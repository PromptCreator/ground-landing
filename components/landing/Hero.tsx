"use client";

import { motion } from "framer-motion";
import { track } from "@/components/analytics/track";

const BETA_COUNT = process.env.NEXT_PUBLIC_BETA_COUNT ?? "127";
const DISTRICT_COUNT = process.env.NEXT_PUBLIC_DISTRICT_COUNT ?? "8";

export default function Hero() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* 상태 표시 */}
          <div className="flex items-center gap-2 mb-8">
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--data)" }}
            />
            <span className="label-caps" style={{ color: "var(--ink-3)" }}>
              서울 25개 자치구 · 방금 전 업데이트
            </span>
          </div>

          {/* 헤드라인 */}
          <h1
            className="font-serif-ko text-4xl sm:text-6xl leading-[1.1] tracking-tight mb-6"
            style={{ color: "var(--ink)" }}
          >
            결정을 내리기 전,<br />
            근거부터 모읍니다.
          </h1>

          {/* 서브 헤드라인 */}
          <p
            className="text-base sm:text-lg mb-10 max-w-xl leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            지역 뉴스·상권 데이터·반대 의견까지.<br />
            Ground가 3초 만에 의사결정 근거 패키지를 묶어 드립니다.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="#prototype"
              onClick={() => track("hero_cta_click", { cta: "primary" })}
              className="px-6 py-3 rounded-sm text-sm font-semibold transition-opacity"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              프로토타입 체험하기 →
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

          {/* Trust row */}
          <p className="label-caps" style={{ color: "var(--ink-3)" }}>
            베타 대기자 {BETA_COUNT}명 · 서울 {DISTRICT_COUNT}개 자치구 데이터 수집 중
          </p>
        </motion.div>
      </div>
    </section>
  );
}
