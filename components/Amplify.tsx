"use client";

import { useLanguage } from "@/hooks/useLanguage";

const translations = {
  fr: {
    floating: "avec JobTrackAI",
    title1: "AMPLIFIEZ",
    title2: "VOTRE",
    title3: "FLUX DE TRAVAIL",
    // Carte 1
    card1Title: "SCAN AUTOMATIQUE",
    card1Desc: "Analyse intelligente de vos emails de candidature.",
    // Carte 2
    card2Title: "REGROUPEMENT INTELLIGENT",
    card2Desc:
      "Tous les emails liés à une même candidature, automatiquement réunis.",
    // Carte 3
    card3Title: "SUIVI CENTRALISÉ",
    card3Desc:
      "Visualisez l’état de toutes vos candidatures en un seul endroit.",
  },
  en: {
    floating: "with JobTrackAI",
    title1: "AMPLIFY",
    title2: "YOUR",
    title3: "WORKFLOW",
    // Card 1
    card1Title: "AUTOMATIC SCAN",
    card1Desc: "Smart analysis of your job application emails.",
    // Card 2
    card2Title: "SMART GROUPING",
    card2Desc:
      "All emails related to a specific application, automatically gathered.",
    // Card 3
    card3Title: "CENTRALIZED TRACKING",
    card3Desc: "Visualize the status of all your applications in one place.",
  },
};

export default function Amplify() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="min-h-screen flex justify-center items-start lg:items-center p-6 pt-20 lg:pt-64 pb-24 relative z-10">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative items-center">
        {/* Center Title */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center text-center relative order-1 lg:order-2 z-0">
          <span className="text-lg text-slate-500 mb-2 relative font-medium">
            {t.floating}
          </span>

          <h1 className="font-sans text-[50px] lg:text-[86px] font-bold leading-[0.92] mb-[30px] mt-5 lg:mt-0 tracking-[-2px] lg:tracking-[-3.5px] max-w-full lg:max-w-[580px] text-black relative z-0">
            {t.title1}
            <br />
            {t.title2}
            <br />
            {t.title3}
          </h1>
        </div>

        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1 relative z-20 translate-x-0 lg:translate-x-12 w-full">
          {/* IMAGE PLACEHOLDER - À réactiver plus tard pour les images */}
          {/* <div className="bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transform -rotate-2 hover:rotate-0 transition-all duration-500 p-2 w-full">
            <div className="w-full h-64 bg-gray-200 rounded-xl"></div>
          </div> */}

          {/* Carte 1 : Scan Automatique */}
          <div className="bg-white/65 backdrop-blur-md border border-white/50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl p-6 inline-block max-w-[260px] transform -rotate-2 hover:rotate-0 transition-all duration-500">
            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-800">
              {t.card1Title}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              {t.card1Desc}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 flex flex-col h-full justify-center order-3 lg:order-3 relative pointer-events-none gap-12 lg:gap-0 w-full">
          {/* Card 2 : Regroupement Intelligent */}
          <div className="relative z-30 pointer-events-auto ml-0 mt-0 translate-x-0 lg:-ml-24 lg:-mt-44 lg:translate-x-8 w-full">
            {/* IMAGE PLACEHOLDER - À réactiver plus tard pour les images */}
            {/* <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 mb-2 w-full lg:w-64 transform rotate-2 hover:rotate-0 transition-transform duration-500 origin-bottom-left">
              <div className="w-full h-64 lg:h-40 bg-gray-200 rounded-lg"></div>
            </div> */}

            <div className="bg-white/65 backdrop-blur-md border border-white/50 shadow-xl rounded-xl p-6 inline-block max-w-[260px] ml-0 lg:ml-0 transform rotate-2 hover:rotate-0 transition-all duration-500 origin-bottom-left">
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {t.card2Title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">{t.card2Desc}</p>
            </div>
          </div>

          {/* Card 3 : Suivi Centralisé */}
          <div className="relative z-20 pointer-events-auto flex flex-col items-start lg:items-start text-left lg:text-left mt-0 lg:mt-24 ml-0 lg:ml-0 w-full">
            {/* IMAGE PLACEHOLDER - À réactiver plus tard pour les images */}
            {/* <div className="bg-white rounded-xl shadow-2xl p-2 mb-4 w-full lg:w-[240px] transform hover:scale-105 transition-transform duration-500">
              <div className="w-full h-64 lg:h-48 bg-gray-200 rounded-lg"></div>
            </div> */}

            <div className="bg-white/65 backdrop-blur-md border border-white/50 shadow-2xl rounded-xl p-6 inline-block max-w-[260px] transform hover:scale-105 transition-all duration-500">
              <h3 className="font-bold text-sm uppercase tracking-wide text-slate-900">
                {t.card3Title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">{t.card3Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
