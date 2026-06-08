const emv = (id: string, value: string) => `${id}${String(value.length).padStart(2, "0")}${value}`;

const normalize = (value: string, maxLength: number) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.-]/g, "")
    .slice(0, maxLength);

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
}: {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  description: string;
  txid: string;
}) {
  const merchantAccount = emv("00", "br.gov.bcb.pix") + emv("01", key) + emv("02", description);
  const payload =
    emv("00", "01") +
    emv("26", merchantAccount) +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", amount.toFixed(2)) +
    emv("58", "BR") +
    emv("59", normalize(merchantName, 25)) +
    emv("60", normalize(merchantCity, 15)) +
    emv("62", emv("05", normalize(txid, 25))) +
    "6304";

  return payload + crc16(payload);
}

export const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
