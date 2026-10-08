# Progresso: IA local em 2031

CURRENT OBJECTIVE: entregar documento de tendência e deck de discussão sobre IA local.
CURRENT PHASE: ENTREGA, deck visual em revisão.
CURRENT BRANCH: feature/ia-local-presentation
BASE BRANCH: master (remoto não tem develop).

COMPLETED:
- `activity-03/tendencia-ia-local.md`: frontmatter canônico, 12 seções literais, 3 disrupções-raiz, 18 efeitos (6 por ordem), 9 fontes com HTTP 200 direto, triagem de maturidade, rodada adversarial, falsificadores, viés declarado e testado, cenários no pretérito, experimento de variável única.
- `activity-03/presentation/index.html`: 18 slides com rodas SVG, linha do tempo, barras do BitNet, requisitos do Chrome, cenários e votação A/B ao vivo;, vanilla, palco 1600x900, setas, espaço, PageUp/PageDown, Home/End, clique, F, hash e hashchange, progresso, prefers-reduced-motion.
- `activity-03/test_tendencia_ia_local.py`: valida documento, roda, URLs e estrutura do deck; funciona com `python3 -O`.

TESTS PASSED:
- `python3 activity-03/test_tendencia_ia_local.py`: 9 fontes, 18 efeitos, 12 slides.
- Screenshots headless do Chromium dos slides 1, 3, 4, 5, 8, 9 e 10, com hash e fragmentos.

DECISIONS MADE:
- Documento reescrito para 3 disrupções e público da entrevista (desenvolvedores e arquitetos de produto); versão anterior tinha 2 disrupções e público divergente.
- Fonte OpenAI de rate limits descartada por HTTP 301.
- Validador exige PyYAML.

BLOCKERS: nenhum técnico.
PR TO DEVELOP: não aplicável; PR para master aberto, não mergeado.
SITE DA DISCIPLINA: nada enviado. Aguarda "pode enviar" do usuário.
EXACT NEXT ACTION: usuário revisar PR do deck visual; merge; enviar link do documento até 07/10 23h59.
