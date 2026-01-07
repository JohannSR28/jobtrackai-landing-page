"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const translations = {
  fr: {
    badge: "Offre de lancement",
    title1: "NE PERDEZ PLUS JAMAIS",
    title2: "UNE OPPORTUNITÉ",
    benefit1Title: "GAIN DE TEMPS",
    benefit1Desc: "Fini les fichiers Excel manuels. Tout est automatisé.",
    benefit2Title: "CENTRALISATION",
    benefit2Desc: "Tout au même endroit.",
    benefit3Title: "NOTIFICATIONS",
    benefit3Desc: "Soyez alerté dès qu'un recruteur vous répond.",
    benefit4Title: "CONFIDENTIALITÉ",
    benefit4Desc: "Vos données sont chiffrées.",
    ctaButton: "Activer mes 500 points offerts",
    ctaDisclaimer: "PAS DE CARTE BANCAIRE REQUISE.",
    modalTitle: "ACTIVER MES POINTS",
    modalSubtitle: "Entrez vos coordonnées pour débloquer 500 crédits.",
    inputName: "Nom complet",
    inputEmail: "Adresse E-mail",
    submitButton: "Confirmer l'inscription →",
    disclaimer:
      "En vous inscrivant, vous acceptez de recevoir un email lors du lancement. Vous pourrez vous désinscrire à tout moment.",
    // Nouveaux textes de succès
    successTitle: "INSCRIPTION RÉUSSIE !",
    successSubtitleLine1: "Un email de confirmation vient de vous être envoyé.",
    successSubtitleLine2:
      "Si vous ne le voyez pas, vérifiez Promotions ou Spam. Vos 500 points seront crédités au lancement (janvier 2026).",
    closeButton: "Fermer la fenêtre",
  },
  en: {
    badge: "Launch offer",
    title1: "NEVER MISS",
    title2: "AN OPPORTUNITY AGAIN",
    benefit1Title: "TIME SAVING",
    benefit1Desc: "No more manual Excel files. Everything is automated.",
    benefit2Title: "CENTRALIZATION",
    benefit2Desc: "Everything in one place.",
    benefit3Title: "NOTIFICATIONS",
    benefit3Desc: "Get alerted as soon as a recruiter responds.",
    benefit4Title: "PRIVACY",
    benefit4Desc: "Your data is encrypted.",
    ctaButton: "Activate my 500 free points",
    ctaDisclaimer: "NO CREDIT CARD REQUIRED.",
    modalTitle: "ACTIVATE MY POINTS",
    modalSubtitle: "Enter your details to unlock 500 credits.",
    inputName: "Full name",
    inputEmail: "Email address",
    submitButton: "Confirm registration →",
    disclaimer:
      "By registering, you agree to receive an email upon launch. You can unsubscribe at any time.",
    // Nouveaux textes de succès
    successTitle: "REGISTRATION SUCCESSFUL!",
    successSubtitleLine1: "A confirmation email was just sent.",
    successSubtitleLine2:
      "If you don’t see it, check Promotions or Spam. Your 500 points will be credited at launch (January 2026).",
    closeButton: "Close window",
  },
};

export default function Benefits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // État pour savoir si soumis
  const [formData, setFormData] = useState({ name: "", email: "" }); // État des champs
  const { language } = useLanguage();
  const t = translations[language];

  // state for mail subcription form :
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const benefits = [
    { title: t.benefit1Title, desc: t.benefit1Desc },
    { title: t.benefit2Title, desc: t.benefit2Desc },
    { title: t.benefit3Title, desc: t.benefit3Desc },
    { title: t.benefit4Title, desc: t.benefit4Desc },
  ];

  // Fonction de gestion du submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/waitlist/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, lang: language }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        const code = data?.error ?? "UNKNOWN";
        setErrorMsg(
          code === "INVALID_EMAIL"
            ? "Email invalide."
            : "Erreur. Réessaie dans quelques secondes."
        );
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrorMsg("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset du formulaire quand on ferme le modal
  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "" });
    }, 300);
    setErrorMsg(null);
    setIsLoading(false);
  };

  return (
    <>
      <section className="bg-gen-black text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange opacity-[0.08] blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-2 px-5 rounded-full bg-brand-orange/15 border border-brand-orange/40 backdrop-blur-md text-brand-orange shadow-[0_0_15px_rgba(255,159,67,0.1)] text-xs font-mono uppercase tracking-widest mb-8 font-bold">
            {t.badge}
          </span>

          <h2 className="gen-typo text-[36px] sm:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-1px] sm:tracking-[-1.5px] lg:tracking-[-2.5px] max-w-[800px] mx-auto mb-10 text-white break-words">
            {t.title1}
            <br />
            <span className="text-brand-orange">{t.title2}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 text-left">
            {benefits.map((item, i) => (
              <div key={i} className="border-t border-white/20 pt-8">
                <h4 className="gen-typo text-xl mb-3 text-white">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-orange text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-brand-orange-hover hover:shadow-[0_0_50px_rgba(255,159,67,0.5)] active:scale-95 transition-all duration-200 uppercase tracking-tight transform"
            >
              {t.ctaButton}
            </button>
            <p className="text-xs text-gray-500 mt-6 font-mono">
              {t.ctaDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-100 overflow-hidden">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"
            >
              ✕
            </button>

            {!isSubmitted ? (
              // --- FORMULAIRE D'INSCRIPTION ---
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-100 shadow-lg">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="8" width="18" height="4" rx="1" />
                      <path d="M12 8v13" />
                      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                    </svg>
                  </div>
                  <h3 className="gen-typo text-2xl mb-2 tracking-tight">
                    {t.modalTitle}
                  </h3>
                  <p className="text-gray-500 text-sm">{t.modalSubtitle}</p>
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-600 font-semibold">
                    {errorMsg}
                  </p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder={t.inputName}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-medium focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                  />
                  <input
                    type="email"
                    placeholder={t.inputEmail}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-medium focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gen-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors uppercase tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "..." : t.submitButton}
                  </button>
                </form>
                <p className="text-center text-[10px] text-gray-400 mt-6 leading-tight">
                  {t.disclaimer}
                </p>
              </>
            ) : (
              // --- VUE SUCCÈS ---
              <div className="text-center py-4 animate-fade-in">
                {/* Animation Coche */}
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="gen-typo text-2xl mb-4 tracking-tight text-black">
                  {t.successTitle}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 px-2">
                  {t.successSubtitleLine1}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 px-2">
                  {t.successSubtitleLine2}
                </p>

                <button
                  onClick={handleClose}
                  className="w-full bg-brand-orange text-black font-bold py-3 rounded-xl hover:bg-brand-orange-hover transition-colors uppercase tracking-wide text-sm"
                >
                  {t.closeButton}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
