-- Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_phone text not null,
  pharmacy_phone text not null,
  status text not null default 'new', -- new, payment-pending, payment-received, ready, out-for-delivery, delivered
  amount numeric,
  rider_name text,
  rider_phone text
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies
create policy "Enable read access for all users" on public.orders for select using (true);
create policy "Enable insert for all users" on public.orders for insert with check (true);
create policy "Enable update for all users" on public.orders for update using (true);
