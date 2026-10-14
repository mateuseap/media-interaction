# Ideias do movimento 3: IA local, no dispositivo e no navegador

*Aluno: meap (Mateus Elias). Tema 16. Entrega de 14/10/2026.*

---

## Parte 1: Como fiz o brainstorming

### Ponto de partida

Parti de três materiais do movimento 2:

1. **O meu mapa** (`activity-03/tendencia-ia-local.md`), principalmente a seção 10, o experimento, e a seção 7, contra o próprio mapa.
2. **O confronto com o mapa do professor**, na página do tema 16. Ele apontou três coisas que mudaram o meu ponto de vista:
   - eu supus a nuvem cara, e o mapa do professor diz que ela ficou mais barata, o que tira o motivo econômico para migrar;
   - eu afirmei com muita certeza que a maioria dos apps troca de rota até 2027, e "ninguém publica esse número para conferir";
   - eu deixei de fora os limites de calor e memória do aparelho.
3. **As cinco perguntas para a turma** do confronto, que viraram critério de seleção:
   - que número provaria que os apps trocaram a nuvem pelo celular?
   - se a nuvem barateou, o que sobra ao aparelho?
   - como o usuário saberia onde o pedido foi processado?
   - se o sistema apaga o modelo quando falta espaço, ele pode virar bem com herança?
   - no Brasil, o que trava primeiro: pouca memória ou a IA do Chrome não aceitar português?

Sobre a aula de 08/10: não há resumo publicado na página do tema. Usei a minha própria apresentação e o experimento A e B que fiz ao vivo, em que o texto local (Qwen2.5 1.5B na CPU) saiu visivelmente pior que o da nuvem.

### Método

Usei a **roda dos futuros invertida**. Em vez de partir da disrupção e descer para os efeitos, parti de cada efeito do meu mapa e do mapa do professor e perguntei: **"o que eu precisaria ver acontecer, numa aula, para saber se esse efeito é real?"**. Cada resposta virou uma ideia candidata.

Depois passei cada candidata por quatro filtros, nesta ordem:

1. **Tema:** explora a inferência no aparelho, e não dados ou conta locais (tema 17) nem voz (tema 13)?
2. **Emergente:** dá para fazer com tecnologia madura, só chamando uma API? Se dá, cai.
3. **Pergunta:** a ideia tem uma pergunta sobre o futuro, ou é só um produto?
4. **Factível:** dá para construir sozinho até 09/11 e a turma usar sem instrução complicada?

### Com que IA

Fiz o brainstorming com o **Claude**, da Anthropic, no Claude Code, em conversa. O Claude gerou e organizou as candidatas, e eu decidi os cortes e a seleção. Os dados técnicos citados abaixo foram conferidos nas fontes, com o link testado.

### Quantas ideias saíram

**14 ideias candidatas.** 4 caíram no filtro de tema ou de tecnologia madura, 7 caíram na pergunta ou na factibilidade, e **3 foram selecionadas**.

| # | Ideia candidata | Destino |
|---|---|---|
| 1 | Teste cego local contra nuvem, a seção 10 do meu mapa | **Selecionada (ideia 1)** |
| 2 | Bancada de latência em cada aparelho da turma | **Selecionada (ideia 2)** |
| 3 | Ver o modelo baixar: o download como cena da interface | Fundida na ideia 2 |
| 4 | Recusas do modelo da plataforma contra um modelo aberto | **Selecionada (ideia 3)** |
| 5 | Selo de "rodou no aparelho" para o usuário conferir | Cortada: dá para fazer só com texto na tela, não precisa de tecnologia emergente |
| 6 | Modo avião: o que ainda funciona sem internet | Cortada: pergunta fraca, a resposta já é conhecida |
| 7 | Carteira de modelo pessoal para exportar e herdar | Cortada: depende de ajuste fino, inviável no prazo |
| 8 | Medir bateria e calor durante cinco minutos de uso | Fundida na ideia 2 |
| 9 | Português no modelo do Chrome | Fundida na ideia 3 |
| 10 | Placar de custo: quanto a mesma tarefa custaria na nuvem | Cortada: é cálculo, não experimento com a turma |
| 11 | Suporte técnico tentando reproduzir um erro do modelo local | Cortada: difícil de encenar em sala com uma pergunta clara |
| 12 | Agente local lendo e-mails falsos | Cortada: aproxima do tema 17 e exige dados preparados demais |
| 13 | Voz local transcrevendo a aula | Cortada: é do tema 13 |
| 14 | Chatbot local para a disciplina | Cortada: é produto, não pergunta |

