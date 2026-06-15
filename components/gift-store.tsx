"use client";

import Image from "next/image";
import { Copy, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useRef, useState } from "react";
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
  const [cart, setCart] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const paymentRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    return gifts.filter((gift) => {
      const matchesCategory = category === "todos" || gift.category === category;
      const matchesQuery = `${gift.name} ${gift.description}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const giftedCount = gifts.filter((gift) => gift.status === "gifted").length;
  const progress = Math.round((giftedCount / gifts.length) * 100);
  const cartItems = useMemo(
    () =>
      gifts
        .map((gift) => ({ gift, quantity: cart[gift.id] || 0 }))
        .filter((item) => item.quantity > 0),
    [cart],
  );
  const cartTotal = cartItems.reduce((sum, item) => sum + item.gift.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartDescription = cartItems.map((item) => `${item.quantity}x ${item.gift.name}`).join(", ");
  const cartSignature = cartItems.map((item) => `${item.gift.id}:${item.quantity}`).join("|");
  const pixReady = isPixConfigured(wedding.pixKey);
  const canPay = pixReady && cartItems.length > 0;
  const pixTxid = useMemo(() => `JPJ${Date.now().toString(36).toUpperCase()}`, [cartSignature]);
  const pixPayload = canPay
    ? buildPixPayload({
        key: wedding.pixKey,
        merchantName: wedding.pixMerchantName,
        merchantCity: wedding.pixMerchantCity,
        amount: cartTotal,
        description: "Presentes casamento",
        txid: pixTxid,
        keyType: wedding.pixKeyType as PixKeyType,
      })
    : "";

  function scrollToPayment() {
    window.setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function addToCart(gift: Gift, shouldScrollToPayment = false) {
    setCopied(false);
    setCart((current) => ({ ...current, [gift.id]: (current[gift.id] || 0) + 1 }));
    if (shouldScrollToPayment) scrollToPayment();
  }

  function decreaseFromCart(giftId: string) {
    setCopied(false);
    setCart((current) => {
      const nextQuantity = (current[giftId] || 0) - 1;
      const next = { ...current };
      if (nextQuantity > 0) next[giftId] = nextQuantity;
      else delete next[giftId];
      return next;
    });
  }

  function removeFromCart(giftId: string) {
    setCopied(false);
    setCart((current) => {
      const next = { ...current };
      delete next[giftId];
      return next;
    });
  }

  async function copyPix() {
    if (!canPay) return;
    await navigator.clipboard.writeText(pixPayload);
    cartItems.forEach((item) => setGiftStatus(item.gift.id, "reserved"));
    await recordGiftPayment({
      giftId: cartItems.map((item) => item.gift.id).join(","),
      giftName: cartDescription,
      pixTxid,
      amount: cartTotal,
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
            <article
              className={`overflow-hidden rounded-[1.7rem] bg-white text-left shadow-soft transition hover:-translate-y-1 ${cart[gift.id] ? "ring-2 ring-fuchsiaWedding" : ""}`}
              key={gift.id}
            >
              <div className="relative aspect-[4/3]">
                <Image src={gift.image} alt={gift.name} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" />
              </div>
              <div className="grid gap-3 p-5">
                <span className="w-fit rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-fuchsiaWedding">{statusLabels[gift.status]}</span>
                <h3 className="text-lg font-bold text-rosewood">{gift.name}</h3>
                <p className="min-h-12 text-sm leading-6 text-rosewood/62">{gift.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-xl text-rosewood">{formatCurrency(gift.price)}</strong>
                  <button
                    className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rosewood px-4 text-sm font-bold text-white transition hover:-translate-y-0.5"
                    type="button"
                    onClick={() => addToCart(gift, true)}
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside ref={paymentRef} className="glass-panel sticky top-24 h-fit scroll-mt-6 rounded-[2rem] p-6">
        <p className="heading-eyebrow">Carrinho</p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <h2 className="font-display text-4xl text-rosewood">Pagamento Pix</h2>
          <span className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-fuchsiaWedding shadow-soft">
            <ShoppingCart size={18} />
            <span className="ml-1">{cartCount}</span>
          </span>
        </div>
        <div className="mt-5 grid gap-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="rounded-2xl bg-white p-4 shadow-soft" key={item.gift.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-rosewood">{item.gift.name}</p>
                    <p className="mt-1 text-sm font-semibold text-rosewood/60">
                      {item.quantity} x {formatCurrency(item.gift.price)}
                    </p>
                  </div>
                  <strong className="text-rosewood">{formatCurrency(item.gift.price * item.quantity)}</strong>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-blush text-rosewood"
                    type="button"
                    onClick={() => decreaseFromCart(item.gift.id)}
                    aria-label={`Diminuir ${item.gift.name}`}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-blush text-rosewood"
                    type="button"
                    onClick={() => addToCart(item.gift)}
                    aria-label={`Adicionar mais ${item.gift.name}`}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    className="focus-ring ml-auto grid h-9 w-9 place-items-center rounded-full bg-rosewood text-white"
                    type="button"
                    onClick={() => removeFromCart(item.gift.id)}
                    aria-label={`Remover ${item.gift.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white p-5 text-sm font-semibold leading-6 text-rosewood/65 shadow-soft">
              Adicione um ou mais presentes para gerar um Pix unico com o valor total.
            </div>
          )}
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-rosewood/50">Total</p>
        <p className="mt-1 text-3xl font-bold text-fuchsiaWedding">{formatCurrency(cartTotal)}</p>
        <div className="mt-6 grid place-items-center rounded-[1.5rem] bg-white p-5 shadow-soft">
          {canPay ? (
            <QRCodeSVG value={pixPayload} size={210} level="M" bgColor="#fffaf7" fgColor="#3a1d27" />
          ) : (
            <div className="grid h-[210px] w-[210px] place-items-center rounded-2xl bg-blush p-6 text-center text-sm font-bold leading-6 text-rosewood">
              {pixReady ? "Adicione presentes ao carrinho para liberar o QR Code." : "Configure a chave Pix para liberar o QR Code."}
            </div>
          )}
        </div>
        <textarea className="mt-5 min-h-28 w-full rounded-2xl border border-rosewood/10 bg-white p-4 text-xs text-rosewood/70" readOnly value={pixPayload} aria-label="Pix copia e cola" placeholder="Pix copia e cola aparece aqui depois da configuracao" />
        <button
          className="focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-rosewood px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={copyPix}
          disabled={!canPay}
        >
          <Copy size={18} /> {copied ? "Copiado" : "Copiar Pix do total"}
        </button>
      </aside>
    </div>
  );
}
