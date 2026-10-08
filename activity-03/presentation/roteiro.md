# Roteiro da apresentação: IA local em 2031

O roteiro tem quatro partes:

1. **A história em um minuto:** o fio condutor. Se você esquecer tudo, lembre disto.
2. **Conceitos que sustentam o argumento:** os termos que provavelmente você não conhece e que aparecem nas perguntas. Leia com calma antes.
3. **O roteiro, slide a slide:** o que falar, já com a ponte para o slide seguinte.
4. **Perguntas difíceis:** respostas prontas para o professor.

---

# Parte 1: A história em um minuto

A apresentação inteira responde a uma pergunta só:

> **Quando a IA sai da nuvem e passa a rodar no seu aparelho, quem passa a mandar nela?**

A história anda em quatro atos, e cada slide é um passo:

1. **O que está mudando (slides 1 a 3).** Hoje a IA séria roda no servidor de uma empresa, e você paga por uso. O celular já tem uma IA pequena, mas o que vem é IA de verdade rodando no aparelho, em três lugares: no sistema, no navegador e no chip.
2. **A prova de que já começou (slides 4 a 7).** Não é palpite: Apple, Google e Microsoft já publicaram números. Mostro esses números, a linha do tempo e as três mudanças.
3. **O que vem depois (slides 8 a 12).** Para cada mudança, sigo a cadeia de consequências até 2031. Quanto mais longe, mais a pergunta deixa de ser técnica e vira de poder: o fabricante decide o que a IA faz, o governo entra, e quem tem celular barato fica de fora.
4. **Testando o próprio mapa (slides 13 a 15).** Mostro onde posso estar errado, três futuros possíveis e um experimento real que, inclusive, enfraquece parte do mapa.

E fecho com duas perguntas para a turma (slides 16 a 18).

A frase para guardar: **"a parte técnica é a mais certa; a dúvida de verdade é quem manda."**

---

# Parte 2: Conceitos que sustentam o argumento

Estes são os pontos em que alguém pode te perguntar "mas o que é isso?". Cada um explica o conceito e diz **por que ele importa para o seu argumento**.

## 2.1. Treinar e rodar um modelo são coisas diferentes

Um modelo de linguagem é, na prática, um arquivo enorme cheio de números, chamados **parâmetros** ou **pesos**. Esses números foram ajustados olhando trilhões de pedaços de texto, até o modelo aprender a prever a próxima palavra.

Existem dois momentos bem diferentes:

- **Treinar** é ajustar esses números. Custa milhões, usa milhares de placas de vídeo e acontece uma vez, nos servidores da empresa.
- **Rodar**, também chamado de **inferência**, é usar o modelo pronto: você manda um texto e ele calcula a resposta.

**Por que importa:** "IA local" é só sobre **rodar** no aparelho. Ninguém está treinando modelo no celular. O modelo é treinado na empresa e depois baixado. Se alguém confundir as duas coisas, corrija.

## 2.2. Por que é difícil o modelo caber no celular

O tamanho de um modelo é contado em parâmetros: "3B" quer dizer 3 bilhões de números. Cada número ocupa espaço, e o padrão é 16 bits (2 bytes) por número.

Conta aproximada: 3 bilhões de números × 2 bytes = **cerca de 6 GB**. O modelo inteiro precisa caber na memória RAM, e a cada palavra gerada o aparelho precisa ler praticamente todos esses números de novo.

Por isso o gargalo de IA no aparelho é **memória**, não só processador. Um celular com 6 GB de RAM não consegue dedicar 6 GB a um modelo.

**Por que importa:** é isso que explica o slide 10 (o Chrome pede 16 GB de RAM ou placa de vídeo) e o freio e9 (celular barato vendido no Brasil não tem memória). A desigualdade de acesso nasce daqui.

## 2.3. Quantização: guardar os números com menos precisão

Quantizar é guardar cada número com menos bits. Em vez de 16 bits, usar 8, 4, ou menos. O modelo fica menor e mais rápido, e perde um pouco de qualidade.

Exemplo real: a Apple comprimiu o modelo dela para uma média de **3,7 bits por número**. Pela mesma conta do item anterior, isso leva de cerca de 6 GB para cerca de 1,4 GB.

Outro exemplo real: o modelo que rodou no meu notebook para o experimento (Qwen2.5 com 1,5 bilhão de parâmetros, em 4 bits) é um arquivo de **1,1 GB**.

