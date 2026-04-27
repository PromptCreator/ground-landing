"use client";

import { useEffect, useState } from "react";
import { geoEqualEarth, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";

const WIDTH = 800;
const HEIGHT = 380;

type Category = "active" | "tension" | "structural";

interface Hotspot {
  id: string;
  coords: [number, number];
  label: string;
  category: Category;
  query: string;
}

const HOTSPOTS: Hotspot[] = [
  // Active conflict
  { id: "uk", coords: [32, 49], label: "우크라이나 전선", category: "active", query: "우크라이나 전선 교착과 EU 지원안" },
  { id: "me", coords: [40, 32], label: "이스라엘–이란", category: "active", query: "이스라엘–이란 4월 충돌 격화" },
  { id: "sd", coords: [33, 15], label: "수단 내전", category: "active", query: "수단 RSF·SAF 내전 격화" },
  // Tension
  { id: "scs", coords: [115, 15], label: "남중국해", category: "tension", query: "남중국해 항행 분쟁 — 필리핀·중국" },
  { id: "kp", coords: [127, 39], label: "한반도", category: "tension", query: "북한 미사일 시험과 한반도 안보" },
  { id: "vg", coords: [-61, 6], label: "에세키보", category: "tension", query: "베네수엘라–가이아나 에세키보 영토 분쟁" },
  // Structural shift
  { id: "brics", coords: [78, 25], label: "BRICS · 결제망", category: "structural", query: "BRICS 확대와 달러 결제망 재편" },
  { id: "sahel", coords: [0, 14], label: "사헬 쿠데타 벨트", category: "structural", query: "사헬 쿠데타 벨트 — 말리·부르키나파소·니제르" },
];

const COLOR: Record<Category, string> = {
  active: "var(--counter)",
  tension: "var(--accent)",
  structural: "var(--data)",
};

const LEGEND: { category: Category; label: string }[] = [
  { category: "active", label: "활성 분쟁" },
  { category: "tension", label: "긴장 고조" },
  { category: "structural", label: "구조 재편" },
];

interface Props {
  onSelect: (query: string) => void;
  active?: string;
  disabled?: boolean;
}

export default function WorldMap({ onSelect, active, disabled }: Props) {
  const [paths, setPaths] = useState<string[]>([]);
  const [projection, setProjection] = useState<GeoProjection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/world-110m.json")
      .then((r) => r.json())
      .then((topology) => {
        if (cancelled) return;
        const obj = topology.objects.countries;
        const coll = feature(topology, obj) as unknown as FeatureCollection<Geometry>;
        const proj = geoEqualEarth().fitSize([WIDTH, HEIGHT], coll);
        const path = geoPath(proj);
        setProjection(() => proj);
        setPaths(coll.features.map((f: Feature<Geometry>) => path(f) || ""));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="OSINT 모니터링 핫스팟 세계지도"
      >
        <rect width={WIDTH} height={HEIGHT} fill="var(--paper)" />
        <g>
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="var(--paper-2)"
              stroke="var(--line)"
              strokeWidth={0.5}
            />
          ))}
        </g>
        <g>
          {projection &&
            HOTSPOTS.map((h) => {
              const p = projection(h.coords);
              if (!p) return null;
              const [x, y] = p;
              const isActive = active === h.query;
              const showLabel = hovered === h.id || isActive;
              const color = COLOR[h.category];
              return (
                <g
                  key={h.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => !disabled && onSelect(h.query)}
                  onMouseEnter={() => setHovered(h.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: disabled ? "default" : "pointer" }}
                >
                  <circle
                    r={13}
                    fill={color}
                    opacity={0.22}
                    className="animate-ping"
                  />
                  <circle
                    r={isActive ? 6.5 : 4.5}
                    fill={color}
                    stroke="var(--paper)"
                    strokeWidth={1.5}
                  />
                  {showLabel && (
                    <g pointerEvents="none">
                      <rect
                        x={9}
                        y={-22}
                        rx={2}
                        width={Math.max(7.2 * h.label.length, 70)}
                        height={18}
                        fill="var(--ink)"
                        opacity={0.92}
                      />
                      <text
                        x={13}
                        y={-9}
                        fontSize={11}
                        fill="var(--paper)"
                        style={{ fontWeight: 600 }}
                      >
                        {h.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </g>
      </svg>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {LEGEND.map((l) => (
          <div key={l.category} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: COLOR[l.category] }}
            />
            <span className="label-caps" style={{ color: "var(--ink-3)" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
      <p
        className="label-caps mt-2 text-center"
        style={{ color: "var(--ink-3)" }}
      >
        지도 위 핫스팟 클릭 → OSINT 브리프 자동 로드
      </p>
    </div>
  );
}
