const CONFIG = {
  pixKey: "INSERIR-CHAVE-PIX-DO-JOAO",
  pixMerchantName: "JOAO PEDRO",
  pixMerchantCity: "COTIA",
  joaoWhatsApp: "5511999999999",
  jessicaWhatsApp: "5511999999999",
  sheetsEndpoint: "",
};

const RSVP_KEY = "casamento-joao-pedro-jessica-rsvp";

const gifts = [
  {
    id: "jogo-panelas",
    name: "Jogo de panelas",
    category: "cozinha",
    price: 180,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=82",
    note: "Para as primeiras receitas da casa nova.",
  },
  {
    id: "jogo-jantar",
    name: "Jogo de jantar",
    category: "cozinha",
    price: 240,
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=82",
    note: "Para receber a familia com mesa bonita.",
  },
  {
    id: "cafeteira",
    name: "Cafeteira",
    category: "cozinha",
    price: 160,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=700&q=82",
    note: "Cafe fresco para a rotina dos noivos.",
  },
  {
    id: "air-fryer",
    name: "Air fryer",
    category: "cozinha",
    price: 380,
    image: "https://images.unsplash.com/photo-1625944228741-cf30983ecb4c?auto=format&fit=crop&w=700&q=82",
    note: "Praticidade para o dia a dia.",
  },
  {
    id: "kit-toalhas",
    name: "Kit de toalhas",
    category: "quarto",
    price: 120,
    image: "https://images.unsplash.com/photo-1589705837845-6b5933023b3f?auto=format&fit=crop&w=700&q=82",
    note: "Conforto para a casa nova.",
  },
  {
    id: "jogo-cama",
    name: "Jogo de cama",
    category: "quarto",
    price: 190,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=700&q=82",
    note: "Para deixar o quarto especial.",
  },
  {
    id: "travesseiros",
    name: "Travesseiros",
    category: "quarto",
    price: 150,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=82",
    note: "Descanso depois da festa.",
  },
  {
    id: "guarda-roupa",
    name: "Cota do guarda-roupa",
    category: "quarto",
    price: 500,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=700&q=82",
    note: "Uma ajuda maior para organizar tudo.",
  },
  {
    id: "tapete",
    name: "Tapete da sala",
    category: "sala",
    price: 220,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=82",
    note: "Aquele toque bonito na sala.",
  },
  {
    id: "cota-sofa",
    name: "Cota do sofa",
    category: "sala",
    price: 450,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=82",
    note: "Um pedacinho do sofa dos noivos.",
  },
  {
    id: "rack",
    name: "Rack da sala",
    category: "sala",
    price: 320,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=82",
    note: "Para montar a sala com carinho.",
  },
  {
    id: "decoracao",
    name: "Decoracao da casa",
    category: "sala",
    price: 90,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=82",
    note: "Detalhes que deixam tudo com cara de lar.",
  },
];

let selectedGiftId = "";

const formatCurrency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const onlyDigits = (value) => value.replace(/\D/g, "");
const normalize = (value, maxLength) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, maxLength);
const emv = (id, value) => `${id}${String(value.length).padStart(2, "0")}${value}`;

const crc16 = (payload) => {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
};

const buildPixPayload = (gift) => {
  const merchantAccount = emv("00", "br.gov.bcb.pix") + emv("01", CONFIG.pixKey) + emv("02", gift.name);
  const txId = `JPJ${gift.id.replace(/[^a-z0-9]/gi, "").slice(0, 18).toUpperCase()}`;
  const payload =
    emv("00", "01") +
    emv("26", merchantAccount) +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", gift.price.toFixed(2)) +
    emv("58", "BR") +
    emv("59", normalize(CONFIG.pixMerchantName, 25)) +
    emv("60", normalize(CONFIG.pixMerchantCity, 15)) +
    emv("62", emv("05", txId)) +
    "6304";

  return payload + crc16(payload);
};

const renderQrCode = (payload) => {
  const qrTarget = document.querySelector("#pixQr");
  if (!qrTarget || !window.QRCode) return;

  qrTarget.innerHTML = "";
  new window.QRCode(qrTarget, {
    text: payload,
    width: 190,
    height: 190,
    colorDark: "#3b1425",
    colorLight: "#fffaf6",
    correctLevel: window.QRCode.CorrectLevel.M,
  });
};

const loadGuests = () => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuests = (guests) => localStorage.setItem(RSVP_KEY, JSON.stringify(guests));

