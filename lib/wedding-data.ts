export type GiftStatus = "available" | "reserved" | "gifted";

export type GiftPaymentStatus = "pending" | "confirmed" | "failed";

export type Gift = {
  id: string;
  name: string;
  category: "cozinha" | "quarto" | "sala" | "experiencias";
  price: number;
  status: GiftStatus;
  image: string;
  description: string;
};

export type GiftPayment = {
  id: string;
  giftId: string;
  giftName: string;
  pixTxid: string;
  amount: number;
  status: GiftPaymentStatus;
  createdAt: string;
};

export type Guest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  companions: number;
  message: string;
  status: "confirmed" | "pending" | "declined";
  createdAt: string;
};

export const wedding = {
  couple: "Joao Pedro e Jessica",
  firstNameA: "Joao Pedro",
  firstNameB: "Jessica",
  dateISO: "2026-10-10T15:30:00-03:00",
  displayDate: "10 de outubro de 2026",
  displayTime: "15:30",
  venue: "Paroquia Santa Cruz",
  address: "R. Balao Magico, 1506 - Rio Cotia, Cotia - SP, 06715-780",
  mapsUrl: "https://www.google.com/maps/place/R.+Bal%C3%A3o+M%C3%A1gico,+1506+-+Rio+Cotia,+Cotia+-+SP,+06715-780",
  wazeUrl: "https://waze.com/ul?q=R.%20Bal%C3%A3o%20M%C3%A1gico%2C%201506%20Cotia%20SP&navigate=yes",
  mapEmbed:
    "https://www.google.com/maps?q=R.%20Bal%C3%A3o%20M%C3%A1gico%2C%201506%20-%20Rio%20Cotia%2C%20Cotia%20-%20SP%2C%2006715-780&output=embed",
  pixKey: process.env.NEXT_PUBLIC_PIX_KEY || "INSERIR-CHAVE-PIX-DO-JOAO",
  pixKeyType: process.env.NEXT_PUBLIC_PIX_KEY_TYPE || "auto",
  pixMerchantName: process.env.NEXT_PUBLIC_PIX_MERCHANT_NAME || "JOAO PEDRO E JESSICA",
  pixMerchantCity: process.env.NEXT_PUBLIC_PIX_MERCHANT_CITY || "COTIA",
  rsvpEmail: process.env.NEXT_PUBLIC_RSVP_EMAIL || "casamento.joao.jessica.2026@gmail.com",
  maxCompanions: 4,
};

export const timeline = [
  {
    year: "2019",
    title: "O primeiro encontro",
    text: "Uma conversa simples virou assunto para a vida inteira.",
  },
  {
    year: "2021",
    title: "Os planos ficaram serios",
    text: "Entre familia, sonhos e rotina, nasceu a vontade de construir uma casa juntos.",
  },
  {
    year: "2025",
    title: "O pedido",
    text: "Um sim cheio de emocao marcou o inicio dos preparativos.",
  },
  {
    year: "2026",
    title: "O grande dia",
    text: "Agora chegou o momento de celebrar essa historia com quem faz parte dela.",
  },
];

export const gallery = [
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=82",
];

export const weddingParty = [
  {
    name: "Mariana",
    role: "Madrinha",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=82",
    text: "Presenca leve, amiga e sempre por perto.",
  },
  {
    name: "Rafael",
    role: "Padrinho",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=82",
    text: "Parceiro de longa data e conselheiro dos noivos.",
  },
  {
    name: "Camila",
    role: "Madrinha",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=82",
    text: "Daquelas pessoas que fazem a festa mais bonita.",
  },
  {
    name: "Lucas",
    role: "Padrinho",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=82",
    text: "Amigo presente nos melhores capitulos.",
  },
];

