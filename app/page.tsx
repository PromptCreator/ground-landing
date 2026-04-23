import Hero from "@/components/landing/Hero";
import PrototypeSection from "@/components/landing/PrototypeSection";
import SignupSection from "@/components/landing/SignupSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <PrototypeSection />
      <SignupSection />
      <Footer />
    </main>
  );
}
