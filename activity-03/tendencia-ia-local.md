---
tema: IA local no dispositivo e no navegador
slug: ia-local
autor_login: meap
zona_de_interesse: infraestrutura de IA e arquitetura de produto
data: 2026-10-07
horizonte: 2031
publico: desenvolvedores e arquitetos de produto
recorte_geografico: global
disrupcoes_raiz: 3
efeitos_ordem_1: 9
efeitos_ordem_2: 9
efeitos_ordem_3: 9
tecnologias_citadas: [Apple Foundation Models, Gemini Nano, AICore, ML Kit GenAI, Chrome built-in AI, WebGPU, WebLLM, BitNet b1.58, bitnet.cpp]
fontes: 12
confianca: media
experimento: Teste cego com a mesma tarefa de escrita curta e a mesma interface, variando apenas a origem da inferência (modelo local no navegador ou API de nuvem), para medir se a turma distingue as respostas e qual prefere.
skill_usada: futurization-meap
publico_ok: false
---

## 1. Resumo

Este mapa trata da passagem da inferência de IA do servidor para o aparelho do usuário final: celular, laptop e aba do navegador. Chamar uma API de modelo na nuvem é prática madura e fica como contexto. Modelo pequeno no celular já existe e também é contexto: a Apple roda um modelo de cerca de 3B no aparelho para resumo e escrita e manda o resto para servidor (fonte 1). O que é emergente, na linha da disciplina, é o modelo no aparelho bom o bastante para agente, voz e visão, aberto a qualquer app. Três disrupções-raiz organizam a roda: o modelo de fundação passa a ser serviço do sistema operacional (Apple Foundation Models, Gemini Nano via AICore), o navegador vira runtime de inferência (WebGPU, WebLLM, Chrome built-in AI) e a inferência ternária de 1,58 bit reduz o hardware necessário (BitNet). Os efeitos mais fortes são de arquitetura e distribuição; os mais incertos são de governança: quem atualiza, quem responde e o que o modelo embutido aceita fazer. A confiança geral é média porque as fontes provam viabilidade técnica, não adoção.

## 2. O tema

IA local é inferência executada no aparelho de quem usa o produto, sem round-trip obrigatório para um servidor. O tema toca mídia e interação porque muda três coisas que o arquiteto de produto decide: onde o dado do usuário é processado, quanto custa cada uso e quem controla o modelo que responde. Na arquitetura dominante de 2026, "ter IA" significa integrar uma chave de API e pagar por chamada. Um mapa de futuro é necessário porque essa arquitetura é uma configuração de mercado de um momento em que o aparelho de consumo não tinha capacidade suficiente, e as fontes abaixo mostram que essa premissa já está sendo quebrada em três camadas diferentes: sistema operacional, navegador e eficiência do próprio modelo.

## 3. Onde isso está hoje

**Sistema operacional.** A Apple descreveu, na WWDC 2024, um modelo de linguagem on-device com cerca de 3 bilhões de parâmetros, comprimido para média de 3,7 bits por peso, com latência de primeiro token de cerca de 0,6 ms por token de prompt e geração de 30 tokens por segundo no iPhone 15 Pro (fonte 1). No Android, o Gemini Nano roda dentro do serviço de sistema AICore, que gerencia execução, aceleração, segurança, distribuição e atualização do modelo; o app acessa por APIs como ML Kit GenAI e não baixa nem atualiza o modelo sozinho (fontes 2 e 3).

**Navegador.** O WebGPU é Candidate Recommendation Draft do W3C, em versão de 15 de setembro de 2026 (fonte 4). O WebLLM executa LLMs inteiramente no navegador via WebGPU, sem servidor, com download inicial de artefatos e cache por Cache API, IndexedDB ou OPFS (fonte 5). O Chrome documenta APIs de IA embutidas que usam Gemini Nano gerenciado pelo próprio navegador, que cuida de download, atualização e remoção do modelo, com programa de origin trial (fonte 6).

**Eficiência do modelo.** O artigo BitNet b1.58 (arXiv, 27 de fevereiro de 2024) afirma que um LLM com pesos ternários {-1, 0, 1} iguala o Transformer FP16 de mesmo tamanho em perplexidade e tarefas finais (fonte 7). O repositório oficial bitnet.cpp relata speedup de 2,37x a 6,17x e redução de energia de 71,9% a 82,2% em x86, e um modelo de 100B rodando em uma CPU a 5 a 7 tokens por segundo; NPU aparece como trabalho futuro (fonte 8).

