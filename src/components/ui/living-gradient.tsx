"use client";

export default function LivingGradient({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#030303] text-white overflow-hidden">
      
      {/* === CINEMATIC AURORA BACKGROUND === */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Base */}
        <div className="absolute inset-0 bg-[#030303]" />
        
        {/* Aurora Glow 1 (Top Left - Deep Blue) */}
        <div 
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full opacity-30 blur-[120px]"
          style={{ 
            background: "radial-gradient(circle, #1e3a8a 0%, transparent 70%)",
            animation: "aurora 20s infinite alternate ease-in-out"
          }} 
        />
        
        {/* Aurora Glow 2 (Bottom Right - Deep Purple) */}
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full opacity-20 blur-[150px]"
          style={{ 
            background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)",
            animation: "aurora 25s infinite alternate-reverse ease-in-out"
          }} 
        />

        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')" }} 
        />
      </div>

      {/* === CONTENT LAYER === */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
