import type { Metadata, Viewport } from "next";
import { createGlobalTokenStyle } from "@/lib/style-tokens";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuraCue",
  description: "AuraCue Web/H5 scaffold for the Web-first P0 flow."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FDF9F3"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={createGlobalTokenStyle()}>{children}</body>
    </html>
  );
}