const renderGuests = () => {
  const guestList = document.querySelector("#guestList");
  const guestTotal = document.querySelector("#guestTotal");
  if (!guestList || !guestTotal) return;

  const guests = loadGuests();
  const total = guests.reduce((sum, guest) => sum + Number(guest.count), 0);
  guestList.innerHTML = "";
  guestTotal.textContent = `${total} ${total === 1 ? "pessoa" : "pessoas"}`;

  if (!guests.length) {
    guestList.innerHTML = "<li><strong>Nenhuma presenca confirmada ainda.</strong><small>A lista aparece aqui depois da confirmacao.</small></li>";
    return;
  }

  guests.forEach((guest) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${guest.name}</strong><small>${guest.count} ${Number(guest.count) === 1 ? "pessoa" : "pessoas"} - ${guest.message || "Presenca confirmada"}</small>`;
    guestList.append(item);
  });
};

const buildWhatsAppUrl = (phone, guest) => {
  const message = `Ola! Quero confirmar presenca no casamento de Joao Pedro e Jessica.%0A%0ANome: ${encodeURIComponent(guest.name)}%0AQuantidade: ${guest.count}%0AMensagem: ${encodeURIComponent(guest.message || "-")}`;
  return `https://wa.me/${onlyDigits(phone)}?text=${message}`;
};

const setupRsvp = () => {
  const form = document.querySelector("#rsvpForm");
  if (!form) return;

  const formStatus = document.querySelector("#formStatus");
  const joaoLink = document.querySelector("#sendJoao");
  const jessicaLink = document.querySelector("#sendJessica");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const guest = {
      name: String(data.get("guestName")).trim(),
      count: String(data.get("guestCount")),
      message: String(data.get("guestMessage")).trim(),
      createdAt: new Date().toISOString(),
    };

    if (!guest.name) {
      formStatus.textContent = "Digite seu nome para confirmar.";
      return;
    }

    const guests = loadGuests();
    const existingIndex = guests.findIndex((item) => item.name.toLowerCase() === guest.name.toLowerCase());
    if (existingIndex >= 0) guests[existingIndex] = guest;
    else guests.push(guest);

    saveGuests(guests);
    renderGuests();

    if (CONFIG.sheetsEndpoint) {
      try {
        await fetch(CONFIG.sheetsEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guest),
        });
      } catch {
        formStatus.textContent = "Presenca salva aqui. Confira os botoes de WhatsApp abaixo.";
      }
    }

    joaoLink.href = buildWhatsAppUrl(CONFIG.joaoWhatsApp, guest);
    jessicaLink.href = buildWhatsAppUrl(CONFIG.jessicaWhatsApp, guest);
    joaoLink.removeAttribute("hidden");
    jessicaLink.removeAttribute("hidden");
    formStatus.textContent = "Presenca registrada. Envie tambem pelo WhatsApp dos noivos.";
    form.reset();
  });
};

const renderGifts = (filter = "todos") => {
  const giftGrid = document.querySelector("#giftGrid");
  if (!giftGrid) return;

  const visibleGifts = filter === "todos" ? gifts : gifts.filter((gift) => gift.category === filter);
  giftGrid.innerHTML = "";

  visibleGifts.forEach((gift) => {
    const card = document.createElement("article");
    card.className = `gift-card${gift.id === selectedGiftId ? " is-selected" : ""}`;
    card.innerHTML = `
      <img src="${gift.image}" alt="${gift.name}" loading="lazy" />
      <div class="gift-card-body">
        <span>${gift.category}</span>
        <h3>${gift.name}</h3>
        <p>${gift.note}</p>
        <div class="gift-card-footer">
          <strong>${formatCurrency(gift.price)}</strong>
          <button type="button">Gerar Pix</button>
        </div>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => selectGift(gift));
    card.addEventListener("click", () => selectGift(gift));
    giftGrid.append(card);
  });
};

const selectGift = (gift) => {
  selectedGiftId = gift.id;
  const payload = buildPixPayload(gift);
  const selectedGift = document.querySelector("#selectedGift");
  const giftNote = document.querySelector("#giftNote");
  const pixCopy = document.querySelector("#pixCopy");

  if (selectedGift) selectedGift.textContent = `${gift.name} - ${formatCurrency(gift.price)}`;
  if (giftNote) giftNote.textContent = `QR Code gerado para ${gift.name}. O Pix sera enviado para Joao Pedro.`;
  if (pixCopy) pixCopy.value = payload;

  renderQrCode(payload);
  renderGifts(document.querySelector("[data-filter].is-active")?.dataset.filter || "todos");
};

const setupGifts = () => {
  const giftGrid = document.querySelector("#giftGrid");
  if (!giftGrid) return;

  const filterButtons = document.querySelectorAll("[data-filter]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGifts(button.dataset.filter);
    });
  });

  const copyPix = document.querySelector("#copyPix");
  copyPix?.addEventListener("click", async () => {
    const pixCopy = document.querySelector("#pixCopy");
    const giftNote = document.querySelector("#giftNote");
    const value = pixCopy?.value || CONFIG.pixKey;

    try {
      await navigator.clipboard.writeText(value);
      if (giftNote) giftNote.textContent = "Pix copia e cola copiado.";
    } catch {
      if (giftNote) giftNote.textContent = "Selecione o Pix copia e cola e copie manualmente.";
    }
  });

  const initialFilter = document.querySelector("[data-filter].is-active")?.dataset.filter || "todos";
  const initialGift = initialFilter === "todos" ? gifts[0] : gifts.find((gift) => gift.category === initialFilter);
  renderGifts(initialFilter);
  if (initialGift) selectGift(initialGift);
};

document.addEventListener("DOMContentLoaded", () => {
  renderGuests();
  setupRsvp();
  setupGifts();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
