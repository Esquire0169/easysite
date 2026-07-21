import { BeManifesto } from "@/components/home/BeManifesto";
import { CasesPreview } from "@/components/home/CasesPreview";
import { ExplodedView } from "@/components/home/ExplodedView";
import { FreeSitesTeaser } from "@/components/home/FreeSitesTeaser";
import { Hero } from "@/components/home/Hero";
import { FourSteps } from "@/components/home/FourSteps";
import { OrbitalDiagram } from "@/components/home/OrbitalDiagram";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ThreePillars } from "@/components/home/ThreePillars";
import { HomeScroll } from "@/components/motion/HomeScroll";
import { Marquee } from "@/components/motion/Marquee";
import { keyIdeas } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <HomeScroll />

      <Hero />
      <ExplodedView />
      <ThreePillars />
      <Marquee items={keyIdeas} />
      <BeManifesto />
      <StatsStrip />
      <OrbitalDiagram />
      <FourSteps />
      <FreeSitesTeaser />
      <CasesPreview />
    </>
  );
}
