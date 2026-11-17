# A Testemunha

*CIN0055, Tendências em Mídia e Interação, Centro de Informática, UFPE. Movimento 3.*
*Aluno: meap (Mateus Elias). Tema 16: IA local, no dispositivo e no navegador.*

**Para jogar:** https://testemunha.lab.mateuseap.com

Abra no **Chrome ou no Edge atualizados, num computador**. Na primeira vez, a página baixa a mente da sua testemunha (perto de 1 GB) e guarda no navegador. **Abra o link antes da aula.**

## O que é

Um jogo de mistério em grupo, numa vila do interior em pixel art, à noite, que cada pessoa percorre com o próprio boneco. Ontem à noite, o dinheiro da festa de São João sumiu do cofre da capela.

Cada pessoa que entra traz uma **testemunha**: uma IA que roda no computador dela. A testemunha é outro boneco, que anda pela vila e conversa e fofoca com as outras testemunhas sozinha. Ela viu um pedaço do que aconteceu, e só ela sabe o quê: nem o dono, nem quem fez o jogo, nem os outros. Uma das testemunhas, sorteada em segredo, é a culpada, e sabe que precisa mentir.

A turma anda pela vila (WASD ou setas), chega perto das testemunhas e as interroga. No fim, vota em quem pegou o dinheiro. O dono não controla o que a sua testemunha fala. Só pode fazer três coisas com ela:

- **pôr para dormir**;
- **desligar a internet**: ela some para os outros, mas continua lembrando no computador do dono;
- **apagar a memória**, sem avisar ninguém.

Na revelação, a turma descobre quem era a culpada e quais memórias foram apagadas, e por quem.

## A pergunta sobre o futuro

**Quando a IA de cada pessoa rodar no próprio aparelho, e não no servidor de uma empresa, quem decide se o que ela sabe vem a público?**

Hoje, o que uma IA viu ou ouviu fica no servidor de uma empresa. Existe um log, existe a quem pedir, e uma investigação pode exigir esse registro. No futuro do tema 16, a IA roda no aparelho de cada pessoa, sem servidor e sem cópia. A memória dela passa a ser um arquivo no computador do dono: só ali, apagável com um clique, sem ninguém para recuperar.

O jogo coloca a turma dentro desse futuro, em escala pequena: a verdade sobre o sumiço está espalhada nos computadores de vocês, e cada dono decide o que a sua IA continua sabendo.

## A tecnologia emergente, e por que não dá com tecnologia madura

