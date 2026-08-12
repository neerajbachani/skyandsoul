import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { SITE } from "@/lib/constants";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Handmade heirloom blankets, crochet toys, gift boxes, and memory editions — crafted with love for the little moments that define us.",
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description:
      "Handmade heirloom blankets, crochet toys, gift boxes, and memory editions — crafted with love for the little moments that define us.",
    url: SITE.url,
    siteName: SITE.name,
    images: [
      {
        url: "/logo.png",
        width: 1080,
        height: 1080,
        alt: `${SITE.name} logo`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} | ${SITE.tagline}`,
    description:
      "Handmade heirloom blankets, crochet toys, gift boxes, and memory editions.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-chocolate">
        <QueryProvider>
          <SkipToContent />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
