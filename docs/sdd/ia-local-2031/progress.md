# Progresso: IA local em 2031

CURRENT OBJECTIVE: primeira apresentação do projeto em 26/11 (8h às 10h) com o Bichos; evoluir até a apresentação final de 08/12.
CURRENT PHASE: BICHOS PUBLICADO.
CURRENT BRANCH: master (este repositório não usa `develop`).

## Calendário (mudança do professor via WhatsApp, não refletida no site em 26/11)
- Primeira apresentação do projeto: 26/11, 8h às 10h.
- Apresentação final: 08/12. Professor indisponível na semana anterior.
- REGISTRO.md: o site ainda diz 03/12 23h59. Reconfirmar com o professor.

## Projeto atual: Bichos
- No ar: https://bichos.lab.mateuseap.com (homelab PRs #290 a #294, pin `2aeb049`): tela de batalha com HP, desafio com E, torneio de 10 min, quem decide cada golpe aparece na tela.
- Código: `movimento-3/bichos/`. README com ideia, pergunta, tecnologia e histórico.
- Cada pessoa choca um bicho, anda com ele na praça (vila da Testemunha refeita de dia) e ensina coisas a ele. A mente do bicho é Qwen2.5 1.5B local (WebLLM); a memória fica só no navegador. Quando dois bichos se encontram, lutam sozinhos; o dono só grita dicas. Placar de vitórias.
- Pergunta: quando a sua IA age por você num espaço compartilhado, com o que aprendeu de você, o que ela faz ainda é você? (efeito e6 do mapa).
- Verificado ao vivo em 26/11 ~06h com 2 navegadores: chocar, ensinar, encontro, batalha automática, grito, placar, sem erros JS.
- NÃO verificado: IA local de verdade (testes no modo sem WebGPU). Na demo, deixar "Usar a IA" desmarcado se o PC não tiver sido testado.
- Limitação: o primeiro par de bichos já luta no spawn se nascerem colados.

## Testes da madrugada de 25 a 26/11 (descartados, citar na apresentação)
- Forja-Mundo (sandbox 2D de itens): estava em forja-mundo.lab, removido em 26/11.
- Faz Aí (sandbox 3D com física): estava em faz-ai.lab, removido em 26/11.
- Forja Arena (FPS 3D, base Yuka): só local, branch `feature/forja-arena`.
- Atalho Impossível (tabuleiro): só local, branch `feature/atalho-impossivel`.
- Invoca (cartas contra chefão, arte gerada na nuvem): só local, branch `feature/invoca` + stash.
- Motivo geral: 3D caro e feio no prazo; jogos sem a IA local como personagem perdiam a pergunta.

## Experimento anterior: A Testemunha
- No ar: https://testemunha.lab.mateuseap.com. Teste com a turma em 17/11, pelo Meet, com cerca de 5 pessoas, cerca de 4 com IA.
- O JSON do teste (`~/Downloads/testemunha-aula-2026-11-17T0857.json`) só tem a entrada do Mateus e 3 eventos. O REGISTRO.md depende das lembranças do usuário.

## EXACT NEXT ACTION
Apresentar em 26/11 com https://bichos.lab.mateuseap.com (README como roteiro). Depois: escrever `movimento-3/experimento/REGISTRO.md` com o relato do teste de 17/11 e testar a IA local do Bichos num PC com WebGPU.
