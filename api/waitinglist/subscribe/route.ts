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
    )}`;

    // 4) email content
    const safeName = escapeHtml(full_name);

    const subject =
      lang === "en" ? "You’re on the list ✅" : "Tu es bien inscrit ✅";

    const html =
      lang === "en"
        ? `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Thanks ${safeName}!</h2>
            <p>You’re on the waitlist. We’ll email you when we launch.</p>
            <p style="margin-top:22px;font-size:12px;color:#666">
              Unsubscribe anytime: <a href="${unsubscribeUrl}">unsubscribe</a>
            </p>
          </div>
        `
        : `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Merci ${safeName} !</h2>
            <p>Tu es bien sur la liste d’attente. On t’écrira au lancement.</p>
            <p style="margin-top:22px;font-size:12px;color:#666">
              Se désinscrire à tout moment : <a href="${unsubscribeUrl}">se désinscrire</a>
            </p>
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
