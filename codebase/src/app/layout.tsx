import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Python Bootcamp",
    template: "%s | Python Bootcamp",
  },
  description:
    "Lerne Python-Programmierung mit KI-Unterstützung. Interaktive Übungen basierend auf der 4C/ID Lernmethode.",
  keywords: ["Python", "Programmieren lernen", "KI", "4C/ID", "Bootcamp", "Tutorial"],
  authors: [{ name: "Python Bootcamp Team" }],
  openGraph: {
    title: "Python Bootcamp",
    description:
      "Lerne Python-Programmierung mit KI-Unterstützung. Interaktive Übungen basierend auf der 4C/ID Lernmethode.",
    type: "website",
    locale: "de_DE",
    siteName: "Python Bootcamp",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Bootcamp",
    description:
      "Lerne Python-Programmierung mit KI-Unterstützung. Interaktive Übungen basierend auf der 4C/ID Lernmethode.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