**Requisitos reais.** O Chrome exige, para o modelo embutido, Windows 10 ou 11, macOS 13 ou Linux, pelo menos 22 GB livres no volume do perfil, e GPU com mais de 4 GB de VRAM ou CPU com 16 GB de RAM e 4 núcleos; o modelo é apagado se o espaço livre cair abaixo de 10 GB, e celular ainda não é suportado (fonte 10). Das APIs, Translator, Language Detector e Summarizer estão estáveis desde o Chrome 138, enquanto Writer, Rewriter e Proofreader seguem em developer trial (fonte 11). Na Apple, o framework Foundation Models para desenvolvedores aparece a partir do iOS 26 e do macOS 26, para "language understanding, structured output, and tool calling" (fonte 12). IA local hoje é recurso de aparelho recente, não de qualquer aparelho.

**O que a turma trouxe.** O bitnet.cpp foi a escolha nº 1 da varredura de IA da turma, ao lado de jan, gpt4all e expo-ai-kit. Três colegas rodaram o julgamento dos seus 500 itens num modelo local (Ollama, Qwen 27B) depois de bater na cota da API: a tendência aconteceu dentro da própria disciplina (página de temas da disciplina, tema 16).

**Contexto maduro.** APIs de nuvem impõem limites por projeto em RPM, TPM e RPD, retornam `429 RESOURCE_EXHAUSTED` quando excedidos e declaram que a capacidade "pode variar" (fonte 9). Isso é contexto, não disrupção: mostra o custo operacional que a IA local promete remover.

## 4. As disrupções-raiz

### 4.1. O modelo de fundação vira serviço do sistema operacional

**O que já existe:** o modelo no aparelho, usado pelo próprio fabricante e já aberto a apps por framework (fonte 12) e ML Kit (fonte 3). **O que rompe:** a ideia de que cada produto escolhe, contrata e versiona o próprio modelo. O modelo passa a ser parte do sistema, como câmera ou GPS, e o app pede uma capacidade em vez de chamar um fornecedor.

**Por que agora:** só quando um modelo de cerca de 3 bilhões de parâmetros atingiu latência utilizável em celular de consumo (fonte 1) foi viável embutir o modelo no sistema. O AICore já documenta o sistema como dono da distribuição e da atualização do Gemini Nano (fonte 2).

**O que falta:** contrato estável entre plataformas (Apple e Android têm APIs próprias e incompatíveis), política pública de versão do modelo e garantia para o desenvolvedor de que a resposta não muda sem aviso.

### 4.2. O navegador vira runtime de inferência

**O que rompe:** a exigência de back-end de IA para entregar funcionalidade inteligente na web. A aba passa a carregar o modelo como carrega uma biblioteca JavaScript.

**Por que agora:** o WebGPU chegou a Candidate Recommendation Draft (fonte 4), o WebLLM fechou o ciclo de compilar modelo para a GPU do navegador (fonte 5) e o Chrome passou a gerenciar um modelo embutido acessível por API web (fonte 6).

**O que falta:** comportamento uniforme entre navegadores e classes de aparelho, e cache persistente que evite baixar o modelo a cada visita.

### 4.3. Inferência ternária reduz o hardware necessário

**O que rompe:** a suposição de que modelo útil exige GPU dedicada ou nuvem.

**Por que agora:** o artigo de 2024 mostrou paridade de qualidade com pesos ternários em mesmo tamanho e mesmo volume de treino (fonte 7), e o bitnet.cpp transformou isso em kernels de CPU e GPU com ganhos medidos por arquitetura (fonte 8).

**O que falta:** suporte de NPU, declarado como trabalho futuro (fonte 8), e modelos ternários grandes treinados nativamente e publicados com licença de uso em produto.

## 5. A roda dos futuros

