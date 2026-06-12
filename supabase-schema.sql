create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  companions int not null default 0,
  message text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table if not exists gifts (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(10, 2) not null,
  status text not null default 'available',
  image text not null,
  description text
);

create table if not exists gift_payments (
  id uuid primary key default gen_random_uuid(),
  gift_id text,
  gift_name text,
  guest_name text,
  pix_txid text,
  amount numeric(10, 2) not null,
  receipt_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table gift_payments add column if not exists gift_name text;
alter table gift_payments drop constraint if exists gift_payments_gift_id_fkey;

alter table guests enable row level security;
alter table gifts enable row level security;
alter table gift_payments enable row level security;

drop policy if exists "Guests insert public" on guests;
drop policy if exists "Guests read public demo" on guests;
drop policy if exists "Gifts read public" on gifts;
drop policy if exists "Payments insert public" on gift_payments;
drop policy if exists "Payments read public demo" on gift_payments;

create policy "Guests insert public" on guests for insert with check (true);
create policy "Guests read public demo" on guests for select using (true);
create policy "Gifts read public" on gifts for select using (true);
create policy "Payments insert public" on gift_payments for insert with check (true);
create policy "Payments read public demo" on gift_payments for select using (true);
