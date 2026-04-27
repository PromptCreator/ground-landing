"use client";

import { motion } from "framer-motion";
import PrototypeApp from "@/components/prototype/PrototypeApp";

export default function PrototypeSection() {
  return (
    <section id="prototype" className="py-20 sm:py-28 px-6">
      <hr className="hairline mb-20 sm:mb-28" />
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="label-caps mb-4 text-center" style={{ color: "var(--ink-3)" }}>
            — INTERACTIVE DEMO —
          </p>
          <h2
            className="font-serif-ko text-2xl sm:text-4xl text-center mb-3"
            style={{ color: "var(--ink)" }}
          >
            직접 써보세요
          </h2>
          <p
            className="text-center text-sm sm:text-base mb-10"
            style={{ color: "var(--ink-2)" }}
          >
            조사할 사건을 입력하면 OSINT 브리프를 묶어 드립니다.
          </p>

          <PrototypeApp />

          <div className="mt-10 text-center">
            <p className="text-sm mb-4" style={{ color: "var(--ink-2)" }}>
              마음에 드셨나요? 출시되면 가장 먼저 알려드릴게요.
            </p>
            <a
              href="#signup"
              className="inline-block px-6 py-3 rounded-sm text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              출시 알림 받기 →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
