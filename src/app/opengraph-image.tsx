import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VibSocial Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "linear-gradient(135deg, #f5efe6 0%, #b7d3f4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#1a1a1a",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 140, fontWeight: "bold", letterSpacing: "-0.05em", marginBottom: 20 }}>
          VIBSOCIAL
        </div>
        <div style={{ fontSize: 40, color: "#555", fontFamily: "sans-serif", letterSpacing: "0.1em" }}>
          AI / ML — FULL-STACK — ARCHITECTURE
        </div>
      </div>
    ),
    { ...size }
  );
}