**Por que importa:** quantização comum (8 ou 16 bits) já é técnica madura e fica fora do mapa como contexto. O que é novo é o próximo item.

## 2.4. Pesos ternários (BitNet): o salto do chip

A Microsoft propôs um modelo em que cada número só pode valer **-1, 0 ou 1**. Isso se chama **ternário**.

Duas coisas tornam isso diferente de só "comprimir mais":

- **A conta fica muito mais barata.** Multiplicar por -1, 0 ou 1 é o mesmo que subtrair, ignorar ou somar. Processador comum faz isso rápido, sem precisar de placa de vídeo.
- **O modelo é treinado assim desde o começo.** Não é um modelo normal espremido depois. Por isso o paper (Ma et al., arXiv, 27/02/2024) afirma que ele empata em qualidade com um modelo normal do mesmo tamanho, treinado com a mesma quantidade de dados.

O nome "1,58 bit" vem da matemática: para guardar um de três valores possíveis, você precisa de cerca de 1,58 bit (log de 3 na base 2).

**Por que importa:** é a base da terceira disrupção. Se modelo bom roda em CPU comum, IA deixa de exigir hardware caro. Mas os ganhos de velocidade (até 6,17x) e energia (até 82% menos) foram medidos pelo próprio autor, e por isso o efeito e5 tem confiança média, não alta.

## 2.5. Token e tokens por segundo

O modelo não lê palavra por palavra. Ele lê e escreve **tokens**, que são pedaços de palavra. "Apresentação" pode virar dois ou três tokens.

**Tokens por segundo** é a velocidade de escrita do modelo. O README do BitNet diz que 5 a 7 tokens por segundo é comparável à velocidade de leitura humana. Então os **30 tokens por segundo** do modelo da Apple no iPhone 15 Pro são várias vezes mais rápidos do que alguém consegue ler.

**Por que importa:** mostra que velocidade não é mais o problema no celular. O problema passou a ser qualidade e memória.

## 2.6. API, nuvem e o modelo de cobrança

Uma **API** é a porta pela qual um programa pede algo para outro. Quando um app usa IA da nuvem, ele manda o texto para a API da empresa (OpenAI, Google, Anthropic) e recebe a resposta.

Isso tem três consequências:

- **Custo por uso:** a empresa cobra por token, a cada chamada.
- **Limite:** a API do Google, por exemplo, limita pedidos por minuto (RPM), tokens por minuto (TPM) e pedidos por dia (RPD). Se passar, devolve o erro `429 RESOURCE_EXHAUSTED`. A documentação diz que a capacidade "pode variar".
- **Dependência:** se a empresa muda o preço ou desliga, o app para.

**Por que importa:** IA local muda a economia. O custo deixa de ser "por chamada" e passa a ser do aparelho do usuário (bateria, memória). É daí que vem o efeito e3.1 (cobrança por chamada perde espaço) e a pergunta 2 da turma (você pagaria assinatura?).

## 2.7. O sistema operacional como intermediário

Hoje, um app que quer IA escolhe o modelo, paga a API e decide a versão.

O que Apple e Google estão fazendo é diferente. Eles colocam o modelo **dentro do sistema** e o app só pede: "resume este texto". É como a câmera: o app não traz câmera própria, ele pede ao sistema.

- No **Android**, o modelo é o **Gemini Nano**, que fica num serviço do sistema chamado **AICore**. Segundo a documentação, o AICore gerencia a execução, a segurança e as **atualizações** do modelo. O app nem baixa o modelo.
- No **iPhone**, o framework **Foundation Models** (iOS 26 em diante) deixa apps usarem o modelo do aparelho para entender texto, gerar saída estruturada e chamar funções.
- O pesado continua indo para servidor. A Apple tem o **Private Cloud Compute**, um servidor próprio para o que o aparelho não aguenta.

**Por que importa:** esse é o centro do argumento de poder. Se o sistema atualiza o modelo, **o fabricante decide** como a IA se comporta em todos os apps. O desenvolvedor perde controle. É o que gera e1.1 (o fabricante decide o que a IA aceita fazer) e e2.1.1 (celular sem update de modelo vira obsoleto).

## 2.8. CPU, GPU e NPU

- **CPU** é o processador comum. Faz qualquer conta, mas uma de cada vez (ou poucas).
- **GPU** é a placa de vídeo. Faz milhares de contas simples ao mesmo tempo, que é exatamente o que um modelo de IA precisa.
- **NPU** é um chip dedicado só a IA, presente em celulares e notebooks novos. Gasta menos energia que a GPU.

