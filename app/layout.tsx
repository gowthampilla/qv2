import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quad",
  description: "Your AI companion for becoming job-ready."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
