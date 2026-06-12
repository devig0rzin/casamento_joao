const emv = (id: string, value: string) => `${id}${String(value.length).padStart(2, "0")}${value}`;

const normalize = (value: string, maxLength: number) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.-]/g, "")
    .slice(0, maxLength);

export const isPixConfigured = (key: string) => Boolean(key.trim()) && !key.includes("INSERIR-CHAVE-PIX");

export type PixKeyType = "auto" | "email" | "phone" | "cpf" | "cnpj" | "random";

const normalizePixKey = (key: string, keyType: PixKeyType = "auto") => {
  const trimmed = key.trim().replace(/^["']|["']$/g, "");
  const digits = trimmed.replace(/\D/g, "");

  if (keyType === "phone") {
    if (trimmed.startsWith("+")) return `+${digits}`;
    if (digits.startsWith("55") && digits.length >= 12) return `+${digits}`;
    return `+55${digits}`;
  }

  if (keyType === "cpf" || keyType === "cnpj") return digits;
  if (keyType === "email") return trimmed.toLowerCase();
  if (keyType === "random") return trimmed;

  if (trimmed.includes("@")) return trimmed.toLowerCase();
  if (trimmed.startsWith("+")) return `+${trimmed.replace(/\D/g, "")}`;

  if (digits.length === 11 || digits.length === 14) return digits;

  return trimmed;
};

const crc16 = (payload: string) => {
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

export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amount,
  description,
  txid,
  keyType = "auto",
}: {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  description: string;
  txid: string;
  keyType?: PixKeyType;
}) {
  const pixKey = normalizePixKey(key, keyType);
  const safeTxid = normalize(txid, 25).replace(/[^A-Za-z0-9]/g, "") || "***";
  const merchantAccount = emv("00", "br.gov.bcb.pix") + emv("01", pixKey);
  const payload =
    emv("00", "01") +
    emv("26", merchantAccount) +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", amount.toFixed(2)) +
    emv("58", "BR") +
    emv("59", normalize(merchantName, 25)) +
    emv("60", normalize(merchantCity, 15)) +
    emv("62", emv("05", safeTxid)) +
    "6304";

  return payload + crc16(payload);
}

export const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
