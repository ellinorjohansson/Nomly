/* eslint-disable camelcase */
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/common/components/header/Header";
import Footer from "@/common/components/footer/Footer";
import ScrollToTop from "@/common/components/scrollToTop/ScrollToTop";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Nomly",
  description: "",
  icons: {
    icon: "/images/nomly_favicon.avif",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable}`}>
        <Header />
        <ScrollToTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}
