"use client";

import type { Gift, Guest } from "./wedding-data";

const GUESTS_KEY = "premium-wedding-guests";
const GIFTS_KEY = "premium-wedding-gifts";

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
