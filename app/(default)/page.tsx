import HeroSection from "@/components/landing/HeroSection"
import SearchSection from "@/components/landing/SearchSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import VoiceSection from "@/components/landing/VoiceSection"
import FaqSection from "@/components/landing/FaqSection"
import CtaSection from "@/components/landing/CtaSection"
import PopularKosenSection from "@/components/landing/PopularKosenSection"
import MeritSection from "@/components/landing/MeritSection"
import ContactSection from "@/components/landing/ContactSection"

export default async function Home() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <PopularKosenSection />
      <VoiceSection />
      <MeritSection />
      <FeaturesSection />
      <FaqSection />
      <ContactSection />
      <CtaSection />
    </>
  )
}
