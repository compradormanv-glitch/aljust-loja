# Al.just — Painel Administrativo

## O que esta versão tem
- Pesquisa de produtos
- Escolha de imagem diretamente do PC/telemóvel
- Cadastrar produto
- Publicar/guardar no Supabase
- Editar produtos
- Eliminar produtos
- Visualizar todos os produtos
- Stock
- Interface responsiva
- Área informativa para clientes/empresas com NIF
- Identidade visual AL vermelho + .just azul-escuro

## Antes de publicar
Abra `admin.html` e substitua:
SUPABASE_URL = "COLOQUE_AQUI_A_URL_DO_SEU_SUPABASE";
SUPABASE_ANON_KEY = "COLOQUE_AQUI_A_CHAVE_ANON_DO_SEU_SUPABASE";

Use a URL e a chave `anon` do seu projeto Supabase.

## Observação importante sobre imagens
Esta versão guarda a imagem como dados no campo `imagem` da tabela `produtos`. Se a sua tabela atual usar outro nome de coluna ou se preferir Supabase Storage, o código precisa ser ajustado para os nomes exatos da sua tabela/bucket.

## Tabela esperada
O painel espera, no mínimo:
- id
- nome
- preco
- stock
- categoria
- descricao
- imagem

Se os seus nomes forem diferentes, adapte no bloco `normalize()` e no `payload` do `admin.html`.
