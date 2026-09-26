"use client";

import { useEffect, useRef } from "react";

const RAMP = " .,'`-_:;=+*<>()[]{}#%@";

export type AsciiBackgroundProps = {
  src: string;
  charSize?: number;
  color?: string;
  opacity?: number;
  invert?: boolean;
  className?: string;
};

export default function AsciiBackground({
  src,
  charSize = 7,
  color = "#8ea79c",
  opacity = 0.55,
  invert = false,
  className,
}: AsciiBackgroundProps) {
  const preRef = useRef<HTMLPreElement>(null);

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
        const data = ctx.getImageData(0, 0, cols, rows).data;
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
      img.onerror = () => {
        if (!cancelled) pre.textContent = "";
      };
      img.src = src;
    };

    render();
    const ro = new ResizeObserver(() => render());
    ro.observe(pre);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [src, charSize, invert]);

  return (
    <pre
      ref={preRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        margin: 0,
        overflow: "hidden",
        color,
        opacity,
        fontSize: charSize,
        lineHeight: `${charSize}px`,
        letterSpacing: 0,
        fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "pre",
      }}
    />
  );
}
