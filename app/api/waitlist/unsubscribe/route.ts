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

  // UX: page simple au lieu de JSON
  return new NextResponse(
    `<html><body style="font-family:Arial;padding:40px">
      <h2>✅ Désinscription réussie</h2>
      <p>Vous ne recevrez plus d'emails.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
