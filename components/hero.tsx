"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarHeart, Gift, MapPin, UserCheck } from "lucide-react";
import { Countdown } from "./countdown";
import { wedding } from "@/lib/wedding-data";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 120]);

  return (
    <section className="relative min-h-screen overflow-hidden" id="inicio" aria-label="Convite principal">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90"
          alt="Foto realista de noivos em casamento"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsiaWedding/80 via-rosewood/48 to-fuchsiaWedding/18" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,241,246,0.24),transparent_28rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#fffaf7] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-5 pb-12 pt-32 md:px-10 lg:px-16 lg:pb-20">
        <motion.div
          className="max-w-3xl text-white"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-champagne">
            <CalendarHeart size={18} /> {wedding.displayDate} as {wedding.displayTime}
          </p>
          <h1 className="font-display text-6xl font-medium leading-[0.9] md:text-8xl lg:text-9xl">
            {wedding.firstNameA}
            <span className="block text-champagne">& {wedding.firstNameB}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/88 md:text-xl">
            Uma celebracao elegante, afetiva e preparada para receber pessoas especiais na {wedding.venue}.
          </p>

          <div className="mt-8 grid gap-3 sm:flex">
            <Link className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-bold text-rosewood shadow-soft transition hover:-translate-y-0.5" href="#presenca">
              <UserCheck size={18} /> Confirmar presenca
            </Link>
            <Link className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/55 bg-white/10 px-6 font-bold text-white backdrop-blur transition hover:-translate-y-0.5" href="#local">
              <MapPin size={18} /> Como chegar
            </Link>
            <Link className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/55 bg-white/10 px-6 font-bold text-white backdrop-blur transition hover:-translate-y-0.5" href="#presentes">
              <Gift size={18} /> Presentes
            </Link>
          </div>

          <div className="mt-10 max-w-2xl">
            <Countdown />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
