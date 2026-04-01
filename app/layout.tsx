import type { Metadata } from "next";
import { Inter, Bebas_Neue, Zen_Dots } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const zenDots = Zen_Dots({
  weight: "400",
  variable: "--font-zen",
  
});

export const metadata: Metadata = {
  title: {
    default: "Estate Kings Basketball Academy",
    template: "%s | Estate Kings Basketball Academy",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "basketball",
    "academy",
    "training",
    "youth basketball",
    "basketball camp",
    "basketball coaching",
    "estate kings basketball academy",
    "estate kings basketball",
    "estate kings basketball team",
    "estate kings basketball players",
    "estate kings basketball coach",
    "estate kings basketball coach",
    'best basketball academy in lagos',
    'best basketball academy in nigeria',
    'lagos basketball academy',
    'nigeria basketball academy',
    'basketball academy in lagos',
    'basketball academy in nigeria',
    'basketball academy in lagos',
  ],
  icons: {
    icon: "/ball-of-basketball.svg",
    shortcut: "/ball-of-basketball.svg",
    apple: "/ball-of-basketball.svg",
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/about.jpg`,
        width: 1200,
        height: 630,
        alt: "Estate Kings Basketball Academy",
      },
      {
        url: `${siteConfig.url}/ball-of-basketball.svg`,
        width: 512,
        height: 512,
        alt: "Estate Kings Basketball Academy logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/about.jpg`, `${siteConfig.url}/ball-of-basketball.svg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${zenDots.variable} antialiased font-body`}
      >
        <TopBar />
        <main>{children}</main>
        <Footer />
        <Navbar />
      </body>
    </html>
  );
}
