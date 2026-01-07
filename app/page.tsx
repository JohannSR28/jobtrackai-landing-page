import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Amplify from "@/components/Amplify";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 via-white to-orange-50 -z-50 pointer-events-none"></div>
      <Header />
      <Hero />
      <Amplify />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <Footer />
    </main>
  );
}
