"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { gallery } from "@/lib/wedding-data";

export function Gallery() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="section-pad bg-white/55" id="galeria">
      <div className="container-premium">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="heading-eyebrow">Galeria</p>
            <h2 className="serif-title mt-4">Momentos que contam antes mesmo das palavras.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-rosewood/65">Imagens otimizadas com carregamento sob demanda, zoom e visual em lightbox.</p>
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          {gallery.map((src, index) => (
            <button
              className={`group relative overflow-hidden rounded-[2rem] shadow-soft focus-ring ${index === 0 || index === 3 ? "md:col-span-2 md:row-span-2" : ""}`}
              key={src}
              type="button"
              onClick={() => setActive(src)}
              aria-label={`Abrir foto ${index + 1}`}
            >
              <Image src={src} alt={`Foto do casal ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-rosewood/88 p-4 backdrop-blur" role="dialog" aria-modal="true">
          <button className="focus-ring absolute right-5 top-5 rounded-full bg-white p-3 text-rosewood" type="button" onClick={() => setActive(null)} aria-label="Fechar galeria">
            <X size={22} />
          </button>
          <div className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-[2rem]">
            <Image src={active} alt="Foto ampliada" fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
