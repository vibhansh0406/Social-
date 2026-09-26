import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "VibSocial | AI & Web Engineering",
  description: "Engineering the next generation of intelligent systems. Machine Learning, Deep Learning, and Full-Stack Architecture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${instrument.variable} font-sans bg-[#fbfbfa] text-neutral-900 antialiased`}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
