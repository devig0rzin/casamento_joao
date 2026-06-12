import { Hero } from "@/components/hero";
import { SimpleInviteSections } from "@/components/simple-invite-sections";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <SimpleInviteSections />
      </main>
    </>
  );
}
