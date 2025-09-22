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
  title: "हाम्रो नेपाली न्युज",
  description: "Hamro Nepali News",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSerifDevanagari.variable} antialiased font-noto-serif-devanagari`}
      >
        {children}
      </body>
    </html>
  );
}
