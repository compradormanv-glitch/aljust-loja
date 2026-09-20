-- Al.just: complemento opcional/recomendado para public.produtos

-- 1) Campo para controlar publicação
alter table public.produtos add column if not exists published boolean not null default true;

-- 2) Se a tua tabela já usa RLS, confirma políticas equivalentes às abaixo.
-- Ajusta os nomes se já existirem.

-- Leitura pública dos produtos
create policy if not exists public_view_products
on public.produtos
for select
to anon, authenticated
using (true);

-- Escrita apenas para utilizadores autenticados
create policy if not exists admin_insert_products
on public.produtos
for insert
to authenticated
with check (true);

create policy if not exists admin_update_products
on public.produtos
for update
to authenticated
using (true)
with check (true);

create policy if not exists admin_delete_products
on public.produtos
for delete
to authenticated
using (true);

-- 3) Cria o utilizador administrador em:
-- Authentication -> Users -> Add user
-- Usa o Gmail/e-mail e a palavra-passe criados por ti.
