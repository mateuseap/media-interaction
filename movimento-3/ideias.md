# Ideias do movimento 3: IA local, no dispositivo e no navegador

*Aluno: meap (Mateus Elias). Tema 16.*
*Versão 2, revisada em 19/10/2026 depois da orientação do professor. A primeira versão foi entregue em 14/10/2026.*

---

## O que mudou em relação à primeira versão

A primeira versão tinha três ideias: um teste cego entre texto local e de nuvem, uma bancada de velocidade em cada aparelho e uma comparação de recusas do modelo do navegador.

Na orientação, o professor apontou o problema: essas ideias **medem coisas que mudam com o poder de computação**, como velocidade, qualidade do texto e quanto o aparelho aguenta. Daqui a dois anos o número muda, e o experimento não diz nada sobre para onde a tendência vai. Ele indicou outra direção: **um jogo que roda com e sem modelo local**.

A correção de rota desta versão é esta: o experimento deixa de medir a máquina e passa a **observar as pessoas**. A pergunta não é mais "quão bem isso roda", e sim "o que muda na experiência quando um personagem é gerado no próprio aparelho, sem servidor".

---

## Parte 1: Como fiz o brainstorming

### Ponto de partida

1. **O meu mapa** (`activity-03/tendencia-ia-local.md`). Desta vez usei só os efeitos que tratam de uso, e não de desempenho:
   - e3: tarefas funcionam na web sem servidor de IA;
   - e3.1: o custo por uso cai perto de zero;
   - e4: a máquina do visitante decide qual versão ele recebe;
   - e6 e e6.1: agentes pessoais usam os seus dados no aparelho, e a IA ajustada a você vira um bem;
   - e1.1: o fabricante decide o que o modelo aceita fazer.
2. **O mapa do professor** e o confronto entre os dois mapas. As três raízes dele:
   - a inferência vira recurso local não medido: sem cota, sem conta e sem registro do lado de quem desenvolve;
   - o modelo vira capacidade da plataforma, e quem escreve o app não escolhe mais o modelo;
   - o modelo deixa de ser serviço e vira arquivo, que pode ser copiado, modificado, herdado ou apreendido.

   E a pergunta do confronto que guiou esta versão: "se a nuvem também barateou, o que sobra ao aparelho?".
3. **A aula de 08/10.** Os três feedbacks da turma apontaram a troca entre um modelo pior e mais privacidade e funcionamento sem internet, o hardware limitando o acesso, e a questão de quem manda no modelo.
4. **O exemplo do enunciado.** "O que acontece quando pessoas conversam com um NPC que lembra delas por semanas?" é pergunta. "Um chatbot para jogos" não é.
5. **A orientação do professor:** um jogo que roda com e sem modelo local.

### Método

Usei uma **comparação controlada dentro de um jogo**. Primeiro fixei a estrutura: o mesmo jogo, a mesma cena e o mesmo objetivo, e uma única coisa que muda entre as versões:

- **sem modelo:** o personagem é roteirizado, com falas prontas numa árvore de diálogo, que é a tecnologia madura;
- **com modelo local:** o personagem é gerado por um modelo pequeno rodando no navegador do jogador, que é a tecnologia emergente.

Depois, para cada efeito dos dois mapas, perguntei: **"se esse efeito for real, o que a turma faria de diferente nas duas versões?"**. Cada resposta virou uma ideia candidata.

Passei cada candidata por quatro filtros, nesta ordem:

1. **Observa pessoas, e não a máquina?** Se o resultado muda só porque o hardware melhora, a ideia cai. Este filtro é novo e vem direto da orientação.
2. **Precisa do modelo local?** Se dá para fazer com árvore de diálogo ou com uma API de nuvem sem perder a pergunta, a ideia cai.
3. **Tem uma pergunta sobre o futuro**, ou é só um produto?
4. **Cabe numa aula** e dá para construir sozinho até 09/11?

