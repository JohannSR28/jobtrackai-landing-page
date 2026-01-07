"use client";

import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";

const translations = {
  fr: {
    h1: "TOUTES VOS CANDIDATURES AU MÊME ENDROIT",
    description:
      "Suivez automatiquement vos candidatures du début à la fin sur une plateforme simple.",
    ctaStart: "COMMENCER GRATUITEMENT",
    ctaLearn: "En savoir plus",
    imageAlt: "Tableau de bord des candidatures",
  },
  en: {
    h1: "ALL YOUR JOB APPLICATIONS IN ONE PLACE",
    description:
      "Automatically track your applications from start to finish on one simple platform.",
    ctaStart: "START NOW FOR FREE",
    ctaLearn: "Learn more",
    imageAlt: "Job applications dashboard",
  },
};

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col xl:flex-row min-h-screen w-full relative z-10 pt-16">
      {/* Left Section */}
      <div className="flex-1 flex items-center p-[30px] sm:p-[40px] md:p-[60px] xl:p-[80px] xl:pr-[60px]">
        <div>
          {/* MODIFICATIONS H1 : 
            1. text-[34px] sur mobile (au lieu de 42px)
            2. leading-[1.1] sur mobile pour aérer
            3. break-words pour la sécurité
          */}
          <h1 className="text-[34px] sm:text-[56px] xl:text-[65px] font-bold leading-[0.92] sm:leading-[0.92] mb-[30px] tracking-[-1px] sm:tracking-[-2px] xl:tracking-[-3.5px] max-w-full xl:max-w-[580px] text-black break-words">
            {t.h1}
          </h1>

          <p className="text-[16px] sm:text-[18px] xl:text-[20px] text-[#333] mb-[40px] max-w-[480px] leading-[1.6]">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[20px] items-start sm:items-center">
            <a
              href="#benefits"
              className="px-6 py-4 text-[13px] sm:text-base font-semibold rounded-full border-none cursor-pointer transition-all duration-300 bg-brand-orange text-black hover:bg-brand-orange-hover hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
            >
              {t.ctaStart}
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-4 text-[13px] sm:text-base font-semibold rounded-full cursor-pointer transition-all duration-300 bg-transparent text-black border-2 border-black hover:bg-black hover:text-white group"
            >
              {t.ctaLearn}
              <span className="ml-[5px] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-[30px] xl:p-[30px] xl:pl-[10px] w-full">
        <div className="w-full max-w-[825px] xl:max-w-[1100px] h-auto rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden relative">
          <Image
            src="/jobtrackai_demo.png"
            alt={t.imageAlt}
            width={1100}
            height={825}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
