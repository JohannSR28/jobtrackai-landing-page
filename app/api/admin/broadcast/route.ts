import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION ---
const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminSecret = process.env.ADMIN_SECRET_KEY; // Clé pour protéger l'admin

// --- NODEMAILER SETUP ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_APP_PASSWORD,
  },
});

// --- GET: Récupérer la liste des inscrits pour le tableau de bord ---
export async function GET(req: Request) {
  // Sécurité basique
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // On récupère tout le monde, trié par date
  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data });
}

// --- POST: Envoyer les emails ---
export async function POST(req: Request) {
  // Sécurité basique
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { targetEmail, subject, htmlContent, mode } = body;
    // mode = 'single' | 'all'

    if (!subject || !htmlContent) {
      return NextResponse.json({ error: "MISSING_CONTENT" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    let recipients = [];

    // 1. DÉTERMINER LES DESTINATAIRES
    if (mode === "single" && targetEmail) {
      const { data } = await supabase
        .from("waitlist_signups")
        .select("*")
        .eq("email", targetEmail)
        .single();
      if (data) recipients.push(data);
    } else if (mode === "all") {
      // On envoie à tout le monde SAUF ceux qui sont désinscrits
      const { data } = await supabase
        .from("waitlist_signups")
        .select("*")
        .is("unsubscribed_at", null); // Uniquement les actifs
      if (data) recipients = data;
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { message: "No recipients found" },
        { status: 400 },
      );
    }

    // 2. BOUCLE D'ENVOI
    let successCount = 0;
    let failCount = 0;
    const baseUrl = process.env.WAITLIST_PUBLIC_BASE_URL;

    // Pour éviter de bloquer le serveur sur une longue boucle, on utilise Promise.all
    // (Attention: pour des milliers d'emails, il faudrait une queue type Redis/BullMQ)
    const promises = recipients.map(async (user) => {
      try {
        // Générer le lien unique pour cet utilisateur
        const unsubscribeUrl = `${baseUrl}/api/waitlist/unsubscribe?token=${encodeURIComponent(
          user.unsubscribe_token,
        )}`;

        // Remplacement dynamique du lien dans le HTML
        // On remplace le placeholder {{UNSUBSCRIBE_LINK}} par le vrai lien
        const personalizedHtml = htmlContent
          .replace(/{{UNSUBSCRIBE_LINK}}/g, unsubscribeUrl)
          .replace(/{{NAME}}/g, user.full_name);

        await transporter.sendMail({
          from: `JobTrackAI <${process.env.WAITLIST_FROM_EMAIL}>`,
          to: user.email,
          subject: subject,
          html: personalizedHtml,
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
          },
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${user.email}`, err);
        failCount++;
      }
    });

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
