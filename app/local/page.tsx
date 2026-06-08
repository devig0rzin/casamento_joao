import Image from "next/image";
import Link from "next/link";
import { Car, Hotel, MapPinned, Navigation, Utensils } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { wedding } from "@/lib/wedding-data";

export default function LocalPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad pt-32">
        <section className="container-premium grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="heading-eyebrow">Local da cerimonia</p>
            <h1 className="serif-title mt-4">{wedding.venue}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-rosewood/70">{wedding.address}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-full bg-rosewood px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5" href={wedding.mapsUrl} target="_blank">
                <MapPinned size={18} /> Google Maps
              </Link>
              <Link className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-full bg-fuchsiaWedding px-6 font-bold text-white shadow-soft transition hover:-translate-y-0.5" href={wedding.wazeUrl} target="_blank">
                <Navigation size={18} /> Waze
              </Link>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[2rem] shadow-premium">
            <Image src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1300&q=82" alt="Igreja preparada para casamento" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </section>

        <section className="container-premium mt-12 overflow-hidden rounded-[2rem] shadow-premium">
          <iframe title="Mapa da igreja" src={wedding.mapEmbed} className="h-[480px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </section>

        <section className="container-premium mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Car, title: "Estacionamento", text: "Ha vagas nas ruas proximas. Chegue com antecedencia para estacionar com tranquilidade." },
            { icon: Hotel, title: "Hoteis proximos", text: "Sugestao: pesquisar hospedagens em Cotia e regioes proximas de facil acesso." },
            { icon: Utensils, title: "Restaurantes", text: "A regiao possui opcoes de restaurantes e lanchonetes para antes ou depois da cerimonia." },
          ].map(({ icon: Icon, title, text }) => (
            <article className="glass-panel rounded-[2rem] p-6" key={title}>
              <Icon className="text-fuchsiaWedding" size={28} />
              <h2 className="mt-5 text-xl font-bold text-rosewood">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-rosewood/68">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
