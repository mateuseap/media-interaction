# A Vila nos Computadores

*CIN0055, Tendências em Mídia e Interação, Centro de Informática, UFPE. Movimento 3.*
*Aluno: meap (Mateus Elias). Tema 16: IA local, no dispositivo e no navegador.*

**Para jogar:** https://fantasma.lab.mateuseap.com

Abra no **Chrome ou no Edge atualizados, num computador**. Na primeira vez a página baixa a mente do seu morador, perto de 1 GB, e guarda no navegador. **Abra o link antes da aula**, para não depender da rede na hora.

## O que é

Uma vila pequena, sem servidor. Cada pessoa que entra traz um morador: dá um nome e diz quem ele é em uma frase. A mente desse morador, um modelo de linguagem, roda **no computador de quem o trouxe**, pela placa de vídeo. Os moradores conversam sozinhos na praça sobre um mistério (o dinheiro da festa sumiu do cofre da capela).

Ninguém controla o próprio morador. A turma só pode:

- **sussurrar** algo para um morador, que só ele ouve, e ver o que ele faz com isso (contar, distorcer ou guardar);
- **fazer algo acontecer** na vila, que todos veem;
- **pôr o próprio morador para dormir**, ou fechar o computador, e ele some da praça.

A lista ao lado mostra cada morador e em qual computador ele está pensando. O topo mostra em quantos computadores a vila está rodando agora.

## A pergunta sobre o futuro

**Quando a IA dos personagens rodar no aparelho de cada jogador, e não no servidor de uma empresa, o mundo do jogo passa a ser feito dos computadores das pessoas. Como elas tratam a parte do mundo que roda na própria máquina?**

Hoje, um mundo com personagens de IA é de quem paga o servidor: a empresa roda as mentes, paga cada fala e decide quando o mundo existe. Com modelos rodando no navegador, de graça, quem joga empresta a própria máquina para um pedaço do mundo existir. O personagem passa a ser, literalmente, um processo no computador de alguém. Se a pessoa desliga, ele dorme. Se a máquina é fraca, ele pensa devagar. Quem não tem placa de vídeo não consegue trazer um morador.

O experimento coloca isso na mão da turma e observa: as pessoas sentem que o morador é delas? Cuidam dele, deixam o computador ligado por ele, ou desligam sem pensar? E o que acontece com um mundo coletivo quando cada pedaço dele depende de uma pessoa diferente?

## A tecnologia emergente, e por que não dá com tecnologia madura

- **Cada morador pensa dentro do navegador do dono.** Um modelo de 1,5 bilhão de parâmetros (Qwen2.5 1.5B Instruct, ou o 3B na opção "mente melhor") roda inteiro no computador, via [WebLLM](https://github.com/mlc-ai/web-llm) e WebGPU. Não há servidor de IA, chave nem custo por fala.
- **A vila só repassa mensagens.** Os navegadores trocam as falas por um broker MQTT público (`broker.emqx.io`), que não tem IA nenhuma: só entrega o texto de um computador para os outros.

Por que a tecnologia madura não serve:

- **Personagens roteirizados** não reagem ao que outro personagem acabou de dizer, nem a um boato sussurrado. A vila depende de cada morador improvisar.
- **Personagens na nuvem** viram o caso de hoje: uma empresa roda todas as mentes, paga cada fala e é dona do mundo. A pergunta do experimento, o mundo feito das máquinas dos jogadores, só existe se cada mente rodar no aparelho de quem a trouxe.

## Como usar

1. Abra o link no Chrome ou no Edge, num computador.
2. Escreva o seu nome, dê um nome ao seu morador e diga quem ele é (ou clique em "Sortear"). Clique em "Entrar na vila".
3. Espere a mente baixar. Quando o morador chegar na praça, ele começa a falar sozinho.
4. Sussurre para os moradores, faça coisas acontecerem e veja a vila andar.
5. "Registro" baixa tudo o que você viu e sussurrou.

Sem placa de vídeo ou sem WebGPU, marque "entrar só como espírito": você observa, sussurra e faz coisas acontecerem, mas não traz morador.

No Linux, o Chrome vem com o WebGPU desligado. Ligue em `chrome://flags/#enable-unsafe-webgpu` (e, se precisar, `chrome://flags/#enable-vulkan`) e reinicie o navegador.

Para jogar numa sala separada, acrescente `?sala=nome` ao link. Todo mundo com o mesmo nome de sala cai na mesma vila.

## O que eu espero que aconteça

Escrito antes do teste:

- A turma vai usar os sussurros para plantar boatos e tentar fazer os moradores dos outros acusarem alguém.
- Alguém vai pôr o próprio morador para dormir para "protegê-lo" de uma acusação, ou vai acordá-lo para ele se defender.
- Quem não tiver WebGPU vai reclamar de ficar "de fora" do mundo: sem máquina boa, sem morador.
- As pessoas vão falar do morador como "o meu", e ficar incomodadas quando ele disser algo que elas não queriam.
- Quando alguém fechar o notebook no meio, o morador vai sumir, e a turma vai notar.

## Limitações conhecidas

- **O broker é público.** As falas da vila passam por ele em texto aberto. Não sussurre nada pessoal.
- **O modelo é pequeno.** Às vezes um morador se repete, sai do personagem ou fala sem sentido.
- **Precisa de WebGPU e de uma placa de vídeo razoável.** Celulares, em geral, não rodam um morador, só um espírito.

## Versão anterior

A primeira versão deste experimento, "O Fantasma da Chamada", continua em [`fantasma.html`](fantasma.html) (https://fantasma.lab.mateuseap.com/fantasma.html). Ela foi trocada pela vila na madrugada de 17/11, porque a turma só assistia ao fantasma, e a vila faz cada pessoa trazer um pedaço do mundo.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | A vila inteira: entrada, praça, moradores, sussurros e registro |
| `fantasma.html` | A versão anterior, O Fantasma da Chamada |
| `README.md` | Este documento |
