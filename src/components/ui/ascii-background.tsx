"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const RAMP = " .,'`-_:;=+*<>()[]{}#%@";

export type AsciiBackgroundProps = {
  src: string;
  useImageColors?: boolean;
  className?: string;
};

export default function AsciiBackground({
  src,
  useImageColors = false,
  className,
}: AsciiBackgroundProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    let cancelled = false;

    const render = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        
        // FIXED GRID: 120 columns, maintain aspect ratio
        const cols = 120;
        const aspectRatio = img.height / img.width;
        // Monospace char aspect ratio is roughly 0.55
        const rows = Math.round(cols * aspectRatio * 0.55);
        
        const canvas = document.createElement("canvas");
        canvas.width = cols;
        canvas.height = rows;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0, cols, rows);
        const imgData = ctx.getImageData(0, 0, cols, rows);
        const data = imgData.data;

        let out = "";
        for (let y = 0; y < rows; y++) {
          let line = "";
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            const v = l / 255;
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
    return () => { cancelled = true; };
  }, [src]);

  const preStyle: CSSProperties = {
    margin: 0,
    fontSize: "1.2vw", // Responsive font size
    lineHeight: "1.2vw",
    letterSpacing: 0,
    fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
    userSelect: "none",
    pointerEvents: "none",
    whiteSpace: "pre",
    color: "transparent",
    ...(useImageColors
      ? {
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          filter: "brightness(1.3) contrast(1.2)",
        }
      : { color: "#ffffff" }),
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050505] overflow-hidden">
      <pre ref={preRef} aria-hidden className={className} style={preStyle} />
    </div>
  );
}
