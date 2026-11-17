# Progresso: IA local em 2031

CURRENT OBJECTIVE: movimento 3, experimento "A Vila nos Computadores" (troca do fantasma em 17/11).
CURRENT PHASE: TESTE (17/11 de manhã, Meet). Vila publicada, só teste de fumaça feito.
CURRENT BRANCH: master
BASE BRANCH: master (remoto não tem develop).

COMPLETED:
- Movimento 2: documento, deck, roteiro e validador. Apresentação em 08/10.
- Movimento 3, ideias v1 (14/10) e v2 (19/10). Link salvo no site em 14/10 (`ideias_url`).
- Movimento 3, experimento (16/11): `movimento-3/experimento/index.html` e `README.md`.
  - Jogo de página única. Um fantasma (Rui, morto em 1987) entra na chamada do Meet; a turma descobre como ele morreu.
  - Modelo Qwen2.5 3B Instruct no navegador via WebLLM/WebGPU; versão leve 1.5B opcional; variante f16 ou f32 conforme a GPU.
  - O código libera um fragmento a cada 2 perguntas, detecta grosseria e decide o final; o modelo só interpreta o personagem.
  - Voz pelo navegador; botão "Registro" baixa a sessão em JSON.
- Publicado no homelab: https://fantasma.lab.mateuseap.com (homelab PRs #262 e #263, pin atualizado em #264 e #265). TLS Let's Encrypt ok.

TESTS PASSED:
- Sessão completa jogada por script no link publicado, nos modelos 3B e 1.5B: segredo protegido, pistas no ritmo, reação à grosseria, negação de ser IA, despedida e sumiço.
- Screenshots da tela inicial, do fantasma e do estado magoado.

DECISIONS MADE:
- Ideias v1 descartadas por medirem desempenho; ideia do guarda descartada pelo usuário por ser pouco interessante.
- Direção final inspirada no experimento da bvga: personagem num mundo compartilhado, turma inteira junta, resultado imprevisível.
- Hospedagem no homelab por preferência do usuário (subdomínio `.lab.mateuseap.com`), no padrão estático do `fj-presentation`.
- Modelo 3B como padrão: português muito melhor que o 1.5B nos testes.

OPEN RISKS:
- Primeiro download de cerca de 1,7 GB: pedir para abrir o link na véspera.
- O reconhecimento de voz do Chrome envia áudio ao Google; alternativa é escrever na caixa.
- O enunciado fala em teste presencial; o do meap é online pelo Meet (confirmar com o professor, se ainda não confirmado).

DEADLINES:
- Experimento + README: 16/11 23h59.
- Teste: 17/11 (Meet).
- REGISTRO.md: 30/11 23h59.
- Apresentação final: 01/12.

VILA (17/11, madrugada):
- `movimento-3/experimento/index.html`: cada aluno traz um morador; mente local (Qwen2.5 1.5B, ou 3B) no navegador do dono; falas trocadas por broker MQTT público `broker.emqx.io`; sussurros, eventos, dormir. Fantasma movido para `fantasma.html`.
- Publicada em https://fantasma.lab.mateuseap.com (homelab PRs #266 e #267, pin 64bf07f).
- Verificado: teste de fumaça headless (entrar como espírito, evento aparece na praça). NÃO verificado: dois moradores com mente conversando entre si (teste com 3 navegadores não chegou a rodar).
- Linux: Chrome precisa de `chrome://flags/#enable-unsafe-webgpu`.

SITE DA DISCIPLINA: `exp_url` salvo em 16/11 23h27 com autorização do usuário ("submete algo que podemos ir modificando"):
https://github.com/mateuseap/media-interaction/tree/master/movimento-3/experimento
EXACT NEXT ACTION: rodar o teste de 17/11; depois escrever `movimento-3/experimento/REGISTRO.md` (até 03/12, prazo novo do site).
