import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "MISSING_TOKEN" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "SERVER_MISCONFIGURED" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("waitlist_signups")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "DB_UPDATE_FAILED" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 404 });
  }

  const lang = searchParams.get("lang") === "en" ? "en" : "fr";

  // UX: page simple au lieu de JSON
  return new NextResponse(
    lang === "en"
      ? `<html><body style="font-family:Arial;padding:40px;color:#111">
        <div style="max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:14px;padding:24px">
          <h2 style="margin:0 0 10px">✅ You’re unsubscribed</h2>
          <p style="margin:0 0 12px">
            You won’t receive any more emails from JobTrackAI.
          </p>
          <p style="margin:0;font-size:12px;color:#666">
            Thanks for trying this out — and you’re always welcome back.
          </p>
        </div>
      </body></html>`
      : `<html><body style="font-family:Arial;padding:40px;color:#111">
        <div style="max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:14px;padding:24px">
          <h2 style="margin:0 0 10px">✅ Désinscription confirmée</h2>
          <p style="margin:0 0 12px">
            Tu ne recevras plus d’emails de la part de JobTrackAI.
          </p>
          <p style="margin:0;font-size:12px;color:#666">
            Merci pour ton temps — et tu peux te réinscrire quand tu veux.
          </p>
        </div>
      </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
