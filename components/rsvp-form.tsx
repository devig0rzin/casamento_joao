"use client";

import { ChevronLeft, ChevronRight, Mail, Phone, Send, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { loadGuests, saveGuestRecord } from "@/lib/local-store";
import { wedding, type Guest } from "@/lib/wedding-data";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const guestsPerPage = 10;

export function RSVPForm() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadGuests().then(setGuests);
  }, []);

  const totalPeople = useMemo(() => guests.reduce((sum, guest) => sum + guest.companions + 1, 0), [guests]);
  const totalPages = Math.max(1, Math.ceil(guests.length / guestsPerPage));
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * guestsPerPage;
    return guests.slice(start, start + guestsPerPage);
  }, [currentPage, guests]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  async function submit(formData: FormData) {
    if (submitting) return;

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

    setSubmitting(true);
    setStatus("Enviando confirmacao...");

    try {
      setGuests(await saveGuestRecord(guest));
      setCurrentPage(1);
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
          companions: guest.companions,
          message: guest.message,
        }),
      });

      if (!response.ok) throw new Error("E-mail nao enviado");
      const result = (await response.json()) as { emailSent?: boolean };

      setStatus(
        result.emailSent
          ? "Presenca confirmada. Enviamos a confirmacao para os noivos."
          : "Presenca confirmada no site, mas o e-mail automatico nao foi enviado.",
      );
    } catch {
      setStatus("Presenca confirmada no site, mas o e-mail automatico nao foi enviado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
      <form
        className="glass-panel grid gap-4 rounded-3xl p-5 md:p-7 lg:sticky lg:top-28"
        action={(formData) => {
          submit(formData);
        }}
      >
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Nome completo
          <span className="relative">
            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
            <input className="focus-ring min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white pl-11 pr-4 outline-none transition focus:border-fuchsiaWedding/50" name="name" required />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Telefone
          <span className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
            <input className="focus-ring min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white pl-11 pr-4 outline-none transition focus:border-fuchsiaWedding/50" name="phone" inputMode="tel" required />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          E-mail
          <span className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
            <input className="focus-ring min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white pl-11 pr-4 outline-none transition focus:border-fuchsiaWedding/50" name="email" type="email" required />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Acompanhantes
          <select className="focus-ring min-h-12 rounded-2xl border border-rosewood/10 bg-white px-4 outline-none transition focus:border-fuchsiaWedding/50" name="companions">
            {Array.from({ length: wedding.maxCompanions + 1 }, (_, index) => (
              <option value={index} key={index}>
                {index}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-rosewood">
          Mensagem
          <textarea className="focus-ring min-h-28 rounded-2xl border border-rosewood/10 bg-white p-4 outline-none transition focus:border-fuchsiaWedding/50" name="message" />
        </label>
        <button className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rosewood px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
          <Send size={18} /> {submitting ? "Enviando..." : "Confirmar presenca"}
        </button>
        <p className="min-h-6 text-sm font-bold text-fuchsiaWedding" role="status" aria-live="polite">
          {status}
        </p>
        <p className="text-xs leading-5 text-rosewood/55">As confirmacoes serao enviadas para: {wedding.rsvpEmail}</p>
      </form>

      <aside className="glass-panel overflow-hidden rounded-3xl">
        <div className="flex flex-col gap-3 border-b border-rosewood/10 bg-white/45 p-5 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div>
            <h2 className="font-display text-3xl leading-none text-rosewood">Confirmados</h2>
            <p className="mt-2 text-sm text-rosewood/60">
              {guests.length ? `Pagina ${currentPage} de ${totalPages}` : "Aguardando as primeiras confirmacoes"}
            </p>
          </div>
          <strong className="w-fit rounded-full bg-blush px-4 py-2 text-sm font-bold tabular-nums text-fuchsiaWedding">{totalPeople} pessoas</strong>
        </div>
        <div className="grid gap-3 p-5 md:p-7">
          {guests.length ? (
            paginatedGuests.map((guest) => (
              <article className="rounded-2xl bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-premium" key={guest.id}>
                <strong className="block break-words text-sm font-bold leading-5 text-rosewood sm:text-base">{guest.name}</strong>
                <p className="mt-1 break-words text-xs leading-5 text-rosewood/60 sm:text-sm">
                  {guest.companions} {guest.companions === 1 ? "acompanhante" : "acompanhantes"} · {guest.email}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl bg-white p-5 text-sm leading-6 text-rosewood/60 shadow-soft">Nenhuma confirmacao registrada ainda.</p>
          )}
        </div>
        {guests.length > guestsPerPage ? (
          <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-rosewood/10 bg-white/45 p-5 md:p-7" aria-label="Paginas de confirmados">
            <button
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-rosewood shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Pagina anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <button
                    className={`focus-ring h-10 min-w-10 rounded-full px-3 text-sm font-bold transition ${
                      page === currentPage ? "bg-rosewood text-white shadow-soft" : "bg-white text-rosewood hover:-translate-y-0.5"
                    }`}
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Ir para pagina ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-rosewood shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="Proxima pagina"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        ) : null}
      </aside>
    </div>
  );
}
