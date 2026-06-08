import Link from "next/link";
import { Car, Church, Gift, HeartHandshake, MapPinned, Shirt, UserCheck } from "lucide-react";
import { wedding } from "@/lib/wedding-data";

const infoCards = [
  {
    icon: Shirt,
    title: "Traje social",
    text: "Pedimos traje social. Por carinho com a identidade do casamento, evite tons de rosa, pois essa cor sera reservada para as madrinhas.",
  },
  {
    icon: Car,
    title: "Estacionamento",
    text: "A igreja possui estacionamento exclusivo para os convidados da cerimonia.",
  },
  {
    icon: Church,
    title: "Cerimonia",
    text: "A celebracao sera apenas na igreja. Nao havera festa apos a cerimonia.",
  },
  {
    icon: HeartHandshake,
    title: "Lembrancinha",
    text: "Ao final da cerimonia, os convidados receberao uma lembrancinha preparada pelos noivos.",
  },
];

export function SimpleInviteSections() {
  return (
    <section className="section-pad bg-gradient-to-b from-[#fffaf7] via-blush/70 to-[#fffaf7]">
      <div className="container-premium">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="glass-panel rounded-[2rem] p-6" id="local">
            <MapPinned className="text-fuchsiaWedding" size={30} />
            <h2 className="mt-5 font-display text-4xl text-rosewood">Como chegar</h2>
            <p className="mt-3 text-sm leading-6 text-rosewood/68">
              {wedding.venue}
              <br />
              {wedding.address}
            </p>
            <Link className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-rosewood px-5 text-sm font-bold text-white transition hover:-translate-y-0.5" href={wedding.mapsUrl} target="_blank">
              Abrir rota
            </Link>
          </article>

          <article className="glass-panel rounded-[2rem] p-6" id="presenca">
            <UserCheck className="text-fuchsiaWedding" size={30} />
            <h2 className="mt-5 font-display text-4xl text-rosewood">Confirmar presenca</h2>
            <p className="mt-3 text-sm leading-6 text-rosewood/68">
              Confirme seu nome na lista para ajudar os noivos na organizacao da cerimonia.
            </p>
            <Link className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-fuchsiaWedding px-5 text-sm font-bold text-white transition hover:-translate-y-0.5" href="/presenca">
              Confirmar agora
            </Link>
          </article>

          <article className="glass-panel rounded-[2rem] p-6" id="presentes">
            <Gift className="text-fuchsiaWedding" size={30} />
            <h2 className="mt-5 font-display text-4xl text-rosewood">Presentes</h2>
            <p className="mt-3 text-sm leading-6 text-rosewood/68">
              A lista possui presentes simbolicos. A contribuicao e feita por Pix para ajudar os noivos na casa nova.
            </p>
            <Link className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-rosewood px-5 text-sm font-bold text-white transition hover:-translate-y-0.5" href="/presentes">
              Ver lista
            </Link>
          </article>
        </div>

        <div className="mt-12" id="informacoes">
          <div className="mx-auto max-w-3xl text-center">
            <p className="heading-eyebrow">Mais informacoes</p>
            <h2 className="serif-title mt-4">Detalhes importantes para o dia.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {infoCards.map(({ icon: Icon, title, text }) => (
              <article className="rounded-[2rem] border border-fuchsiaWedding/10 bg-white p-6 shadow-soft" key={title}>
                <Icon className="text-fuchsiaWedding" size={28} />
                <h3 className="mt-5 text-lg font-bold text-rosewood">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-rosewood/68">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
