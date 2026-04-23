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

export const metadata: Metadata = {
  title: "Ground — 의사결정 근거 패키지를 3초 만에",
  description: "지역 뉴스·상권 데이터·반대 의견까지. Ground가 3초 만에 의사결정 근거 패키지를 묶어 드립니다.",
  openGraph: {
    title: "Ground — 의사결정 근거 패키지를 3초 만에",
    description: "지역 매장 운영자를 위한 AI 의사결정 도우미. 베타 출시 알림 신청하세요.",
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
