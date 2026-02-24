import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Anima — AI Agents for Enterprise",
  description:
    "Deploy autonomous AI agents that work across your tools and channels — privately, on your infrastructure.",
  openGraph: {
    title: "Anima — AI Agents for Enterprise",
    description:
      "Deploy autonomous AI agents that work across your tools and channels — privately, on your infrastructure.",
    type: "website",
    url: "https://anima.sylphx.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