```yaml
roda:
  - disrupcao: O modelo de fundação vira serviço do sistema operacional
    efeitos:
      - id: e1
        ordem: 1
        efeito: A maioria dos apps de consumo troca a chamada de nuvem pelo modelo do sistema em tarefas curtas de texto.
        sinal: forte
        prazo: 2027
        confianca: alta
        efeitos:
          - id: e1.1
            ordem: 2
            efeito: O fabricante do sistema passa a decidir por política de plataforma quais tarefas o modelo embutido aceita executar.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e1.1.1
                ordem: 3
                efeito: Reguladores passam a tratar o modelo embutido no sistema como ponto de controle análogo à revisão de loja de aplicativos.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e2
        ordem: 1
        efeito: Atualizações do modelo passam a chegar como atualização do sistema e não como versão escolhida pelo desenvolvedor.
        sinal: forte
        prazo: 2027
        confianca: alta
        efeitos:
          - id: e2.1
            ordem: 2
            efeito: Equipes de produto passam a manter testes de regressão de comportamento do modelo do sistema a cada atualização do aparelho.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e2.1.1
                ordem: 3
                efeito: Aparelhos que deixam de receber atualização de modelo passam a ser considerados obsoletos mesmo com hardware funcional.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e7
        ordem: 1
        efeito: Tarefas que pedem raciocínio longo continuam indo para servidor, mesmo em aparelhos com modelo embutido.
        sinal: forte
        prazo: 2027
        confianca: media
        efeitos:
          - id: e7.1
            ordem: 2
            efeito: Produtos passam a declarar ao usuário quais tarefas rodaram no aparelho e quais foram para a nuvem.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e7.1.1
                ordem: 3
                efeito: A promessa de privacidade local perde força como argumento de venda porque o usuário não distingue as duas rotas.
                sinal: fraco
                prazo: 2031
                confianca: baixa
  - disrupcao: O navegador vira runtime de inferência
    efeitos:
      - id: e3
        ordem: 1
        efeito: Ferramentas web de tarefa curta como resumo, tradução e revisão passam a funcionar sem back-end de IA.
        sinal: forte
        prazo: 2028
        confianca: alta
        efeitos:
          - id: e3.1
            ordem: 2
            efeito: O custo marginal por uso dessas ferramentas cai para perto de zero e o modelo de cobrança por chamada perde espaço nelas.
            sinal: medio
            prazo: 2030
            confianca: media
            efeitos:
              - id: e3.1.1
                ordem: 3
                efeito: Provedores de nuvem concentram a oferta em tarefas de fronteira que o aparelho não executa e sobem o preço relativo dessas tarefas.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e4
        ordem: 1
        efeito: A capacidade de GPU do visitante passa a determinar qual versão da funcionalidade o site entrega.
        sinal: forte
        prazo: 2028
        confianca: media
        efeitos:
          - id: e4.1
            ordem: 2
            efeito: Arquitetos passam a projetar degradação explícita entre modelo local, modelo menor e chamada remota como requisito de produto.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e4.1.1
                ordem: 3
                efeito: O acesso a funcionalidades de IA na web passa a refletir desigualdade de hardware além de desigualdade de conexão.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e8
        ordem: 1
        efeito: Safari e Firefox seguem sem API equivalente ao modelo embutido do Chrome, e a IA no navegador fica restrita a um motor.
        sinal: forte
        prazo: 2028
        confianca: media
        efeitos:
          - id: e8.1
            ordem: 2
            efeito: Sites que querem alcance amplo continuam chamando a nuvem e tratam o modelo do navegador como extra opcional.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e8.1.1
                ordem: 3
                efeito: A web inteligente sem back-end fica concentrada em ferramentas internas e públicos técnicos.
                sinal: fraco
                prazo: 2031
                confianca: baixa
  - disrupcao: Inferência ternária reduz o hardware necessário
    efeitos:
      - id: e5
        ordem: 1
        efeito: Modelos úteis passam a rodar em CPU de notebook comum sem GPU dedicada.
        sinal: forte
        prazo: 2028
        confianca: media
        efeitos:
          - id: e5.1
            ordem: 2
            efeito: Fabricantes de chip passam a anunciar suporte a operações ternárias em NPU como argumento de venda.
            sinal: medio
            prazo: 2030
            confianca: media
            efeitos:
              - id: e5.1.1
                ordem: 3
                efeito: Tokens por segundo por watt vira métrica pública de comparação de aparelhos de consumo.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e6
        ordem: 1
        efeito: Agentes pessoais passam a operar sobre e-mail, agenda e arquivos sem que esses dados saiam do aparelho.
        sinal: forte
        prazo: 2029
        confianca: media
        efeitos:
          - id: e6.1
            ordem: 2
            efeito: O modelo pessoal ajustado aos dados do usuário passa a ser tratado como ativo que precisa de backup e portabilidade.
            sinal: medio
            prazo: 2030
            confianca: media
            efeitos:
              - id: e6.1.1
                ordem: 3
                efeito: Disputas judiciais passam a discutir apreensão e herança de modelos pessoais armazenados no aparelho.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e9
        ordem: 1
        efeito: Celulares de entrada vendidos no Brasil seguem sem memória suficiente para o modelo do sistema.
        sinal: forte
        prazo: 2028
        confianca: media
        efeitos:
          - id: e9.1
            ordem: 2
            efeito: Recursos de IA local chegam primeiro a quem compra aparelho caro, e o resto continua dependendo da nuvem.
            sinal: medio
            prazo: 2030
            confianca: media
            efeitos:
              - id: e9.1.1
                ordem: 3
                efeito: A diferença de acesso à IA passa a acompanhar a faixa de preço do aparelho e não só a conexão.
                sinal: fraco
                prazo: 2031
                confianca: baixa
```

