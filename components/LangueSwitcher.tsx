"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-4 py-2 rounded ${
          language === "en" ? "bg-brand-orange text-black" : "bg-gray-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("fr")}
        className={`px-4 py-2 rounded ${
          language === "fr" ? "bg-brand-orange text-black" : "bg-gray-200"
        }`}
      >
        FR
      </button>
    </div>
  );
}
