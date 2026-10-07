# IA local em 2031: documento e apresentação

## Objetivo

Entregar o documento de tendência do tema 16, `IA local: no dispositivo e no navegador`, e uma apresentação HTML para discussão em sala. O público do mapa é desenvolvedores e arquitetos de produto, com recorte global e horizonte 2031.

## Escopo

- Produzir `activity-03/tendencia-ia-local.md` no formato canônico da disciplina.
- Produzir `activity-03/presentation/index.html` sem build ou dependências de execução.
- Validar fontes por resposta HTTP 200 antes de citá-las.
- Incluir fontes primárias para efeitos apresentados.
- Fazer triagem explícita: API de nuvem, self-hosting clássico e quantização convencional são contexto maduro, não disrupções-raiz.
- Preservar dados brutos, descartes e incertezas na seção 12.
- Incluir roteiro de réplicas aos ataques previstos ao mapa, no deck.

## Fora de escopo

- Submeter documento, feedback, ideia ou experimento no site da disciplina sem confirmação explícita do usuário.
- Construir demonstração executável de IA local. O deck descreve experimento controlado.
- Alegar paridade entre modelos locais e modelos de fronteira sem fonte que compare tarefa equivalente.

## Disrupções a investigar

1. Inferência ternária eficiente em hardware de consumo.
2. Modelo de fundação como capacidade governada pelo sistema operacional.
3. Inferência de modelo no navegador via WebGPU, sem back-end de IA.

Todas exigem evidência atual antes de constarem no documento. A análise deve separar possibilidade técnica de adoção ampla.

## Documento

O documento terá frontmatter com todos os campos canônicos e doze seções literais. A roda terá chave raiz `roda`, entrada por `disrupcao`, e árvore recursiva `efeitos` com IDs hierárquicos, ordem, sinal, ano único e confiança.

Seção 7 terá contra-mapa e falsificador concreto. Seção 8 registrará apenas erros verificáveis do processo. Seção 9 usará pretérito para cenários de 2031. Seção 10 define experimento cego, comparando local e nuvem em uma tarefa fixa e mantendo somente origem de inferência como variável manipulada.

## Apresentação

O deck terá 12 a 14 slides, palco fixo de 1600x900, navegação por setas, espaço, PageUp/PageDown, clique, tela cheia e hash. Usará CSS puro, paleta CIn, tipografia Figtree e JetBrains Mono, animação reduzível por `prefers-reduced-motion`, contador e progresso.

Narrativa: ruptura, estado atual, três disrupções, três cascatas, contra-mapa, experimento, respostas a ataques do professor, duas perguntas para turma e encerramento.

## Verificação

- Parser YAML do frontmatter e da roda.
- Exatamente 12 títulos de seção `## ` canônicos.
- Todos links de fontes retornam HTTP 200.
- Checagem estrutural do HTML: um `main.deck`, slides, controles e JavaScript de navegação.
- Abrir o HTML localmente e testar navegação da primeira à última tela, hash e tela cheia.
- Revisão independente do diff antes de integrar.

## Critérios de aceite

- Documento parseável e com 12 títulos canônicos.
- Roda válida com três ordens e efeito afirmativo por nó.
- Nenhuma fonte não verificada.
- Cada efeito mostrado no deck tem fonte e data.
- Contra-mapa declara viés, teste aplicado e falsificador.
- Experimento mede uma variável manipulada: origem local ou nuvem.
- Deck abre como arquivo e navega sem build.
