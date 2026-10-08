# Roteiro da apresentação: IA local em 2031

Como usar: cada slide tem **Fale**, que é o texto para ler em voz alta, e **Contexto**, que é para estudar antes e responder perguntas. `[clique]` marca onde avançar. A meta é falar uns 15 minutos e deixar o resto para discussão.

| Bloco | Slides | Tempo |
|---|---|---|
| Abertura | 1 a 3 | 2 min |
| Onde estamos hoje | 4 a 7 | 3 min |
| As três rodas | 8 a 11 | 5 min |
| Padrão, erros e cenários | 12 a 14 | 3 min |
| Experimento e discussão | 15 a 18 | 2 min, depois a turma |

---

## Slide 1: Capa

**Fale:**
"Meu tema é IA local: a IA rodando no próprio aparelho, sem depender da nuvem. A frase que resume tudo é esta: a IA está mudando de endereço, da nuvem para o seu bolso. O que eu quero discutir com vocês não é só se isso é possível. É o que muda quando acontece, e principalmente quem passa a mandar nessa IA."

**Contexto:**
- "Nuvem" é o servidor de uma empresa. Quando você usa o ChatGPT, o seu texto vai para o servidor, ele calcula a resposta e devolve.
- "Local" é quando esse cálculo acontece no seu aparelho.
- A pilha à direita mostra os quatro lugares onde a IA pode rodar: nuvem, sistema, navegador e chip. Hoje o pesado está na nuvem.

---

## Slide 2: Seu celular já tem IA (3 cliques)

**Fale:**
"Um aviso antes: o celular de vocês já tem IA. Quando o iPhone resume uma notificação ou o Android corrige um texto, isso roda no aparelho. Mas é IA pequena, do fabricante, para tarefa simples. O pesado ainda vai para servidor, e até a Apple faz isso.
[clique] A primeira mudança é no sistema: o modelo de fábrica deixa de ser só do fabricante e vira um serviço que qualquer app pode usar. E quem atualiza é o sistema, não o app.
[clique] A segunda é no navegador: um site baixa o modelo e roda na placa de vídeo de quem está visitando, sem servidor.
[clique] A terceira é no chip: um jeito novo de montar o modelo faz ele caber num processador comum."

**Contexto:**
- A Apple usa dois modelos: um de cerca de 3 bilhões de parâmetros no aparelho e um maior num servidor dela, chamado Private Cloud Compute (Apple ML Research, WWDC 2024).
- "Modelo" é um arquivo com bilhões de números, os parâmetros, que aprendeu padrões de texto. "3B" quer dizer 3 bilhões.
- No Android, o modelo se chama Gemini Nano e fica dentro de um serviço do sistema chamado AICore.

---

## Slide 3: O mapa ignora o que já é comum

**Fale:**
"Antes de prever qualquer coisa, eu filtrei o que já é comum, porque coisa madura não é tendência. Chamar API de nuvem, rodar modelo em servidor próprio, compactar modelo e até o modelo pequeno do fabricante: tudo isso já existe e fica como contexto. No meio está o emergente, que funciona mas ainda não se espalhou. À direita está o que rompe de fato: o modelo do sistema aberto a qualquer app, e IA capaz de agir, ouvir e ver rodando no aparelho. O teste que usei foi este: se eu não consigo dizer o que a tecnologia quebra hoje, ela é madura."

**Contexto:**
- Quantização INT8 e FP16: guardar os números do modelo com menos precisão para ocupar menos memória. FP16 usa 16 bits por número; INT8 usa 8.
- Self-hosting: a empresa roda o modelo no próprio servidor em vez de pagar uma API.
- Agente: IA que executa ações, como marcar reunião ou mandar e-mail, em vez de só responder.
- CRD (Candidate Recommendation Draft): rascunho avançado de um padrão no W3C, o órgão que define os padrões da web.

---

## Slide 4: Os números já são do fabricante

**Fale:**
"Três números, todos do próprio fabricante. Trinta tokens por segundo é a velocidade do modelo da Apple dentro do iPhone 15 Pro. Dois bilhões é o tamanho do modelo oficial da Microsoft com pesos que só valem menos um, zero ou um, e que roda em CPU comum. E zero é quantos servidores de IA o WebLLM precisa: o modelo roda inteiro na aba do navegador.
Embaixo está o contraste: a API do Google limita pedidos por minuto e por dia e avisa que a capacidade pode variar. É esse custo e essa instabilidade que a IA local promete tirar."

