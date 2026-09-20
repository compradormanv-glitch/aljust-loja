-- Use no Supabase SQL Editor se o catálogo público não conseguir ler public.produtos.
-- Se já existir uma política equivalente, não crie outra com o mesmo nome.

alter table public.produtos enable row level security;

create policy public_view_products
on public.produtos
for select
to anon, authenticated
using (true);
