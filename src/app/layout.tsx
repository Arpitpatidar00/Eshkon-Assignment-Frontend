import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page Studio — CMS-Powered Landing Page Builder",
  description:
    "Create, edit, preview, and publish landing pages with structured content. Schema-driven rendering, role-based permissions, and immutable versioning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
