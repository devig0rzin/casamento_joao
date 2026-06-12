import { SiteHeader } from "@/components/site-header";
import { GiftStore } from "@/components/gift-store";

export default function GiftsPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad pt-32">
        <section className="container-premium">
          <GiftStore />
        </section>
      </main>
    </>
  );
}
