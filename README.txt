Al.just — recuperação e alteração da palavra-passe

Fluxo:
1. 5 cliques rápidos no logotipo -> admin.html.
2. Entrada com e-mail e palavra-passe do administrador no Supabase.
3. Botão "Esqueci a palavra-passe" -> envia link de recuperação por e-mail.
4. O link abre a área para definir uma nova palavra-passe.
5. Depois de entrar, o botão "Alterar palavra-passe" permite trocar a palavra-passe.

No Supabase, em Authentication > URL Configuration > Redirect URLs, adicione a URL do admin.html no GitHub Pages. Exemplo:
https://SEU_USUARIO.github.io/aljust-loja/admin.html#reset

Use apenas a publishable/anon key no frontend. Nunca coloque service_role/secret key no site.