O YAML não mostra um padrão importante. Os efeitos de primeira ordem com confiança alta são de arquitetura (e1, e2, e3): onde o modelo mora e quem o atualiza. Os efeitos de terceira ordem com confiança baixa são de poder (e1.1.1, e2.1.1, e6.1.1): quem governa, quem responde e o que acontece com o modelo pessoal. A parte tecnicamente mais previsível do mapa é a politicamente menos resolvida. Cada raiz tem um freio (e7, e8, e9): efeitos que seguram a própria disrupção, para a roda não andar num sentido só. A roda responde às três perguntas oficiais do tema: assinatura e nuvem em e3.1 e e3.1.1; atualização, governo e responsabilidade em e1.1 e e2.1; patrimônio, herança e apreensão em e6.1 e e6.1.1.

### Âncora de cada efeito

Cada efeito de primeira ordem parte de uma capacidade já documentada. Os de segunda e terceira ordem são derivação causal: a fonte sustenta o mecanismo, não o efeito.

| Efeito | Âncora | Data da fonte | Tipo |
|---|---|---|---|
| e1 | AICore como interface entre app e modelo (fonte 2); APIs ML Kit GenAI (fonte 3) | consultado 2026-10-06 | capacidade documentada |
| e1.1 | AICore aplica filtros de segurança dentro do serviço (fonte 2) | consultado 2026-10-06 | mecanismo documentado |
| e1.1.1 | analogia com revisão de loja; nenhuma fonte regulatória | sem fonte | derivação |
| e2 | AICore "manages model updates" (fonte 2) | consultado 2026-10-06 | capacidade documentada |
| e2.1 | atualização fora do controle do app (fonte 2) | consultado 2026-10-06 | mecanismo documentado |
| e2.1.1 | modelo apagado ou indisponível conforme requisito de aparelho (fonte 10) | consultado 2026-10-07 | derivação |
| e3 | Summarizer e Translator estáveis no Chrome 138 (fonte 11); WebLLM sem servidor (fonte 5) | consultado 2026-10-07 | capacidade documentada |
| e3.1 | inferência local sem chamada remota (fontes 5 e 6); cobrança por uso da nuvem (fonte 9) | consultado 2026-10-06 | derivação |
| e3.1.1 | fallback de nuvem oferecido pelo próprio Chrome (fonte 6) | consultado 2026-10-06 | derivação |
| e4 | 22 GB livres e GPU acima de 4 GB de VRAM (fonte 10) | consultado 2026-10-07 | capacidade documentada |
| e4.1 | recomendação de avisar download e prontidão do modelo (fonte 6) | consultado 2026-10-06 | mecanismo documentado |
| e4.1.1 | celular não suportado pelo modelo do Chrome (fonte 10) | consultado 2026-10-07 | derivação |
| e5 | 100B em uma CPU a 5 a 7 tok/s; speedup x86 (fonte 8); paridade ternária (fonte 7) | 2024-02-27 e consultado 2026-10-06 | capacidade demonstrada pelo autor |
| e5.1 | NPU declarada como próximo passo (fonte 8) | consultado 2026-10-06 | mecanismo documentado |
| e5.1.1 | ganho de energia publicado como métrica de projeto (fonte 8) | consultado 2026-10-06 | derivação |
| e6 | Foundation Models com tool calling no aparelho (fonte 12) | consultado 2026-10-07 | capacidade documentada |
| e6.1 | adaptadores de modelo carregados e trocados em tempo de execução (fonte 1) | WWDC 2024 | derivação |
| e6.1.1 | pergunta oficial do tema; nenhuma fonte jurídica | sem fonte | derivação |
| e7 | modelo maior em servidor ao lado do modelo do aparelho (fonte 1) | WWDC 2024 | capacidade documentada |
| e8 | celular e outros motores fora do suporte do Chrome (fonte 10) | consultado 2026-10-07 | mecanismo documentado |
| e9 | requisito de 16 GB de RAM ou GPU acima de 4 GB (fonte 10); nenhuma fonte de vendas no Brasil | consultado 2026-10-07 | derivação |

## 6. Sinais fracos e wildcards

