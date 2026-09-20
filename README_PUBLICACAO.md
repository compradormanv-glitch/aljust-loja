# Al.just V9 — publicação e pesquisa

Esta versão corrige o catálogo público para carregar primeiro os dados leves dos produtos. As imagens são carregadas separadamente quando necessário, para que uma imagem muito grande não bloqueie a lista de produtos.

A pesquisa funciona enquanto o cliente escreve e procura por nome, marca, modelo, referência, categoria, subcategoria, cor, material e especificações. Por exemplo, ao escrever apenas `F`, já podem aparecer produtos cujo nome ou outros dados contêm a letra F.

Se os produtos aparecem no administrador mas não aparecem para clientes, confirme a política SELECT pública no Supabase. O ficheiro `supabase_public_read_policy.sql` contém um exemplo.

Para novos produtos, o administrador também comprime as imagens antes de as guardar no campo de imagem, reduzindo o tamanho dos dados.
