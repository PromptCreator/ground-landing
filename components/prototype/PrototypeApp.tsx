"use client";

import { useState, useCallback } from "react";
import { track } from "@/components/analytics/track";
import InputStage from "./InputStage";
import LoadingStage from "./LoadingStage";
import ResultStage from "./ResultStage";

type Stage = "input" | "loading" | "result";

let interacted = false;

function fireInteract(action: "sample" | "generate" | "copy") {
  if (interacted) return;
  interacted = true;
  track("prototype_interact", { action });
}

export default function PrototypeApp() {
  const [stage, setStage] = useState<Stage>("input");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = useCallback(async (q: string) => {
    fireInteract("generate");
    setQuery(q);
    setStage("loading");
    await new Promise((r) => setTimeout(r, 2200));
    setResult(buildSampleResult(q));
    setStage("result");
  }, []);

  const handleSample = useCallback((q: string) => {
    fireInteract("sample");
    setQuery(q);
  }, []);

  const handleCopy = useCallback(() => {
    fireInteract("copy");
  }, []);

  const handleReset = useCallback(() => {
    setStage("input");
    setQuery("");
    setResult(null);
  }, []);

  return (
    <div
      className="rounded-sm border overflow-hidden"
      style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}
    >
      {stage === "input" && (
        <InputStage query={query} onQueryChange={setQuery} onGenerate={handleGenerate} onSample={handleSample} />
      )}
      {stage === "loading" && <LoadingStage query={query} />}
      {stage === "result" && result && (
        <ResultStage query={query} result={result} onCopy={handleCopy} onReset={handleReset} />
      )}
    </div>
  );
}

function buildSampleResult(query: string): string {
  return `## 근거 패키지 — "${query}"

### 긍정 신호 (3건)
1. **[서울시 마포구 상권분석 2024]** 홍대입구역 반경 500m 카페 매출 전년 대비 +12%. 유동인구 일평균 8.2만 명.
2. **[KB부동산 상권리포트 Q1 2025]** 해당 지역 공실률 4.1% — 서울 평균(7.8%) 대비 낮음. 신규 입점 경쟁 제한적.
3. **[네이버 지역 리뷰 트렌드]** '혼자 오기 좋은', '조용한 작업 공간' 키워드 리뷰 6개월 연속 증가세.

### 반대 신호 (2건)
1. **[소상공인시장진흥공단 2024]** 카페 업종 3년 생존율 38.2%. 동일 상권 내 신규 개업 전년比 +23%.
2. **[서울 열린데이터광장]** 해당 블록 임대료 ㎡당 월 8.5만원 — 전년比 +18%. 손익분기 매출 상향 압력.

### 핵심 판단 요약
> 유동인구·공실률은 우호적이나 임대료 상승과 과잉경쟁이 위험 요소. **추가 확인 필요**: 목표 고객층(1인 집중형 vs 그룹 미팅형) 명확화 후 메뉴 포지셔닝 재검토 권장.

---
*Ground 베타 — 샘플 데이터 기반 시연용*`;
}