### Com que IA

Fiz o brainstorming com o **Claude**, da Anthropic, no Claude Code. O Claude gerou as candidatas e propôs os cortes, e eu revisei e escolhi as três. Os dados técnicos citados foram conferidos nas fontes, com o link testado.

### Quantas ideias saíram

**14 ideias candidatas:** 3 selecionadas, 4 fundidas nas selecionadas e 7 cortadas.

| # | Ideia candidata | Destino |
|---|---|---|
| 1 | O guarda que improvisa: a mesma cena com personagem roteirizado e com personagem gerado no aparelho | **Selecionada (ideia 1)** |
| 2 | O personagem que lembra de você, com a memória guardada só no aparelho | **Selecionada (ideia 2)** |
| 3 | Quem escreve o personagem: o modelo da plataforma contra o modelo do próprio jogo | **Selecionada (ideia 3)** |
| 4 | O jogo continua funcionando com a internet desligada | Fundida na ideia 1, mostrada no fim do jogo |
| 5 | Quem não tem WebGPU cai na versão roteirizada | Fundida na ideia 1, vira dado sobre e4 |
| 6 | Jogadores tentando fazer o personagem sair do papel | Fundida na ideia 1, como observação |
| 7 | Entregar o personagem, com a memória, para outro jogador | Fundida na ideia 2 |
| 8 | Bancada de velocidade por aparelho (versão 1) | Cortada: mede hardware, que muda com o tempo |
| 9 | Teste cego de texto local contra nuvem (versão 1) | Cortada: mede a qualidade do modelo, que muda com o tempo. A pergunta de percepção foi para dentro do jogo |
| 10 | Placar de quanto cada jogador custaria na nuvem | Cortada: é cálculo, não experiência da turma |
| 11 | Modificar o personagem editando o arquivo do modelo | Cortada: exige preparar ferramentas demais para uma aula |
| 12 | Personagem que conversa por voz | Cortada: é do tema 13 |
| 13 | Vários personagens conversando sozinhos entre si | Cortada: difícil ligar a uma pergunta clara e grande demais para o prazo |
| 14 | Mestre de RPG local narrando uma sessão inteira | Cortada: grande demais para construir até 09/11 |

---

## Parte 2: Três ideias selecionadas

### Ideia 1: O guarda que improvisa

**O que é**

Um jogo curto de navegador, com uma cena só: o jogador precisa convencer o guarda de um portão a deixá-lo passar. Existem duas versões, com a mesma cena, o mesmo objetivo e a mesma ficha do personagem (nome, temperamento, o que ele sabe e o que pode convencê-lo):

- **sem modelo:** o guarda é roteirizado, e o jogador escolhe entre falas prontas, como na maioria dos jogos hoje;
- **com modelo local:** o guarda é gerado por um modelo pequeno rodando no navegador do jogador, e o jogador escreve o que quiser.

Metade da turma joga uma versão primeiro e depois troca. No fim, o jogo mostra onde o guarda rodou: no próprio aparelho, sem servidor, funcionando com a internet desligada.

**A pergunta sobre o futuro**

Quando personagens de jogo puderem improvisar sem servidor e sem custo por jogador, o que os jogadores passam a fazer com essa liberdade?

**A tecnologia emergente**

Inferência de um modelo inteiro no navegador, via WebGPU, com WebLLM. O jogo usa um modelo pequeno da lista oficial do WebLLM, como o SmolLM2 ou o Qwen2.5 0.5B, baixado na primeira visita e guardado no navegador.

Por que não dá com tecnologia madura: a versão madura é justamente o controle, a árvore de diálogo. A outra forma madura de fazer um personagem improvisar é chamar uma API de nuvem, que cobra a cada fala de cada jogador, exige servidor e chave, e para quando o servidor desliga. O que o mapa prevê, e o jogo testa, é o personagem improvisado vindo **dentro do jogo**, sem custo por jogador e sem servidor. Isso só existe com o modelo rodando no aparelho.

