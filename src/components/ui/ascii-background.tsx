"use client";

import { useEffect, useRef, type CSSProperties, useState } from "react";
import { useGyroscope } from "@/hooks/useGyroscope";

const RAMP = " .,'`-_:;=+*<>()[]{}#%@";

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
  charSize = 7,
  opacity = 1,
  invert = false,
  useImageColors = false,
  className,
}: AsciiBackgroundProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const { orientation } = useGyroscope();
  
  const [isDesktop, setIsDesktop] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Detect Desktop for Mouse Parallax
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mouse Parallax Logic
  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; 
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  // Generate ASCII Text
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
        const cellW = charSize * 0.6;
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
  // Multipliers kept low for subtle, premium feel
  const tiltX = isDesktop ? mousePos.x * 12 : orientation.x * 1.2;
  const tiltY = isDesktop ? mousePos.y * 12 : orientation.y * 1.2;

  const preStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    margin: 0,
    opacity,
    fontSize: charSize,
    lineHeight: `${charSize}px`,
    letterSpacing: 0,
    fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
    userSelect: "none",
    pointerEvents: "none",
    whiteSpace: "pre",
    // Smooth Parallax Transform
    transform: `translate3d(${tiltX}px, ${tiltY}px, 0)`,
    transition: "transform 0.2s ease-out",
    // CSS Filters for instant color pop (Better than canvas manipulation)
    filter: "brightness(1.4) contrast(1.15) saturate(1.2)",
    ...(useImageColors
      ? {
          color: "transparent",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }
      : { color: "#ffffff" }),
  };

  const pre = <pre ref={preRef} aria-hidden className={className} style={preStyle} />;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#050505", overflow: "hidden" }}>
      {/* Scale up slightly to prevent edges showing during parallax */}
      <div style={{ position: "absolute", inset: "-10%", transform: "scale(1.1)" }}>
        {pre}
      </div>
    </div>
  );
}
