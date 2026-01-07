"use client";

import Header from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

const translations = {
  fr: {
    badge: "Bientôt disponible",
    title: "SITE EN\nCONSTRUCTION",
    subtitle:
      "Nous travaillons dur pour vous offrir la meilleure expérience. Cette page sera bientôt disponible.",
    features: [
      "Interface intuitive",
      "Suivi en temps réel",
      "Notifications intelligentes",
    ],
    goHome: "Aller à la page d'accueil",
    launchDate: "Lancement : Janvier 2026",
  },
  en: {
    badge: "Coming soon",
    title: "UNDER\nCONSTRUCTION",
    subtitle:
      "We're working hard to bring you the best experience. This page will be available soon.",
    features: [
      "Intuitive interface",
      "Real-time tracking",
      "Smart notifications",
    ],
    goHome: "Go to Landing Page",
    launchDate: "Launch: January 2026",
  },
};

export default function UnderConstruction() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden">
      {/* Gradient orange background - Ajusté pour mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-brand-orange opacity-[0.06] blur-[100px] sm:blur-[150px] rounded-full pointer-events-none"></div>

      {/* Header simplifié */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24 relative z-10">
        <div className="w-full max-w-[900px] text-center">
          {/* Badge orange */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 sm:px-5 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full">
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
            <span className="text-brand-orange font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              {t.badge}
            </span>
          </div>

          {/* Illustration construction */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="relative">
              {/* Icône principale */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 rounded-3xl flex items-center justify-center border-2 border-brand-orange/20 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <svg
                  width="48" // Réduit pour mobile
                  height="48" // Réduit pour mobile
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-orange relative z-10 sm:w-16 sm:h-16" // Ajustement responsive
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>

              {/* Décorations */}
              <div
                className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-brand-orange/20 rounded-lg rotate-12 animate-bounce"
                style={{ animationDelay: "0s", animationDuration: "3s" }}
              ></div>
              <div
                className="absolute -bottom-4 -left-4 w-4 h-4 sm:w-6 sm:h-6 bg-brand-orange/30 rounded-full animate-bounce"
                style={{ animationDelay: "1s", animationDuration: "2.5s" }}
              ></div>
            </div>
          </div>

          {/* Titre - OPTIMISÉ POUR MOBILE */}
          {/* text-[40px] au lieu de 56px pour mobile + break-words */}
          <h1 className="gen-typo text-[40px] sm:text-[72px] lg:text-[86px] leading-[1.1] sm:leading-[0.92] tracking-[-1.5px] sm:tracking-[-2.5px] lg:tracking-[-3.5px] mb-6 sm:mb-8 text-black whitespace-pre-line break-words">
            {t.title}
          </h1>

          {/* Sous-titre */}
          <p className="text-base sm:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            {t.subtitle}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            {t.features.map((feature, index) => (
              <div
                key={index}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-full text-xs sm:text-sm font-semibold text-gray-700 hover:border-brand-orange hover:text-brand-orange transition-all duration-200 shadow-sm"
              >
                <span className="inline-block mr-2 text-brand-orange">✓</span>
                {feature}
              </div>
            ))}
          </div>

          {/* Bouton */}
          <div className="flex justify-center mb-8">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-black font-bold rounded-full hover:bg-brand-orange-hover hover:shadow-[0_0_30px_rgba(255,159,67,0.3)] hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-tight text-sm sm:text-base"
            >
              {t.goHome}
            </Link>
          </div>

          {/* Date */}
          <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-full border border-gray-200">
            <p className="text-xs sm:text-sm font-mono text-gray-600 flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-orange sm:w-4 sm:h-4"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {t.launchDate}
            </p>
          </div>
        </div>
      </main>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-brand-orange via-brand-orange-hover to-brand-orange animate-pulse"
          style={{ width: "90%" }}
        ></div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium text-center">
            © 2026 JOBTRACKAI.{" "}
            {language === "fr" ? "TOUS DROITS RÉSERVÉS" : "ALL RIGHTS RESERVED"}
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