**O que espero observar**

- Na versão com modelo, espero que os jogadores tentem caminhos que a árvore não oferece: mentir, subornar, ameaçar, puxar outro assunto, tentar fazer o guarda sair do personagem. O que interessa é quantos tentam e o quê.
- Espero que parte da turma **prefira a versão roteirizada**, por ser mais clara e dar menos trabalho. Se muitos preferirem, o personagem improvisado não é o futuro de todo jogo, e sim de alguns.
- O modelo pequeno vai errar: esquecer o que disse, aceitar qualquer argumento. Espero ver se o jogador **explora o erro como mecânica** ou desiste.
- Quem não tiver WebGPU cai automaticamente na versão roteirizada. Isso não é falha do experimento: mostra na prática o meu efeito e4, a máquina decidindo qual versão do jogo cada pessoa recebe.

Liga aos mapas: e3 e e3.1 do meu mapa, e a raiz do professor em que a inferência vira recurso local não medido.

---

### Ideia 2: O personagem que lembra de você, só no seu aparelho

**O que é**

O mesmo jogo, agora com uma personagem que guarda memória do que o jogador contou e fez. A turma joga duas vezes, antes e depois do intervalo da aula. Na segunda vez, ela lembra. Há duas versões:

- **sem modelo:** a personagem só lembra de fatos fixos por regra, como o nome do jogador e a escolha que ele fez;
- **com modelo local:** a personagem conversa usando livremente o que lembra.

A memória fica **só no navegador do jogador**. No fim, o jogo abre o arquivo com tudo que a personagem guardou sobre a pessoa e oferece três botões: apagar, baixar ou entregar para outro jogador.

**A pergunta sobre o futuro**

O que muda quando a memória de um personagem fica no aparelho do jogador, e não no servidor de uma empresa? A pessoa passa a tratar isso como algo seu?

**A tecnologia emergente**

Modelo local via WebGPU, com WebLLM, e a memória guardada no navegador e entregue ao modelo a cada conversa.

Por que não dá com tecnologia madura: num jogo com IA na nuvem, a memória e o modelo ficam no servidor da empresa, e o jogador nunca vê nem leva consigo. Guardar fatos fixos no aparelho já é maduro, mas não gera conversa. Só com o modelo local a conversa e a memória ficam juntas no aparelho de quem joga.

**O que espero observar**

- Ao abrir o arquivo, espero que parte da turma **se surpreenda com o que foi guardado**.
- Quantos apagam, quantos baixam e quantos entregam para outra pessoa. Isso testa o meu efeito e6.1, a IA ajustada a você virando um bem, e a raiz do professor em que o modelo vira arquivo.
- Se alguém entregar a memória para outro jogador e a personagem passar a tratá-lo como a primeira pessoa, espero uma discussão: de quem é essa memória, do jogador, do jogo ou de quem recebeu? É a pergunta de herança do e6.1.1, numa versão pequena.
- **Risco:** o teste é numa aula só. A volta acontece depois do intervalo, e não semanas depois, como no exemplo do enunciado. A pergunta de tempo fica menor, mas a de posse continua inteira.

---

### Ideia 3: Quem escreve o personagem

**O que é**

A mesma cena do guarda, com modelo local nas duas versões, mas com modelos de origens diferentes:

- **o modelo da plataforma:** o Gemini Nano, que vem dentro do Chrome, usado pela Prompt API. O jogo não escolhe nem fixa a versão do modelo;
- **o modelo do jogo:** um modelo aberto que o próprio jogo baixa, via WebLLM.

O guarda é de um mundo sombrio, e a ficha dele inclui ameaça e violência de ficção. A turma joga as duas versões e compara.

**A pergunta sobre o futuro**

Quando o personagem do jogo roda no modelo do navegador, quem decide o que ele pode dizer: quem fez o jogo ou a plataforma?

**A tecnologia emergente**

