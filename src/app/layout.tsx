import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "공연마루 | Stage Maru",
  description: "오늘, 당신을 위한 막이 오르면 - 대한민국의 모든 공연 정보를 한눈에 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen bg-[var(--bg-primary)] pb-24">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