**Contexto:**
- Token é um pedaço de palavra, geralmente menor que uma palavra inteira.
- O modelo da Apple foi comprimido para uma média de 3,7 bits por número.
- O modelo BitNet de 2B foi treinado com 4 trilhões de tokens e lançado em abril de 2025.
- WebLLM: no primeiro acesso, o site baixa o modelo; depois ele fica guardado no navegador (cache).
- `429 RESOURCE_EXHAUSTED` é o erro de "recurso esgotado", quando você passa do limite. RPM, TPM e RPD são pedidos por minuto, tokens por minuto e pedidos por dia.

---

## Slide 5: Pesos ternários aceleram até 6 vezes

**Fale:**
"Esse gráfico é da terceira mudança, o chip. O bitnet.cpp, programa da Microsoft para rodar esses modelos, fica de 1,4 a 5 vezes mais rápido em processador ARM, que é o tipo usado em celular, e de 2,4 a 6 vezes em processador x86, o de PC. E corta de 55% a 82% do consumo de energia. Mas atenção: esses números são do próprio autor. Por isso eu não dei confiança alta para o efeito que depende deles."

**Contexto:**
- Por que acelera: multiplicar por -1, 0 ou 1 vira somar, subtrair ou pular. É uma conta muito mais barata que multiplicar números quebrados.
- "1,58 bit": com três valores possíveis, cada número precisa de cerca de 1,58 bit (é o logaritmo de 3 na base 2).
- O paper que lançou a ideia (Ma et al., arXiv, 27/02/2024) diz que esse modelo empata com um modelo normal do mesmo tamanho, treinado com a mesma quantidade de dados.
- A parte clara de cada barra é o mínimo medido, e a parte forte vai até o máximo.

---

## Slide 6: Linha do tempo

**Fale:**
"Na faixa de cima está só o que tem fonte: o paper de 2024, a Apple descrevendo o modelo no aparelho, o lançamento do bitnet.cpp, o suporte a placa de vídeo, a otimização de CPU deste ano e a nova versão do WebGPU em setembro. Na faixa de baixo, tracejada, está o que eu projetei: 2027 para os primeiros efeitos e 2031 para os mais distantes. A separação é de propósito: em cima é fato, embaixo é aposta minha."

**Contexto:**
- Datas: paper em 02/2024; Apple em 06/2024; bitnet.cpp 1.0 em 10/2024; suporte a GPU em 05/2025; otimização de CPU em 01/2026; nova versão do WebGPU no W3C em 15/09/2026.
- O espaçamento entre os pontos não é proporcional ao tempo. O slide avisa isso.

---

## Slide 7: A mesma descida, em três camadas

**Fale:**
"Juntando tudo, são três disrupções-raiz: a mesma descida, em três camadas.
No sistema, rompe a ideia de que cada app escolhe e paga o próprio modelo. O Android já faz o sistema cuidar disso. Falta um padrão comum entre Apple e Google.
No navegador, rompe a necessidade de servidor. O Chrome já tem resumo e tradução estáveis. Falta Safari, Firefox e celular.
No chip, rompe a necessidade de placa de vídeo. O modelo e o programa já existem. Falta suporte nos chips de IA, que a própria Microsoft diz que vem depois."

**Contexto:**
- Disrupção-raiz é a mudança central da qual saem as consequências.
- O slide segue o formato "rompe, agora, falta": o que quebra, por que acontece agora e o que ainda falta.
- NPU é o chip dedicado a IA dentro de celulares e notebooks novos.
- No Chrome 138, Summarizer, Translator e Language Detector ficaram estáveis. Writer, Rewriter e Proofreader ainda estão em teste.

---

## Slide 8: Roda 1, o sistema (3 cliques)

**Fale:**
"Agora a roda dos futuros. Cada efeito tem um nome: e1 é a consequência direta, e1.1 é a consequência dela, e1.1.1 é a seguinte. Quanto mais longe do centro, menos certeza.
[clique] Primeira ordem: a maioria dos apps troca a nuvem pelo modelo do sistema em tarefa curta, e a atualização do modelo passa a vir com o sistema, não com o app.
[clique] Segunda ordem: o fabricante decide por política o que a IA aceita fazer, e os apps precisam testar tudo de novo a cada update do celular.
[clique] Terceira ordem: governos passam a tratar esse modelo como tratam a loja de apps, e um celular sem update de modelo vira velho mesmo com o hardware funcionando.
Em preto está o freio, o e7: tarefa de raciocínio longo continua indo para servidor, e os produtos passam a avisar o que rodou onde."

**Contexto:**
- Âncora: a documentação do Android diz que o AICore "gerencia atualizações e segurança do modelo".
- Freio é um efeito que segura a própria tendência. Ele existe para a roda não ser só otimista.

---

## Slide 9: Roda 2, o navegador (3 cliques)

