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

  // Gyroscope tilt
  const tiltX = orientation.x * 2;
  const tiltY = orientation.y * 2;

  return (
    <div ref={ref} className="relative min-h-screen">
      {/* Layer 1: Base Cream */}
      <div className="fixed inset-0 bg-[#f5efe6]" style={{ zIndex: -30 }} />

      {/* Layer 2: Gradient Blobs with Gyroscope */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: -20,
          transform: `translate3d(${tiltX}px, ${tiltY}px, 0)`,
          transition: "transform 0.15s ease-out",
          willChange: "transform"
        }}
      >
        {/* Blue Blob - Top Left */}
        <div 
          className="absolute animate-blob"
          style={{ 
            top: "-10%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            borderRadius: "50%",
            filter: "blur(100px)",
            opacity: 0.7,
            background: "radial-gradient(circle, #b7d3f4 0%, rgba(183,211,244,0) 70%)"
          }} 
        />
        
        {/* Peach Blob - Top Right */}
        <div 
          className="absolute animate-blob animation-delay-2000"
          style={{ 
            top: "-10%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            borderRadius: "50%",
            filter: "blur(100px)",
            opacity: 0.7,
            background: "radial-gradient(circle, #f3cfb2 0%, rgba(243,207,178,0) 70%)"
          }} 
        />
        
        {/* Orange Blob - Bottom */}
        <div 
          className="absolute animate-blob animation-delay-4000"
          style={{ 
            bottom: "-20%",
            left: "20%",
            width: "70vw",
            height: "70vw",
            borderRadius: "50%",
            filter: "blur(120px)",
            opacity: 0.6,
            background: "radial-gradient(circle, #eec4a4 0%, rgba(238,196,164,0) 70%)"
          }} 
        />
      </div>

      {/* Layer 3: Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none mix-blend-multiply"
        style={{ 
          zIndex: -10,
          opacity: 0.03,
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')"
        }} 
      />

      {/* iOS Permission Button */}
      {isIOS && !permissionGranted && (
        <button
          onClick={requestPermission}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium shadow-lg hover:bg-neutral-700 transition-colors"
          style={{ zIndex: 100 }}
        >
          Enable Motion Effects
        </button>
      )}

      {children}
    </div>
  );
}
