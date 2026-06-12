import Image from "next/image";
import { Car, Clock, MapPinned, Shirt, Utensils } from "lucide-react";
import { faqs, wedding, weddingParty } from "@/lib/wedding-data";

const info = [
  { icon: Clock, title: "Horario", text: `Cerimonia as ${wedding.displayTime}. Chegue com alguns minutos de antecedencia.` },
  { icon: Shirt, title: "Dress code", text: "Traje social. Evite tons de rosa, pois essa cor sera reservada para as madrinhas." },
  { icon: Car, title: "Estacionamento", text: "A igreja possui estacionamento exclusivo para os convidados da cerimonia." },
  { icon: MapPinned, title: "Observacoes", text: "A cerimonia sera apenas na igreja. Nao havera festa apos a celebracao." },
];

export function ImportantInfo() {
  return (
    <section className="section-pad" id="informacoes">
      <div className="container-premium">
        <div className="max-w-2xl">
          <p className="heading-eyebrow">Informacoes importantes</p>
          <h2 className="serif-title mt-4">Tudo que voce precisa saber antes do grande dia.</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {info.map(({ icon: Icon, title, text }) => (
            <article className="glass-panel rounded-[2rem] p-6" key={title}>
              <Icon className="text-fuchsiaWedding" size={28} />
              <h3 className="mt-5 text-lg font-bold text-rosewood">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-rosewood/68">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WeddingParty() {
  return (
    <section className="section-pad bg-blush/55" id="padrinhos">
      <div className="container-premium">
        <div className="mx-auto max-w-3xl text-center">
          <p className="heading-eyebrow">Padrinhos</p>
          <h2 className="serif-title mt-4">Pessoas que caminham perto da nossa historia.</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {weddingParty.map((person) => (
            <article className="overflow-hidden rounded-[2rem] bg-white shadow-soft" key={person.name}>
              <div className="relative aspect-[4/5]">
                <Image src={person.image} alt={person.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsiaWedding">{person.role}</span>
                <h3 className="mt-2 text-xl font-bold text-rosewood">{person.name}</h3>
                <p className="mt-2 text-sm leading-6 text-rosewood/65">{person.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="section-pad" id="faq">
      <div className="container-premium grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="heading-eyebrow">FAQ</p>
          <h2 className="serif-title mt-4">Perguntas frequentes.</h2>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-rosewood shadow-soft">
            <Utensils size={18} className="text-fuchsiaWedding" /> Duvidas comuns dos convidados
          </div>
        </div>
        <div className="grid gap-4">
          {faqs.map(([question, answer]) => (
            <details className="group rounded-[1.5rem] bg-white p-5 shadow-soft" key={question}>
              <summary className="cursor-pointer list-none font-bold text-rosewood">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-rosewood/65">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
