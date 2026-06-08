"use client";

import jsPDF from "jspdf";
import { Download, FileText, Gift, Lock, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as XLSX from "xlsx";
import { readGuests } from "@/lib/local-store";
import { formatCurrency } from "@/lib/pix";
import { gifts } from "@/lib/wedding-data";

const ADMIN_PASSWORD = "casamento2026";

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const guests = typeof window !== "undefined" ? readGuests() : [];

  const filteredGuests = guests.filter((guest) => `${guest.name} ${guest.email} ${guest.phone}`.toLowerCase().includes(query.toLowerCase()));
  const totalPeople = guests.reduce((sum, guest) => sum + guest.companions + 1, 0);
  const gifted = gifts.filter((gift) => gift.status === "gifted");
  const giftTotal = gifted.reduce((sum, gift) => sum + gift.price, 0);
  const presencePercent = guests.length ? 100 : 0;

  const chartData = useMemo(
    () => [
      { name: "Confirmados", value: totalPeople },
      { name: "Pendentes", value: Math.max(0, 120 - totalPeople) },
    ],
    [totalPeople],
  );

  function login() {
    setAuthenticated(password === ADMIN_PASSWORD);
  }

  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(guests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Confirmacoes");
    XLSX.writeFile(workbook, "confirmacoes-casamento.xlsx");
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.text("Confirmacoes - Joao Pedro e Jessica", 14, 18);
    guests.slice(0, 35).forEach((guest, index) => {
      doc.text(`${index + 1}. ${guest.name} | ${guest.companions} acompanhantes | ${guest.email}`, 14, 32 + index * 7);
    });
    doc.save("confirmacoes-casamento.pdf");
  }

  if (!authenticated) {
    return (
      <section className="mx-auto max-w-md pt-32">
        <div className="glass-panel rounded-[2rem] p-8">
          <Lock className="text-fuchsiaWedding" size={34} />
          <h1 className="mt-5 font-display text-5xl text-rosewood">Admin</h1>
          <p className="mt-3 text-sm leading-6 text-rosewood/65">Area protegida para acompanhar RSVP e presentes.</p>
          <input
            className="focus-ring mt-6 min-h-12 w-full rounded-2xl border border-rosewood/10 bg-white px-4"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="focus-ring mt-4 min-h-12 w-full rounded-full bg-rosewood px-6 font-bold text-white" type="button" onClick={login}>
            Entrar
          </button>
          <p className="mt-3 text-xs text-rosewood/50">Senha demo: casamento2026</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-premium pt-32">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="heading-eyebrow">Painel administrativo</p>
          <h1 className="serif-title mt-4">Resumo do casamento.</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-bold text-rosewood shadow-soft" type="button" onClick={exportExcel}>
            <Download size={18} /> Excel
          </button>
          <button className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-rosewood px-5 font-bold text-white shadow-soft" type="button" onClick={exportPdf}>
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {[
          { icon: Users, label: "Convidados", value: totalPeople },
          { icon: Users, label: "RSVPs", value: guests.length },
          { icon: Gift, label: "Presentes", value: gifted.length },
          { icon: Gift, label: "Valor recebido", value: formatCurrency(giftTotal) },
        ].map(({ icon: Icon, label, value }) => (
          <article className="glass-panel rounded-[2rem] p-6" key={label}>
            <Icon className="text-fuchsiaWedding" />
            <span className="mt-5 block text-sm font-bold uppercase tracking-[0.18em] text-rosewood/45">{label}</span>
            <strong className="mt-2 block text-3xl text-rosewood">{value}</strong>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="glass-panel h-80 rounded-[2rem] p-6">
          <h2 className="font-bold text-rosewood">Presenca</h2>
          <ResponsiveContainer width="100%" height="86%">
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={92} label>
                <Cell fill="#c01868" />
                <Cell fill="#f3dfce" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <span className="sr-only">{presencePercent}% de presenca confirmada</span>
        </article>
        <article className="glass-panel h-80 rounded-[2rem] p-6">
          <h2 className="font-bold text-rosewood">Presentes por status</h2>
          <ResponsiveContainer width="100%" height="86%">
            <BarChart data={["available", "reserved", "gifted"].map((status) => ({ status, total: gifts.filter((gift) => gift.status === status).length }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#c01868" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>

      <article className="glass-panel mt-8 rounded-[2rem] p-6">
        <label className="relative block max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsiaWedding" size={18} />
          <input className="focus-ring min-h-12 w-full rounded-full border border-rosewood/10 bg-white pl-11 pr-4" placeholder="Pesquisar convidado" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-rosewood/45">
              <tr>
                <th className="py-3">Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Acompanhantes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr className="border-t border-rosewood/10" key={guest.id}>
                  <td className="py-3 font-bold text-rosewood">{guest.name}</td>
                  <td>{guest.phone}</td>
                  <td>{guest.email}</td>
                  <td>{guest.companions}</td>
                  <td>{guest.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
