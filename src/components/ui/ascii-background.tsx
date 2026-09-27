"use client";

import { useEffect, useRef, type CSSProperties, useState } from "react";
import { useGyroscope } from "@/hooks/useGyroscope";

const RAMP = " .:-=+*#%@"; // Optimized ramp for better contrast

export type AsciiBackgroundProps = {
  src: string;
  charSize?: number;
  opacity?: number;
  invert?: boolean;
  useImageColors?: boolean;
  className?: string;
};

export default function AsciiBackground({
  src,
  charSize = 6,
  opacity = 1,
  invert = false,
  useImageColors = false,
  className,
}: AsciiBackgroundProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const brightUrlRef = useRef<string>("");
  const { orientation } = useGyroscope();
  
  const [isDesktop, setIsDesktop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Detect Desktop
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mouse Parallax for Desktop
  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  // Generate ASCII
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    let cancelled = false;

    const render = () => {
      const width = pre.clientWidth;
      const height = pre.clientHeight;
      if (!width || !height) return;
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        const cellW = charSize * 0.55; // Slightly tighter for better resolution
        const cols = Math.max(40, Math.floor(width / cellW));
        const rows = Math.max(24, Math.floor(height / charSize));
        
        const canvas = document.createElement("canvas");
        canvas.width = cols;
        canvas.height = rows;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        
        const scale = Math.max(cols / img.width, rows / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        
        const imgData = ctx.getImageData(0, 0, cols, rows);
        const data = imgData.data;
        
        // Brighten & Contrast Fix
        const brightCanvas = document.createElement("canvas");
        brightCanvas.width = cols;
        brightCanvas.height = rows;
        const bCtx = brightCanvas.getContext("2d");
        if (bCtx) {
          const brightData = bCtx.createImageData(cols, rows);
          const bd = brightData.data;
          for (let i = 0; i < data.length; i += 4) {
            // Gamma correction for better contrast
            bd[i] = Math.min(255, Math.pow(data[i] / 255, 0.85) * 255 * 1.8);
            bd[i+1] = Math.min(255, Math.pow(data[i+1] / 255, 0.85) * 255 * 1.8);
            bd[i+2] = Math.min(255, Math.pow(data[i+2] / 255, 0.85) * 255 * 1.8);
            bd[i+3] = 255;
          }
          bCtx.putImageData(brightData, 0, 0);
          brightUrlRef.current = brightCanvas.toDataURL();
        }

        let out = "";
        for (let y = 0; y < rows; y++) {
          let line = "";
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            let v = l / 255;
            if (invert) v = 1 - v;
            line += RAMP[Math.round(v * (RAMP.length - 1))];
          }
          out += line + "\n";
        }
        pre.textContent = out;
      };
      img.onerror = () => { if (!cancelled) pre.textContent = ""; };
      img.src = src;
    };

    render();
    const ro = new ResizeObserver(() => render());
    ro.observe(pre);
    return () => { cancelled = true; ro.disconnect(); };
  }, [src, charSize, invert]);

  // Calculate Tilt (Mouse for Desktop, Gyro for Mobile)
  const tiltX = isDesktop ? mousePos.x * 15 : orientation.x * 1.5;
  const tiltY = isDesktop ? mousePos.y * 15 : orientation.y * 1.5;

  const preStyle: CSSProperties = {
    position: "absolute",
    inset: "-30px", // Extra padding to prevent edges showing on tilt
    margin: 0,
    overflow: "hidden",
    opacity,
    fontSize: charSize,
    lineHeight: `${charSize * 0.9}px`,
    letterSpacing: 0,
    fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
    userSelect: "none",
    pointerEvents: "none",
    whiteSpace: "pre",
    transform: `translate3d(${tiltX}px, ${tiltY}px, 0)`,
    transition: "transform 0.2s ease-out",
    ...(useImageColors
      ? {
          color: "transparent",
          backgroundImage: brightUrlRef.current ? `url(${brightUrlRef.current})` : `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }
      : { color: "#ffffff" }),
  };

  const pre = <pre ref={preRef} aria-hidden className={className} style={preStyle} />;

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, background: "#050505", overflow: "hidden" }}>
      {pre}
      {/* CRT Scanline Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          mixBlendMode: "multiply"
        }}
      />
    </div>
  );
}
