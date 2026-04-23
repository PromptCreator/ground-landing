"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { isValidEmail } from "@/lib/validators";
import { getUtmParams } from "@/lib/utm";
import { track } from "@/components/analytics/track";

const STORAGE_KEY = "ground_submitted";
const STORAGE_TTL = 24 * 60 * 60 * 1000;

function isAlreadySubmitted(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < STORAGE_TTL;
  } catch {
    return false;
  }
}

function markSubmitted() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
  } catch {}
}

const INDUSTRIES = ["카페", "음식점", "소매", "기타"];
const REGIONS = ["강남", "홍대", "판교", "기타"];

export default function SignupSection() {
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [consent, setConsent] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = isValidEmail(email) && consent && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (isAlreadySubmitted()) {
      setSuccess(true);
      return;
    }

    track("signup_submit");
    setLoading(true);
    setError("");

    const utm = getUtmParams();
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          industry,
          region,
          consent,
          ...utm,
          user_agent: navigator.userAgent,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        track("signup_success", { industry, region });
        markSubmitted();
        setSuccess(true);
      } else {
        throw new Error(json.error ?? "error");
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown";
      track("signup_error", { reason });
      setError("잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="signup" className="py-20 sm:py-28 px-6">
      <hr className="hairline mb-20 sm:mb-28" />
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2
            className="font-serif-ko text-2xl sm:text-4xl text-center mb-3"
            style={{ color: "var(--ink)" }}
          >
            출시 알림 받기
          </h2>
          <p
            className="text-center text-sm sm:text-base mb-10"
            style={{ color: "var(--ink-2)" }}
          >
            베타 출시 시 가장 먼저 연락드립니다.
          </p>

          {success ? (
            <div
              className="text-center py-10 px-6 rounded-sm border"
              style={{ borderColor: "var(--line)", background: "var(--paper-2)" }}
            >
              <p className="text-lg font-serif-ko mb-2" style={{ color: "var(--ink)" }}>
                고맙습니다.
              </p>
              <p className="text-sm" style={{ color: "var(--ink-2)" }}>
                출시되면 {email} 으로 가장 먼저 연락드릴게요.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              {/* 이메일 */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                required
                className="w-full px-4 py-3 rounded-sm border text-sm outline-none transition-colors"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
              />

              {/* 더 알려주기 토글 */}
              <button
                type="button"
                onClick={() => setShowExtra((v) => !v)}
                className="text-xs underline cursor-pointer"
                style={{ color: "var(--ink-3)", background: "none", border: "none" }}
              >
                {showExtra ? "▲ 접기" : "+ 더 알려주기 (선택)"}
              </button>

              {showExtra && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-caps block mb-1.5" style={{ color: "var(--ink-3)" }}>업종</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-sm border text-sm outline-none"
                      style={{ borderColor: "var(--line)", background: "var(--paper)", color: "var(--ink)" }}
                    >
                      <option value="">선택</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-caps block mb-1.5" style={{ color: "var(--ink-3)" }}>지역</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-sm border text-sm outline-none"
                      style={{ borderColor: "var(--line)", background: "var(--paper)", color: "var(--ink)" }}
                    >
                      <option value="">선택</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* 동의 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 flex-shrink-0"
                />
                <span className="text-xs leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  출시 및 베타 모집 안내를 받는 데 동의합니다.
                </span>
              </label>

              {error && (
                <p className="text-xs" style={{ color: "var(--counter)" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3 rounded-sm text-sm font-semibold transition-opacity cursor-pointer"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  opacity: canSubmit ? 1 : 0.4,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    전송 중…
                  </span>
                ) : (
                  "출시 알림 받기"
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