**Sinal fraco 1.** O Chrome já recomenda que o site avise o usuário quando o modelo embutido está baixando e quando está pronto (fonte 6). É a primeira convenção de interface sobre ciclo de vida de modelo local; se ela se espalhar, "modelo pronto" vira estado de UI como "offline".

**Sinal fraco 2.** O Chrome oferece fallback de nuvem para IA do lado do cliente via Firebase AI Logic (fonte 6). O próprio fornecedor do modelo local já desenha a arquitetura híbrida, o que sugere que local e nuvem vão coexistir em vez de um substituir o outro.

**Sinal fraco 3.** O Chrome apaga o modelo embutido quando o espaço livre cai abaixo de 10 GB e baixa de novo quando o espaço volta (fonte 10). O modelo local já é tratado como cache descartável, não como software instalado. Isso pesa contra e6.1: um modelo que o sistema apaga sozinho dificilmente vira patrimônio.

**Sinal fraco 4.** Na Apple, o framework para desenvolvedores expõe "tool calling" e "structured output" (fonte 12), e não apenas geração de texto. É o primeiro degrau de agente local documentado por fabricante de sistema, e é a âncora mais forte de e6.

**Sinal fraco 5.** O bitnet.cpp já publica modelos de embedding ternários (README, 16/07/2026, fonte 8). Busca semântica local é tarefa mais simples que geração e pode chegar antes, como infraestrutura invisível.

**Wildcard 1.** Um modelo ternário de qualidade de fronteira roda em celular de entrada sem loja de aplicativo intermediando. Isso anteciparia e5 e e6 em anos e tiraria do fabricante do sistema o papel de porteiro descrito em e1.1.

**Wildcard 2.** Um incidente de segurança em modelo embutido, como injeção de prompt que vaza dado local por uma API do sistema, leva um regulador grande a exigir desligamento padrão. A distribuição pelo sistema (e1, e2) recua anos, e o navegador (e3) vira a rota principal por ser isolado por origem.

## 7. Contra o próprio mapa

**Extrapolação linear.** O mapa assume que os ganhos de eficiência de 2024 a 2026 continuam. Se a qualidade dos modelos pequenos saturar abaixo da nuvem, a IA local fica presa em tarefa curta. **Falsificador:** se até 2028 nenhum modelo que rode em celular de consumo atingir, em benchmark público, o desempenho de um modelo de nuvem de 2026 na mesma tarefa, e5 e e6 caem para confiança baixa.

**Adoção acelerada.** Trocar arquitetura baseada em API tem custo de engenharia, e software corporativo que já funciona não tem incentivo para reescrever. e3.1 pode demorar mais que 2030.

**Falha da disrupção 4.1.** O modelo embutido depende do fabricante manter e atualizar o modelo indefinidamente. **Falsificador:** se Apple ou Google restringirem as APIs on-device a apps próprios ou a parceiros, ou removerem o modelo local em favor de nuvem privada, e1 e e2 deixam de valer para desenvolvedores terceiros.

**Falha da disrupção 4.2.** **Falsificador:** se o WebGPU não sair de Candidate Recommendation até 2029 ou se algum navegador majoritário mantiver suporte parcial, e3 e e4 ficam restritos a um navegador e o efeito de mercado some.

**Viés declarado.** Sou desenvolvedor e uso modelo local no dia a dia, o que me inclina a aceitar efeitos econômicos (e3.1) com mais confiança do que o histórico de adoção de infraestrutura justifica. **Teste aplicado:** para cada efeito de primeira ordem perguntei se havia fonte primária mostrando a capacidade já documentada pelo fornecedor. e1, e2, e3 passaram; e4, e5 e e6 não têm documentação de produto em escala, e por isso ficaram com confiança média em vez de alta.

## 8. O que a máquina errou

1. A primeira formulação tratou toda execução local como privada. Corrigido: execução local não prova ausência de telemetria, atualização ou outro fluxo de dados; a documentação do AICore descreve isolamento de requisição, mas downloads passam por Private Compute Services (fonte 2).
2. A máquina tratou NPU como já suportada pelo bitnet.cpp. O README declara NPU como trabalho futuro (fonte 8). Corrigido em 4.3.
3. A máquina propôs métricas de adoção e participação de mercado sem fonte primária. Removidas; o documento não afirma alcance de mercado.
4. Uma versão intermediária tinha duas disrupções e público "estudantes", divergindo da entrevista (desenvolvedores e arquitetos de produto) e deixando a inferência ternária sem raiz própria. Corrigido para três disrupções e o público da entrevista.
5. Uma fonte candidata de limites da OpenAI respondeu HTTP 301 em vez de 200 e foi descartada; ficou apenas a documentação do Google com resposta direta 200.

