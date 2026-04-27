"use client";

import { useEffect, useState } from "react";
import { geoEqualEarth, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";

const WIDTH = 800;
const HEIGHT = 380;

interface Hotspot {
  id: string;
  coords: [number, number];
  label: string;
  query: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: "me", coords: [40, 32], label: "이스라엘–이란", query: "이스라엘–이란 4월 충돌 격화" },
  { id: "brics", coords: [78, 25], label: "BRICS · 결제망", query: "BRICS 확대와 달러 결제망 재편" },
  { id: "scs", coords: [115, 15], label: "남중국해", query: "남중국해 항행 분쟁 — 필리핀·중국" },
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
                    r={14}
                    fill="var(--accent)"
                    opacity={0.2}
                    className="animate-ping"
                  />
                  <circle
                    r={isActive ? 7 : 5}
                    fill="var(--accent)"
                    stroke="var(--paper)"
                    strokeWidth={1.5}
                  />
                  {showLabel && (
                    <g pointerEvents="none">
                      <rect
                        x={10}
                        y={-22}
                        rx={2}
                        width={Math.max(7.2 * h.label.length, 70)}
                        height={18}
                        fill="var(--ink)"
                        opacity={0.92}
                      />
                      <text
                        x={14}
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
      <p
        className="label-caps mt-3 text-center"
        style={{ color: "var(--ink-3)" }}
      >
        지도 위 핫스팟 클릭 → OSINT 브리프 자동 로드
      </p>
    </div>
  );
}
