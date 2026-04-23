"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "지역 뉴스 스캔 중…",
  "상권 데이터 수집 중…",
  "반대 의견 정리 중…",
  "근거 패키지 묶는 중…",
];

interface Props {
  query: string;
}

export default function LoadingStage({ query }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 520);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-6 sm:p-8">
      <p className="label-caps mb-3" style={{ color: "var(--ink-3)" }}>
        분석 중 — &ldquo;{query}&rdquo;
      </p>
      <div className="space-y-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm transition-opacity duration-300"
            style={{ opacity: i <= step ? 1 : 0.25, color: i === step ? "var(--accent)" : "var(--ink-2)" }}>
            <span className="w-4 text-center">
              {i < step ? "✓" : i === step ? "·" : "○"}
            </span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div
        className="mt-5 h-1 rounded-full overflow-hidden"
        style={{ background: "var(--line-2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
