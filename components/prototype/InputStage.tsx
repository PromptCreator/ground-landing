"use client";

const SAMPLES = [
  "이스라엘–이란 4월 충돌 격화",
  "BRICS 확대와 달러 결제망 재편",
  "남중국해 항행 분쟁 — 필리핀·중국",
];

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onGenerate: (q: string) => void;
  onSample: (q: string) => void;
}

export default function InputStage({ query, onQueryChange, onGenerate, onSample }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onGenerate(query.trim());
  };

  return (
    <div className="p-6 sm:p-8">
      <p className="label-caps mb-4" style={{ color: "var(--ink-3)" }}>
        어떤 사건을 조사 중인가요?
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {SAMPLES.map((s) => (
          <button
            key={s}
            onClick={() => {
              onSample(s);
              onQueryChange(s);
            }}
            className="px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer"
            style={{
              borderColor: "var(--line)",
              color: "var(--ink-2)",
              background: "var(--paper)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-deep)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-2)";
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="예) 우크라이나 곡물 협정 결렬과 식량 시장 영향"
          className="flex-1 px-4 py-3 rounded-sm border text-sm outline-none transition-colors"
          style={{
            borderColor: "var(--line)",
            background: "var(--paper)",
            color: "var(--ink)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="px-5 py-3 rounded-sm text-sm font-semibold transition-opacity cursor-pointer"
          style={{
            background: "var(--accent)",
            color: "#fff",
            opacity: query.trim() ? 1 : 0.4,
          }}
        >
          리서치 시작 →
        </button>
      </form>
    </div>
  );
}