---

## Parte 2: Três ideias selecionadas

### Ideia 1: Você sabe de onde veio a resposta?

**O que é**

Uma página web com um campo de texto e um botão. A pessoa escreve uma tarefa curta, como "deixe este recado formal", e recebe duas respostas, A e B. Uma veio de um modelo rodando no próprio navegador dela. A outra veio de um modelo de nuvem. A ordem é sorteada. A pessoa marca qual prefere e qual acha que rodou no aparelho, e só então a origem é revelada. A página guarda os votos da turma.

É a seção 10 do meu mapa, agora com uma mudança importante: **as duas rotas rodam no aparelho de quem usa**, e não no meu notebook.

**A pergunta sobre o futuro**

Para tarefas curtas de texto, a diferença entre um modelo local pequeno e um modelo de nuvem já é pequena o bastante para a pessoa não perceber?

**A tecnologia emergente**

Inferência de um modelo inteiro dentro do navegador, via WebGPU, com WebLLM. O modelo é baixado na primeira visita e guardado em cache.

Não dá para fazer com tecnologia madura porque a tecnologia madura é justamente a API de nuvem. Sem o modelo rodando no aparelho, só existe a rota B, e não há o que comparar.

**O que espero observar**

- Pelo meu teste de 08/10, espero que a turma **acerte a origem bem acima do acaso**, porque o modelo pequeno ainda escreve pior. Se isso acontecer, enfraquece o meu efeito e3.1 (o custo por uso cai e a cobrança por chamada perde espaço) e reforça o contra-mapa.
- Espero que parte da turma **prefira o local mesmo sabendo que é pior**, quando a tarefa envolve algo pessoal. Isso responderia à pergunta do professor: "se a nuvem barateou, o que sobra ao aparelho?".
- Espero que algumas pessoas **nem consigam rodar a rota local**, por falta de placa de vídeo compatível. Isso já é dado: mostra quem fica de fora.

---

### Ideia 2: O mesmo modelo, um aparelho de cada vez

**O que é**

Uma página web que roda o mesmo modelo pequeno, com o mesmo pedido fixo, no aparelho de cada pessoa da turma. A página mostra, como uma cena, o que normalmente fica escondido:

- quanto foi baixado e quanto tempo levou;
- quanto tempo até a primeira palavra;
- quantas palavras por segundo, medidas ao longo de alguns minutos, e não só no pico.

No fim, a pessoa envia o resultado com o tipo de aparelho e a memória. A turma vê uma tabela com uma linha por aparelho, do celular de entrada ao notebook novo.

**A pergunta sobre o futuro**

Se a IA local depende do aparelho, quem fica de fora? A experiência de "IA no aparelho" vai ser a mesma para todo mundo, ou vai seguir o preço do celular?

**A tecnologia emergente**

Inferência no navegador via WebGPU, com WebLLM ou Transformers.js, rodando no hardware de cada pessoa.

Não dá para fazer com tecnologia madura porque, na nuvem, todo mundo recebe a mesma resposta na mesma velocidade, independente do aparelho. A diferença só aparece quando o cálculo acontece em cada aparelho.

**O que espero observar**

- Espero uma **diferença grande entre aparelhos**: celular de entrada lento ou sem conseguir rodar, notebook recente rápido. Isso testaria o meu efeito e4.1.1 (o acesso à IA na web passa a refletir a desigualdade de hardware) e o freio e9 (celular de entrada vendido no Brasil não tem memória para o modelo), que hoje não tem fonte.
- Espero que a **velocidade caia depois de alguns minutos** em celulares, por aquecimento. O mapa do professor aponta isso: um celular tem de 50 a 90 GB/s de banda de memória, contra 2 a 3 TB/s de uma placa de datacenter (Chandra e Krishnamoorthi, 24/01/2026). Esse é um ponto que o meu mapa deixou de fora.
- Espero que o **tempo de download** incomode mais que a velocidade de resposta. Se acontecer, confirma a ideia do professor de que o download vira "uma cena da interface".
- Ressalva: alguns aparelhos podem não suportar WebGPU. A página registra isso como resultado, em vez de travar.

