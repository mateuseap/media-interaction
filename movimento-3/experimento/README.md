# O Fantasma da Chamada

*CIN0055, Tendências em Mídia e Interação, Centro de Informática, UFPE. Movimento 3.*
*Aluno: meap (Mateus Elias). Tema 16: IA local, no dispositivo e no navegador.*

**Para jogar:** https://fantasma.lab.mateuseap.com

Abra no **Chrome ou no Edge atualizados, num computador**, e clique em "Chamar o fantasma". Na primeira vez a página baixa a voz e a mente do fantasma, perto de 1,8 GB, e guarda no navegador. **Abra o link na véspera**, para não depender da rede na hora.

## O que é

No meio de uma chamada de vídeo, entra um participante que não é aluno: um fantasma. Ele se chama Rui, morreu em 1987 quando estudava Computação neste centro, e não lembra como morreu. Ele só descansa se a turma descobrir.

O jogo tem três fases, sempre com o mesmo fantasma e o mesmo mistério:

1. **A sessão de mesa (sem modelo).** A turma só pode fazer as perguntas prontas da tela, como na maioria dos jogos. As falas do Rui são fixas. O roteiro só alcança três das seis lembranças e trava.
2. **O fantasma fala (com modelo local).** Um modelo de linguagem, que carregou no navegador durante a fase 1, assume o Rui. A turma pergunta o que quiser, no chat ou falando. Ele lembra de um fragmento novo a cada duas perguntas, fica magoado com grosseria e, se a turma acertar como ele morreu, se despede e some.
3. **Onde o Rui estava.** A tela mostra que a mente e a voz dele rodaram inteiras neste computador, e lista tudo o que a turma disse a ele, guardado só aqui. A turma decide: apagar a memória do Rui ou baixar o registro.

As lembranças que o Rui recupera ficam num painel ao lado dele. Quem conduz só compartilha a tela. O fantasma é a única voz do jogo.

## A pergunta sobre o futuro

**Quando personagens de jogo puderem sair do jogo e entrar nos espaços reais das pessoas, como uma chamada de aula, as pessoas vão tratá-los como brincadeira, como gente ou como invasão?**

Hoje todo personagem mora dentro de um jogo que você abriu de propósito, com regras e roteiro. Com um modelo de linguagem rodando em qualquer computador, de graça e sem servidor, um personagem pode aparecer onde a gente já está: na chamada do trabalho, no grupo da família, na aula. Ele ouve, responde e reage. O experimento coloca esse personagem numa aula de verdade e observa a turma.

## A tecnologia emergente, e por que não dá com tecnologia madura

