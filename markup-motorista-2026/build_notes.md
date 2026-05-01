# Guia de implementação — Markup Motorista 2026

## Filosofia visual escolhida

A interface seguirá o conceito de **neo-brutalismo técnico noturno**, preservando a sensação de ferramenta prática e profissional do site original, mas com composição mais sofisticada, melhor hierarquia, maior respiro visual e um sistema de cartões de resultado mais forte.

## Estrutura da página

A nova home deve ser organizada como uma experiência de página única com cinco momentos visuais e funcionais. O primeiro momento é um hero editorial com contexto econômico de 2026, chamada principal e acesso rápido ao simulador. O segundo momento é o painel de parâmetros, reunindo os campos da calculadora em grupos claros. O terceiro momento é a área de resultados, com destaque imediato para markup por quilômetro e por minuto, separando urbano e intermunicipal. O quarto momento é o detalhamento completo de custos em formato tabular, mas com melhor leitura em desktop e cards resumidos no mobile. O quinto momento é uma seção de interpretação estratégica, explicando como ler o prejuízo, a margem e a comparação com o valor pago nas corridas.

## Conteúdo e dados-base a refletir

As referências econômicas de 2026 devem aparecer de forma textual e editável. O projeto deve mencionar salário mínimo de **R$ 1.621**, IPCA recente de **4,14%** em 12 meses até março de 2026 e gasolina média nacional de **R$ 6,29** por litro no início de 2026. O texto deve deixar claro que os valores são parâmetros iniciais e podem ser ajustados pelo motorista.

## Ativos visuais gerados

### Hero principal

Usar preferencialmente a versão comprimida:

`https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-hero-2026-HXWj87hTbiAVJ44gbTrBG2.webp`

Essa imagem tem fundo escuro e reflexos âmbar e azul, com área útil para texto à esquerda. O texto aplicado sobre ela deve ser claro, com contraste alto.

### Fundo técnico para seções de apoio

Usar preferencialmente a versão comprimida:

`https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-surface-panel-2026-VH4jDpaGauBXjXZfbG8hfz.webp`

A imagem deve aparecer em seções intermediárias, atrás de blocos com opacidade controlada e blur sutil.

### Seção de comparação e leitura estratégica

Usar preferencialmente a versão comprimida:

`https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-comparison-2026-XfUMMG7y65ovsCb2bBCVgJ.webp`

A composição favorece overlays à direita e reforça a ideia de custo versus ganho real.

### Fundo de mobilidade e inteligência operacional

Usar preferencialmente a versão comprimida:

`https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-urban-grid-2026-AP3xmpTcctCiR6WoMuXgXm.webp`

Essa arte funciona em blocos explicativos, faixas de contexto e trechos de fechamento.

## Diretrizes tipográficas

Evitar Inter. A combinação ideal é uma fonte condensada e técnica para títulos, como **Rajdhani**, e uma fonte de leitura para o corpo, como **Manrope**. Títulos podem usar caixa alta de forma controlada em labels e headings curtos. Números e métricas precisam de forte contraste e alinhamento consistente.

## Regras de implementação

Cada arquivo editado deve receber no topo um comentário curto lembrando a filosofia visual aplicada naquele contexto. O layout não deve cair em centralização excessiva. A leitura deve ser guiada por colunas assimétricas, painéis sobrepostos, superfícies escuras, contornos finos e brilho controlado. Quando houver dúvida de composição, a pergunta orientadora é: **isso reforça ou dilui a linguagem de painel técnico noturno?**

## Observações da primeira inspeção visual do preview

A primeira renderização confirma que a direção visual escolhida está consistente. O hero está forte, a tipografia condensada sustenta o caráter técnico e a ambientação noturna mantém a essência do projeto original. Os cartões econômicos de 2026 e o bloco de resultados reforçam bem a proposta de painel operacional.

A implementação principal está funcional e a calculadora apresenta números coerentes com a lógica do site de referência. A leitura da tabela detalhada também foi preservada. Como refinamento final, vale apenas revisar pequenos detalhes de respiro e escala em alguns cartões de KPI para manter a hierarquia visual ainda mais controlada em larguras intermediárias.

## Observações da inspeção intermediária da calculadora

A área principal da calculadora está visualmente sólida. A composição assimétrica entre formulário e painel de resultados funciona bem no desktop, e os blocos de operação, veículo, rodagem e contexto 2026 estão legíveis. Os números calculados permanecem coerentes com a referência original, agora atualizados com gasolina de São Paulo em 2026 e novo valor-base de INSS.

A inspeção mostra também que o resumo lateral está cumprindo seu papel de painel executivo. O refinamento restante é de polimento, não estrutural. A implementação já preserva a essência funcional do site original ao mesmo tempo em que apresenta um acabamento mais maduro.

## Observações da inspeção final do preview

A tabela detalhada preserva o caráter técnico do original e apresenta os valores atualizados sem quebrar a leitura. A seção comparativa da corrida também está funcionando como esperado, com boa separação entre valor por quilômetro, valor por tempo e total necessário pelo markup.

Não foram observadas quebras estruturais relevantes na experiência principal. O resultado já está consistente para entrega inicial, com identidade visual forte, cálculos coerentes e seções de apoio bem integradas à narrativa do site.
