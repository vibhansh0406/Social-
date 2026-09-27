"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function LivingGradient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let target = window.scrollY;
    let current = target;
    let raf = 0;
    const onScroll = () => { target = window.scrollY; };
    const loop = () => {
      current += (target - current) * 0.07;
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
    <div ref={ref} className="relative isolate overflow-hidden bg-[#f5efe6]">
      <style>{`
        @keyframes lg-drift {
          0%, 100% { translate: 0% 0%; scale: 1; }
          50% { translate: 3% -4%; scale: 1.08; }
        }
      `}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[15%] top-[10%] h-[80vh] w-[85vw] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle at 40% 40%, #b7d3f4 0%, rgba(183,211,244,0) 65%)", transform: "translate3d(0, calc(var(--sy, 0) * -0.05px), 0)", animation: "lg-drift 18s ease-in-out infinite" }} />
        <div className="absolute -right-[20%] -top-[15%] h-[85vh] w-[90vw] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle at 55% 45%, #f3cfb2 0%, rgba(243,207,178,0) 62%)", transform: "translate3d(0, calc(var(--sy, 0) * -0.09px), 0)", animation: "lg-drift 22s ease-in-out infinite reverse" }} />
        <div className="absolute left-[10%] top-[55%] h-[70vh] w-[75vw] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle at 50% 50%, #fdf9f0 0%, rgba(253,249,240,0) 60%)", transform: "translate3d(0, calc(var(--sy, 0) * -0.03px), 0)", animation: "lg-drift 26s ease-in-out infinite" }} />
        <div className="absolute -right-[10%] top-[70%] h-[75vh] w-[80vw] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle at 45% 55%, #eec4a4 0%, rgba(238,196,164,0) 60%)", transform: "translate3d(0, calc(var(--sy, 0) * -0.07px), 0)", animation: "lg-drift 20s ease-in-out infinite reverse" }} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#0d2b1f] to-transparent" />
      {children}
    </div>
  );
}
