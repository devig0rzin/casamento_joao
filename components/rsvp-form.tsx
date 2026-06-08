"use client";

import { Mail, Phone, Send, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { readGuests, saveGuest } from "@/lib/local-store";
import { wedding, type Guest } from "@/lib/wedding-data";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RSVPForm() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState("");
  const [emailLink, setEmailLink] = useState("");

  useMemo(() => {
    if (typeof window !== "undefined") setGuests(readGuests());
  }, []);

  function submit(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const companions = Number(formData.get("companions") || 0);
    const message = String(formData.get("message") || "").trim();

    if (name.length < 3) {
      setStatus("Informe o nome completo.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setStatus("Informe um telefone valido.");
      return;
    }

    if (!emailRegex.test(email)) {
      setStatus("Informe um e-mail valido.");
      return;
    }

    if (companions > wedding.maxCompanions) {
      setStatus(`O limite e de ${wedding.maxCompanions} acompanhantes.`);
      return;
    }

    const guest: Guest = {
      id: crypto.randomUUID(),
      name,
      phone,
      email,
      companions,
      message,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    setGuests(saveGuest(guest));
    const subject = encodeURIComponent(`Confirmacao de presenca - ${guest.name}`);
    const body = encodeURIComponent(
      `Confirmacao de presenca\n\nNome: ${guest.name}\nTelefone: ${guest.phone}\nE-mail: ${guest.email}\nAcompanhantes: ${guest.companions}\nMensagem: ${guest.message || "-"}\n\nCasamento Joao Pedro e Jessica`,
    );
    setEmailLink(`mailto:${wedding.rsvpEmail}?subject=${subject}&body=${body}`);
    setStatus("Presenca confirmada. Agora envie a confirmacao para o e-mail dos noivos.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        className="glass-panel grid gap-4 rounded-[2rem] p-6 md:p-8"
        action={(formData) => {
          submit(formData);
        }}
      >
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Nome completo
          <span className="relative">
            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
            <input className="focus-ring min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white pl-11 pr-4" name="name" required />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Telefone
          <span className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
            <input className="focus-ring min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white pl-11 pr-4" name="phone" inputMode="tel" required />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          E-mail
          <span className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
            <input className="focus-ring min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white pl-11 pr-4" name="email" type="email" required />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Acompanhantes
          <select className="focus-ring min-h-12 rounded-2xl border border-rosewood/10 bg-white px-4" name="companions">
            {Array.from({ length: wedding.maxCompanions + 1 }, (_, index) => (
              <option value={index} key={index}>
                {index}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Mensagem
          <textarea className="focus-ring min-h-28 rounded-2xl border border-rosewood/10 bg-white p-4" name="message" />
        </label>
        <button className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rosewood px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5" type="submit">
          <Send size={18} /> Confirmar presenca
        </button>
        {emailLink ? (
          <a className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-fuchsiaWedding px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5" href={emailLink}>
            <Mail size={18} /> Enviar confirmacao por e-mail
          </a>
        ) : null}
        <p className="min-h-6 text-sm font-bold text-fuchsiaWedding" role="status" aria-live="polite">
          {status}
        </p>
        <p className="text-xs leading-5 text-rosewood/55">As confirmacoes serao enviadas para: {wedding.rsvpEmail}</p>
      </form>

      <aside className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-rosewood/10 pb-4">
          <h2 className="font-display text-3xl text-rosewood">Confirmados</h2>
          <strong className="rounded-full bg-blush px-4 py-2 text-fuchsiaWedding">{guests.reduce((sum, guest) => sum + guest.companions + 1, 0)} pessoas</strong>
        </div>
        <div className="mt-5 grid gap-3">
          {guests.length ? (
            guests.map((guest) => (
              <article className="rounded-2xl bg-white p-4 shadow-soft" key={guest.id}>
                <strong className="text-rosewood">{guest.name}</strong>
                <p className="mt-1 text-sm text-rosewood/60">{guest.companions} acompanhantes | {guest.email}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-rosewood/60">Nenhuma confirmacao registrada ainda.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