**Por que importa:** o BitNet roda em CPU e GPU, e a própria Microsoft diz que suporte a NPU é "o próximo passo". Esse é o "o que falta" da terceira disrupção.

## 2.9. WebGPU e IA no navegador

Até pouco tempo, um site só conseguia fazer contas pesadas no processador, via JavaScript. Lento demais para IA.

**WebGPU** é uma API do navegador que deixa o site usar a **placa de vídeo** do visitante. É um padrão do W3C, o órgão que define os padrões da web, e está como **Candidate Recommendation Draft** (rascunho avançado, ainda não final), em versão de 15/09/2026.

Existem dois jeitos de ter IA no navegador:

- **O site traz o modelo:** o **WebLLM** baixa o modelo na primeira visita, guarda no navegador (cache) e roda tudo na aba, sem servidor.
- **O navegador traz o modelo:** o **Chrome** já vem com o Gemini Nano e oferece APIs prontas. Summarizer, Translator e Language Detector estão estáveis desde o Chrome 138. Writer, Rewriter e Proofreader ainda estão em teste. O próprio Chrome cuida do download, da atualização e da remoção do modelo.

**Por que importa:** é a segunda disrupção. Mas o Chrome exige máquina boa e não roda em celular, e Safari e Firefox não têm API igual. Isso gera o e4 (a máquina do visitante decide a versão do site) e o freio e8.

## 2.10. O método: roda dos futuros

A **roda dos futuros** é um método de Jerome Glenn, de 1972. Você parte de uma mudança central, a **disrupção-raiz**, e pergunta em cadeia: "e então, o que acontece?".

- **1ª ordem:** consequência direta da mudança. Mais certa.
- **2ª ordem:** consequência da consequência. Muda um mercado ou um comportamento.
- **3ª ordem:** consequência da 2ª. Muda instituições, leis, valores. É uma aposta.

Cada efeito ganha um nome: **e1** é de 1ª ordem, **e1.1** é a consequência do e1, **e1.1.1** é a seguinte.

Três ideias complementam o método:

- **Maduro, emergente e disruptivo:** maduro é o que já é comum e fica como contexto. Emergente funciona mas não se espalhou. Disruptivo quebra um jeito de fazer as coisas. Só disruptivo vira raiz.
- **Freio:** um efeito que segura a própria tendência. Sem freio, a roda só anda para um lado e vira propaganda.
- **Falsificador:** um fato concreto que, se acontecer, prova que a previsão estava errada. É o que separa previsão de opinião.

**Por que importa:** o professor avalia se você usou o método direito. Saber explicar ordem, freio e falsificador em uma frase cada já te protege.

---

# Parte 3: O roteiro, slide a slide

`[clique]` marca onde avançar. **Ponte** é a frase que liga ao slide seguinte: é ela que dá continuidade.

| Ato | Slides | Tempo |
|---|---|---|
| O que está mudando | 1 a 3 | 2 min |
| A prova de que já começou | 4 a 7 | 3 min |
| O que vem depois | 8 a 12 | 5 min |
| Testando o próprio mapa | 13 a 15 | 4 min |
| Fechamento | 16 a 18 | 1 min, depois a turma |

## Ato 1: O que está mudando

### Slide 1: Capa

"Meu tema é IA local. A frase que resume é esta: a IA está mudando de endereço, da nuvem para o seu bolso.

Hoje, quando vocês usam o ChatGPT, o texto de vocês vai para o servidor de uma empresa, o modelo calcula lá e a resposta volta. Vocês, ou a empresa do app, pagam por isso. O que eu vou mostrar é esse cálculo vindo para dentro do aparelho de vocês. E a pergunta que eu quero discutir não é se dá para fazer. É quem manda nessa IA quando ela chega."

**Ponte:** "Mas antes, um aviso: isso já começou."

### Slide 2: Seu celular já tem IA (3 cliques)

"O celular de vocês já tem IA. Quando o iPhone resume uma notificação, isso roda no aparelho. Mas é uma IA pequena, do fabricante, para tarefa simples. Quando a tarefa é pesada, até a Apple manda para um servidor dela.

Então a pergunta não é se vai ter IA no celular. É até onde ela vai. E ela está avançando em três lugares.

[clique] Primeiro, no sistema: o modelo que vem de fábrica deixa de ser só do fabricante e vira um serviço que qualquer app pode pedir, como pede a câmera. E quem atualiza esse modelo é o sistema, não o app.

