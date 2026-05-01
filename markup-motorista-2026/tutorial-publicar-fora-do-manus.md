# Tutorial para colocar o **Markup Motorista 2026** no ar fora do Manus

**Autor:** Manus AI  
**Projeto:** Markup Motorista 2026

Embora o Manus já ofereça hospedagem nativa com domínio próprio, é possível publicar este projeto em outra plataforma. Como o site foi construído em **React + Vite**, o caminho mais seguro é tratá-lo como **site estático**, usando o build de produção e publicando a saída pública correta. A documentação oficial do Vite informa que `vite build` gera um bundle adequado para hospedagem estática [1], enquanto as documentações da Vercel e da Netlify confirmam suporte direto a projetos Vite [2] [3].

> “when it is time to deploy your app for production, simply run the `vite build` command. By default, it uses `<root>/index.html` as the build entry point, and produces an application bundle that is suitable to be served over a static hosting service.” — Vite [1]

## Visão geral da estratégia

No seu caso, o projeto tem um detalhe importante: o script `build` não gera apenas o frontend padrão em `dist`, porque ele também empacota um servidor auxiliar em `dist/index.js`. Na prática, o que interessa para hospedagem estática é a pasta **`dist/public`**, onde ficam o `index.html`, os arquivos de `assets/` e os arquivos auxiliares gerados pelo build do projeto.

| Situação | Estratégia recomendada | O que publicar |
| --- | --- | --- |
| Você quer subir rápido em uma plataforma moderna | Conectar o repositório no **Vercel** | Build com `pnpm build` e saída em `dist/public` |
| Você prefere painel simples e fluxo clássico de site estático | Conectar o repositório na **Netlify** | Build com `pnpm build` e saída em `dist/public` |
| Você vai usar hospedagem comum com gerenciador de arquivos, cPanel, S3 ou similar | Fazer o build localmente e enviar os arquivos manualmente | Conteúdo de `dist/public` |

## Etapa 1 — Exporte o projeto do Manus

O primeiro passo é tirar o código do ambiente do Manus. Você pode fazer isso de duas formas. A forma mais organizada é exportar para um repositório GitHub pelo painel do projeto. A forma mais manual é baixar o projeto em ZIP e depois subir para um repositório seu.

| Opção | Quando usar | Resultado |
| --- | --- | --- |
| **Exportar para GitHub** | Quando você quer deploy contínuo | Cada alteração futura pode gerar novo deploy automaticamente |
| **Baixar ZIP** | Quando você quer apenas publicar uma vez ou migrar manualmente | Você passa a controlar os arquivos localmente |

Se você optar por GitHub, a sequência mais limpa é exportar o projeto, confirmar que o repositório ficou completo e depois conectar esse repositório à Vercel ou à Netlify. Se optar por ZIP, descompacte o projeto no seu computador e inicialize um repositório Git antes de subir para sua conta.

## Etapa 2 — Rode o projeto localmente antes de publicar

Antes de mandar o site para fora do Manus, vale validar localmente se o build está saindo certo. Como o projeto usa **pnpm** no `packageManager`, este é o gerenciador mais indicado.

```bash
pnpm install
pnpm build
```

Depois disso, confira se a pasta abaixo foi criada corretamente:

```bash
dist/public
```

Dentro dela, você deve encontrar pelo menos estes arquivos e pastas:

| Caminho | Função |
| --- | --- |
| `dist/public/index.html` | Arquivo principal do site |
| `dist/public/assets/` | CSS e JavaScript otimizados do frontend |
| `dist/public/__manus__/` | Arquivos auxiliares gerados pelo build atual |

Esse ponto é importante porque algumas plataformas detectam Vite e sugerem diretório `dist` por padrão [3]. **No seu projeto específico, o diretório correto para publicação é `dist/public`**, porque a etapa adicional de build coloca o frontend estático lá dentro.

## Etapa 3 — Escolha o modo de publicação

A melhor opção para este projeto é o **deploy por repositório**, porque ele facilita atualizações futuras. Tanto Vercel quanto Netlify suportam Vite oficialmente [2] [3]. Se você fizer mudanças no site depois, bastará dar push no GitHub para gerar uma nova publicação.

### Caminho recomendado A — Publicar na Vercel

A Vercel documenta que projetos Vite podem ser publicados diretamente pela plataforma e também via CLI [2]. Para este site, o fluxo recomendado é por repositório conectado ao GitHub.

Abra a Vercel, clique para importar um projeto do GitHub e selecione o repositório exportado do Manus. Quando a tela de configuração abrir, revise manualmente os campos de build, porque o seu projeto não publica em `dist` puro.

Use estes parâmetros:

