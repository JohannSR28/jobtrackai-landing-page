import type { Metadata } from "next";
import { LanguageProvider } from "@/hooks/useLanguage";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobTrackAI – Track your job applications automatically",
  description:
    "JobTrackAI automatically scans your Gmail and Outlook emails to track, organize, and monitor your job applications in one clean dashboard. Never lose track of an opportunity again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
