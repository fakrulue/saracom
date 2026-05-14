
-- Enums
create type public.app_role as enum ('admin', 'customer');
create type public.age_group as enum ('newborn', 'baby', 'toddler', 'kid', 'teen');
create type public.gender as enum ('boy', 'girl', 'unisex');
create type public.order_status as enum ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (true);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  title text not null,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  age_group public.age_group,
  gender public.gender,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  is_sale boolean not null default false,
  stock int not null default 0,
  rating numeric(2,1) not null default 5.0,
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products public read" on public.products for select using (true);
create index on public.products (category_id);
create index on public.products (is_new, is_best_seller, is_sale);

-- Variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text,
  color text,
  sku text unique,
  stock int not null default 0,
  price_override numeric(10,2)
);
alter table public.product_variants enable row level security;
create policy "variants public read" on public.product_variants for select using (true);
create index on public.product_variants (product_id);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles owner read" on public.profiles for select using (auth.uid() = id);
create policy "profiles owner update" on public.profiles for update using (auth.uid() = id);
create policy "profiles owner insert" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "roles self read" on public.user_roles for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "roles admin manage" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Addresses
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  area text,
  country text not null default 'Bangladesh',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.addresses enable row level security;
create policy "addr owner all" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Cart
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  qty int not null default 1 check (qty > 0),
  created_at timestamptz not null default now()
);
alter table public.cart_items enable row level security;
create policy "cart owner all" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Wishlist
create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
alter table public.wishlist_items enable row level security;
create policy "wishlist owner all" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.order_status not null default 'pending',
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address jsonb not null,
  gift_wrap boolean not null default false,
  gift_message text,
  discount_code text,
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders owner read" on public.orders for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "orders owner insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders admin update" on public.orders for update using (public.has_role(auth.uid(), 'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  title text not null,
  qty int not null,
  price numeric(10,2) not null
);
alter table public.order_items enable row level security;
create policy "order_items via order" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(), 'admin')))
);
create policy "order_items insert via order" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