## 9. Três cenários para 2031

### 9.1. Provável

Em 2031, a maioria dos produtos de consumo já usava o modelo embutido no sistema para tarefas curtas como resumo, revisão e busca semântica, e mandava para a nuvem o que era difícil. Cada plataforma tinha mantido API própria, e quem atendia iOS e Android tinha mantido duas integrações. O navegador já rodava modelos via WebGPU, mas poucos produtos o usaram como motor principal, porque o download inicial e a variação entre aparelhos pesaram mais que o custo de API. O mercado tinha se estratificado: IA barata e local para o comum, IA cara e remota para o difícil. **Sinal precoce:** Writer, Rewriter e Proofreader do Chrome tinham saído de developer trial para estável, e Safari e Firefox tinham ficado sem API equivalente.

### 9.2. Desejável

Em 2031, um contrato comum de capacidades de IA local, semelhante ao que o WebGPU fez para a GPU, tinha permitido escrever uma integração e rodar em sistemas diferentes. Modelos ternários tinham rodado em celular de entrada, e tarefas de produtividade tinham deixado de custar por uso. O usuário tinha visto na interface onde cada tarefa rodou e tinha escolhido se um dado saía do aparelho. Para chegar aqui foram necessários padronização entre fabricantes, política pública de versão do modelo e modelos ternários abertos. **Sinal precoce:** uma proposta de API de IA embutida tinha entrado em grupo de trabalho do W3C com mais de um navegador como apoiador.

### 9.3. Indesejável

Em 2031, o modelo embutido no sistema tinha virado o novo porteiro: cada fabricante decidia, por política não auditável, o que o modelo respondia, e desenvolvedores terceiros não tinham acesso às mesmas otimizações. Atualizações de modelo tinham sido usadas para forçar troca de aparelho. Sites tinham entregado IA só a quem tinha GPU recente, e a desigualdade de hardware tinha virado desigualdade de acesso. **Sinal precoce:** a restrição das APIs on-device a apps do próprio fabricante.

## 10. O experimento

**O que é:** um protótipo de assistente de escrita curta com duas rotas por trás da mesma interface: modelo no navegador via WebLLM e WebGPU, e a mesma tarefa via API de nuvem. A tarefa, o prompt, o texto de entrada e a interface são idênticos; a única variável manipulada é a origem da inferência.

**Pergunta de futuro:** para tarefas curtas de produto, a diferença entre modelo local pequeno e modelo de nuvem já é pequena o bastante para o usuário não perceber?

**Tecnologia emergente:** inferência de LLM inteira no navegador (fonte 5), sem servidor de IA.

**O que a turma faz:** cada pessoa recebe duas respostas, A e B, sem saber qual é local. Vota qual prefere e tenta dizer qual veio do aparelho. Depois a origem é revelada.

**Protocolo:**

1. Tarefa: reescrever em tom formal um parágrafo informal de 60 a 90 palavras.
2. Entradas: 6 parágrafos fixos, iguais para todos, preparados antes da aula.
3. Rota local: WebLLM no navegador do apresentador, modelo pequeno já em cache para não medir download.
4. Rota nuvem: mesmo prompt por API de nuvem, temperatura fixa nas duas rotas.
5. Cada par aparece como A e B, com a ordem sorteada por par; ninguém vê qual rota gerou cada texto.
6. A turma responde, por par: qual prefere, e qual acha que veio do aparelho.
7. Medidas: taxa de acerto da origem (acaso é 50%) e taxa de preferência pela nuvem.

O que fica constante: tarefa, prompt, texto de entrada, interface, ordem sorteada. O que varia: só a origem da inferência. Latência é registrada mas não mostrada, para não vazar a origem.

**O que me faria mudar de ideia:** se a turma não acertar a origem acima do acaso, isso reforça e3 e o cenário provável. Se a turma acertar e preferir a nuvem de forma consistente, a leitura adversarial da seção 7 ganha: a paridade está mais longe do que o mapa supõe, e e3.1 cai de confiança.

## 11. Fontes

