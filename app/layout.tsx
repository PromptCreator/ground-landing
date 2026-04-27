import type { Metadata } from "next";
import { Noto_Serif_KR, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const GA_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ground — 흩어진 출처를 한 번에 묶는 OSINT 워크벤치",
  description: "통신사 헤드라인·1차 자료·반론까지. 사건이 터졌을 때 Ground가 출처를 한 번에 묶어 OSINT 브리프로 정리합니다.",
  openGraph: {
    title: "Ground — 흩어진 출처를 한 번에 묶는 OSINT 워크벤치",
    description: "지정학·국제정세를 추적하는 사람을 위한 OSINT 워크벤치. 베타 출시 알림 신청하세요.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${fraunces.variable}`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: true });
            `}</Script>
          </>
        )}
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