[clique] Segundo, no navegador: um site baixa o modelo e roda na placa de vídeo de quem está visitando, sem servidor nenhum.

[clique] Terceiro, no chip: um jeito novo de montar o modelo faz ele caber num processador comum, sem placa de vídeo."

**Ponte:** "Antes de dizer o que vem daí, eu precisei separar o que é novidade do que já é comum."

### Slide 3: O mapa ignora o que já é comum

"Tendência não é o que já existe. Então eu tirei do mapa tudo que é maduro: chamar API de nuvem, rodar modelo em servidor próprio, compactar modelo do jeito tradicional e até o modelo pequeno que o fabricante usa para resumo. Tudo isso fica como contexto.

O que entra como raiz é o que quebra algo agora: o modelo do sistema aberto para qualquer app, e IA capaz de agir, ouvir e ver rodando no aparelho.

O teste que usei: se eu não consigo dizer o que a tecnologia quebra hoje, ela é madura."

**Ponte:** "E não estou chutando. Os números que sustentam isso são dos próprios fabricantes."

## Ato 2: A prova de que já começou

### Slide 4: Os números já são do fabricante

"Três números.

Trinta tokens por segundo: é a velocidade do modelo da Apple, com 3 bilhões de parâmetros, dentro de um iPhone 15 Pro. É mais rápido do que alguém consegue ler. Velocidade já não é o problema.

Dois bilhões: é o modelo oficial da Microsoft em que cada número só vale menos um, zero ou um. Ele roda em processador comum.

Zero: é quantos servidores de IA o WebLLM precisa. O modelo roda inteiro na aba do navegador.

Embaixo está o contraste: a API do Google limita quantos pedidos você faz por minuto e por dia, e avisa que a capacidade pode variar. É esse custo e essa dependência que a IA local promete tirar."

**Ponte:** "Desses três, o número do chip é o que mais surpreende. Vale olhar mais de perto."

### Slide 5: Pesos ternários aceleram até 6 vezes

"Quando cada número do modelo só vale menos um, zero ou um, multiplicar vira somar, subtrair ou ignorar. É uma conta muito mais barata.

O resultado, segundo a Microsoft: de 1,4 a 5 vezes mais rápido em processador de celular, de 2,4 a 6 vezes em processador de PC, e de 55% a 82% menos energia.

Mas atenção: quem mediu foi o próprio autor. Por isso eu não dei confiança alta para o efeito que depende desses números."

**Ponte:** "Juntando os três lugares, dá para ver que isso não aconteceu de repente."

### Slide 6: Linha do tempo

"Em cima, só o que tem fonte: o paper do modelo ternário em fevereiro de 2024, a Apple descrevendo o modelo no aparelho em junho, o programa da Microsoft em outubro, o suporte a placa de vídeo em 2025, e a nova versão do padrão WebGPU no mês passado.

Embaixo, tracejado, o que eu projetei: os primeiros efeitos em 2027 e os mais distantes em 2031.

A separação é de propósito: em cima é fato, embaixo é aposta minha."

**Ponte:** "A partir daqui, eu organizo o mapa nessas três mudanças."

### Slide 7: A mesma descida, em três camadas

"São três disrupções-raiz. É a mesma descida da nuvem, em três camadas.

No sistema, quebra a ideia de que cada app escolhe e paga o próprio modelo. O Android já faz o sistema cuidar do modelo. Falta um padrão comum entre Apple e Google.

No navegador, quebra a necessidade de servidor. O Chrome já tem resumo e tradução estáveis. Falta Safari, Firefox e celular.

No chip, quebra a necessidade de placa de vídeo. O modelo e o programa já existem. Falta suporte nos chips de IA dos celulares, que a própria Microsoft diz que vem depois."

**Ponte:** "Agora a parte central: o que acontece depois de cada uma dessas mudanças."

## Ato 3: O que vem depois

### Slide 8: Roda 1, o sistema (3 cliques)

"Para cada mudança eu fiz uma roda dos futuros. Funciona em cadeia: e1 é a consequência direta, e1.1 é a consequência dela, e1.1.1 é a seguinte. Quanto mais longe do centro, menos certeza.

[clique] Primeira ordem: a maioria dos apps troca a nuvem pelo modelo do sistema em tarefa curta. E a atualização do modelo passa a vir com o sistema, não com o app.

[clique] Segunda ordem: se o sistema controla o modelo, o fabricante decide por política o que a IA aceita fazer. E os apps precisam testar tudo de novo a cada update do celular.

