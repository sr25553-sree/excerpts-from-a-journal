import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif-4",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const casualHuman = localFont({
  src: "./fonts/CasualHuman.otf",
  variable: "--font-casual-human",
  display: "swap",
});

const biroScript = localFont({
  src: "./fonts/Biro_Script_reduced.otf",
  variable: "--font-biro-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Excerpts from a Journal",
  description: "Anonymous words, left here for anyone.",
  openGraph: {
    title: "Excerpts from a Journal",
    description: "Anonymous words, left here for anyone.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable} ${casualHuman.variable} ${biroScript.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
