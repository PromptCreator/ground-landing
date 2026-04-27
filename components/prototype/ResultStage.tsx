"use client";

import { useState } from "react";

interface Props {
  query: string;
  result: string;
  onCopy: () => void;
  onReset: () => void;
}

export default function ResultStage({ query, result, onCopy, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = result.split("\n");

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <p className="label-caps" style={{ color: "var(--ink-3)" }}>
          OSINT 브리프 — &ldquo;{query}&rdquo;
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs rounded-sm border transition-colors cursor-pointer"
            style={{ borderColor: "var(--line)", color: "var(--ink-2)", background: "transparent" }}
          >
            {copied ? "복사됨 ✓" : "복사"}
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-xs rounded-sm border transition-colors cursor-pointer"
            style={{ borderColor: "var(--line)", color: "var(--ink-2)", background: "transparent" }}
          >
            다시 시작
          </button>
        </div>
      </div>

      <div
        className="rounded-sm p-5 text-sm leading-relaxed overflow-y-auto"
        style={{ background: "var(--paper)", borderLeft: "3px solid var(--accent)", maxHeight: "360px" }}
      >
        {lines.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h3 key={i} className="font-bold text-base mb-3 font-serif-ko" style={{ color: "var(--ink)" }}>
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h4 key={i} className="font-semibold mt-4 mb-2" style={{ color: "var(--accent-deep)" }}>
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("> ")) {
            return (
              <blockquote key={i} className="pl-3 my-3 text-sm italic" style={{ borderLeft: "2px solid var(--line)", color: "var(--ink-2)" }}>
                {line.replace("> ", "")}
              </blockquote>
            );
          }
          if (line.startsWith("---")) {
            return <hr key={i} className="hairline my-3" />;
          }
          if (line.startsWith("*") && line.endsWith("*")) {
            return (
              <p key={i} className="text-xs mt-2" style={{ color: "var(--ink-3)" }}>
                {line.replace(/\*/g, "")}
              </p>
            );
          }
          if (line.trim() === "") return <div key={i} className="h-1" />;
          return (
            <p key={i} className="mb-1.5" style={{ color: "var(--ink-2)" }}
              dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--ink)">$1</strong>'),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
