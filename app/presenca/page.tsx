import { SiteHeader } from "@/components/site-header";
import { RSVPForm } from "@/components/rsvp-form";

export default function RSVPPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad pt-32">
        <section className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <p className="heading-eyebrow">RSVP</p>
            <h1 className="serif-title mt-4">Confirme sua presenca.</h1>
            <p className="mt-6 text-lg leading-8 text-rosewood/70">Sua confirmacao ajuda os noivos a organizarem cada detalhe com carinho e precisao.</p>
          </div>
          <div className="mt-12">
            <RSVPForm />
          </div>
        </section>
      </main>
    </>
  );
}