export const gifts: Gift[] = [
  {
    id: "teste-pix",
    name: "Teste Pix",
    category: "experiencias",
    price: 0.1,
    status: "available",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=82",
    description: "Produto de teste para validar pagamento Pix de R$ 0,10.",
  },
  {
    id: "teste-pix-1-real",
    name: "Teste Pix 1 real",
    category: "experiencias",
    price: 1,
    status: "available",
    image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=82",
    description: "Produto de teste para validar pagamento Pix de R$ 1,00.",
  },
  {
    id: "pano-prato",
    name: "Kit pano de prato",
    category: "cozinha",
    price: 40,
    status: "available",
    image: "/gifts/kit-pano-prato.jpg",
    description: "Um presente simples e util para a cozinha.",
  },
  {
    id: "porta-temperos",
    name: "Porta temperos",
    category: "cozinha",
    price: 55,
    status: "available",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=82",
    description: "Para deixar a cozinha organizada.",
  },
  {
    id: "jogo-copos",
    name: "Jogo de copos",
    category: "cozinha",
    price: 65,
    status: "available",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=82",
    description: "Para brindar os primeiros momentos da casa.",
  },
  {
    id: "almofadas",
    name: "Almofadas decorativas",
    category: "sala",
    price: 75,
    status: "available",
    image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?auto=format&fit=crop&w=900&q=82",
    description: "Um toque aconchegante para a sala.",
  },
  {
    id: "porta-retrato",
    name: "Porta-retrato",
    category: "sala",
    price: 45,
    status: "available",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=82",
    description: "Para guardar uma lembranca especial.",
  },
  {
    id: "kit-lavabo",
    name: "Kit lavabo",
    category: "quarto",
    price: 85,
    status: "available",
    image: "/gifts/kit-lavabo.jpg",
    description: "Detalhe elegante para receber visitas.",
  },
  {
    id: "cafe-manha",
    name: "Cafe da manha dos noivos",
    category: "experiencias",
    price: 70,
    status: "available",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=82",
    description: "Um carinho para depois do casamento.",
  },
  {
    id: "cinema-casal",
    name: "Cinema do casal",
    category: "experiencias",
    price: 60,
    status: "available",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=82",
    description: "Uma saidinha leve para os noivos.",
  },
  {
    id: "jogo-panelas",
    name: "Jogo de panelas",
    category: "cozinha",
    price: 180,
    status: "available",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=82",
    description: "Para as primeiras receitas da casa nova.",
  },
  {
    id: "jogo-jantar",
    name: "Jogo de jantar",
    category: "cozinha",
    price: 240,
    status: "reserved",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=82",
    description: "Mesa bonita para receber a familia.",
  },
  {
    id: "cafeteira",
    name: "Cafeteira",
    category: "cozinha",
    price: 160,
    status: "available",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=82",
    description: "Cafe fresco para todos os dias.",
  },
  {
    id: "air-fryer",
    name: "Air fryer",
    category: "cozinha",
    price: 380,
    status: "available",
    image: "https://www.guiadecompra.com/wp-content/uploads/2024/02/escolher-a-melhor-fritadeira-sem-oleo.webp",
    description: "Praticidade na rotina dos noivos.",
  },
  {
    id: "kit-toalhas",
    name: "Kit de toalhas",
    category: "quarto",
    price: 120,
    status: "gifted",
    image: "/gifts/kit-toalhas.jpg",
    description: "Conforto para a casa nova.",
  },
  {
    id: "jogo-cama",
    name: "Jogo de cama",
    category: "quarto",
    price: 190,
    status: "available",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=82",
    description: "Para deixar o quarto especial.",
  },
  {
    id: "cota-sofa",
    name: "Cota do sofa",
    category: "sala",
    price: 450,
    status: "available",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=82",
    description: "Um pedacinho do sofa dos noivos.",
  },
  {
    id: "decoracao",
    name: "Decoracao da casa",
    category: "sala",
    price: 90,
    status: "available",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=82",
    description: "Detalhes que deixam tudo com cara de lar.",
  },
  {
    id: "jantar-romantico",
    name: "Jantar especial",
    category: "experiencias",
    price: 260,
    status: "available",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=82",
    description: "Uma noite especial depois do casamento.",
  },
];

export const faqs = [
  ["Posso levar acompanhante?", "A confirmacao permite informar acompanhantes dentro do limite definido pelos noivos."],
  ["Como confirmar presenca?", "Acesse a pagina de RSVP, preencha seus dados e finalize a confirmacao."],
  ["Como chegar?", "A pagina do local possui botoes para Google Maps e Waze."],
  ["Onde estacionar?", "Ha orientacoes na pagina do local com sugestoes proximas da igreja."],
  ["Como funciona a lista de presentes?", "Voce escolhe um item ilustrativo e paga o valor por Pix."],
] as const;
