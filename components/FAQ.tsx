"use client";

import { useLanguage } from "@/hooks/useLanguage";

const translations = {
  fr: {
    title: "QUESTIONS\nFRÉQUENTES",
    subtitle: "Vous avez des doutes ?",
    contactSupport: "Contacter le support →",
    question1: "COMMENT JOBTRACKAI DÉTECTE-T-IL MES CANDIDATURES ?",
    answer1:
      "L'outil utilise des modèles IA pour analyser vos e-mails entrants et identifier automatiquement les messages de confirmation.",
    question2: "CONÇU POUR RESPECTER VOTRE VIE PRIVÉE",
    answer2:
      "JobTrackAI accède uniquement aux emails nécessaires à l’analyse de vos candidatures, via les API officielles Google et Microsoft. Tout est chiffré. Vous gardez le contrôle. Toujours.",
  },
  en: {
    title: "FREQUENTLY\nASKED QUESTIONS",
    subtitle: "Have doubts?",
    contactSupport: "Contact support →",
    question1: "HOW DOES JOBTRACKAI DETECT MY APPLICATIONS?",
    answer1:
      "The tool uses AI models to analyze your incoming emails and automatically identify confirmation messages.",
    question2: "BUILT TO RESPECT YOUR PRIVACY",
    answer2:
      "JobTrackAI only accesses the emails required to analyze your job applications, using the official Google and Microsoft APIs. Everything is encrypted. You stay in control. Always.",
  },
};

export default function FAQ() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="faq" className="border-b border-gen-border bg-gen-bg">
      <div className="grid grid-cols-1 lg:grid-cols-3 max-w-[1440px] mx-auto">
        <div className="p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-gen-border bg-white">
          <h2 className="gen-typo text-[42px] leading-[0.92] tracking-[-2.5px] mb-6 whitespace-pre-line">
            {t.title}
          </h2>
          <p className="text-gray-500 font-medium">{t.subtitle}</p>

          {/* Modification ici : ajout du mailto */}
          <a
            href="mailto:jobtrackerai.assist@gmail.com"
            className="block mt-8 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-brand-orange uppercase tracking-wide"
          >
            {t.contactSupport}
          </a>
        </div>

        <div className="lg:col-span-2 p-12 lg:p-20 space-y-10">
          <div>
            <h4 className="gen-typo text-[22px] mb-3 tracking-[-1px]">
              {t.question1}
            </h4>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-2xl">
              {t.answer1}
            </p>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
          <div>
            <h4 className="gen-typo text-[22px] mb-3 tracking-[-1px]">
              {t.question2}
            </h4>
            <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-2xl">
              {t.answer2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
