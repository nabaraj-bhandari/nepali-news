// app/layout.tsx
import type { Metadata } from "next";
import { Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "नव न्युज",
  description:
    "नव न्युज (Nawa News) - नेपाली समाचार एग्रीगेटर, जसले विभिन्न स्रोतबाट शीर्ष समाचारहरू संकलन गर्छ। यो प्रोजेक्ट पूर्णतया सिकाइ र शौकको लागि मात्र हो।",
  keywords: [
    "नव न्युज",
    "Nawa News",
    "Nepali News",
    "Nepal Headlines",
    "Nepali News Portal",
    "News Aggregator",
    "Nepal",
  ],
  authors: [
    {
      name: "Nabaraj Bhandari",
      url: "https://nabaraj-bhandari.com.np",
    },
  ],
  openGraph: {
    type: "website",
    locale: "ne_NP",
    url: "https://news.nabaraj-bhandari.com.np",
    title: "नव न्युज",
    description:
      "नव न्युज (Nawa News) - शीर्ष नेपाली समाचार स्रोतहरूबाट समाचार संकलन गर्ने शुद्ध शौक र सिकाइ उद्देश्यको प्रोजेक्ट।",
    siteName: "नव न्युज",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "नव न्युज | Nawa News",
      },
    ],
  },
  metadataBase: new URL("https://news.nabaraj-bhandari.com.np"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <body
        className={`${notoSerifDevanagari.variable} antialiased font-noto-serif-devanagari`}
      >
        {children}
      </body>
    </html>
  );
}
