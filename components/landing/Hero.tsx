"use client";

import { motion } from "framer-motion";
import { track } from "@/components/analytics/track";

const BETA_COUNT = process.env.NEXT_PUBLIC_BETA_COUNT ?? "127";
const SOURCE_COUNT = process.env.NEXT_PUBLIC_SOURCE_COUNT ?? "32";

export default function Hero() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-8">
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--data)" }}
            />
            <span className="label-caps" style={{ color: "var(--ink-3)" }}>
              전 세계 {SOURCE_COUNT}개 통신사 · UTC 실시간
            </span>
          </div>

          <h1
            className="font-serif-ko text-4xl sm:text-6xl leading-[1.1] tracking-tight mb-6"
            style={{ color: "var(--ink)" }}
          >
            흩어진 출처를 한 번에,<br />
            OSINT 워크벤치.
          </h1>

          <p
            className="text-base sm:text-lg mb-10 max-w-xl leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            통신사 헤드라인·1차 자료·반론까지.<br />
            사건이 터졌을 때 Ground가 출처를 한 번에 묶어 OSINT 브리프로 정리합니다.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="#prototype"
              onClick={() => track("hero_cta_click", { cta: "primary" })}
              className="px-6 py-3 rounded-sm text-sm font-semibold transition-opacity"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              워크벤치 체험하기 →
            </a>
            <a
              href="#signup"
              onClick={() => track("hero_cta_click", { cta: "secondary" })}
              className="px-6 py-3 rounded-sm text-sm font-semibold border transition-colors"
              style={{ borderColor: "var(--line)", color: "var(--ink-2)", background: "transparent" }}
            >
              출시 알림 받기
            </a>
          </div>

          <p className="label-caps" style={{ color: "var(--ink-3)" }}>
            베타 대기자 {BETA_COUNT}명 · 글로벌 {SOURCE_COUNT}개 통신사 모니터링 중
          </p>
        </motion.div>
      </div>
    </section>
  );
}
