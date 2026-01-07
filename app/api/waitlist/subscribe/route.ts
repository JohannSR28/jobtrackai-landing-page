import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

type Body = { name: string; email: string; lang?: "fr" | "en" };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const full_name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!full_name || !email) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const fromEmail = process.env.WAITLIST_FROM_EMAIL;
    const baseUrl = process.env.WAITLIST_PUBLIC_BASE_URL;

    const smtpUser = process.env.GMAIL_SMTP_USER;
    const smtpPass = process.env.GMAIL_SMTP_APP_PASSWORD;

    if (
      !supabaseUrl ||
      !serviceKey ||
      !fromEmail ||
      !baseUrl ||
      !smtpUser ||
      !smtpPass
    ) {
      return NextResponse.json(
        { error: "SERVER_MISCONFIGURED" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // 1) check si existe
    const { data: existing, error: readErr } = await supabase
      .from("waitlist_signups")
      .select("id, unsubscribed_at, unsubscribe_token")
      .eq("email", email)
      .maybeSingle();

    if (readErr) {
      return NextResponse.json({ error: "DB_READ_FAILED" }, { status: 500 });
    }

    let unsubscribeToken = existing?.unsubscribe_token ?? makeToken();

    // 2) insert / reactivate / already subscribed
    if (!existing) {
      const { error: insErr } = await supabase.from("waitlist_signups").insert({
        email,
        full_name,
        unsubscribe_token: unsubscribeToken,
        unsubscribed_at: null,
      });

      if (insErr) {
        // collision token rare -> retry 1 fois
        if (
          String(insErr.message).toLowerCase().includes("unsubscribe_token")
        ) {
          unsubscribeToken = makeToken();
          const { error: insErr2 } = await supabase
            .from("waitlist_signups")
            .insert({
              email,
              full_name,
              unsubscribe_token: unsubscribeToken,
              unsubscribed_at: null,
            });
          if (insErr2) {
            return NextResponse.json(
              { error: "DB_INSERT_FAILED" },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: "DB_INSERT_FAILED" },
            { status: 500 }
          );
        }
      }
    } else if (existing.unsubscribed_at) {
      // réactivation si l’utilisateur se réinscrit
      const { error: updErr } = await supabase
        .from("waitlist_signups")
        .update({ unsubscribed_at: null, full_name })
        .eq("id", existing.id);

      if (updErr) {
        return NextResponse.json(
          { error: "DB_UPDATE_FAILED" },
          { status: 500 }
        );
      }
    } else {
      // déjà abonné : on renvoie ok, mais on peut éviter de renvoyer un mail
      return NextResponse.json(
        { success: true, status: "ALREADY_SUBSCRIBED" },
        { status: 200 }
      );
    }

    // 3) construire le lien unsubscribe
    const unsubscribeUrl = `${baseUrl}/api/waitlist/unsubscribe?token=${encodeURIComponent(
      unsubscribeToken
    )}&lang=${lang}`;

    // 4) email content
    const safeName = escapeHtml(full_name);

    const subject =
      lang === "en"
        ? "Welcome to the JobTrackAI waitlist ✅"
        : "Bienvenue sur la liste JobTrackAI ✅";

    const html =
      lang === "en"
        ? `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
  <div style="max-width:560px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:14px">
    <h2 style="margin:0 0 10px">Thanks ${safeName} 👋</h2>
    <p style="margin:0 0 12px">
      You’re officially on the waitlist — you’ll be among the first to know when JobTrackAI launches.
    </p>

    <p style="margin:0 0 12px">
      <strong>Heads-up:</strong> our email may appear in <em>Promotions</em> or <em>Spam</em> depending on your inbox settings.
      If you don’t see it, please check there.
    </p>

    <p style="margin:0 0 16px">
      <strong>Planned release:</strong> January 2026.
    </p>

    <hr style="border:none;border-top:1px solid #eee;margin:18px 0" />

    <p style="margin:0;font-size:12px;color:#666">
      No longer want updates?
      <a href="${unsubscribeUrl}" style="color:#111;text-decoration:underline">Unsubscribe</a>.
    </p>

    <p style="margin:14px 0 0;font-size:12px;color:#666">
      — JobTrackAI
    </p>
  </div>
</div>
`
        : `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
  <div style="max-width:560px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:14px">
    <h2 style="margin:0 0 10px">Merci ${safeName} 👋</h2>
    <p style="margin:0 0 12px">
      Tu es officiellement sur la liste d’attente — tu seras parmi les premiers informés quand JobTrackAI sera disponible.
    </p>

    <p style="margin:0 0 12px">
      <strong>Petit rappel :</strong> selon ta boîte mail, notre message peut arriver dans <em>Promotions</em> ou <em>Spam</em>.
      Si tu ne le vois pas, pense à vérifier ces onglets.
    </p>

    <p style="margin:0 0 16px">
      <strong>Sortie prévue :</strong> janvier 2026.
    </p>

    <hr style="border:none;border-top:1px solid #eee;margin:18px 0" />

    <p style="margin:0;font-size:12px;color:#666">
      Tu ne veux plus recevoir d’emails ?
      <a href="${unsubscribeUrl}" style="color:#111;text-decoration:underline">Se désinscrire</a>.
    </p>

    <p style="margin:14px 0 0;font-size:12px;color:#666">
      — JobTrackAI
    </p>
  </div>
</div>
`;

    // 5) envoyer email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `JobTrackAI <${fromEmail}>`,
      to: email,
      subject,
      html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
      },
    });

    return NextResponse.json(
      { success: true, status: "CREATED_OR_REACTIVATED" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "UNKNOWN_ERROR" }, { status: 500 });
  }
}