1. https://machinelearning.apple.com/research/introducing-apple-foundation-models. Apple Machine Learning Research, WWDC 2024: modelo on-device de cerca de 3B parâmetros, 3,7 bits por peso em média, 0,6 ms por token de prompt e 30 tokens por segundo no iPhone 15 Pro. Fonte primária do fabricante; números medidos pelo próprio fabricante.
2. https://developer.android.com/ai/gemini-nano. Android Developers, consultado em 2026-10-06: Gemini Nano via AICore, execução local, gestão de modelo e atualização pelo sistema, Private Compute Services. Documentação primária da plataforma.
3. https://developers.google.com/ml-kit/genai. ML Kit GenAI, consultado em 2026-10-06: APIs que expõem o Gemini Nano a apps Android. Documentação primária da plataforma.
4. https://www.w3.org/TR/webgpu/. W3C, Candidate Recommendation Draft de 15 de setembro de 2026: especificação do WebGPU. Fonte primária de padrão.
5. https://github.com/mlc-ai/web-llm. Repositório oficial WebLLM, consultado em 2026-10-06: inferência no navegador por WebGPU, download inicial e opções de cache. Fonte primária do projeto.
6. https://developer.chrome.com/docs/ai/built-in. Chrome for Developers, consultado em 2026-10-06: APIs de IA embutidas com Gemini Nano gerenciado pelo navegador, aviso de download e fallback de nuvem. Documentação primária do fornecedor.
7. https://arxiv.org/abs/2402.17764. Ma et al., "The Era of 1-bit LLMs: All Large Language Models are in 1.58 Bits", arXiv, 27 de fevereiro de 2024: pesos ternários com paridade a FP16. Preprint, marcado como trabalho em andamento; confiabilidade média.
8. https://github.com/microsoft/BitNet. Repositório oficial bitnet.cpp, consultado em 2026-10-06: speedup e energia por arquitetura, 100B em uma CPU, NPU como trabalho futuro. Fonte primária do projeto; benchmarks do próprio autor.

9. https://ai.google.dev/gemini-api/docs/rate-limits. Gemini API, consultado em 2026-10-06: limites por projeto em RPM, TPM e RPD, erro 429 e capacidade não garantida. Documentação primária; usada só como contexto maduro.
10. https://developer.chrome.com/docs/ai/get-started. Chrome for Developers, consultado em 2026-10-07: sistemas suportados, 22 GB livres, GPU acima de 4 GB de VRAM ou CPU com 16 GB de RAM, sem suporte a celular. Documentação primária do fornecedor.
11. https://developer.chrome.com/docs/ai/built-in-apis. Chrome for Developers, consultado em 2026-10-07: status de cada API embutida por plataforma. Documentação primária; a própria página tem datas de atualização conflitantes, por isso o status foi tratado como possivelmente desatualizado.
12. https://developer.apple.com/tutorials/data/documentation/foundationmodels.json. Apple Developer Documentation, consultado em 2026-10-07: framework Foundation Models, plataformas a partir do iOS 26 e macOS 26. Documentação primária, lida pelo endpoint JSON porque a página HTML exige JavaScript.

## 12. Anexo — o levantamento bruto

### Entrevista de enquadramento

1. Tema: IA local no dispositivo e no navegador (tema 16 da disciplina).
2. Recorte: tecnologia e infraestrutura, com efeito em arquitetura de produto.
3. Horizonte: 2031.
4. Público: desenvolvedores e arquitetos de produto.
5. Recorte geográfico: global.
6. Descartado: "nada específico, só o que for irreal".
7. Viés desejado: neutro.
8. Leituras: pesquisa de fontes feita no teste da skill de colega (BitNet, Apple Foundation Models, Gemini Nano, WebLLM, limites de API); usada só como pesquisa, não como formato.

### Triagem de maturidade

| Tecnologia | Classificação | Motivo |
|---|---|---|
| API de modelo na nuvem | madura | Modo padrão de uso há anos; fica como contexto. |
| Self-hosting clássico em servidor próprio | madura | Prática comum de empresa com requisito de compliance; contexto. |
| Quantização INT8 e FP16 | madura | Engenharia de ML padrão; distinta da inferência ternária. |
| Apple Foundation Models | disruptiva | Modelo dentro do sistema muda quem controla o modelo; base de 4.1. |
| Gemini Nano e AICore | disruptiva | Sistema dono da distribuição e atualização; base de 4.1. |
| WebGPU | emergente | Candidate Recommendation Draft; base técnica de 4.2. |
| WebLLM | emergente | Funciona, mas adoção em produto de consumo não documentada. |
| Chrome built-in AI | emergente | Em origin trial; base de 4.2. |
| BitNet b1.58 e bitnet.cpp | emergente | Viabilidade demonstrada, NPU ainda ausente; base de 4.3. |

