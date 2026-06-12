"use client";

import Image from "next/image";
import { Copy, Search } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useState } from "react";
import { recordGiftPayment, setGiftStatus } from "@/lib/local-store";
import { buildPixPayload, formatCurrency, isPixConfigured, type PixKeyType } from "@/lib/pix";
import { gifts, wedding, type Gift } from "@/lib/wedding-data";

const categoryLabels = {
  todos: "Todos",
  cozinha: "Cozinha",
  quarto: "Quarto",
  sala: "Sala",
  experiencias: "Experiencias",
} as const;

const statusLabels = {
  available: "Disponivel",
  reserved: "Reservado",
  gifted: "Presenteado",
} as const;

export function GiftStore() {
  const [category, setCategory] = useState<keyof typeof categoryLabels>("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Gift>(gifts[0]);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return gifts.filter((gift) => {
      const matchesCategory = category === "todos" || gift.category === category;
      const matchesQuery = `${gift.name} ${gift.description}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const giftedCount = gifts.filter((gift) => gift.status === "gifted").length;
  const progress = Math.round((giftedCount / gifts.length) * 100);
  const pixReady = isPixConfigured(wedding.pixKey);
  const pixTxid = `JPJ${selected.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 22)}`;
  const pixPayload = pixReady
    ? buildPixPayload({
        key: wedding.pixKey,
        merchantName: wedding.pixMerchantName,
        merchantCity: wedding.pixMerchantCity,
        amount: selected.price,
        description: selected.name,
        txid: pixTxid,
        keyType: wedding.pixKeyType as PixKeyType,
      })
    : "";

  async function copyPix() {
    if (!pixReady) return;
    await navigator.clipboard.writeText(pixPayload);
    setGiftStatus(selected.id, "reserved");
    await recordGiftPayment({
      giftId: selected.id,
      giftName: selected.name,
      pixTxid,
      amount: selected.price,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
      <section className="glass-panel rounded-[2rem] p-5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="heading-eyebrow">Lista de presentes</p>
            <h1 className="mt-3 font-display text-5xl text-rosewood">Casa nova</h1>
          </div>
          <div className="w-full max-w-sm">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
              <input
                className="focus-ring min-h-12 w-full rounded-full border border-rosewood/10 bg-white pl-11 pr-4 text-sm"
                placeholder="Buscar presente"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              className={`focus-ring min-h-11 rounded-full px-4 text-sm font-bold transition ${category === key ? "bg-rosewood text-white" : "bg-white text-rosewood hover:bg-blush"}`}
              key={key}
              type="button"
              onClick={() => setCategory(key as keyof typeof categoryLabels)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-full bg-white p-2">
          <div className="h-3 rounded-full bg-gradient-to-r from-fuchsiaWedding to-goldRose" style={{ width: `${progress}%` }} aria-label={`${progress}% dos presentes adquiridos`} />
        </div>
        <p className="mt-2 text-sm font-semibold text-rosewood/60">{progress}% da lista presenteada</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((gift) => (
            <button
              className={`focus-ring overflow-hidden rounded-[1.7rem] bg-white text-left shadow-soft transition hover:-translate-y-1 ${selected.id === gift.id ? "ring-2 ring-fuchsiaWedding" : ""}`}
              key={gift.id}
              type="button"
              onClick={() => setSelected(gift)}
            >
              <div className="relative aspect-[4/3]">
                <Image src={gift.image} alt={gift.name} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" />
              </div>
              <div className="grid gap-3 p-5">
                <span className="w-fit rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-fuchsiaWedding">{statusLabels[gift.status]}</span>
                <h3 className="text-lg font-bold text-rosewood">{gift.name}</h3>
                <p className="min-h-12 text-sm leading-6 text-rosewood/62">{gift.description}</p>
                <strong className="text-xl text-rosewood">{formatCurrency(gift.price)}</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="glass-panel sticky top-24 h-fit rounded-[2rem] p-6">
        <p className="heading-eyebrow">Pagamento Pix</p>
        <h2 className="mt-3 font-display text-4xl text-rosewood">{selected.name}</h2>
        <p className="mt-2 text-2xl font-bold text-fuchsiaWedding">{formatCurrency(selected.price)}</p>
        <div className="mt-6 grid place-items-center rounded-[1.5rem] bg-white p-5 shadow-soft">
          {pixReady ? (
            <QRCodeSVG value={pixPayload} size={210} level="M" bgColor="#fffaf7" fgColor="#3a1d27" />
          ) : (
            <div className="grid h-[210px] w-[210px] place-items-center rounded-2xl bg-blush p-6 text-center text-sm font-bold leading-6 text-rosewood">
              Configure a chave Pix para liberar o QR Code.
            </div>
          )}
        </div>
        <textarea className="mt-5 min-h-28 w-full rounded-2xl border border-rosewood/10 bg-white p-4 text-xs text-rosewood/70" readOnly value={pixPayload} aria-label="Pix copia e cola" placeholder="Pix copia e cola aparece aqui depois da configuracao" />
        <button
          className="focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-rosewood px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={copyPix}
          disabled={!pixReady}
        >
          <Copy size={18} /> {copied ? "Copiado" : "Copiar Pix"}
        </button>
      </aside>
    </div>
  );
}