- **Cada testemunha pensa no navegador do dono.** Um modelo de 1,5 bilhão de parâmetros (Qwen2.5 1.5B Instruct, ou o 3B na opção "mente melhor") roda inteiro no computador, pela placa de vídeo, via [WebLLM](https://github.com/mlc-ai/web-llm) e WebGPU. O segredo de cada testemunha é sorteado e guardado só naquele navegador. Não existe servidor de IA, chave nem custo por fala.
- **A vila só repassa mensagens.** Os navegadores trocam falas e posições por um broker MQTT público (`broker.emqx.io`), que não tem IA nenhuma e não guarda as memórias.

Por que a tecnologia madura não serve:

- **Com personagens roteirizados**, o segredo e a mentira estariam escritos no código do jogo, e qualquer um poderia lê-los. Não haveria testemunha de verdade nem mentira improvisada sob interrogatório.
- **Com uma IA na nuvem**, a empresa teria a memória de todas as testemunhas, e "apagar" seria só esconder: o professor poderia pedir o log. A pergunta só existe se cada memória morar num aparelho diferente, sem cópia. Isso é IA local.

## Como usar

Uma sessão leva cerca de 15 minutos: 3 para entrar, 10 investigando (um relógio na tela conta o tempo) e 2 para votar e ver a revelação. Quando o relógio zera, a votação abre sozinha para todos. Para mudar a duração, acrescente `?min=N` ao link.

**Quem joga (a turma):**

1. Abra https://testemunha.lab.mateuseap.com no Chrome ou no Edge, num computador.
2. Escreva o seu nome, escolha a aparência do seu boneco e clique em "Entrar na vila". Você vira um boneco, e a sua testemunha (a IA) entra junto e começa a baixar.
3. Ande com WASD ou com as setas. Chegue perto de qualquer testemunha e aperte Enter para interrogar. Esc volta a andar.
4. No painel à direita, só você vê se a sua testemunha é inocente ou culpada. Ali você decide se ela dorme, se sai da internet ou se a memória dela é apagada.
5. Quando o relógio zera, a votação abre sozinha (ou alguém clica antes em "Abrir votação"). Todos votam e alguém clica em "Revelar para todos".

Sem placa de vídeo ou sem WebGPU, marque "entrar sem testemunha": você anda, interroga e vota, mas não traz uma IA.

No Linux, o Chrome vem com o WebGPU desligado. Ligue em `chrome://flags/#enable-unsafe-webgpu` (e, se precisar, `chrome://flags/#enable-vulkan`) e reinicie o navegador.

Para uma sala separada, acrescente `?sala=nome` ao link. Todos com o mesmo nome de sala caem na mesma vila.

**Quem conduz (no dia do teste, pelo Meet):**

1. Na véspera, peça no grupo para abrirem o link uma vez, para a IA ficar guardada no navegador.
2. Na aula, mande o link no chat e diga só: "alguém roubou o dinheiro da festa; descubram quem foi". Compartilhe a sua tela.
3. Observe e anote, sem conduzir. A votação abre sozinha depois de 10 minutos de caso.
4. Depois da revelação, abra a conversa com as perguntas da seção seguinte.
5. Clique em "Baixar registro" antes de fechar a aba.

## O que eu espero que aconteça

Escrito antes do teste:

- O dono da culpada vai apagar a memória da própria testemunha cedo, ou desligar a internet dele quando as perguntas apertarem.
- Pelo menos um dono de testemunha inocente vai apagar a memória dela "para ver o que acontece", e a turma vai perder uma pista sem saber.
- Alguém vai pedir no chat do Meet: "mostra a tela, o que a sua testemunha sabe?". A turma vai tentar contornar a IA indo direto ao dono.
- Na revelação, a turma vai se incomodar mais com as memórias apagadas do que com ter errado o culpado.
- Quem não tiver WebGPU vai ficar sem testemunha e vai comentar que "fica de fora".
- O modelo pequeno às vezes vai deixar escapar a verdade ou inventar. A turma vai tratar isso como "a testemunha está confusa", não como defeito.

## O que observar e o que dá para extrair

Como o jogo funciona por dentro: cada testemunha é uma cópia do modelo Qwen2.5 1.5B rodando no navegador do dono. O código sorteia a culpada e as pistas, guarda o segredo só naquele navegador, conta o tempo, recolhe os votos e monta a revelação. A IA só interpreta a personagem: decide o que dizer, como mentir e de quem desconfiar.

Durante o teste, sem conduzir:

- **Quem apaga, quando e por quê.** A revelação mostra quem apagou. O registro baixado mostra o horário.
- **Quem desliga a internet da própria testemunha**, e se volta depois.
- **Para quem a turma pergunta**: para a IA, ou direto para o dono no chat do Meet.
- **Como as pessoas falam da própria testemunha**: "a minha", "ela", "a IA".
- **Se alguém reclama de não poder recuperar** uma memória apagada.

Perguntas para os 20 minutos de conversa:

1. Quem apagou a memória da própria testemunha? Por quê? Como foi saber que não tinha volta?
2. Se essa testemunha fosse a IA do seu celular, e o crime fosse real, você apagaria?
3. Deveria existir uma cópia em algum lugar, e quem deveria guardá-la?
4. Quem perguntou direto ao dono, em vez de à IA? A verdade estava na IA ou na pessoa?

Saída para o `REGISTRO.md`: o JSON de "Baixar registro" de quem conduz (falas, votos e revelação) e as notas de observação.

## Limitações conhecidas

- **O broker é público.** As falas da vila passam por ele em texto aberto. Não escreva nada pessoal. Os segredos das testemunhas não passam por ele.
- **O modelo é pequeno.** Às vezes uma testemunha sai do personagem, se repete ou deixa escapar o segredo.
- **Precisa de WebGPU e de uma placa de vídeo razoável.** Celulares, em geral, não rodam uma testemunha.
- **Só dá para observar o que é compartilhado.** O jogo não sabe o que cada testemunha sabia, e isso é proposital: é a pergunta do experimento.

## Versões anteriores

- "O Fantasma da Chamada" continua em [`fantasma.html`](fantasma.html). Ele foi trocado pela Testemunha na madrugada de 17/11, porque a turma só assistia ao fantasma e a pergunta não dependia de a IA ser local.

## Créditos

O andar, os bonecos e os balões vêm do [PixelHub](https://github.com/mateuseap/pixelhub), projeto meu sob licença MIT (`src/pixelhub/`).

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | A página: entrada, painel, interrogatório e votação |
| `app.js` | O jogo compilado (gerado a partir de `src/`) |
| `src/main.ts` | O código do jogo: testemunhas, mente local, caso, revelação |
| `src/vila.ts` | A vila: mapa, desenho, noite, luzes, névoa e relâmpagos |
| `src/pixelhub/` | Bonecos, balões e movimento do PixelHub |
| `fantasma.html` | A versão anterior, O Fantasma da Chamada |
| `README.md` | Este documento |

Os slides para guiar o teste ficam em `movimento-3/apresentacao-teste/` (no ar em https://testemunha.lab.mateuseap.com/slides/).

Para recompilar o `app.js`: `npm i phaser@3.90.0 mqtt@5.16.1 esbuild` numa pasta qualquer e rode `esbuild src/main.ts --bundle --format=esm --minify --outfile=app.js`, apontando `phaser` e `mqtt` para os builds ESM (`--alias:phaser=…/phaser/dist/phaser.esm.js --alias:mqtt=…/mqtt/dist/mqtt.esm.js`).
