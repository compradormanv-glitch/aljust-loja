AL.JUST - LOGIN DO ADMINISTRADOR CORRIGIDO

O admin agora exige e-mail e palavra-passe sempre que admin.html é aberto, mesmo que exista uma sessão anterior no navegador.

Fluxo:
5 cliques no logotipo -> admin.html -> e-mail + palavra-passe -> painel.

Recuperação de palavra-passe:
Clique em "Esqueci a palavra-passe" e use o e-mail do administrador. O Supabase enviará o link de recuperação.

Importante:
No Supabase, em Authentication > URL Configuration, adicione a URL publicada de admin.html em Redirect URLs. Exemplo:
https://SEU-USUARIO.github.io/aljust-loja/admin.html

Não use a service_role/secret key no navegador.
