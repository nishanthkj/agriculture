import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import NavBar from "@/components/NavBar/NavBar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900", // Ensure your font file supports this range
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900", // Ensure your font file supports this range
});

export const metadata: Metadata = {
  title: "Agriculture",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <NavBar />
        {children}
      </body>
    </html>
  );
}