**Fale:**
"[clique] Primeira ordem: resumo, tradução e revisão funcionam na web sem servidor de IA, e a placa de vídeo de quem visita decide qual versão do site ela recebe.
[clique] Segunda ordem: o custo por uso cai para perto de zero, e prever um plano B entre modelo local, modelo menor e nuvem vira requisito de produto.
[clique] Terceira ordem: a nuvem fica com o que o aparelho não roda e cobra mais caro por isso, e o acesso a IA na web passa a refletir quem tem máquina boa.
Freio, o e8: Safari e Firefox não têm API igual à do Chrome, então site que quer alcançar todo mundo continua na nuvem."

**Contexto:**
- Back-end é o servidor do site.
- API é o jeito de um programa pedir algo a outro programa.

---

## Slide 10: O Chrome não roda em qualquer máquina

**Fale:**
"Esse slide explica por que existe o e4. Para rodar o modelo embutido do Chrome, você precisa de 22 GB livres no disco, placa de vídeo com mais de 4 GB ou então 16 GB de RAM, e Windows, Mac ou Linux. Em celular, ainda não roda. E se o espaço livre cair abaixo de 10 GB, o Chrome apaga o modelo sozinho. Ou seja: hoje, IA local é coisa de máquina nova."

**Contexto:**
- VRAM é a memória da placa de vídeo.
- O Chromebook Plus também é suportado.
- Fonte: Chrome for Developers, página "Get started with built-in AI", consultada em 07/10/2026.

---

## Slide 11: Roda 3, o chip (3 cliques)

**Fale:**
"[clique] Primeira ordem: modelos úteis rodam em CPU de notebook, sem placa de vídeo, e agentes pessoais passam a mexer no seu e-mail, agenda e arquivos sem tirar nada do aparelho.
[clique] Segunda ordem: fabricantes de chip vendem suporte a esses modelos como diferencial, e a IA ajustada aos seus dados vira um bem que precisa de backup.
[clique] Terceira ordem: velocidade por watt vira número de comparação entre aparelhos, e tribunais discutem se esse modelo pessoal pode ser herdado ou apreendido.
Freio, o e9, que é o do Brasil: celular de entrada vendido aqui não tem memória para isso, então a IA local chega primeiro a quem compra aparelho caro. Para esse eu não tenho fonte de vendas, e deixo isso claro."

**Contexto:**
- A Apple diz que o modelo dela no aparelho faz "tool calling", que é chamar funções de outros programas. É o primeiro degrau de um agente.
- Watt é a unidade de potência. "Velocidade por watt" mede quanto o aparelho entrega para cada unidade de energia gasta.

---

## Slide 12: Quanto mais longe, mais vira poder

**Fale:**
"Olhando as três rodas juntas, aparece um padrão. A primeira ordem é arquitetura: onde o modelo mora, quem distribui, quem atualiza. É a parte mais certa. A segunda é produto e mercado: política do fabricante, custo, testes. A terceira é governança: regulação, obsolescência, herança. Ou seja, a parte tecnicamente previsível é justamente a politicamente aberta. A dúvida de verdade não é se dá para rodar IA no celular. É quem manda nela."

---

## Slide 13: Onde eu posso estar errado

**Fale:**
"Agora, onde eu posso estar errado. São três fatos que, se acontecerem, derrubam pedaços do mapa.
Se até 2028 nenhum modelo de celular empatar com um modelo de nuvem de 2026 na mesma tarefa, caem o e5 e o e6.
Se Apple ou Google liberarem o modelo só para os próprios apps, caem o e1 e o e2.
Se o WebGPU não virar padrão até 2029, ou um navegador grande não suportar, caem o e3 e o e4.
E o meu viés: eu uso IA local no dia a dia, então tendo a ser otimista. Para compensar, só dei confiança alta a efeito com capacidade já documentada pelo fabricante."

**Contexto:**
- Falsificador é um fato concreto que, se acontecer, prova que a previsão estava errada. É o que separa previsão de opinião.

---

## Slide 14: 2031, em três versões

**Fale:**
"Três versões de 2031, escritas como se já tivessem acontecido.
Provável: o modelo do sistema fez o simples, a nuvem fez o difícil, e cada fabricante manteve a sua API. O sinal de que estamos indo para lá é o Chrome liberar as APIs de escrita sem que os outros navegadores acompanhem.
Desejável: um padrão comum deixou escrever o app uma vez e rodar em qualquer sistema, e o usuário passou a escolher se o dado sai do aparelho. O sinal é uma API de IA embutida entrar num grupo do W3C com mais de um navegador apoiando.
Indesejável: o modelo do sistema virou porteiro, com regra que ninguém audita e update usado para forçar a troca de celular. O sinal é as APIs ficarem restritas aos apps do próprio fabricante."

