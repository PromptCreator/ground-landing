"use client";

import { useState, useCallback } from "react";
import { track } from "@/components/analytics/track";
import InputStage from "./InputStage";
import LoadingStage from "./LoadingStage";
import ResultStage from "./ResultStage";
import WorldMap from "./WorldMap";

type Stage = "input" | "loading" | "result";

let interacted = false;

function fireInteract(action: "sample" | "generate" | "copy" | "map") {
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

  const handleMapSelect = useCallback(
    (q: string) => {
      fireInteract("map");
      handleGenerate(q);
    },
    [handleGenerate]
  );

  const handleCopy = useCallback(() => {
    fireInteract("copy");
  }, []);

  const handleReset = useCallback(() => {
    setStage("input");
    setQuery("");
    setResult(null);
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="rounded-sm border p-4 sm:p-6"
        style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}
      >
        <WorldMap
          onSelect={handleMapSelect}
          active={stage !== "input" ? query : undefined}
          disabled={stage === "loading"}
        />
      </div>
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
    </div>
  );
}

function buildSampleResult(query: string): string {
  const q = query.trim();
  if (/이스라엘|이란|호르무즈|중동/.test(q)) return ISRAEL_IRAN_BRIEF;
  if (/BRICS|브릭스|달러|결제망|위안|루블/.test(q)) return BRICS_BRIEF;
  if (/남중국해|필리핀|스카버러|세컨드 토머스|9단선|남사군도/.test(q)) return SCS_BRIEF;
  if (/우크라이나|러시아|EU 지원|유럽 안보|돈바스|크름|크림/.test(q)) return UKRAINE_BRIEF;
  if (/북한|한반도|미사일|김정은|ICBM|DPRK/.test(q)) return KOREA_BRIEF;
  if (/수단|RSF|SAF|카르툼|다르푸르|내전/.test(q)) return SUDAN_BRIEF;
  if (/사헬|말리|부르키나파소|니제르|쿠데타|와그너|아프리카 군부/.test(q)) return SAHEL_BRIEF;
  if (/베네수엘라|가이아나|에세키보|마두로|Esequibo/.test(q)) return ESEQUIBO_BRIEF;
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

const UKRAINE_BRIEF = `## OSINT 브리프 — "우크라이나 전선 교착과 EU 지원안"

### 핵심 사실
1. **[ISW · 04-21]** 도네츠크 차시우야르 일대 러시아군 진격 일주일 평균 250m 미만. 동부 전선 전반 교착 국면 진입.
2. **[Reuters · 04-15]** EU 27개국 €50bn 우크라이나 지원 패키지 4년분 집행 1차 트랜치(€4.5bn) 송금 완료.
3. **[Bloomberg · 04-23]** 미 의회 통과한 $61bn 보충예산 중 ATACMS·155mm 포탄 1차 인도 시작. 전선 도착까지 4–6주 추정.

### 1차 자료
- **우크라이나 총참모부 일일 보고** (텔레그램 공식) — 전선별 교전 횟수·러시아 손실 추정치
- **러시아 국방부 공식 발표** (mil.ru) — 자체 영토 점령 주장(검증 필요)
- **EU Council 결론문** (04-15) — Ukraine Facility 실행 메커니즘 §3

### 반대·대안 해석
- **현실주의**(Mearsheimer · Quincy 04-10): 영토 양보 협상 외 출구 없음. 서방 지원은 소모전 연장
- **유럽 결의론**(ECFR 04-18): 러시아 경제·인구 한계, 2026 말까지 공세 동력 소진 예측
- **회의론**(RUSI 04-20): F-16 도입에도 제공권 비대칭 해소엔 18개월 이상 소요

### 타임라인
- 2024-02 아우디우카 함락 → 2025-Q3 동부 전반 압력 상승 → 2026-04 EU·미 지원 동시 재가동 → 2026-Q3 우크라이나 동원법 효과 가시화 예상

### Bottom line
> **소모전의 변수는 보급 속도**. 미 보충예산 도착 시점과 우크라이나 동원·방공망 보강 속도가 동부 전선 안정화의 분수령. 협상 시그널은 아직 없음.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

const KOREA_BRIEF = `## OSINT 브리프 — "북한 미사일 시험과 한반도 안보"

### 핵심 사실
1. **[합동참모본부 · 04-18]** 평안북도 동창리 일대 신형 IRBM 추정 발사. 정상각 비행, 비행거리 약 1,000km, 마하 10+ 추정.
2. **[NK News · 04-19]** 노동신문 익일 보도에서 "극초음속 활공체(HGV) 발사 성공" 명시. 김정은 현지지도 동행.
3. **[CSIS Beyond Parallel · 04]** 풍계리 핵실험장 3번 갱도 작업 인원·차량 활동 증가. 7차 핵실험 정치적 결단만 남은 단계로 평가.

### 1차 자료
- **합참 공식 브리핑** (04-18) — 비행 제원 상세
- **노동신문** (04-19) — 시험 성격·사진 자료
- **38 North 위성 분석** (04-21) — 동창리·풍계리 상업 위성 영상 비교

### 반대·대안 해석
- **억제 강화론**(CSIS · Cha 04-15): 미·일·한 3자 협력 가속화 정당화
- **자제 신호론**(Carnegie · 박원곤 04-20): 7차 핵실험 미실행은 협상 카드로 보유 중
- **러·북 동조 가설**(RAND 04-12): 우크라이나 전쟁 무기 거래 대가로 위성·재진입체 기술 이전

### 타임라인
- 2024-09 정찰위성 3호기 발사 → 2025-Q4 다탄두 ICBM 시험 → 2026-04 IRBM·HGV → 2026-Q3 ROK 대선 직전 도발 가능성

### Bottom line
> **재진입체와 다탄두 능력 입증이 다음 분기점**. 7차 핵실험은 미·중 관계와 한국 정치 일정에 종속된 정치적 변수. 기술적 준비는 완료 단계로 평가.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

const SUDAN_BRIEF = `## OSINT 브리프 — "수단 RSF·SAF 내전 격화"

### 핵심 사실
1. **[OCHA · 04-20]** 내전 1주년 누적 사망자 14,000명+, 강제 이주 850만 명 — 현 시점 세계 최대 인도적 위기.
2. **[Reuters · 04-12]** RSF가 엘파시르(다르푸르 마지막 SAF 거점) 포위 100일 돌파. 시가전 임박.
3. **[FT · 04-16]** UAE의 RSF 무기·드론 지원 의혹 증거 추가 보도. UAE 정부 부인 성명.

### 1차 자료
- **UN Panel of Experts 보고서** (S/2026/47) — 무기 금수 위반 사례 §27–34
- **Sudan Doctors Network 일일 사상자 집계** — 카르툼·다르푸르 병원 데이터
- **SAF·RSF 텔레그램 공식 채널** — 양측 작전 발표(상호 검증 필요)

### 반대·대안 해석
- **인도주의 우선론**(MSF 04-05): 정전·인도적 회랑 우선, 외부 군사 개입은 사태 악화
- **개입 필요론**(ICG 04-14): UAE·이집트 압박 없이는 정전 불가능. 사우디·미국 중재 한계
- **자원 경쟁 프레임**(Brookings · Vertin): 다르푸르 금광·홍해 항만이 외부 후원 핵심 동기

### 타임라인
- 2023-04 카르툼 충돌 → 2024-Q4 RSF 다르푸르 장악 → 2025-Q3 제다 협상 결렬 → 2026-04 엘파시르 포위 임계

### Bottom line
> **국제 관심도 대비 위기 규모 비대칭**. 엘파시르 함락 시 다르푸르 인종 청소 재현 우려. UAE에 대한 미국·EU의 압박 강도가 단기 분기점.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

const SAHEL_BRIEF = `## OSINT 브리프 — "사헬 쿠데타 벨트 — 말리·부르키나파소·니제르"

### 핵심 사실
1. **[AFP · 04-10]** 말리·부르키나파소·니제르 군사정부 3자 "사헬국가연합(AES)" 통합 통화·여권 로드맵 발표. ECOWAS 탈퇴 공식화 후속.
2. **[RFI · 04-17]** 프랑스군 철수 1년, 러시아 아프리카 군단(舊 와그너) 사헬 3개국 파견 인원 누적 5,000명+ 추정.
3. **[ACLED · 04]** 2026Q1 사헬 지역 무장 충돌 사망자 전년 동기比 +38%. JNIM·ISGS 공세 강화.

### 1차 자료
- **AES 정상회담 공동성명** (니아메 04-08) — ECOWAS 탈퇴·통합 절차 §4–7
- **러시아 외교부 발표** (04-12) — 군사 협력 협정 갱신 확인
- **ACLED Sahel Dashboard** — 충돌 위치·사망자 일별 데이터

### 반대·대안 해석
- **다극화 환영론**(SIPRI · Wezeman): 서방 의존 탈피, 자결권 회복 서사
- **안보 악화론**(IISS Strategic Survey 2026): 러시아 군단의 대(對)테러 작전 효과 미입증, 민간인 피해는 증가
- **자원 프레임**(Brookings 04-15): 우라늄·금 통제권 변화가 본질, 이념은 표층

### 타임라인
- 2020 말리 쿠데타 → 2022 부르키나파소 → 2023 니제르 → 2024 ECOWAS 탈퇴 선언 → 2026-Q1 AES 통합 본격화

### Bottom line
> **서아프리카의 지정학적 재편 진행 중**. 러시아·튀르키예의 침투는 가속화, 서방의 영향력 회복은 단기 불가. 우라늄(니제르) 공급망이 EU 에너지 정책에 직격.

---
*Ground 베타 — 샘플 데이터 기반 시연용. 실제 출처·시점 검증 후 인용 권장.*`;

const ESEQUIBO_BRIEF = `## OSINT 브리프 — "베네수엘라–가이아나 에세키보 영토 분쟁"

### 핵심 사실
1. **[Reuters · 04-09]** 베네수엘라, 에세키보(가이아나 영토 2/3, 16만km²) 자국 24번째 주로 편입하는 헌법 개정 국민투표 재가동 시사.
2. **[Bloomberg · 04-14]** ExxonMobil 운영 Stabroek 광구 누적 매장량 110억 배럴 상향. 2026 가이아나 GDP +43% 전망(IMF).
3. **[BBC · 04-18]** 브라질, 양국 국경에 군 1,500명 추가 배치. "양측 모두 자제 촉구"한 룰라 정부의 실력 행사.

### 1차 자료
- **국제사법재판소(ICJ) 가이아나 v 베네수엘라** 임시조치 명령(2023-12) 원문
- **베네수엘라 국가선거관리위(CNE) 공고** (04-09) — 국민투표 일정 §2
- **ExxonMobil Q1 2026 어닝콜** — Stabroek 광구 생산 계획

### 반대·대안 해석
- **국내정치 도구설**(WOLA · Smilde 04-11): 마두로 7월 대선 동원용, 실제 침공 가능성 낮음
- **실재 위협론**(Atlantic Council 04-16): 군사력 격차(베네수엘라 11만 vs 가이아나 4천), 기회 포착 시 제한적 진격 가능
- **자원 프레임**(CSIS 04-13): 미·중 모두 가이아나 원유에 이해, 충돌 시 미국 개입 명분 충분

### 타임라인
- 1899 파리 중재 → 2018 가이아나 ICJ 제소 → 2023-12 베네수엘라 국민투표 → 2026-04 헌법 편입 시도 재개 → 2026-07 베네수엘라 대선

### Bottom line
> **마두로의 선거 정치가 핵심 변수**. 7월 대선 전 군사적 도발은 동원 효과, 실제 무력 충돌은 미·브라질 억제로 제한적. 단 ExxonMobil 시설 인근 해상 충돌 가능성은 상존.

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
