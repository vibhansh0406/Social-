"use client";

import { useEffect } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import AsciiBackground from "@/components/ui/ascii-background";
import LivingGradient from "@/components/ui/living-gradient";
import AnimatedNoise from "@/components/ui/animated-noise";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Methodology } from "@/components/sections/Methodology";
import { Initiate } from "@/components/sections/Initiate";

function CaptionColorFixer() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      [data-gp-caption],
      [data-gp-hint],
      [data-gp-enter] {
        color: #1a1a1a !important;
      }
      [data-gp-enter]:focus-visible {
        background: #f5efe6 !important;
        color: #1a1a1a !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  return null;
}

export default function Home() {
  return (
    <LivingGradient>
      <main className="relative min-h-screen">
        <CaptionColorFixer />
        <AnimatedNoise />
        <GlyphPortal
          word="VIBSOCIAL"
          enterLabel="Enter"
          scrollLength={2.6}
          style={{
            "--gp-paper": "transparent",
            "--gp-ink": "#ffffff",
            "--gp-field": "#0d2b1f",
            "--gp-foreground": "#ffffff",
          }}
          background={
            <AsciiBackground src="/me.jpeg" charSize={5} opacity={1} useImageColors />
          }
        >
          <div className="max-w-2xl px-4">
            <p className="mb-3 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/80">
              AI / ML — Full-Stack — Architecture
            </p>
            <h2 className="mb-4 font-serif text-3xl sm:text-4xl md:text-6xl leading-tight tracking-tight text-white">
              Engineering the next generation of intelligent systems.
            </h2>
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/70">
              From VEDA-8B language models to scalable SaaS platforms — research,
              architecture and deployment under one roof.
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