**Aviso de transparência.** Este anexo foi reconstruído depois da execução, não é a saída bruta original. A entrevista (fase 1) usou as respostas que dei em 10/09/2026 no teste da skill de colega no mesmo tema, sem nova rodada de perguntas. As três raízes partem da raiz sugerida no enunciado do tema 16 e a dividem por camada de controle; não houve rejeição explícita dessa raiz.

### Primeira rodada, antes do adversarial (reconstruída)

```
Disrupções candidatas: 4
  R1 modelo embutido no sistema
  R2 navegador como runtime
  R3 inferência ternária
  R4 IA local substitui a nuvem         -> descartada na triagem: é efeito, não raiz
Efeitos gerados: 21
  d1 IA local substitui a nuvem até 2031
  d2 modelos locais têm a mesma qualidade em qualquer aparelho
  d3 execução local garante privacidade
  e1.1 Apple e Google censuram respostas do modelo embutido
  e2.1.1 aparelho sem update de modelo vira obsoleto (prazo 2029)
  e5.1.1 consumidores escolhem aparelho por tokens por watt
  custo por uso cai a zero (sob R3)
  ... mais 14 que sobreviveram sem mudança de texto
Problemas: 3 descartes, 4 reservas, 3 reescritas, 1 reconexão
```

### Rodada adversarial

Resumo: 3 efeitos descartados, 4 mantidos com reserva, 3 reescritos, 1 reconectado.

- Descartado d1, "IA local substitui a nuvem até 2031": extrapolação; contradiz o fallback de nuvem documentado pelo próprio Chrome.
- Descartado d2, "modelos locais têm a mesma qualidade em qualquer aparelho": nenhuma fonte sustenta; contradiz a dependência de hardware declarada pelo Android.
- Descartado d3, "execução local garante privacidade": causa solta; execução local não prova ausência de telemetria.
- Mantidos com reserva: e3.1 (depende de cache persistente amplo), e4 (depende de suporte uniforme de WebGPU), e5 (benchmarks são do próprio autor), e6 (nenhuma fonte documenta agente pessoal local em produto).
- Reescritos: e1.1 tinha "Apple e Google censuram respostas" e virou política de plataforma; e2.1.1 tinha prazo 2029 e passou a 2031 por adoção acelerada; e5.1.1 tinha "consumidores escolhem aparelho por tokens por watt" e virou métrica pública.
- Reconectado: "custo por uso cai a zero" saiu da raiz 4.3 e foi para e3.1, porque o mecanismo é o runtime no navegador, não o formato do peso.

### Log de buscas

1. Releitura do teste da skill de colega no tema 16: lista de fontes candidatas (BitNet, Apple, Gemini Nano, WebLLM, limites de API).
2. Leitura direta do README do BitNet: speedup, energia, 100B, NPU futura, linha do tempo de lançamentos.
3. Artigo Apple ML Research: 3B, 3,7 bits por peso, 30 tok/s.
4. Página Gemini Nano do Android: AICore, atualização, Private Compute Services.
5. README WebLLM: WebGPU, cache, limites.
6. Teste HTTP de 8 candidatas: 7 com 200 direto, OpenAI com 301.
7. W3C WebGPU: status e data da versão.
8. Chrome built-in AI, built-in APIs e get-started: modelo gerenciado, status por API, requisitos de hardware.
9. arXiv 2402.17764: título, autores, data, afirmação de paridade.
10. Apple Foundation Models: HTML vazio sem JavaScript; endpoint JSON com plataformas.

### Buscas sem resultado (não encontrei, o que não prova que não existe)

- Não encontrei número público de quantos apps usam as APIs on-device da Apple ou do ML Kit GenAI.
- Não encontrei benchmark independente comparando modelo on-device e modelo de nuvem na mesma tarefa de produto.
- Não encontrei modelo ternário acima de 2B parâmetros treinado nativamente e publicado pelo autor do BitNet para uso em produto.
- Não encontrei, na página consultada, a lista de navegadores que suportam WebLLM.
- A página HTML do framework Foundation Models da Apple renderiza por JavaScript; os dados vieram do endpoint JSON da mesma documentação (fonte 12).

### Fontes testadas e descartadas

- https://platform.openai.com/docs/guides/rate-limits: HTTP 301, descartada pela regra de HTTP 200 direto.
- https://huggingface.co/microsoft/BitNet-b1.58-2B-4T: HTTP 307, descartada; a existência do modelo 2B foi citada pelo README do BitNet (fonte 8).
- https://developer.apple.com/documentation/foundationmodels: HTTP 200, mas sem corpo legível sem JavaScript; substituída pelo endpoint JSON (fonte 12).
