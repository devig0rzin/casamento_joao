"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding-data";

function calculate() {
  const diff = Math.max(0, new Date(wedding.dateISO).getTime() - Date.now());
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const [time, setTime] = useState(calculate);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(calculate()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 rounded-[2rem] border border-white/60 bg-white/75 p-3 shadow-soft backdrop-blur md:gap-4 md:p-5" aria-label="Contagem regressiva">
      {Object.entries(time).map(([label, value]) => (
        <motion.div className="rounded-3xl bg-blush/80 px-2 py-4 text-center" key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <strong className="block font-display text-3xl leading-none text-rosewood md:text-5xl">{String(value).padStart(2, "0")}</strong>
          <span className="mt-2 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-fuchsiaWedding md:text-xs">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
