import Hero from "@/components/sections/Hero";
import ProgramsPreview from "@/components/sections/ProgramsPreview";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import Sponsors from "@/components/sections/Sponsors";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <ProgramsPreview />
      <Stats />
      <Testimonials />
      <Sponsors />
      <CTABanner />
    </>
  );
}
