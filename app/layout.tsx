import type { Metadata } from "next";
import "./globals.css";
import { wedding } from "@/lib/wedding-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://casamento-joao-pedro-jessica.vercel.app"),
  title: {
    default: `${wedding.couple} | Convite de Casamento`,
    template: `%s | ${wedding.couple}`,
  },
  description: "Convite premium de casamento com RSVP, local, lista de presentes e Pix.",
  openGraph: {
    title: `${wedding.couple} | Convite de Casamento`,
    description: "Confirme sua presenca, veja o local e escolha um presente para os noivos.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=82",
        width: 1200,
        height: 630,
        alt: "Casamento elegante",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