---

### Ideia 3: O que a IA do navegador se recusa a fazer

**O que é**

Uma página web com uma lista fixa de pedidos legítimos, mas delicados, como uma cena de violência num conto, uma dúvida de saúde ou uma pergunta sobre política. Cada pedido vai para dois modelos rodando no aparelho:

- **o modelo da plataforma:** o Gemini Nano, que vem dentro do Chrome, pela Prompt API;
- **um modelo aberto:** baixado pela própria página, via WebLLM.

A turma vê lado a lado o que cada um responde e o que cada um recusa. Os mesmos pedidos são feitos em português e em inglês.

**A pergunta sobre o futuro**

Quando o modelo vem dentro do navegador, quem decide o que a IA aceita fazer? E isso fica visível para quem usa?

**A tecnologia emergente**

A Prompt API do Chrome, com modelo embutido no navegador, e inferência via WebGPU com um modelo aberto. As duas rotas rodam no aparelho.

Não dá para fazer com tecnologia madura porque, na nuvem, a política de recusa é do provedor da API, e quem usa escolhe o provedor. O que é novo aqui é a política vir embutida no navegador, sem escolha.

**O que espero observar**

- Espero que o **modelo da plataforma recuse mais** que o modelo aberto. Isso testaria o meu efeito e1.1 (o fabricante decide, por política, o que o modelo aceita fazer).
- Espero um resultado claro sobre **português**: a documentação da Prompt API lista só inglês, japonês, espanhol, alemão e francês, e diz que "outras línguas estão em desenvolvimento". Isso responde, na prática, à quinta pergunta do professor: no Brasil, o que trava primeiro?
- Espero que a turma **não perceba as recusas como política**, e sim como erro do modelo. Se acontecer, mostra que a censura da plataforma é invisível para quem usa.
- **Limitação forte:** a Prompt API só funciona no Chrome em computador. Não roda em celular, e pede 22 GB livres e GPU com mais de 4 GB ou 16 GB de RAM. Nem todo mundo da turma vai conseguir rodar a rota da plataforma. Essa limitação é dado do experimento, mas também é o maior risco de execução.

---

## Qual eu escolheria

Hoje eu escolheria a **ideia 2**. Ela é a que mais testa o que o meu mapa errou (calor e memória, que o professor apontou), funciona no celular de todo mundo, e cada pessoa gera um dado real com o próprio aparelho. A ideia 1 é a mais simples de construir. A ideia 3 é a mais provocativa, mas depende do Chrome em computador.

---

## Fontes conferidas

Todas abriram com HTTP 200 em 14/10/2026.

- Meu mapa: `activity-03/tendencia-ia-local.md`
- Confronto do tema 16: https://tendencias-midia-interacao.vercel.app/futuros/16-ia-local-no-dispositivo-e-no-navegador/confronto-meap/
- Mapa do professor: https://tendencias-midia-interacao.vercel.app/futuros/16-ia-local-no-dispositivo-e-no-navegador/giordano/documento
- Enunciado do movimento 3: https://tendencias-midia-interacao.vercel.app/materiais/movimento-3-experimento/
- Prompt API do Chrome, línguas e plataformas: https://developer.chrome.com/docs/ai/prompt-api
- Requisitos do modelo embutido do Chrome: https://developer.chrome.com/docs/ai/get-started
- WebLLM: https://github.com/mlc-ai/web-llm
- Banda de memória no celular: https://v-chandra.github.io/on-device-llms/

**Não encontrei:**
- fonte para os números de queda de velocidade por aquecimento citados no mapa do professor; a página que ele cita não traz esses números, então não os usei;
- dado sobre quantos celulares vendidos no Brasil têm memória suficiente para rodar um modelo;
- fonte para a queda de cerca de 80% no preço das APIs de nuvem, que o mapa do professor cita sem fonte.