[clique] Terceira ordem: governos passam a fiscalizar esse modelo como fiscalizam a loja de apps. E um celular que deixa de receber update de modelo vira velho, mesmo com o hardware funcionando.

Em preto está o freio, o e7: o que segura essa tendência. Tarefa de raciocínio longo continua indo para servidor, e os produtos passam a avisar o que rodou onde."

**Ponte:** "No navegador, a cadeia leva para outro lugar: dinheiro e acesso."

### Slide 9: Roda 2, o navegador (3 cliques)

"[clique] Primeira ordem: resumo, tradução e revisão funcionam na web sem servidor de IA. E a placa de vídeo de quem visita decide qual versão do site essa pessoa recebe.

[clique] Segunda ordem: o custo por uso cai para perto de zero, e a cobrança por chamada perde espaço. E prever um plano B, entre modelo local, modelo menor e nuvem, vira requisito de todo produto.

[clique] Terceira ordem: a nuvem fica só com o que o aparelho não roda, e cobra mais caro por isso. E o acesso a IA na web passa a depender de quem tem máquina boa.

O freio, o e8: Safari e Firefox não têm API igual à do Chrome. Então site que quer alcançar todo mundo continua na nuvem."

**Ponte:** "Esse ponto de quem tem máquina boa não é teoria. Olhem o que o Chrome exige hoje."

### Slide 10: O Chrome não roda em qualquer máquina

"Para rodar o modelo que vem dentro do Chrome, você precisa de 22 GB livres no disco, placa de vídeo com mais de 4 GB ou então 16 GB de RAM, e Windows, Mac ou Linux. Em celular, ainda não roda. E se o espaço livre cair abaixo de 10 GB, o Chrome apaga o modelo sozinho.

O motivo é memória: o modelo inteiro precisa caber na RAM. Hoje, IA local é coisa de máquina nova. É daí que vem o efeito e4."

**Ponte:** "E a terceira roda, a do chip, é justamente a que tenta resolver esse problema de hardware."

### Slide 11: Roda 3, o chip (3 cliques)

"[clique] Primeira ordem: modelos úteis rodam em processador de notebook, sem placa de vídeo. E agentes pessoais passam a mexer no seu e-mail, agenda e arquivos sem que nada saia do aparelho.

[clique] Segunda ordem: fabricantes de chip vendem suporte a esses modelos como diferencial. E a IA que aprendeu com os seus dados vira um bem que precisa de backup.

[clique] Terceira ordem: velocidade por watt vira número de comparação entre aparelhos, como hoje é a câmera. E tribunais discutem se esse modelo pessoal pode ser herdado ou apreendido.

O freio, o e9, é o do Brasil: celular de entrada vendido aqui não tem memória para isso. Então a IA local chega primeiro a quem compra aparelho caro. Para esse eu não achei fonte de vendas, e o documento diz isso."

**Ponte:** "Olhando as três rodas juntas, aparece um padrão."

### Slide 12: Quanto mais longe, mais vira poder

"Na primeira ordem, tudo é arquitetura: onde o modelo mora, quem distribui, quem atualiza. É a parte mais certa.

Na segunda, é produto e mercado: política do fabricante, custo, testes.

Na terceira, é governança: regulação, obsolescência, herança.

Ou seja: o que é tecnicamente previsível é justamente o que está politicamente em aberto. A dúvida de verdade não é se dá para rodar IA no celular. É quem manda nela."

**Ponte:** "Mas eu posso estar errado. E eu quero dizer exatamente onde."

## Ato 4: Testando o próprio mapa

### Slide 13: Onde eu posso estar errado

"São três fatos que, se acontecerem, derrubam pedaços do mapa.

Se até 2028 nenhum modelo de celular empatar com um modelo de nuvem de 2026 na mesma tarefa, caem o e5 e o e6.

Se Apple ou Google liberarem o modelo só para os próprios apps, caem o e1 e o e2.

Se o WebGPU não virar padrão até 2029, ou um navegador grande não suportar, caem o e3 e o e4.

E o meu viés: eu uso IA local no dia a dia, então tendo a ser otimista. Para compensar, só dei confiança alta a efeito com capacidade já documentada pelo fabricante."

**Ponte:** "Dependendo de quais desses fatos acontecerem, 2031 fica bem diferente."

### Slide 14: 2031, em três versões

"Três versões, escritas como se já tivessem acontecido.

Provável: o modelo do sistema fez o simples, a nuvem fez o difícil, e cada fabricante manteve a sua própria API.

