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
  const q = query.trim();
  if (/이스라엘|이란|호르무즈|중동/.test(q)) return ISRAEL_IRAN_BRIEF;
  if (/BRICS|브릭스|달러|결제망|위안|루블/.test(q)) return BRICS_BRIEF;
  if (/남중국해|필리핀|스카버러|세컨드 토머스|9단선|남사군도/.test(q)) return SCS_BRIEF;
  return genericBrief(q);
}

const ISRAEL_IRAN_BRIEF = `## OSINT 브리프 — "이스라엘–이란 4월 충돌 격화"

### 핵심 사실
1. **[Reuters · 04-19]** 이란 본토 이스파한 인근 군 시설 대상 제한적 타격. 인명피해 미확인, 핵시설 손상 없음(IAEA 1차 점검).
2. **[AP · 04-14]** 이란, 시리아 다마스쿠스 영사관 피격(4-1) 보복으로 드론·미사일 300여기 발사 — 99% 요격 발표(IDF).
3. **[Bloomberg · 04-22]** 브렌트유 일시 $92 돌파 후 $87 안착. 호르무즈 통과 LNG 운송료 +14%.

### 1차 자료
- **IDF Spokesperson Telegram** (04-14) — 요격 통계·상세 무기 분류 공개
- **IRGC 공식 성명문** (Tasnim 04-14) — "True Promise" 작전 종료 선언, 추가 행동 조건부
- **U.S. CENTCOM Press Release** (04-14) — 영국·요르단·프랑스 합동 요격 참여 확인

### 반대·대안 해석
- **이란 측 프레임**: 제한적·비례적 보복으로 "관리된 대치" 종결 의도 (Carnegie · Vakil 04-16)
- **이스라엘 매파 프레임**: 핵시설 직접 타격이 정치적 호기 (JINSA 04-18)
- **제3자(ICG)**: 양측 모두 "얼굴 세우기" 단계, 확전 의도 부재. 다만 우발 충돌 위험 고조

### 타임라인
- 04-01 다마스쿠스 영사관 피격 → 04-13 이란 보복 발사 → 04-19 이스라엘 제한 타격 → 04-22 양측 공식 성명 자제

### Bottom line
> 양측은 **"보여주기식 보복"의 균형점**을 찾았으나, 호르무즈 해협 보험료·해운 우회는 구조화 단계. 다음 분기점은 헤즈볼라 북부 전선과 핵 협상(JCPOA) 재개 여부.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

const BRICS_BRIEF = `## OSINT 브리프 — "BRICS 확대와 달러 결제망 재편"

### 핵심 사실
1. **[FT · 03-28]** BRICS+ 신규 가입국 외환보유고 중 USD 비중 2020년 71% → 2025년 58%. 위안·금 비중 동반 상승.
2. **[BIS Quarterly Review · 2026Q1]** mBridge(다자 CBDC 결제망) 실거래 누적 $2.1B. 사우디·UAE 정식 합류 후 거래량 +280%.
3. **[SWIFT RMB Tracker · 03]** 위안 결제 비중 4.7%(역대 최고). 단 USD 49.1%·EUR 22.4% 대비 여전히 격차 큼.

### 1차 자료
- **카잔 BRICS 정상선언문** (2024-10) — "다자 결제 인프라" 항목 ¶42, 강제력 없는 권고 수준
- **IMF COFER** (2026Q1) — 글로벌 외환보유고 통화 구성 시계열
- **PBoC 위안화 국제화 보고서** (2025 연차) — CIPS 가입 기관 1,500개 돌파

### 반대·대안 해석
- **달러 패권 견고론**(Eichengreen · Brookings 03-15): 무역결제 ≠ 준비통화. 자본시장 깊이·법치 신뢰가 USD 대체 차단
- **다극화 진행론**(Pozsar · Credit Suisse 시리즈 인용): "Bretton Woods III" 가설, 자원 담보 통화 부상
- **신중론**(Atlantic Council Geoeconomics): 분절은 진행 중이나 **속도 < 시장 기대**

### 타임라인
- 2024-10 카잔 회담(확대 합의) → 2025-06 mBridge 실거래 개시 → 2026-Q1 사우디·UAE 합류 → 2026-Q3 인도 결정 예정

### Bottom line
> 즉각적 달러 위협보다 **장기적 분절화(fragmentation)**가 본질. 한국 기업 관점에서는 결제 통화 다변화·제재 대응 회로가 단기 우선 과제.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

const SCS_BRIEF = `## OSINT 브리프 — "남중국해 항행 분쟁 — 필리핀·중국"

### 핵심 사실
1. **[Reuters · 04-08]** Second Thomas Shoal(아융인 암초) 보급선 대상 중국 해경 물대포 사용. 필리핀 해군 3명 부상.
2. **[CSIS AMTI · 03]** Scarborough Shoal 인근 중국 해경·해상민병 상시 배치 척수 2024년 평균 12척 → 2026년 19척.
3. **[Bloomberg · 04-12]** 미·필 상호방위조약 발동 임계 관련 워싱턴 내부 검토 보도. 국무부 공식 부인.

### 1차 자료
- **PCG(필리핀 해안경비대) 공개 영상** (04-08) — 충돌 전 과정 4K 풀영상 X 공식계정 게재
- **중국 외교부 정례 브리핑** (04-09) — "필리핀의 도발이 사태 원인" 입장 반복
- **U.S. State Department 성명** (04-09) — 1951 상호방위조약 적용 대상 재확인

### 반대·대안 해석
- **중국 측**: 9단선 역사적 권원 주장, 2016 PCA 판결 무효 입장 일관
- **필리핀 측**: 마르코스 정부 "투명성 외교" 노선, 충돌 영상 적극 공개로 국제 여론전
- **회의론**(Hayton · RUSI): 미국의 모호성 전략이 오히려 중국의 점진적 잠식 허용

### 타임라인
- 2024-06 보급선 충돌 격화 → 2025-02 미·필 EDCA 기지 추가 → 2026-04 부상자 발생 → 2026-Q2 미·필 발리카탄 연합훈련 예정

### Bottom line
> **미·필 동맹의 임계점 시험대**. 부상자 발생은 처음이지만 사망자 부재로 조약 발동 명분은 부족. 다음 분기 발리카탄 훈련 규모·미 항모 전개가 핵심 신호.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

function genericBrief(query: string): string {
  return `## OSINT 브리프 — "${query}"

### 핵심 사실
1. **[Reuters / AP / AFP]** 주요 통신사 헤드라인 3건이 자동 수집되어 사실 관계가 정렬됩니다.
2. **[정부 공식 발표 / 1차 자료]** 관계국 외교부·국방부 브리핑과 공식 문서가 대조됩니다.
3. **[현장 검증]** 위성 이미지·SNS 지오로케이션 등 1차 검증 자료가 함께 제시됩니다.

### 1차 자료
- 관련 정부 공식 성명·브리핑 원문 링크
- 국제기구 보고서(UN, IAEA, IMF 등) 해당 단락
- 검증된 OSINT 계정의 1차 분석 게시물

### 반대·대안 해석
- 주류 해석에 대한 **반박·수정 시각** (싱크탱크·전문가 칼럼)
- 당사국 내부의 **상이한 입장**

### 타임라인
- 사건의 핵심 분기점 4–6개를 시간 순으로 재구성

### Bottom line
> 사건의 의미·확전 가능성·다음 분기점에 대한 **한 문단 요약**을 제공합니다.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;
}
