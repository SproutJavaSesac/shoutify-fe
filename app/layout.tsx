import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "구절구절 제목",
    template: "%s | 구절구절",
  },
  description:
    "일상의 감정을 문학적 표현으로 변환해주는 AI 기반 소셜 플랫폼. 당신의 이야기를 아름다운 문학 작품으로 만들어보세요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://verseByverse.com",
    siteName: "구절구절",
    title: "제목입니다.",
    description: "일상의 감정을 문학적 표현으로 변환해주는 AI 기반 소셜 플랫폼",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "verse-by-verse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "제목입니다.",
    description: "일상의 감정을 문학적 표현으로 변환해주는 AI 기반 소셜 플랫폼",
    images: ["/og-image.png"],
    creator: "@verse-by-verse",
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
      </body>
    </html>
  );
}