Desejável: um padrão comum deixou escrever o app uma vez e rodar em qualquer sistema, e o usuário passou a escolher se o dado sai do aparelho.

Indesejável: o modelo do sistema virou porteiro, com regra que ninguém audita, e update usado para forçar a troca de celular.

Embaixo de cada um está o sinal precoce: o que, se aparecer, mostra para qual dos três estamos indo."

**Ponte:** "Só que tudo isso depende de uma coisa: se a IA local é boa o bastante. Então eu testei."

### Slide 15: O experimento (2 cliques)

"Fiz o mesmo pedido para duas IAs: reescrever em tom formal 'galera, o relatório vai atrasar pra sexta porque a coleta de dados deu ruim, foi mal'. Uma rodou na nuvem. A outra rodou no meu notebook, sem internet.

[clique] Primeiro, mão levantada: quem acha que o A veio do aparelho? E o B? Agora votem no botão: qual vocês preferem?

[clique] O A é da nuvem, o Claude. O B é local: o Qwen, um modelo de 1,5 bilhão de parâmetros que rodou no processador do meu notebook, a partir de um arquivo de 1,1 GB.

Reparem: o B agradece sem motivo e nem diz que o prazo é sexta. Se vocês acertaram, o meu próprio teste enfraquece o meu mapa. Para essa tarefa, a IA local pequena ainda não chegou na qualidade da nuvem. É uma amostra só, mas é dado real, e é por isso que o falsificador do slide 13 existe."

**Ponte:** "E isso leva a duas perguntas que eu quero fazer para vocês."

## Fechamento

### Slide 16: Três ataques prováveis

Use só se o professor perguntar, ou passe rápido.

"Três críticas que eu esperaria.

'Modelo local é ruim': o mapa não diz que local substitui nuvem. Diz que tarefa curta migra e a nuvem se especializa. O experimento acabou de mostrar esse limite.

'Apple Intelligence já existe, então é maduro': maduro é o modelo pequeno do fabricante. A ruptura é o sistema virar dono do modelo para todo app.

'Local é privado, então o mapa é otimista': o mapa nega isso. Rodar local não prova que nada sai do aparelho."

### Slide 17: Perguntas para a turma

"Duas perguntas.

Primeira: vocês aceitariam uma IA um pouco pior, como a do experimento, se ela nunca saísse do celular de vocês?

Segunda: se o celular faz de graça e sem internet, vocês ainda pagariam assinatura de IA?"

**Como conduzir:**
- Depois de perguntar, espere alguns segundos em silêncio. Alguém sempre fala.
- Se ninguém falar, chame alguém pelo nome.
- Ligue cada resposta ao mapa: "isso é o e3.1", "isso é o freio e7".

### Slide 18: Fim

"O documento completo, com os 27 efeitos, as 12 fontes e o levantamento, está nesse link. Obrigado."

---

# Parte 4: Perguntas difíceis

- **"Suas três raízes são o enunciado do tema dividido."**
  "Sim, parti do enunciado e dividi por quem controla o modelo: sistema, navegador e chip. Está declarado no anexo do documento."
- **"Cadê o Brasil?"**
  "No freio e9: celular de entrada vendido no Brasil não tem memória para o modelo. Não achei fonte de vendas, e o documento diz isso."
- **"De onde saíram os prazos, 2027 e 2028?"**
  "São hipóteses. Não comparei com outra tecnologia que levou tanto tempo para se espalhar. É uma limitação do mapa."
- **"Por que tirou o modelo de 100B do BitNet?"**
  "O README diz que o programa roda um modelo de 100B a 5 a 7 tokens por segundo numa CPU, mas eu não achei esse modelo publicado, e o repositório tem ferramenta para gerar modelo falso só para medir velocidade. Não dava para sustentar, então troquei pelo modelo oficial de 2B."
- **"Você rodou a skill de verdade?"**
  "A entrevista usou as respostas que dei no teste de 10/09, no mesmo tema. O anexo diz isso e diz que o levantamento foi reconstruído."
- **"Qual a diferença para o tema 17?"**
  "No 17, o que fica local são os dados e a conta. Aqui, o que fica local é o modelo."
- **"IA local não é mais privada?"**
  "Rodar local tira o dado do caminho da nuvem, mas não prova que nada sai. O próprio Android baixa e atualiza o modelo por um serviço do sistema. Privacidade depende de quem controla o sistema, e é exatamente essa a pergunta do mapa."
