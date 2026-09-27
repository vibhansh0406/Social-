import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VibSocial | AI & Full-Stack Engineering",
    template: "%s | VibSocial",
  },
  description: "Engineering the next generation of intelligent systems. VEDA-8B, scalable SaaS platforms, and AI architecture by Vibhansh.",
  keywords: ["AI", "Machine Learning", "Full-Stack", "Next.js", "VibSocial", "Vibhansh", "Portfolio", "VEDA-8B"],
  authors: [{ name: "Vibhansh", url: "https://vibsocial.vercel.app" }],
  creator: "Vibhansh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibsocial.vercel.app",
    siteName: "VibSocial",
    title: "VibSocial | AI & Full-Stack Engineering",
    description: "Engineering the next generation of intelligent systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibSocial | AI & Full-Stack Engineering",
    description: "Engineering the next generation of intelligent systems.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#070b09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
