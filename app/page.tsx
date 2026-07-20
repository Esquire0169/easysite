import { BeManifesto } from "@/components/home/BeManifesto";
import { CasesPreview } from "@/components/home/CasesPreview";
import { FreeSitesTeaser } from "@/components/home/FreeSitesTeaser";
import { Hero } from "@/components/home/Hero";
import { HowPreview } from "@/components/home/HowPreview";
import { OneServiceDiagram } from "@/components/home/OneServiceDiagram";
import { ShowcaseStack } from "@/components/home/ShowcaseStack";
import { StatsStrip } from "@/components/home/StatsStrip";
import { HomeScroll } from "@/components/motion/HomeScroll";
import { Marquee } from "@/components/motion/Marquee";
import { keyIdeas } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeScroll />

      <Hero />
      <Marquee items={keyIdeas} />
      <ShowcaseStack />
      <BeManifesto />
      <StatsStrip />
      <OneServiceDiagram />
      <HowPreview />
      <FreeSitesTeaser />
      <CasesPreview />
    </>
  );
}
