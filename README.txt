AL.JUST — CATÁLOGO + ÁREA DO ADMINISTRADOR

1) No site, clique rapidamente 5 vezes no logotipo Al.just.
2) Será aberta a área admin.
3) Entre com o Gmail/e-mail e palavra-passe de um utilizador criado no Supabase Authentication > Users.
4) Depois do login aparece a área de cadastro, publicação, edição, eliminação e stock.
5) O site público lê os produtos da tabela public.produtos.

IMPORTANTE SOBRE A TABELA
A versão assume que public.produtos possui as colunas:
- id
- created_at
- name
- category
- price
- stock
- image_url
- description
- published (opcional, mas recomendada)

As informações da ficha técnica (marca, modelo, referência, cor, garantia, dimensões, peso) são guardadas dentro da coluna description em JSON, para não exigir novas colunas.

IMAGENS
Cada produto pode receber até 50 imagens. Para esta versão, as imagens são guardadas como dados dentro de image_url. Para catálogos muito grandes, recomenda-se migrar depois para Supabase Storage.

SEGURANÇA
Os 5 cliques só escondem a entrada do painel. A proteção real é o login do Supabase Auth e as políticas RLS.
Nunca coloque uma service_role/secret key no HTML.


FICHEIRO SUPABASE_SETUP.sql
Se necessário, execute este SQL no SQL Editor do Supabase uma única vez para adicionar published e as políticas básicas.
