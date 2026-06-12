import net from "node:net";
import tls from "node:tls";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RsvpPayload = {
  name: string;
  phone: string;
  email: string;
  companions: number;
  message: string;
};

const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_FROM", "NEXT_PUBLIC_RSVP_EMAIL"] as const;

const encodeHeader = (value: string) => `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;

const normalizePassword = (password: string) => password.replace(/\s/g, "");

const smtpDate = () => new Date().toUTCString();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

class SmtpClient {
  private socket?: net.Socket | tls.TLSSocket;
  private buffer = "";

  constructor(
    private readonly host: string,
    private readonly port: number,
  ) {}

  private write(command: string) {
    this.socket?.write(`${command}\r\n`);
  }

  private readResponse() {
    return new Promise<string>((resolve, reject) => {
      const onData = (chunk: Buffer) => {
        this.buffer += chunk.toString("utf8");
        const lines = this.buffer.split(/\r?\n/).filter(Boolean);
        const last = lines.at(-1);
        if (last && /^\d{3}\s/.test(last)) {
          this.socket?.off("data", onData);
          this.socket?.off("error", onError);
          const response = this.buffer;
          this.buffer = "";
          resolve(response);
        }
      };
      const onError = (error: Error) => {
        this.socket?.off("data", onData);
        reject(error);
      };
      this.socket?.on("data", onData);
      this.socket?.once("error", onError);
    });
  }

  private async expect(command: string | null, okCodes: string[]) {
    if (command) this.write(command);
    const response = await this.readResponse();
    if (!okCodes.some((code) => response.startsWith(code))) {
      throw new Error(`SMTP command failed: ${response.split(/\r?\n/)[0]}`);
    }
    return response;
  }

  async connect() {
    this.socket = net.connect(this.port, this.host);
    await this.expect(null, ["220"]);
  }

  async startTls(servername: string) {
    await this.expect(`EHLO ${servername}`, ["250"]);
    await this.expect("STARTTLS", ["220"]);

    this.socket = tls.connect({
      socket: this.socket,
      servername,
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
    });
    this.buffer = "";
    await new Promise<void>((resolve, reject) => {
      const secureSocket = this.socket as tls.TLSSocket;
      secureSocket.once("secureConnect", resolve);
      secureSocket.once("error", reject);
    });
    await this.expect(`EHLO ${servername}`, ["250"]);
  }

  async login(user: string, password: string) {
    await this.expect("AUTH LOGIN", ["334"]);
    await this.expect(Buffer.from(user, "utf8").toString("base64"), ["334"]);
    await this.expect(Buffer.from(normalizePassword(password), "utf8").toString("base64"), ["235"]);
  }

  async send(from: string, to: string, message: string) {
    await this.expect(`MAIL FROM:<${from}>`, ["250"]);
    await this.expect(`RCPT TO:<${to}>`, ["250", "251"]);
    await this.expect("DATA", ["354"]);
    this.write(`${message.replace(/\r?\n\./g, "\r\n..")}\r\n.`);
    await this.expect(null, ["250"]);
    await this.expect("QUIT", ["221"]);
  }

  close() {
    this.socket?.end();
  }
}

function buildEmail(guest: RsvpPayload, from: string, to: string) {
  const subject = `Confirmacao de presenca - ${guest.name}`;
  const plain = [
    "Confirmacao de presenca",
    "",
    `Nome: ${guest.name}`,
    `Telefone: ${guest.phone}`,
    `E-mail: ${guest.email}`,
    `Acompanhantes: ${guest.companions}`,
    `Mensagem: ${guest.message || "-"}`,
    "",
    "Casamento Joao Pedro e Jessica",
  ].join("\n");

  const html = `
    <h2>Confirmacao de presenca</h2>
    <p><strong>Nome:</strong> ${escapeHtml(guest.name)}</p>
    <p><strong>Telefone:</strong> ${escapeHtml(guest.phone)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(guest.email)}</p>
    <p><strong>Acompanhantes:</strong> ${guest.companions}</p>
    <p><strong>Mensagem:</strong> ${escapeHtml(guest.message || "-")}</p>
    <p>Casamento Joao Pedro e Jessica</p>
  `.trim();

  const boundary = `rsvp-${crypto.randomUUID()}`;

  return [
    `From: ${encodeHeader("Casamento Joao e Jessica")} <${from}>`,
    `To: ${to}`,
    `Reply-To: ${guest.email}`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${smtpDate()}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    "",
    plain,
    "",
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    "",
    html,
    "",
    `--${boundary}--`,
  ].join("\r\n");
}

export async function POST(request: Request) {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    return NextResponse.json({ error: `Configuracao de e-mail incompleta: ${missing.join(", ")}` }, { status: 500 });
  }

  const payload = (await request.json()) as RsvpPayload;
  const name = String(payload.name || "").trim();
  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim();
  const companions = Number(payload.companions || 0);
  const message = String(payload.message || "").trim();

  if (name.length < 3 || phone.replace(/\D/g, "").length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Dados de confirmacao invalidos." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.EMAIL_FROM!;
  const to = process.env.NEXT_PUBLIC_RSVP_EMAIL!;
  const user = process.env.SMTP_USER!;
  const password = process.env.SMTP_PASSWORD!;
  const client = new SmtpClient(host, port);

  try {
    await client.connect();
    await client.startTls(host);
    await client.login(user, password);
    await client.send(from, to, buildEmail({ name, phone, email, companions, message }, from, to));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Nao foi possivel enviar o e-mail de confirmacao." }, { status: 500 });
  } finally {
    client.close();
  }
}
