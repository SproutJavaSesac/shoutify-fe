import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "구절구절 - 당신의 이야기가 문학이 되는 곳",
    template: "%s | 구절구절",
  },
  description:
    "평범한 일상의 순간들을 아름다운 문학 작품으로 변화시켜주는 AI 플랫폼. 시, 소설, 에세이로 당신만의 감정을 표현하고 다른 이들과 공유해보세요.",
  keywords: [
    "AI 문학",
    "감정 표현",
    "창작 플랫폼",
    "시 생성",
    "소설 창작",
    "에세이",
    "문학 소셜",
    "감정 공유",
    "창작 커뮤니티",
  ],
  authors: [{ name: "구절구절 팀" }],
  creator: "구절구절",
  publisher: "구절구절",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://versebyverse.vercel.app",
    siteName: "구절구절",
    title: "구절구절 - 당신의 이야기가 문학이 되는 곳",
    description:
      "평범한 일상의 순간들을 아름다운 문학 작품으로 변화시켜주는 AI 플랫폼",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "구절구절 - AI와 함께 만드는 문학 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "구절구절 - 당신의 이야기가 문학이 되는 곳",
    description:
      "평범한 일상의 순간들을 아름다운 문학 작품으로 변화시켜주는 AI 플랫폼",
    images: ["/og-image.png"],
    creator: "@versebyverse_kr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  generator: "Next.js",
  applicationName: "VerseByVerse",
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
