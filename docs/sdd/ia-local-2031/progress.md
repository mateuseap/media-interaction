# Progresso: IA local em 2031

CURRENT OBJECTIVE: apresentar o primeiro entregável do projeto Forja-Mundo em 26/11 e evoluí-lo até a apresentação final de 08/12.
CURRENT PHASE: PRIMEIRO ENTREGÁVEL PUBLICADO.
CURRENT BRANCH: master.
BASE BRANCH: master (este repositório não usa `develop`).

COMPLETED:
- Movimento 2: documento, deck, roteiro e validador. Apresentação em 08/10.
- Movimento 3, ideias v1 (14/10) e v2 (19/10). Link salvo no site em 14/10 (`ideias_url`).
- A Testemunha construída e publicada em 17/11. Teste remoto realizado pelo Meet com cerca de 5 pessoas, das quais cerca de 4 usaram IA.
- Primeiro entregável do projeto Forja-Mundo construído e publicado em 26/11:
  - jogo multiplayer em `movimento-3/forja-mundo/`;
  - jogadores criam itens por IA local ou por gerador procedural imediato;
  - itens caem no mundo compartilhado e criam biomas visuais;
  - jogadores recolhem itens e fundem dois em uma terceira invenção;
  - README com ideia, pergunta, tecnologia, instruções e próximos passos;
  - deck de 7 slides em `movimento-3/forja-mundo/slides.html`.
- Código do projeto no commit `703b4a0a35f210a8c237e7fa91f41bf9184826d7`.
- Deploy no homelab pelos PRs #284 (`develop`) e #285 (`main`).

TESTS PASSED:
- Build do bundle com esbuild.
- Teste local com 3 navegadores: entrada, renderização, criação procedural, item na mochila e sincronização MQTT entre todos.
- Teste de fusão: dois itens selecionados geraram um terceiro item.
- Teste ao vivo com 2 navegadores: item criado por um jogador apareceu no registro do outro; nenhum erro JavaScript.
- Links ao vivo retornaram HTTP 200:
  - https://testemunha.lab.mateuseap.com/
  - https://testemunha.lab.mateuseap.com/slides.html

DECISIONS MADE:
- Projeto e experimento podem ser a mesma linha, mas o projeto final não precisa ficar preso ao mistério da Testemunha.
- Primeiro entregável prioriza criatividade coletiva e entrada imediata: "entrem, inventem coisas e vejam o mundo aparecer".
- Direção escolhida: geração como verbo dentro do jogo, não conteúdo preparado antes da partida.
- Base técnica reaproveitada da Testemunha: Phaser, PixelHub, WebLLM, Qwen2.5 1.5B, MQTT e deploy estático.
- Modo procedural existe para quem não tem WebGPU e para demos sem esperar o download do modelo.
- Pergunta atual: quando cada pessoa puder gerar partes de um jogo no próprio aparelho, quem passa a construir o mundo: quem desenvolveu o jogo, a IA ou os jogadores?

OPEN RISKS:
- Fluxo com WebLLM não foi retestado de ponta a ponta nesta madrugada; o mesmo carregamento já usado na Testemunha foi reaproveitado.
- Primeiro download do modelo local tem cerca de 1 GB. Para demo imediata, desmarcar "Usar IA local neste aparelho".
- Broker MQTT é público. Não inserir dados pessoais.
- Poderes dos itens são descrições nesta primeira versão; ainda não alteram mecanicamente o jogo.
- O arquivo do teste de 17/11 (`/home/mateuseap/Downloads/testemunha-aula-2026-11-17T0857.json`) só registra Mateus, Dona Lurdes e 3 eventos. Não contém sessão completa, votos ou revelação.

DEADLINES (mudança informada pelo professor via WhatsApp):
- Primeira apresentação do projeto: 26/11, entre 8h e 10h.
- Professor indisponível na semana seguinte.
- Apresentação final: 08/12.
- O site da disciplina ainda não refletia essas mudanças em 26/11 à 00h.
- Prazo de `REGISTRO.md` no site: 03/12 23h59, ainda não reconfirmado após a mudança pelo WhatsApp.

DELIVERY STATE:
- Repositório da disciplina: commit em `master` e enviado ao GitHub.
- Site da disciplina: não alterado, conforme regra do usuário.
- Homelab PR para `develop`: #284, merged.
- Homelab release PR para `main`: #285, merged.
- Deployment: saudável e verificado ao vivo.
- Branch de projeto: integrada e removida localmente pelo merge fast-forward; branch remota ainda pode ser removida.
- Branch de homelab: PR merged; limpeza pendente.

REMAINING:
- Apresentar Forja-Mundo em 26/11.
- Recolher reação da turma e escolher evolução para 08/12.
- Reconstruir o teste de 17/11 a partir das lembranças do usuário e escrever `movimento-3/experimento/REGISTRO.md`.
- Confirmar se o prazo de 03/12 mudou junto com a apresentação final.
- Dar efeitos reais aos poderes ou adicionar pequenas missões/criaturas, conforme reação ao primeiro entregável.

EXACT NEXT ACTION: abrir `https://testemunha.lab.mateuseap.com/slides.html`, apresentar os 7 slides e então abrir `https://testemunha.lab.mateuseap.com/?sala=aula`; para entrada instantânea, desmarcar "Usar IA local neste aparelho".
