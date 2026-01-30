"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

const translations = {
  fr: {
    login: "Connexion",
  },
  en: {
    login: "Login",
  },
};

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const MAIN_SITE_URL = "https://jobtrackai-three.vercel.app";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      {/* Modification : px-4 sur mobile, px-6 sur écran plus large */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Section Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            J
          </div>
          {/* Modification : Le texte JobTrackAI est caché sur mobile (hidden) et visible sur tablette/PC (sm:block) */}
          <span className="font-bold text-xl tracking-tight text-black hidden sm:block">
            JobTrackAI
          </span>
        </div>

        {/* Section Droite */}
        {/* Modification : gap-3 sur mobile, gap-6 sur PC */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setLanguage("en")}
              // Modification : text-xs et padding réduit sur mobile
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                language === "en"
                  ? "bg-brand-orange text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("fr")}
              // Modification : text-xs et padding réduit sur mobile
              className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                language === "fr"
                  ? "bg-brand-orange text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              FR
            </button>
          </div>

          <Link
            href={MAIN_SITE_URL + "/login"}
            // Modification : text-xs et padding réduit sur mobile
            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-brand-orange transition-colors px-2 py-2 sm:px-4"
          >
            {t.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
