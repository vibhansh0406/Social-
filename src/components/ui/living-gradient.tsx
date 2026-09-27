"use client";
import { useEffect, useRef } from "react";

export default function LivingGradient({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = window.scrollY;
    let current = target;
    let raf = 0;
    const onScroll = () => { target = window.scrollY; };
    const loop = () => {
      current += (target - current) * 0.05;
      el.style.setProperty("--sy", current.toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen">
      {/* Layer 1: Base Cream Color (Sabse peeche) */}
      <div className="fixed inset-0 -z-20 bg-[#f5efe6]" />

      {/* Layer 2: Colorful Blobs (Base ke upar) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-70 animate-blob"
             style={{ background: "radial-gradient(circle, #b7d3f4 0%, rgba(183,211,244,0) 70%)" }} />
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-70 animate-blob animation-delay-2000"
             style={{ background: "radial-gradient(circle, #f3cfb2 0%, rgba(243,207,178,0) 70%)" }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-60 animate-blob animation-delay-4000"
             style={{ background: "radial-gradient(circle, #eec4a4 0%, rgba(238,196,164,0) 70%)" }} />
      </div>

      {/* Layer 3: Noise Texture (Sabse upar) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-[1] mix-blend-multiply"
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')" }} />

      {children}
    </div>
  );
}
