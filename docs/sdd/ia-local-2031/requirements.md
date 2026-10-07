# Requisitos: IA local em 2031

## Objetivo

Criar documento de tendência e apresentação de discussão para tema 16 da disciplina CIN0055.

## Requisitos funcionais

- RF-01: O documento deve conter frontmatter canônico e 12 seções com títulos literais exigidos.
- RF-02: O documento deve mapear efeitos de 1ª, 2ª e 3ª ordem sob cada disrupção-raiz.
- RF-03: Toda fonte citada deve responder HTTP 200 na validação final.
- RF-04: APIs de nuvem, self-hosting clássico e quantização comum devem aparecer somente como contexto maduro.
- RF-05: O contra-mapa deve expor viés, teste de viés e falsificador concreto.
- RF-06: O experimento deve isolar origem da inferência, local ou nuvem, mantendo tarefa e interface constantes.
- RF-07: O deck deve abrir direto pelo navegador e navegar por teclado, clique, hash e tela cheia.
- RF-08: O deck deve citar fonte e data para cada efeito central.
- RF-09: Nenhum envio ao site da disciplina pode ocorrer sem confirmação explícita do usuário.

## Aceite

- AC-01: Frontmatter e roda passam parse YAML.
- AC-02: Documento contém exatamente 12 títulos `## ` canônicos.
- AC-03: Efeitos da roda usam campos e vocabulários permitidos.
- AC-04: Validação HTTP confirma todas URLs citadas.
- AC-05: Navegação do deck funciona da primeira à última tela em arquivo local.
