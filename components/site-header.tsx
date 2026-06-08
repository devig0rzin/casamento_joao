"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { wedding } from "@/lib/wedding-data";

const links = [
  ["Inicio", "/#inicio"],
  ["Como chegar", "/#local"],
  ["Presenca", "/#presenca"],
  ["Presentes", "/#presentes"],
  ["Informacoes", "/#informacoes"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 md:px-6" aria-label="Navegacao principal">
        <Link href="/" className="focus-ring rounded-full font-display text-2xl font-semibold text-rosewood">
          {wedding.couple}
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-rosewood/80 md:flex">
          {links.map(([label, href]) => (
            <Link className="focus-ring rounded-full transition hover:text-fuchsiaWedding" href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>

        <button
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-rosewood text-white md:hidden"
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="glass-panel mx-auto mt-3 grid max-w-7xl gap-2 rounded-3xl p-4 text-sm font-semibold text-rosewood md:hidden">
          {links.map(([label, href]) => (
            <Link className="rounded-2xl px-4 py-3 transition hover:bg-blush" href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
