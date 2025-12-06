import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrendSage | AI-Powered Market Trend Intelligence",
  description: "Discover and analyze market trends with AI-driven research. Get instant, credible insights from scholarly sources and academic publications.",
  keywords: ["market trends", "AI research", "trend analysis", "market intelligence", "scholarly search", "academic research", "business intelligence"],
  authors: [{ name: "TrendSage" }],
  openGraph: {
    title: "TrendSage | AI-Powered Market Trend Intelligence",
    description: "Discover and analyze market trends with AI-driven research. Get instant, credible insights from scholarly sources.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendSage | AI-Powered Market Trend Intelligence",
    description: "Discover and analyze market trends with AI-driven research.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
