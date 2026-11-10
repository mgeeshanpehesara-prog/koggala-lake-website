create table if not exists public.products (
  slug text primary key,
  product jsonb not null check (jsonb_typeof(product) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id text primary key,
  booking jsonb not null check (jsonb_typeof(booking) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_updated_at_idx on public.products (updated_at);
create index if not exists bookings_created_at_idx on public.bookings (created_at);
create index if not exists bookings_product_slug_idx
  on public.bookings ((booking ->> 'productSlug'));
create index if not exists bookings_booking_reference_idx
  on public.bookings ((booking ->> 'bookingReference'));
create index if not exists bookings_date_idx
  on public.bookings ((booking ->> 'date'));
create index if not exists bookings_status_idx
  on public.bookings ((booking ->> 'bookingStatus'));

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.set_bookings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
before update on public.bookings
for each row execute function public.set_bookings_updated_at();

alter table public.products enable row level security;
alter table public.bookings enable row level security;

-- No public policies are created. All application access uses the server-only
-- service-role key, while the service role bypasses RLS.
