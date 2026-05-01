# Notas de pesquisa para deploy externo

## Vite

A documentação oficial do Vite confirma que, para produção, basta executar `vite build`. O próprio guia afirma que, por padrão, ele usa `<root>/index.html` como ponto de entrada e produz um bundle adequado para ser servido por um serviço de hospedagem estática.

## Vercel

A documentação oficial da Vercel para Vite confirma que projetos Vite podem ser publicados diretamente na plataforma. O material também alerta que, se a aplicação estiver configurada como SPA, o deep linking não funciona automaticamente sem uma regra de rewrite para `index.html`. A própria Vercel fornece um exemplo de `vercel.json` com rewrite global para esse caso.

## Projeto atual

O projeto `markup-motorista-2026` usa `pnpm build` como script principal de produção. O build atual gera arquivos públicos em `dist/public`, incluindo `index.html`, `assets/` e arquivos auxiliares `__manus__/`. O HTML base do projeto ainda inclui uma chamada para analytics via variáveis `VITE_ANALYTICS_ENDPOINT` e `VITE_ANALYTICS_WEBSITE_ID`, o que deve ser ajustado ou removido se o deploy externo não for usar esse analytics.
