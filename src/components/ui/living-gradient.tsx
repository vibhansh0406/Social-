"use client";
import { useEffect, useRef } from "react";
import { useGyroscope } from "@/hooks/useGyroscope";

export default function LivingGradient({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { orientation, isIOS, permissionGranted, requestPermission } = useGyroscope();

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

  const tiltX = orientation.x * 3;
  const tiltY = orientation.y * 3;

  return (
    <div ref={ref} className="relative min-h-screen">
      
      {/* BACKGROUND LAYER */}
      <div 
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Cream Base */}
        <div className="absolute inset-0" style={{ backgroundColor: '#f5efe6' }} />

        {/* Blobs Wrapper (Moves with Gyroscope) */}
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `translate3d(${tiltX}px, ${tiltY}px, 0)`,
            transition: "transform 0.2s ease-out",
            willChange: "transform"
          }}
        >
          {/* Blue Blob */}
          <div 
            className="absolute"
            style={{ 
              top: '-20%', left: '-20%', width: '80vw', height: '80vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #93c5fd 0%, rgba(147,197,253,0) 70%)',
              filter: 'blur(80px)',
              opacity: 0.8,
              animation: 'blob 12s infinite ease-in-out'
            }} 
          />
          {/* Peach Blob */}
          <div 
            className="absolute"
            style={{ 
              top: '-10%', right: '-20%', width: '70vw', height: '70vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fdba74 0%, rgba(253,186,116,0) 70%)',
              filter: 'blur(80px)',
              opacity: 0.8,
              animation: 'blob 15s infinite ease-in-out reverse'
            }} 
          />
          {/* Pink/Orange Blob */}
          <div 
            className="absolute"
            style={{ 
              bottom: '-20%', left: '10%', width: '90vw', height: '90vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fca5a5 0%, rgba(252,165,165,0) 70%)',
              filter: 'blur(100px)',
              opacity: 0.7,
              animation: 'blob 18s infinite ease-in-out'
            }} 
          />
        </div>

        {/* Noise Texture */}
        <div 
          className="absolute inset-0 mix-blend-multiply"
          style={{ 
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }} 
        />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>

      {/* iOS PERMISSION BUTTON */}
      {isIOS && !permissionGranted && (
        <button
          onClick={requestPermission}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium shadow-lg"
          style={{ zIndex: 50 }}
        >
          Enable Motion Effects
        </button>
      )}
    </div>
  );
}
