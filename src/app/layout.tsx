/* eslint-disable camelcase */
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/common/components/header/Header";
import Footer from "@/common/components/footer/Footer";
import ScrollToTop from "@/common/components/scrollToTop/ScrollToTop";
import { Manrope, Sora } from "next/font/google";

const display = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Nomly",
  description:
    "Nomly är en receptapp där du kan spara, bläddra bland och dela dina favoritrecept.",
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
    <html lang="sv">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${display.variable} ${body.variable}`}>
        <Header />
        <ScrollToTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}