---

## Slide 15: O experimento (2 cliques)

**Fale:**
"Agora é com vocês. Fiz o mesmo pedido para duas IAs: reescrever em tom formal 'galera, o relatório vai atrasar pra sexta porque a coleta de dados deu ruim, foi mal'. Uma rodou na nuvem. A outra rodou no meu notebook, sem internet.
[clique] Primeiro, mão levantada: quem acha que o A veio do aparelho? E o B? Agora votem no botão: qual vocês preferem?
[clique] O A é da nuvem, o Claude. O B é local: o Qwen, um modelo de 1,5 bilhão de parâmetros rodando na minha CPU. Reparem que o B agradece sem motivo e nem diz que o prazo é sexta. Se vocês acertaram, o meu próprio teste enfraquece o meu mapa: para essa tarefa, a IA local ainda não chegou na qualidade da nuvem. É uma amostra só, mas é dado real."

**Contexto:**
- Qwen2.5 1.5B é um modelo aberto da equipe Qwen, da Alibaba. Rodou com o llama.cpp, um programa aberto para rodar modelos no computador.
- O protocolo completo, à direita do slide, prevê 6 parágrafos. Hoje é um par só.
- A velocidade não aparece no slide de propósito: ela denunciaria qual é o local.
- A regra do slide: se o acerto ficar perto de 50%, o e3 se sustenta. Se o acerto for alto e a turma preferir a nuvem, o e3.1 perde confiança.

---

## Slide 16: Três ataques prováveis

**Fale (use só se perguntarem, ou passe rápido):**
"Três críticas que eu esperaria.
'Modelo local é ruim': o mapa não diz que local substitui nuvem. Diz que tarefa curta migra e a nuvem se especializa, e o experimento acabou de mostrar o limite.
'Apple Intelligence já existe, então isso é maduro': maduro é o modelo pequeno do fabricante. A ruptura é o sistema virar dono do modelo, para qualquer app.
'Local é privado, então o mapa é otimista': o mapa nega isso. Rodar local não prova que nada sai do aparelho."

---

## Slide 17: Perguntas para a turma

**Fale:**
"Para fechar, duas perguntas. Primeira: vocês aceitariam uma IA um pouco pior se ela nunca saísse do celular? Depois do experimento, essa ficou concreta. Segunda: se o celular faz de graça e sem internet, vocês ainda pagariam assinatura de IA?"

**Como conduzir:**
- Depois de perguntar, espere alguns segundos em silêncio. Alguém sempre fala.
- Se ninguém falar, chame alguém pelo nome.
- Ligue cada resposta a um efeito: "isso é o e3.1", "isso é o freio e7".

---

## Slide 18: Fim

**Fale:**
"O documento completo, com os 27 efeitos, as 12 fontes e o levantamento, está nesse link. Obrigado."

---

## Perguntas difíceis do professor

- **"Suas três raízes são o enunciado do tema dividido."**
  "Sim, parti do enunciado e dividi por quem controla o modelo: sistema, navegador e chip. Está declarado no anexo do documento."
- **"Cadê o Brasil?"**
  "No freio e9: celular de entrada vendido no Brasil não tem memória para o modelo. Não tenho fonte de vendas para isso, e o documento diz isso."
- **"De onde saíram os prazos, 2027 e 2028?"**
  "São hipóteses. Não usei comparação com outra tecnologia que levou tanto tempo para se espalhar. É uma limitação do mapa."
- **"Você rodou a skill de verdade?"**
  "A entrevista usou as respostas que dei no teste de 10/09, no mesmo tema. O anexo diz isso e diz que o levantamento foi reconstruído."
- **"Qual a diferença para o tema 17?"**
  "No 17, o que fica local são os dados e a conta. Aqui, o que fica local é o modelo."

## Glossário rápido

- **Inferência:** o modelo calculando uma resposta.
- **Parâmetro:** cada número do modelo. "3B" quer dizer 3 bilhões de parâmetros.
- **Token:** pedaço de palavra que o modelo lê e escreve.
- **Quantização:** guardar os números do modelo com menos bits para ocupar menos memória.
- **Ternário:** cada número só pode valer -1, 0 ou 1.
- **WebGPU:** API do navegador que deixa o site usar a placa de vídeo.
- **NPU:** chip dedicado a IA.
- **AICore:** serviço do Android que guarda e atualiza o Gemini Nano.
- **1ª, 2ª e 3ª ordem:** a consequência direta, a consequência da consequência, e a seguinte.
- **Freio:** efeito que segura a própria tendência.
- **Falsificador:** fato que, se acontecer, prova que a previsão está errada.