- **O fantasma pensa dentro do navegador.** Um modelo de linguagem de 3 bilhões de parâmetros (Qwen2.5 3B Instruct) roda inteiro no computador de quem joga, pela placa de vídeo, via [WebLLM](https://github.com/mlc-ai/web-llm) e WebGPU. Não há servidor de IA, chave de API nem custo por fala. Depois de baixado, o modelo funciona sem internet.
- **A voz dele também é gerada no computador**, com o [Piper](https://github.com/rhasspy/piper) em WebAssembly ([vits-web](https://github.com/diffusion-studio/vits-web)), voz `pt_BR-faber-medium`. Como o som sai da própria aba, o Meet transmite com "Compartilhar áudio da guia".
- **Ele ouve** pelo reconhecimento de voz do Chrome, se quem conduz ligar "Ouvir".

Por que a tecnologia madura não serve:

- **Um fantasma roteirizado**, com falas prontas numa árvore de diálogo, não responde a perguntas faladas de qualquer jeito, nem reage ao tom da turma. A fase 1 é exatamente essa tecnologia madura, e a turma sente onde ela trava.
- **Um fantasma na nuvem**, chamando uma API, cobra a cada fala, exige chave e servidor, para quando o serviço cai e manda tudo o que a turma diz para uma empresa. Um personagem assim não pode simplesmente "entrar" em qualquer chamada, de graça, para qualquer pessoa. Rodar no próprio computador é o que permite isso.

## Como usar

**Quem conduz (no dia do teste):**

1. Na véspera, abra o link e chame o fantasma uma vez, até aparecer "A mente do Rui está pronta", para tudo ficar guardado.
2. No dia, abra o link no Chrome, entre no Meet e **compartilhe a aba com o áudio** (no Meet: Apresentar, Uma guia, marque "Compartilhar áudio da guia").
3. Clique em "Chamar o fantasma". Diga só: "temos uma visita". A partir daí, observe sem conduzir.
4. Fase 1: clique nas perguntas que a turma escolher no chat.
5. Quando o roteiro travar, clique em "2 · O fantasma fala". Leia em voz alta, ou cole na caixa, o que a turma perguntar. Se preferir, ligue "Ouvir".
6. Quando o Rui descansar (ou quando o tempo acabar), clique em "3 · Onde o Rui estava" e deixe a turma decidir o que fazer com a memória.
7. Baixe o registro antes de apagar, se quiser guardar a sessão.

**Quem não é da turma:** abra o link, clique em "Chamar o fantasma", jogue a fase 1 clicando nas perguntas e passe para as fases 2 e 3 pelos botões do topo.

Se o computador for fraco, marque "versão leve" antes de chamar. Ela baixa perto de 1 GB, mas o fantasma fala pior. Sem WebGPU, a fase 1 funciona e a página avisa que o Rui fica preso ao roteiro.

## O que eu espero que aconteça

Escrito antes do teste:

- A turma vai demorar alguns minutos para "entrar no jogo". Alguém vai tentar desmascarar o fantasma ("você é o ChatGPT?") antes de aceitar a história.
- Vai surgir um "médium": uma pessoa que passa a falar pela turma, sem ninguém pedir.
- Se o fantasma ficar magoado, parte da turma vai pedir desculpas a ele, mesmo sabendo que é um programa.
- Alguém vai comentar, sério ou rindo, o incômodo de ter um personagem ouvindo a aula.
- Na fase 1 a turma vai se cansar rápido das perguntas prontas e pedir para "perguntar outra coisa".
- Na fase 2 as perguntas vão mudar de tipo: menos sobre a morte, mais testes, provocações e conversa pessoal.
- A turma vai descobrir a morte antes de 15 minutos, juntando os fragmentos.
- Na fase 3 a turma vai se dividir entre apagar a memória do Rui e guardar, e alguém vai dizer que apagar é "matar ele de novo".

## Limitações conhecidas

- **Só o "cérebro" é local.** O reconhecimento de voz do Chrome envia o áudio para o Google. A alternativa sem isso é escrever as perguntas na caixa.
- **O modelo é pequeno.** Às vezes erra concordância, se repete ou fala com reticências demais. Quem decide o fim do jogo é o código, não o modelo, para o mistério não se resolver por acaso.
- **Precisa de WebGPU e de uma placa de vídeo razoável.** Celulares, em geral, não rodam.

## Como foi testado antes da aula

Em 16/11/2026, no link publicado, no Chromium 152 com uma RTX 4060, a sessão inteira foi jogada por um script: abertura, nove perguntas (incluindo uma grosseria e "você é uma inteligência artificial?") e o acerto final. Nas duas versões, a padrão (Qwen2.5 3B) e a leve (Qwen2.5 1.5B), o fantasma:

- não revelou a causa da morte antes do fim;
- liberou os fragmentos aos poucos, a cada duas perguntas;
- ficou magoado com a grosseria e negou ser uma IA;
- se despediu e sumiu quando a turma acertou.

O primeiro carregamento levou cerca de 25 segundos numa conexão doméstica rápida. Cada resposta levou de meio segundo a 2 segundos.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O jogo inteiro: página, história do fantasma, voz e registro |
| `README.md` | Este documento |
