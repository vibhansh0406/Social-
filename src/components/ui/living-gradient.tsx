"use client";
import { useEffect, useRef } from "react";
import { useDevice } from "@/hooks/useDevice";

export default function LivingGradient({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isHighEnd } = useDevice();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = window.scrollY;
    let current = target;
    let raf = 0;
    
    const loop = () => {
      current += (target - current) * 0.05; // Smooth inertia
      el.style.setProperty("--sy", current.toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    
    const onScroll = () => { target = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen bg-[#f5efe6]">
      {/* Base Noise Texture for Depth */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply"
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')" }} />

      {/* High-End Mesh Gradient (Shader-like) */}
      {isHighEnd ? (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000" />
        </div>
      ) : (
        /* Low-End Static Gradient */
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#f5efe6] via-[#e8f0ea] to-[#f3cfb2]" />
      )}
      
      {children}
    </div>
  );
}
