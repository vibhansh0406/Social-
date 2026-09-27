"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const RAMP = " .,'`-_:;=+*<>()[]{}#%@";

export type AsciiBackgroundProps = {
  src: string;
  charSize?: number;
  color?: string;
  opacity?: number;
  invert?: boolean;
  useImageColors?: boolean;
  className?: string;
};

export default function AsciiBackground({
  src,
  charSize = 7,
  color = "#8ea79c",
  opacity = 0.55,
  invert = false,
  useImageColors = false,
  className,
}: AsciiBackgroundProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const brightUrlRef = useRef<string>("");

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
        
        // Draw original
        const scale = Math.max(cols / img.width, rows / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        
        const imgData = ctx.getImageData(0, 0, cols, rows);
        const data = imgData.data;
        
        // Brighten pixels for the background fill
        const brightCanvas = document.createElement("canvas");
        brightCanvas.width = cols;
        brightCanvas.height = rows;
        const bCtx = brightCanvas.getContext("2d");
        if (bCtx) {
          const brightData = bCtx.createImageData(cols, rows);
          const bd = brightData.data;
          for (let i = 0; i < data.length; i += 4) {
            // Boost brightness 2.5x for visibility on dark bg
            bd[i] = Math.min(255, data[i] * 2.5);
            bd[i+1] = Math.min(255, data[i+1] * 2.5);
            bd[i+2] = Math.min(255, data[i+2] * 2.5);
            bd[i+3] = 255;
          }
          bCtx.putImageData(brightData, 0, 0);
          brightUrlRef.current = brightCanvas.toDataURL();
        }

        // Generate ASCII text based on luminance
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

  const preStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    margin: 0,
    overflow: "hidden",
    opacity,
    fontSize: charSize,
    lineHeight: `${charSize}px`,
    letterSpacing: 0,
    fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
    userSelect: "none",
    pointerEvents: "none",
    whiteSpace: "pre",
    ...(useImageColors
      ? {
          color: "transparent",
          backgroundImage: brightUrlRef.current ? `url(${brightUrlRef.current})` : `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }
      : { color }),
  };

  const pre = <pre ref={preRef} aria-hidden className={className} style={preStyle} />;

  if (useImageColors) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#000000" }}>
        {pre}
      </div>
    );
  }
  return pre;
}
