# O Fantasma da Chamada

*CIN0055, Tendências em Mídia e Interação, Centro de Informática, UFPE. Movimento 3.*
*Aluno: meap (Mateus Elias). Tema 16: IA local, no dispositivo e no navegador.*

**Para jogar:** https://fantasma.lab.mateuseap.com

Abra no **Chrome ou no Edge atualizados, num computador**, e clique em "Chamar o fantasma". Na primeira vez a página baixa a mente do fantasma, perto de 1,7 GB, e guarda no navegador. **Abra o link na véspera**, para não depender da rede na hora.

## O que é

No meio de uma chamada de vídeo, entra um participante que não é aluno: um fantasma. Ele se chama Rui, morreu em 1987 quando estudava Computação neste centro, e não lembra como morreu. Ele só descansa se a turma descobrir.

A turma conversa com ele em voz alta ou pelo chat. O fantasma responde falando, com voz e um rosto na tela. Ele lembra de um fragmento novo a cada duas perguntas, fica magoado quando é tratado com grosseria e, se a turma acertar como ele morreu, se despede e some da chamada.

Quem conduz só compartilha a tela. O fantasma é a única voz do jogo.

## A pergunta sobre o futuro

**Quando personagens de jogo puderem sair do jogo e entrar nos espaços reais das pessoas, como uma chamada de aula, as pessoas vão tratá-los como brincadeira, como gente ou como invasão?**

Hoje todo personagem mora dentro de um jogo que você abriu de propósito, com regras e roteiro. Com um modelo de linguagem rodando em qualquer computador, de graça e sem servidor, um personagem pode aparecer onde a gente já está: na chamada do trabalho, no grupo da família, na aula. Ele ouve, responde e reage. O experimento coloca esse personagem numa aula de verdade e observa a turma.

## A tecnologia emergente, e por que não dá com tecnologia madura

- **O fantasma pensa dentro do navegador.** Um modelo de linguagem de 3 bilhões de parâmetros (Qwen2.5 3B Instruct) roda inteiro no computador de quem joga, pela placa de vídeo, via [WebLLM](https://github.com/mlc-ai/web-llm) e WebGPU. Não há servidor de IA, chave de API nem custo por fala. Depois de baixado, o modelo funciona sem internet.
- **Ele fala e ouve pelo próprio navegador**, com a síntese e o reconhecimento de voz do Chrome.

Por que a tecnologia madura não serve:

- **Um fantasma roteirizado**, com falas prontas numa árvore de diálogo, não responde a perguntas faladas de qualquer jeito, nem reage ao tom da turma. A experiência de um personagem que "participa" da chamada não existe com roteiro.
- **Um fantasma na nuvem**, chamando uma API, cobra a cada fala, exige chave e servidor, para quando o serviço cai e manda tudo o que a turma diz para uma empresa. Um personagem assim não pode simplesmente "entrar" em qualquer chamada, de graça, para qualquer pessoa. Rodar no próprio computador é o que permite isso.

## Como usar

**Quem conduz (no dia do teste):**

1. Na véspera, abra o link e chame o fantasma uma vez, para o modelo ficar guardado.
2. No dia, abra o link no Chrome, entre no Meet e **compartilhe a aba com o áudio** (no Meet: Apresentar, Uma guia, marque "Compartilhar áudio da guia").
3. Clique em "Chamar o fantasma". Diga só: "temos uma visita". A partir daí, observe sem conduzir.
4. Leia em voz alta, ou cole na caixa, o que a turma perguntar no chat ou falar. Se preferir, ligue "Ouvir": o fantasma escuta o microfone do seu computador.
5. No fim, clique em "Registro" para baixar a conversa inteira, com o horário de cada fala.

**Quem não é da turma:** abra o link, clique em "Chamar o fantasma" e converse escrevendo ou falando.

Se o computador for fraco, marque "versão leve" antes de chamar. Ela baixa perto de 1 GB, mas o fantasma fala pior. Sem WebGPU, a página avisa e não carrega.

## O que eu espero que aconteça

Escrito antes do teste:

- A turma vai demorar alguns minutos para "entrar no jogo". Alguém vai tentar desmascarar o fantasma ("você é o ChatGPT?") antes de aceitar a história.
- Vai surgir um "médium": uma pessoa que passa a falar pela turma, sem ninguém pedir.
- Se o fantasma ficar magoado, parte da turma vai pedir desculpas a ele, mesmo sabendo que é um programa.
- Alguém vai comentar, sério ou rindo, o incômodo de ter um personagem ouvindo a aula.
- A turma vai descobrir a morte antes de 15 minutos, juntando os fragmentos.

## Limitações conhecidas

- **Só o "cérebro" é local.** O reconhecimento de voz do Chrome envia o áudio para o Google. A alternativa sem isso é escrever as perguntas na caixa.
- **O modelo é pequeno.** Às vezes erra concordância ou se repete. Quem decide o fim do jogo é o código, não o modelo, para o mistério não se resolver por acaso.
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
