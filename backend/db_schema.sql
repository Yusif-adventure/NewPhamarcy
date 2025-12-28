-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Create pharmacies table
create table if not exists public.pharmacies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null unique,
  password text not null
);

-- Create riders table
create table if not exists public.riders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null unique,
  password text not null,
  vehicle_type text
);

-- Optional: Enable Row Level Security (RLS)
alter table public.pharmacies enable row level security;
alter table public.riders enable row level security;

-- Optional: Create policies to allow public access (if you want to access from frontend directly later)
-- Note: The backend uses a service role key so it bypasses these policies.
create policy "Enable read access for all users" on public.pharmacies for select using (true);
create policy "Enable insert for all users" on public.pharmacies for insert with check (true);

create policy "Enable read access for all users" on public.riders for select using (true);
create policy "Enable insert for all users" on public.riders for insert with check (true);
