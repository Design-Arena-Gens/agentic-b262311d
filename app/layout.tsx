import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bus Routing System",
  description: "School bus routing and tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
