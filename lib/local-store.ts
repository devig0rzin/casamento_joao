"use client";

import { hasSupabaseConfig, supabase } from "./supabase";
import type { Gift, GiftPayment, Guest } from "./wedding-data";

const GUESTS_KEY = "premium-wedding-guests";
const GIFTS_KEY = "premium-wedding-gifts";
const GIFT_PAYMENTS_KEY = "premium-wedding-gift-payments";

export function readGuests(): Guest[] {
  try {
    return JSON.parse(localStorage.getItem(GUESTS_KEY) || "[]") as Guest[];
  } catch {
    return [];
  }
}

export function saveGuest(guest: Guest) {
  const guests = readGuests();
  const existingIndex = guests.findIndex((item) => item.id === guest.id || item.email === guest.email);
  if (existingIndex >= 0) guests[existingIndex] = guest;
  else guests.unshift(guest);
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
  return guests;
}

export async function loadGuests() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase.from("guests").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const guests = data.map(
        (guest): Guest => ({
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
          companions: guest.companions,
          message: guest.message || "",
          status: guest.status,
          createdAt: guest.created_at,
        }),
      );
      localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
      return guests;
    }
  }

  return readGuests();
}

export async function saveGuestRecord(guest: Guest) {
  const guests = saveGuest(guest);

  if (hasSupabaseConfig && supabase) {
    await supabase.from("guests").insert({
      id: guest.id,
      name: guest.name,
      phone: guest.phone,
      email: guest.email,
      companions: guest.companions,
      message: guest.message,
      status: guest.status,
      created_at: guest.createdAt,
    });
  }

  return guests;
}

export function readGiftOverrides(): Partial<Record<string, Gift["status"]>> {
  try {
    return JSON.parse(localStorage.getItem(GIFTS_KEY) || "{}") as Partial<Record<string, Gift["status"]>>;
  } catch {
    return {};
  }
}

export function setGiftStatus(id: string, status: Gift["status"]) {
  const overrides = readGiftOverrides();
  overrides[id] = status;
  localStorage.setItem(GIFTS_KEY, JSON.stringify(overrides));
}

export function readGiftPayments(): GiftPayment[] {
  try {
    return JSON.parse(localStorage.getItem(GIFT_PAYMENTS_KEY) || "[]") as GiftPayment[];
  } catch {
    return [];
  }
}

export async function loadGiftPayments() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase.from("gift_payments").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const payments = data.map(
        (payment): GiftPayment => ({
          id: payment.id,
          giftId: payment.gift_id,
          giftName: payment.gift_name || payment.gift_id,
          pixTxid: payment.pix_txid,
          amount: Number(payment.amount),
          status: payment.status,
          createdAt: payment.created_at,
        }),
      );
      localStorage.setItem(GIFT_PAYMENTS_KEY, JSON.stringify(payments));
      return payments;
    }
  }

  return readGiftPayments();
}

export async function recordGiftPayment(payment: Omit<GiftPayment, "id" | "createdAt" | "status">) {
  const pendingPayment: GiftPayment = {
    ...payment,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const payments = readGiftPayments();
  const existingIndex = payments.findIndex((item) => item.pixTxid === pendingPayment.pixTxid);
  if (existingIndex >= 0) payments[existingIndex] = pendingPayment;
  else payments.unshift(pendingPayment);
  localStorage.setItem(GIFT_PAYMENTS_KEY, JSON.stringify(payments));

  if (hasSupabaseConfig && supabase) {
    await supabase.from("gift_payments").insert({
      id: pendingPayment.id,
      gift_id: pendingPayment.giftId,
      gift_name: pendingPayment.giftName,
      pix_txid: pendingPayment.pixTxid,
      amount: pendingPayment.amount,
      status: pendingPayment.status,
      created_at: pendingPayment.createdAt,
    });
  }

  return pendingPayment;
}
