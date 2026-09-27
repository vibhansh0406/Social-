import GlyphPortal from "@/components/ui/glyph-portal";
import AsciiBackground from "@/components/ui/ascii-background";
import LivingGradient from "@/components/ui/living-gradient";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Methodology } from "@/components/sections/Methodology";
import { Initiate } from "@/components/sections/Initiate";

export default function Home() {
  return (
    <LivingGradient>
      <main className="relative min-h-screen">
        <GlyphPortal
          word="VIBSOCIAL"
          enterLabel="Enter the studio"
          scrollLength={2.6}
          style={{
            "--gp-paper": "transparent",
            "--gp-ink": "#1a1a1a",
            "--gp-field": "#0d2b1f",
            "--gp-foreground": "#1a1a1a",
          }}
          background={
            <AsciiBackground src="/me.jpeg" charSize={5} opacity={1} useImageColors />
          }
        >
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/80">
              AI / ML — Full-Stack — Architecture
            </p>
            <h2 className="mb-6 font-serif text-4xl leading-tight tracking-tight md:text-6xl text-white">
              Engineering the next generation of intelligent systems.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/70">
              From VEDA-8B language models to scalable SaaS platforms — research,
              architecture and deployment under one roof. Scroll onward for
              capabilities, selected work and methodology.
            </p>
          </div>
        </GlyphPortal>

        <Capabilities />
        <SelectedWork />
        <Methodology />
        <Initiate />
      </main>
    </LivingGradient>
  );
}