A Prompt API do Chrome, com o modelo embutido no navegador, e a inferência via WebGPU com WebLLM.

Por que não dá com tecnologia madura: com uma API de nuvem, quem faz o jogo escolhe o provedor e a política de uso. O que é novo é a política vir embutida no navegador de quem joga, sem escolha, e o mesmo jogo se comportar de um jeito diferente em cada navegador.

**O que espero observar**

- Espero que o modelo da plataforma **recuse ou suavize** falas do guarda, fazendo o jogo sair do personagem. O que interessa é se a turma percebe isso como censura, como defeito, ou nem percebe. Testa o meu efeito e1.1 e a raiz do professor em que quem escreve o app não escolhe mais o modelo.
- Espero um resultado claro sobre **português**: a documentação da Prompt API lista só inglês, japonês, espanhol, alemão e francês. O guarda da plataforma vai precisar falar inglês, ou vai falhar em português. Isso responde, na prática, a uma das perguntas do confronto: no Brasil, o que trava primeiro?
- **Limitação forte:** a Prompt API só funciona no Chrome em computador, com 22 GB livres e GPU com mais de 4 GB ou 16 GB de RAM. Não roda em celular. Parte da turma não vai conseguir jogar essa versão. Isso é dado, mas é o maior risco desta ideia.

---

## O ponto de equilíbrio

A minha proposta é construir **a ideia 1 como base e acoplar o final da ideia 2**, num jogo só:

- **uma cena, um personagem e duas versões**, roteirizada e com modelo local. É exatamente o cenário indicado pelo professor;
- **a versão roteirizada também é o plano B automático** para quem não tem WebGPU. Ninguém fica sem jogar, e quem cair nela vira dado sobre e4;
- **no fim do jogo**, o jogador vê onde o personagem rodou e abre o arquivo com o que ele guardou, com as opções de apagar, baixar ou entregar. Isso traz a pergunta de posse da ideia 2 sem precisar de duas sessões.

A ideia 3 fica como extensão opcional, se der tempo e se a turma tiver Chrome no computador.

**Por que este é o ponto certo:** tudo que o jogo observa é comportamento das pessoas. Se em poucos anos os modelos ficarem muito mais rápidos e melhores, a pergunta continua valendo: o que as pessoas fazem quando o personagem improvisa, e de quem é aquilo que ele lembra.

**Por que é factível:** é uma página HTML estática, sem servidor e sem chave de API, publicada no GitHub Pages. O WebLLM é carregado direto de um CDN, e o modelo é um dos pequenos da lista oficial. Isso atende à regra de o experimento ser acessível a quem não é da turma.

---

## Fontes conferidas

Todas abriram com HTTP 200 em 19/10/2026.

- Meu mapa: `activity-03/tendencia-ia-local.md`
- Enunciado do movimento 3: https://tendencias-midia-interacao.vercel.app/materiais/movimento-3-experimento/
- Confronto do tema 16: https://tendencias-midia-interacao.vercel.app/futuros/16-ia-local-no-dispositivo-e-no-navegador/confronto-meap/
- Mapa do professor: https://tendencias-midia-interacao.vercel.app/futuros/16-ia-local-no-dispositivo-e-no-navegador/giordano/documento
- WebLLM: https://github.com/mlc-ai/web-llm
- Lista oficial de modelos do WebLLM: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
- Prompt API do Chrome, línguas e plataformas: https://developer.chrome.com/docs/ai/prompt-api
- Requisitos do modelo embutido do Chrome: https://developer.chrome.com/docs/ai/get-started
- Feedbacks da aula de 08/10: 3 respostas da turma no site da disciplina, consultadas em 14/10/2026

**Não encontrei:**
- o tamanho de download de cada modelo pequeno do WebLLM. Não conferi, e vou medir ao construir;
- quantos aparelhos da turma têm WebGPU. Isso é parte do que o jogo vai revelar.
