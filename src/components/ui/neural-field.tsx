"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number; vx: number; vy: number;
  r: number; layer: number; phase: number; speed: number; accent: boolean;
};
type Signal = { a: number; b: number; t: number };
type Ripple = { x: number; y: number; t: number };

export default function NeuralField({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = !isDesktop && cores <= 4;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf = 0;
    let time = 0;

    const particles: Particle[] = [];
    const signals: Signal[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: -9999, y: -9999, on: false };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const COUNT = lowEnd ? 26 : isDesktop ? 85 : 48;
    const LINK = isDesktop ? 130 : 100;

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const layer = i % 3;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.8 + layer * 0.7 + Math.random() * 0.8,
          layer,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 0.9,
          accent: Math.random() < 0.12,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onMove = (e: MouseEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.on = true; };
    const onLeave = () => { pointer.on = false; pointer.x = -9999; pointer.y = -9999; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      ripples.push({ x: t.clientX, y: t.clientY, t: 0 });
      if (ripples.length > 4) ripples.shift();
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      tilt.tx = Math.max(-1, Math.min(1, (e.gamma || 0) / 28));
      tilt.ty = Math.max(-1, Math.min(1, ((e.beta || 0) - 40) / 28));
    };

    window.addEventListener("resize", resize);
    if (isDesktop) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
    } else {
      window.addEventListener("touchstart", onTouch, { passive: true });
      if (!isIOS) window.addEventListener("deviceorientation", onTilt, { passive: true });
    }

    resize();

    const step = (animate: boolean) => {
      time += 0.016;
      tilt.x += (tilt.tx - tilt.x) * 0.06;
      tilt.y += (tilt.ty - tilt.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      if (animate) {
        for (const p of particles) {
          p.x += p.vx + tilt.x * (p.layer + 1) * 0.25;
          p.y += p.vy + tilt.y * (p.layer + 1) * 0.15;

          if (pointer.on) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 19600 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = ((140 - d) / 140) * 0.6;
              p.x += (dx / d) * f;
              p.y += (dy / d) * f;
            }
          }

          for (const r of ripples) {
            const dx = p.x - r.x;
            const dy = p.y - r.y;
            const d = Math.hypot(dx, dy) || 1;
            const band = Math.abs(d - r.t * 260);
            if (band < 60) {
              const f = ((60 - band) / 60) * (1 - r.t) * 1.4;
              p.x += (dx / d) * f;
              p.y += (dy / d) * f;
            }
          }

          if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
          ripples[i].t += 0.02;
          if (ripples[i].t >= 1) ripples.splice(i, 1);
        }

        if (Math.random() < 0.06 && particles.length) {
          const a = Math.floor(Math.random() * particles.length);
          let best = -1; let bd = LINK;
          for (let j = 0; j < particles.length; j++) {
            if (j === a) continue;
            const d = Math.hypot(particles[a].x - particles[j].x, particles[a].y - particles[j].y);
            if (d < bd) { bd = d; best = j; }
          }
          if (best >= 0) signals.push({ a, b: best, t: 0 });
        }
        for (let i = signals.length - 1; i >= 0; i--) {
          signals[i].t += 0.025;
          if (signals[i].t >= 1) signals.splice(i, 1);
        }
      }

      // Connections
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (Math.abs(a.layer - b.layer) > 1) continue;
          const dx = a.x - b.x; const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.16;
          ctx.strokeStyle = `rgba(148, 210, 200, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Traveling signals (synapse fire)
      for (const s of signals) {
        const a = particles[s.a]; const b = particles[s.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const fade = Math.sin(s.t * Math.PI);
        ctx.strokeStyle = `rgba(252, 211, 77, ${(0.35 * fade).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.fillStyle = `rgba(255, 236, 179, ${(0.9 * fade).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
      }

      // Touch ripples
      for (const r of ripples) {
        ctx.strokeStyle = `rgba(163, 230, 210, ${(0.25 * (1 - r.t)).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.t * 260, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nodes (pulsing)
      for (const p of particles) {
        const pulse = 0.45 + 0.35 * Math.sin(p.phase + time * p.speed * 2);
        const alpha = pulse * (0.35 + p.layer * 0.2);
        ctx.fillStyle = p.accent
          ? `rgba(252, 211, 77, ${alpha.toFixed(3)})`
          : `rgba(163, 230, 210, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      step(true);
      raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!raf && !reduced && !lowEnd) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    if (reduced || lowEnd) step(false);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#04070a] text-white">
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(18,42,46,0.5) 0%, rgba(4,7,10,0) 65%)" }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