| Campo na Vercel | Valor recomendado |
| --- | --- |
| **Framework Preset** | Vite ou Other |
| **Install Command** | `pnpm install` |
| **Build Command** | `pnpm build` |
| **Output Directory** | `dist/public` |
| **Root Directory** | raiz do projeto |

Depois disso, clique em deploy. Se o build terminar sem erros, a Vercel já entregará um domínio provisório para teste.

A documentação da Vercel também faz um alerta importante: em apps Vite configurados como SPA, **deep linking não funciona automaticamente** sem regra de rewrite [2]. Como o seu site atual é essencialmente uma landing page com calculadora na rota principal, isso **não é obrigatório agora**. Ainda assim, se no futuro você adicionar rotas como `/sobre`, `/faq` ou `/simulador`, crie um arquivo `vercel.json` na raiz do projeto com este conteúdo:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> “If your Vite app is configured to deploy as a Single Page Application (SPA), deep linking won't work out of the box.” — Vercel [2]

### Caminho recomendado B — Publicar na Netlify

A Netlify também suporta Vite oficialmente e informa que, ao detectar um projeto Vite, costuma sugerir `npm run build` e diretório `dist` [3]. No seu caso, novamente, você deve **substituir o diretório sugerido** por `dist/public`.

Conecte o repositório na Netlify e revise estes campos:

| Campo na Netlify | Valor recomendado |
| --- | --- |
| **Base directory** | vazio ou raiz do projeto |
| **Build command** | `pnpm build` |
| **Publish directory** | `dist/public` |
| **Node / package manager** | compatível com `pnpm` |

Depois de salvar, faça o deploy. Se você escolheu publicar a partir de GitHub, os próximos pushes no repositório poderão gerar novas versões do site.

## Etapa 4 — Publicação manual sem GitHub

Se você não quiser usar integração com GitHub, também pode publicar manualmente. Nesse caso, o fluxo é simples: faça `pnpm install`, depois `pnpm build`, e envie **somente o conteúdo de `dist/public`** para o serviço de hospedagem.

Esse modo funciona bem em hospedagens tradicionais com upload por painel, FTP, cPanel ou armazenamento estático. O erro mais comum aqui é enviar a pasta errada. Não envie apenas o diretório raiz do projeto e não publique `dist/index.js`, porque esse arquivo não é a versão estática do site. O que precisa ir ao ar é o frontend dentro de `dist/public`.

## Etapa 5 — Revise um detalhe opcional antes do deploy externo

O projeto atual foi criado dentro de um template do Manus e o build produzido inclui arquivos auxiliares ligados a esse ambiente. Para uma migração rápida, isso não bloqueia a publicação do site. Ainda assim, se você quiser deixar o projeto mais limpo para longo prazo, vale fazer uma revisão posterior do `client/index.html` e dos artefatos auxiliares gerados no build, especialmente se quiser simplificar o projeto para manutenção 100% independente.

Em outras palavras, o caminho mais prático é: **publique primeiro e limpe depois**. Para este site específico, isso tende a ser mais eficiente do que refatorar antes da primeira publicação externa.

## Checklist de publicação

| Verificação | O que confirmar |
| --- | --- |
| Build local | `pnpm build` termina sem erro |
| Pasta correta | você configurou `dist/public` como saída publicada |
| Teste visual | o hero, a calculadora e a tabela aparecem normalmente |
| Assets | CSS e JS carregam sem erro 404 |
| Domínio | a plataforma gerou URL pública e o site abre fora do preview |

## Problemas comuns e correções rápidas

| Problema | Causa provável | Correção |
| --- | --- | --- |
| Página em branco | Diretório publicado errado | Troque de `dist` para `dist/public` |
| Estilos quebrados | `assets/` não foi enviado corretamente | Refaça o build e publique a pasta completa |
| Erro de comando no deploy | Plataforma usou npm em vez de pnpm | Defina `pnpm install` e `pnpm build` manualmente |
| Rota interna 404 | Falta de rewrite SPA | Na Vercel, adicione `vercel.json` com rewrite para `index.html` [2] |

## Recomendação final

Se você quer o caminho mais estável e fácil de manter, minha recomendação é esta: **exporte para GitHub, publique na Vercel ou na Netlify e configure explicitamente `dist/public` como diretório de saída**. Isso respeita a estrutura real do seu projeto e evita o erro mais comum dessa migração, que é assumir que o diretório final será `dist` puro como em um Vite mais simples.

Se quiser, no próximo passo eu também posso te entregar um **guia específico para Vercel** ou um **guia específico para Netlify**, já no formato “clique aqui, depois aqui”, com as telas e os valores exatos para preencher.

## Referências

[1]: https://vite.dev/guide/build "Vite — Building for Production"
[2]: https://vercel.com/docs/frameworks/frontend/vite "Vercel — Vite on Vercel"
[3]: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/ "Netlify Docs — Vite on Netlify"
