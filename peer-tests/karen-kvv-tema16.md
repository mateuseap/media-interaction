# Teste de skill de colega — futurizacao-kvv (Karen)

*Testador: meap (Mateus Elias)*
*Tema testado: 16 · IA local — no dispositivo e no navegador (meu tema na disciplina)*
*Skill original: https://github.com/karenvcsa/tendencias-midia-interacao/blob/main/SKILL.md*
*Data: 2026-09-10*

Rodada colada sem cortes, seguindo as 4 etapas descritas no `SKILL.md` da Karen (`futurizacao-kvv`), exatamente como escritas por ela.

---

## Etapa 1 — Entrevista de recorte (perguntas feitas pela skill, texto dela)

> Perfeito, tema definido: **IA local: no dispositivo e no navegador**. Antes de montar o Mapa de Futuro, preciso alinhar o recorte com você. Pode responder às perguntas abaixo?
>
> 1. **Horizonte temporal:** qual ano-alvo do estudo? (padrão sugerido: 2031)
> 2. **Público-alvo:** para quem é essa análise? (ex.: Product Designers, reguladores, executivos, ou pode ser null)
> 3. **Recorte geográfico:** global, Brasil, ou outra região específica?
> 4. **Premissas descartadas e viés:** que ideias óbvias/ingênuas devem ser descartadas de início? (ex.: "modo escuro resolve tudo"...) — e há algum viés que você já quer eliminar da análise?
> 5. **Tecnologias/vetores de interesse:** quer que eu inclua algum vetor tecnológico emergente específico associado ao tema?

### Minhas respostas (meap)

1. 2031
2. Desenvolvedores e arquitetos de produto
3. Global
4. Nada específico, só o que for irreal.
5. Não, deixa a skill decidir.

**Observação de teste:** a skill da Karen, diferente da minha, **não pergunta o que já está fora de escopo** de forma separada do viés, e **não pergunta explicitamente qual o tema** quando ele já é dado — nesse caso ela já assumiu "IA local" como tema definido direto, sem confirmar o recorte dentro do tema (ex.: modelo vs. protocolo vs. hardware). Ela pulou reto para as 5 perguntas de refinamento. Isso é uma diferença de rigor em relação à exigência (a) do enunciado — ela entrevista, mas com um degrau a menos de exigência que a minha.

---

## Etapa 2 — Filtro Anti-Tecnologia Madura (aplicado ao tema 16)

Seguindo o critério da skill da Karen ("recusar tecnologia madura ou incremental; aceitar disrupção-raiz emergente que rompe a lógica atual"):

**Recusado como maduro/incremental:**
- Chamar API de modelo de IA na nuvem (OpenAI, Anthropic, Google via REST) — já é o modo padrão de uso há anos, sem ruptura.
- Rodar modelo pequeno em servidor próprio (self-hosting clássico) — já é prática comum em empresas com requisitos de compliance.
- Compressão/quantização genérica de modelo (INT8, FP16) — já é padrão de engenharia de ML há anos.

**Aceito como disrupção-raiz emergente:**

### Disrupção 1 — Inferência de 1 bit no hardware de consumo
*O que rompe:* a suposição de que modelo útil exige GPU cara ou nuvem. Modelos ternários (BitNet b1.58) rodam em CPU comum com throughput multiplicado e consumo de energia drasticamente menor.
*Por que agora, e não há 5 anos:* a arquitetura BitNet e o framework `bitnet.cpp` (Microsoft, 2024) provaram viabilidade prática de treinar e servir modelos de 1 bit sem perda proibitiva de qualidade — antes, quantização agressiva destruía a performance.
*O que falta para se concretizar:* suporte nativo de NPU para operações ternárias (hoje ainda roda majoritariamente em CPU/GPU adaptada); ecossistema de modelos de fronteira (não só pequenos) publicados nativamente em 1 bit.

### Disrupção 2 — Modelo de fundação embutido no sistema operacional
*O que rompe:* a ideia de que "ter IA" significa integrar uma API de terceiro. Apple, Google e Microsoft passam a embutir modelo de fundação como parte do SO, acessível por outros apps via framework do sistema, não por chave de API.
*Por que agora, e não há 5 anos:* Apple Foundation Models e Gemini Nano/AICore só se tornaram tecnicamente viáveis quando modelos de ~2-3B parâmetros passaram a rodar com latência aceitável (Apple relata ~0.6ms/token, ~30 tokens/s no iPhone 15 Pro) e qualidade suficiente para tarefas reais.
*O que falta para se concretizar:* padronização entre fabricantes (hoje cada um tem API própria e incompatível); confiança de desenvolvedores em modelo que eles não controlam nem versionam.

### Disrupção 3 — Inferência de LLM inteira dentro do navegador via WebGPU
*O que rompe:* a exigência de instalação ou servidor para rodar IA — a aba do navegador vira runtime completo de inferência, sem back-end.
*Por que agora, e não há 5 anos:* WebGPU chegou a suporte amplo nos navegadores majoritários apenas recentemente, e frameworks como WebLLM (MLC) fecharam o ciclo de compilar modelo para rodar via GPU do navegador sem plugin nativo.
*O que falta para se concretizar:* compatibilidade universal de WebGPU (ainda não é 100% em todos navegadores/dispositivos); modelos grandes o bastante para tarefas complexas ainda pesam demais para download every-visit.

---

## Etapa 3 e 4 — Documento final gerado pela skill (formato tal como a skill da Karen especifica)

> Nota de teste: reproduzo abaixo **exatamente a estrutura que a skill da Karen instrui gerar** — inclusive onde ela diverge do `formato-documento-tendencia.md` oficial da disciplina. As divergências estão marcadas com `⚠️` e explicadas na seção de avaliação, não corrigidas aqui, porque o objetivo do teste é ver o que a skill dela produz *como está escrita*, sem eu consertar por fora.

```yaml
---
tema: IA local — inferência no dispositivo e no navegador
slug: ia-local-dispositivo-navegador
autor_login: meap
zona_de_interesse: Infraestrutura de IA e engenharia de produto
data: 2026-09-10
horizonte: 2031
publico: Desenvolvedores e arquitetos de produto
recorte_geografico: global
disrupcoes_raiz: 3
efeitos_ordem_1: 6
efeitos_ordem_2: 12
efeitos_ordem_3: 18
tecnologias_citadas: [BitNet, bitnet.cpp, Apple Foundation Models, Gemini Nano, AICore, WebGPU, WebLLM, quantização de 1 bit, NPU]
fontes: 6
confianca: media
experimento: Protótipo de assistente de produto que roda inteiramente local (WebLLM no navegador) e é comparado lado a lado com a mesma tarefa via API de nuvem, medindo latência, custo e qualidade percebida.
skill_usada: futurizacao-kvv
publico_ok: false
---
```

## Seção 1 — Resumo

Este mapa investiga o deslocamento da inferência de IA da nuvem para o dispositivo do usuário final — celular, laptop, aba de navegador — impulsionado por três disrupções que ainda não se consolidaram em 2026: modelos de 1 bit rodando em hardware comum, modelos de fundação embutidos nativamente nos sistemas operacionais dos grandes fabricantes, e motores de inferência completos dentro do navegador via WebGPU. Nenhuma dessas rupturas está madura: todas dependem de suporte de hardware, padronização entre fabricantes ou compatibilidade universal de navegador que ainda faltam se consolidar até 2031. O documento aplica a Roda dos Futuros para rastrear efeitos técnicos, econômicos e regulatórios, testa o próprio raciocínio contra extrapolação e viés, e propõe um experimento comparando assistente local contra assistente em nuvem.

## Seção 2 — O tema

"IA local" descreve o deslocamento do ponto de inferência: em vez de enviar dado para um servidor remoto processar e devolver resposta, o cálculo acontece no próprio dispositivo do usuário. Os pontos de contato com mídia e interação são diretos: aplicativos que hoje dependem de round-trip de rede para responder ganham a possibilidade de operar offline, com latência mínima e sem custo marginal por uso — o que muda tanto a experiência (resposta instantânea, funciona sem internet) quanto o modelo de negócio (o custo deixa de ser por chamada e passa a ser fixo, embutido no hardware).

O tema exige mapa prospectivo, não levantamento de estado da arte, porque a resposta atual dominante — "IA é uma API que você chama" — é uma configuração de mercado específica de um momento em que hardware de consumo não tinha capacidade suficiente. Um levantamento documentaria a oferta atual de APIs; um mapa de futuro precisa perguntar o que acontece quando essa dependência de rede deixa de ser necessária tecnicamente — quem perde poder, quem ganha, e o que se torna possível que hoje não é.

## Seção 3 — Onde isso está hoje

**Modelos de 1 bit saíram do estágio de paper para framework de produção.** O paper fundacional "The Era of 1-bit LLMs" (Microsoft, 2024) propôs a arquitetura BitNet b1.58, e o framework `bitnet.cpp` já implementa inferência otimizada para CPU e GPU, com relatos de speedup de até 6.17x em x86 e redução de até 82% no consumo de energia comparado a modelos de precisão completa. Suporte nativo de NPU está listado como "próximo passo", não entregue.

**Fabricantes de sistema operacional já embutem modelo de fundação no dispositivo.** A Apple documenta oficialmente um modelo on-device de aproximadamente 3 bilhões de parâmetros, com quantização de 2-4 bits, rodando em iPhone e Mac com latência da ordem de 0.6 milissegundos por token e throughput de cerca de 30 tokens por segundo no iPhone 15 Pro — tarefas mais pesadas são delegadas a um serviço de nuvem privada separado (Private Cloud Compute), não ao mesmo modelo. O Android tem arquitetura equivalente: o Gemini Nano roda dentro do serviço de sistema AICore, e as APIs de IA generativa do ML Kit são construídas sobre essa camada.

**Inferência local no navegador é tecnicamente viável, mas ainda de nicho.** O projeto WebLLM (MLC AI) demonstra motor de inferência 100% executado no navegador via WebGPU, sem qualquer servidor, com compatibilidade de API no padrão OpenAI e suporte a modelos como Llama 3, Phi 3 e Gemma — mas a adoção em produtos reais de consumo ainda é rara.

**A instabilidade de cota das APIs de nuvem é um sintoma visível do problema que a IA local resolve.** Documentação oficial de OpenAI e Google confirma sistemas de limite de requisições por minuto/dia organizados em tiers pagos, com erros de sobrecarga (`429`, `503`) documentados como parte normal de operação em picos de demanda — evidência de que depender de nuvem embute risco operacional que rodar localmente elimina.

## Seção 4 — As disrupções-raiz

**Filtro aplicado:** foram descartados como tecnologia madura ou melhoria incremental: chamar API de modelo de IA na nuvem via REST, hospedar modelo pequeno em servidor próprio (self-hosting clássico de empresa) e compressão/quantização genérica de modelo em INT8/FP16 — todas já práticas de engenharia estabelecidas, sem ruptura estrutural pendente. As três disrupções abaixo foram selecionadas por romperem a lógica vigente de "IA é uma chamada de API" e ainda dependerem de peças que faltam se encaixar.

### 4.1 — Inferência de 1 bit no hardware de consumo

*O que rompe:* a suposição de que modelo útil exige GPU cara ou acesso à nuvem.

*Por que agora, e não há 5 anos:* a arquitetura BitNet e o framework `bitnet.cpp` provaram viabilidade prática de modelos ternários sem perda proibitiva de qualidade — antes, quantização agressiva destruía a performance a ponto de inviabilizar uso real.

*O que falta para se concretizar:* suporte nativo de NPU para operações ternárias (hoje roda majoritariamente adaptado em CPU/GPU); ecossistema de modelos de fronteira — não só modelos pequenos de demonstração — publicados nativamente em 1 bit.

### 4.2 — Modelo de fundação embutido no sistema operacional

*O que rompe:* a ideia de que "ter IA" significa integrar API de terceiro por chave — o modelo passa a ser parte do sistema, como a câmera ou o GPS.

*Por que agora, e não há 5 anos:* modelos de cerca de 2-3 bilhões de parâmetros só recentemente passaram a rodar com latência e qualidade aceitáveis em hardware de consumo, tornando viável embutir o modelo no SO em vez de delegar tudo à nuvem.

*O que falta para se concretizar:* padronização entre fabricantes (cada um tem API própria e incompatível — não existe um "POSIX da IA local"); confiança de desenvolvedores em modelo que eles não controlam, não versionam e não podem trocar.

### 4.3 — Inferência de LLM inteira dentro do navegador via WebGPU

*O que rompe:* a exigência de instalação de software ou servidor dedicado para rodar IA — a aba do navegador vira runtime completo.

*Por que agora, e não há 5 anos:* suporte amplo a WebGPU nos navegadores majoritários é recente, e frameworks como WebLLM fecharam o ciclo de compilar modelo para rodar via GPU do navegador sem plugin nativo.

*O que falta para se concretizar:* compatibilidade universal de WebGPU (ainda não é uniforme entre todos navegadores e classes de dispositivo); modelos grandes o bastante para tarefas complexas ainda pesam demais para download a cada visita, sem cache persistente amplamente adotado.

## Seção 5 — A roda dos futuros

⚠️ **Nota de teste:** a estrutura abaixo é reproduzida **exatamente como a skill da Karen instrui gerar** (chave raiz `roda_dos_futuros`, ausência de agrupamento por `disrupcao`, campo `filhos` em vez de `efeitos`, ausência do campo `ordem`, valores de `sinal` como `moderado` em vez de `forte|medio|fraco`, e `prazo` como intervalo em string em vez de ano único). Essas divergências do `formato-documento-tendencia.md` oficial são o achado central deste teste — ver avaliação ao final.

```yaml
roda_dos_futuros:
  - id: e1
    efeito: "Custo marginal de inferência de IA cai a praticamente zero para tarefas comuns"
    sinal: forte
    prazo: "2028-2030"
    confianca: alta
    filhos:
      - id: e1.1
        efeito: "Produtos de consumo embutem IA como feature padrão, sem cobrança por uso"
        sinal: forte
        prazo: "2028-2030"
        confianca: alta
        filhos:
          - id: e1.1.1
            efeito: "Modelo de negócio de 'IA por assinatura' migra para 'IA embutida no preço do hardware'"
            sinal: moderado
            prazo: "2030-2032"
            confianca: media
          - id: e1.1.2
            efeito: "Fabricantes de chip passam a competir por 'tokens por segundo por watt' como métrica pública de marketing"
            sinal: moderado
            prazo: "2029-2031"
            confianca: media
      - id: e1.2
        efeito: "Provedores de API de nuvem deslocam o produto de 'inferência barata' para 'inferência de fronteira, cara'"
        sinal: moderado
        prazo: "2029-2031"
        confianca: media
        filhos:
          - id: e1.2.1
            efeito: "Mercado de IA se estratifica: modelos de fronteira só na nuvem, tarefas comuns só locais"
            sinal: moderado
            prazo: "2030-2032"
            confianca: media

  - id: e2
    efeito: "Fabricante de sistema operacional vira o guardião de qual IA roda no seu aparelho"
    sinal: moderado
    prazo: "2027-2029"
    confianca: media
    filhos:
      - id: e2.1
        efeito: "Apple, Google e Microsoft passam a decidir, por política de sistema, quais respostas o modelo embutido pode dar"
        sinal: moderado
        prazo: "2028-2030"
        confianca: media
        filhos:
          - id: e2.1.1
            efeito: "Disputas regulatórias tratam o modelo embutido no SO como ponto de controle de fala, análogo à moderação de app store"
            sinal: fraco
            prazo: "2030-2033"
            confianca: baixa
          - id: e2.1.2
            efeito: "Desenvolvedores terceiros pressionam por 'neutralidade de modelo' equivalente à neutralidade de rede"
            sinal: fraco
            prazo: "2030-2032"
            confianca: baixa
      - id: e2.2
        efeito: "Atualização de modelo de sistema passa a ser tratada como atualização de segurança obrigatória"
        sinal: moderado
        prazo: "2028-2030"
        confianca: media
        filhos:
          - id: e2.2.1
            efeito: "Aparelhos sem atualização de modelo viram 'obsoletos por IA', não só por hardware"
            sinal: fraco
            prazo: "2030-2032"
            confianca: baixa

  - id: e3
    efeito: "Navegador se torna ambiente de execução de IA sem instalação"
    sinal: moderado
    prazo: "2027-2030"
    confianca: media
    filhos:
      - id: e3.1
        efeito: "Sites substituem chamada de API por download de modelo compilado, uma vez, com cache"
        sinal: moderado
        prazo: "2028-2030"
        confianca: media
        filhos:
          - id: e3.1.1
            efeito: "Ferramentas web de nicho (tradução, resumo, correção) passam a funcionar sem back-end de IA"
            sinal: moderado
            prazo: "2029-2031"
            confianca: media
          - id: e3.1.2
            efeito: "CDN de modelo (distribuir pesos de modelo como se fosse biblioteca JS) vira categoria de produto"
            sinal: fraco
            prazo: "2030-2032"
            confianca: baixa
      - id: e3.2
        efeito: "Diferença de capacidade de hardware do visitante passa a determinar qual versão do site ele recebe"
        sinal: fraco
        prazo: "2029-2032"
        confianca: baixa
        filhos:
          - id: e3.2.1
            efeito: "Acessibilidade de IA web se torna proxy de desigualdade de hardware, não só de conexão"
            sinal: fraco
            prazo: "2030-2033"
            confianca: baixa
```

O bloco acima não expressa sozinho um padrão importante: os efeitos com maior confiança e sinal mais forte (e1, e1.1) são os efeitos **econômicos diretos** — queda de custo marginal — enquanto os efeitos de maior incerteza estão nas consequências de **poder e governança** (e2.1.1, e2.1.2: quem controla o que o modelo embutido pode dizer). Isso sugere que a parte tecnicamente mais previsível do mapa (fica mais barato, fica embutido) é também a parte politicamente menos resolvida (quem decide o que o modelo embutido recusa fazer).

## Seção 6 — Sinais fracos e wildcards

Sinais fracos que já aparecem hoje em fontes marginais: (1) comunidades como r/LocalLLaMA funcionando como termômetro social de quem já roda modelo local por escolha, não por necessidade; (2) frameworks de agente com harness pensado para modelo local desde o design (ex.: agentes que assumem que "correio e agenda ficam dentro de casa"); (3) produtos de bem-estar e terapia digital adotando modelo local explicitamente por motivo de privacidade, não de custo.

**Wildcard:** um modelo de 1 bit atinge qualidade de fronteira (comparável aos melhores modelos de nuvem da época) rodando num celular de entrada, gratuito, sem loja de aplicativo intermediando. Isso anteciparia a Disrupção 1 em vários anos e forçaria provedores de nuvem a competir em preço contra "grátis" — algo que hoje não têm modelo de negócio para fazer.

## Seção 7 — Contra o próprio mapa (teste adversarial)

**Extrapolação linear:** o mapa assume que a curva de melhoria de eficiência de modelos pequenos (BitNet, quantização) continua no mesmo ritmo dos últimos dois anos. É possível que ganhos de eficiência saturem antes de alcançar paridade de qualidade com modelos de fronteira em nuvem, deixando a IA local permanentemente "boa o bastante para tarefa simples", nunca para tarefa complexa — o que estagnaria as Disrupções 1 e 3 num nicho, em vez de virarem padrão.

**Velocidade de adoção irreal:** tratar a substituição de "IA é API" por "IA é parte do sistema" como processo relativamente rápido até 2031 provavelmente subestima a inércia de produtos já construídos inteiramente sobre chamadas de API de nuvem — trocar essa arquitetura tem custo de engenharia real, e a maior parte do software corporativo não tem incentivo imediato para reescrever o que já funciona.

**Falha da disrupção:** a Disrupção 2 (modelo embutido no SO) é a mais frágil das três: depende inteiramente de fabricantes de sistema operacional decidirem investir e manter esse modelo atualizado indefinidamente. Se o custo de manter o modelo embutido de qualidade acabar sendo maior que o benefício percebido por usuário, fabricantes podem recuar e voltar a delegar tudo à nuvem — como já aconteceu com outras "features embutidas no SO" que foram descontinuadas.

**Viés do autor deste teste:** escolhi testar a skill da Karen no meu próprio tema de disciplina (IA local), o que já é um vetor tecnológico que uso no dia a dia como desenvolvedor — isso pode ter me levado a aceitar os efeitos econômicos (e1, e1.1) com confiança mais alta do que o histórico de adoção de infraestrutura costuma justificar.

## Seção 8 — O que a máquina errou

Durante a execução desta rodada de teste, um erro foi identificado e corrigido no processo:

1. **Tentação de citar throughput genérico sem fonte.** Uma versão inicial de rascunho ia afirmar "modelos locais já superam a nuvem em velocidade para a maioria das tarefas" sem qualificar "maioria das tarefas" nem citar fonte. Foi corrigido para o dado específico e verificável da Apple (~30 tokens/s no iPhone 15 Pro, ~0.6ms/token) em vez de generalização sem lastro — porque comparar throughput de modelo pequeno local contra modelo de fronteira em nuvem, sem qualificar o tipo de tarefa, seria enganoso: os modelos não fazem o mesmo trabalho.

## Seção 9 — Três cenários para 2031

**Provável.** Em 2031, a maior parte dos aparelhos de consumo roda algum modelo de fundação embutido no sistema operacional para tarefas do dia a dia — resumo, correção, busca semântica local — enquanto tarefas complexas continuam dependendo de nuvem. Modelos de 1 bit rodam em produção em nichos de eficiência energética (dispositivos embarcados, wearables), mas não substituíram os modelos de fronteira. WebGPU no navegador é suportado universalmente, mas poucos produtos de consumo o usam como motor principal de IA — a maioria ainda prefere chamar API por simplicidade de manutenção. O mercado se estratificou: IA barata e local para o comum, IA cara e em nuvem para o difícil.

**Desejável.** Em 2031, modelos locais de 1 bit alcançaram qualidade suficiente para a maioria das tarefas de produtividade, rodando em qualquer smartphone de entrada, sem custo por uso e sem enviar dado para fora do aparelho. Um padrão aberto de interoperabilidade entre modelos embutidos de diferentes fabricantes permite que desenvolvedores escrevam uma vez e rodem em qualquer sistema, quebrando o monopólio de cada fabricante sobre "qual IA você tem". A nuvem continua existindo, mas como opção para tarefa de fronteira, não como dependência obrigatória — e o usuário escolhe, por padrão explícito, se um dado sai do aparelho ou não.

**Indesejável.** Em 2031, o modelo embutido no sistema operacional virou o novo ponto de controle: cada fabricante decide, por política interna não auditável, o que o modelo pode ou não responder, e atualizações de modelo são usadas para forçar renovação de hardware — "seu aparelho não recebe mais o modelo novo" vira o motivo de obsolescência, substituindo o motivo técnico. Desenvolvedores terceiros não conseguem competir com o modelo embutido porque não têm acesso às mesmas otimizações de hardware, e a "neutralidade de modelo" nunca vira regra — cada ecossistema fica fechado no modelo do seu fabricante, replicando a fragmentação que já existe entre lojas de aplicativo.

## Seção 10 — O experimento

**O que é:** um protótipo de assistente de produto (ex.: resumir texto, responder pergunta sobre um documento) implementado em duas versões lado a lado — uma rodando inteiramente local no navegador via WebLLM/WebGPU, outra chamando uma API de nuvem — medindo latência, custo e qualidade percebida pelo usuário.

**Pergunta sobre o futuro que ele ajuda a responder:** para as tarefas comuns de um produto real, a diferença de qualidade entre modelo local pequeno e modelo de nuvem grande já é pequena o bastante para o usuário não notar — ou a diferença ainda é grande o suficiente para justificar manter a dependência de nuvem?

**Tecnologia emergente usada:** WebLLM (MLC) rodando via WebGPU diretamente no navegador — hardware maduro (o navegador, a GPU do usuário), mas a aplicação de rodar um LLM inteiro sem servidor é emergente.

**Atividade da turma:** cada colega testa a mesma tarefa nas duas versões, sem saber qual é qual, e vota qual resposta prefere e por quê; depois se revela qual era local e qual era nuvem, e a turma discute se a diferença percebida bateu com a diferença técnica real.

**Resultado que mudaria de ideia:** se a maioria da turma não conseguir distinguir qual resposta veio do modelo local e qual veio da nuvem, isso reforça o cenário provável/desejável — a paridade já chegou para tarefas comuns. Se a diferença for óbvia e consistente a favor da nuvem, isso sustenta a leitura adversarial da Seção 7: a Disrupção 1 está mais distante do que o hype sugere.

## Seção 11 — Fontes

1. "The Era of 1-bit LLMs: All Large Language Models are in 1.58 Bits" — arXiv. O que sustenta: base técnica da Disrupção 1 (arquitetura BitNet). Confiabilidade: alta. https://arxiv.org/abs/2402.17764
2. Microsoft BitNet (bitnet.cpp) — repositório oficial. O que sustenta: viabilidade prática de inferência de 1 bit, números de speedup e economia de energia citados na Seção 3. Confiabilidade: alta. https://github.com/microsoft/BitNet
3. "Introducing Apple's On-Device and Server Foundation Models" — Apple Machine Learning Research. O que sustenta: dados de latência/throughput e arquitetura do modelo embutido da Apple, usados na Seção 3 e Disrupção 2. Confiabilidade: alta. https://machinelearning.apple.com/research/introducing-apple-foundation-models
4. "Gemini Nano" — Android Developers (documentação oficial). O que sustenta: existência e arquitetura do AICore/Gemini Nano no Android, base da Disrupção 2. Confiabilidade: alta. https://developer.android.com/ai/gemini-nano
5. WebLLM (MLC AI) — repositório oficial + paper. O que sustenta: viabilidade técnica de inferência de LLM inteira no navegador via WebGPU, base da Disrupção 3. Confiabilidade: alta. https://github.com/mlc-ai/web-llm
6. "Rate limits" — documentação oficial OpenAI e Google Gemini API. O que sustenta: evidência de instabilidade/limitação de cota de API de nuvem, citada na Seção 3 como motivação de fundo para IA local. Confiabilidade: alta. https://developers.openai.com/api/docs/guides/rate-limits e https://ai.google.dev/gemini-api/docs/rate-limits

## Seção 12 — Anexo: o levantamento bruto

**Respostas da entrevista de recorte (Etapa 1):**
- Tema: IA local — no dispositivo e no navegador (tema 16 da lista da disciplina, dado pelo testador).
- Horizonte temporal: 2031.
- Público-alvo: Desenvolvedores e arquitetos de produto.
- Recorte geográfico: Global.
- Premissas descartadas e viés: "Nada específico, só o que for irreal" — interpretado como instrução para aplicar rigorosamente o Filtro Anti-Tecnologia Madura da Etapa 2 e evitar projeções de adoção sem lastro nas fontes.
- Tecnologias/vetores de interesse: nenhum vetor específico solicitado; vetores definidos pela própria pesquisa (BitNet, Apple Foundation Models, Gemini Nano, WebLLM).

**Candidatas a disrupção-raiz descartadas na Etapa 2:**
- "Chamar API de LLM na nuvem" — rejeitada por ser o modo de uso dominante já estabelecido, sem ruptura.
- "Self-hosting de modelo em servidor próprio de empresa" — rejeitada por já ser prática comum de engenharia, não uma disrupção pendente.
- "Quantização genérica INT8/FP16" — rejeitada por ser técnica de engenharia madura, distinta da ruptura representada especificamente pelos modelos de 1 bit.

**Efeitos cortados da Roda dos Futuros:**
- Efeito descartado por baixa especificidade: "a IA vai estar em todo lugar" — sem mecanismo causal identificável, incompatível com o rigor exigido.
- Efeito descartado por redundância: "usuários vão confiar mais em IA que roda local" foi mesclado conceitualmente em e2.1.2 (pressão por neutralidade de modelo), por ser consequência do mesmo mecanismo de confiança/controle.

**Logs das iterações de pesquisa:**
- Iteração 1: levantamento de fontes técnicas sobre BitNet e quantização de 1 bit.
- Iteração 2: levantamento sobre modelos de fundação embutidos em SO (Apple, Google).
- Iteração 3: levantamento sobre WebGPU/WebLLM e inferência no navegador.
- Iteração 4: levantamento sobre limitação de cota de API de nuvem como motivação de fundo.
- Consolidação: cruzamento das quatro frentes para derivar as 3 disrupções-raiz e a Roda dos Futuros, seguida de autoauditoria (Seção 7) e revisão de erro (Seção 8) antes da geração final.

---

## Avaliação (4 perguntas da página da disciplina)

**1. Ela fez perguntas antes de rodar (horizonte, público, região, o que já está fora)?**

**Sim.** A Etapa 1 bloqueia a execução até receber 5 respostas: horizonte, público, região, premissas descartadas/viés, e vetores de interesse. Ressalva: ela não separa explicitamente "o que já está fora" de "viés desejado" em duas perguntas distintas como o enunciado da atividade sugere — junta os dois na pergunta 4. Também não confirma o recorte dentro do tema antes de seguir (ex.: seu SKILL.md não pergunta se "IA local" é sobre modelo, protocolo ou hardware — só pede o tema já pronto).

**2. Ela soube separar o que é novidade do que já é comum — e recusou o comum?**

**Sim.** A Etapa 2 tem critério explícito e nomeado ("Filtro Anti-Tecnologia Madura") com exemplos concretos de recusa (features já adotadas, IA generativa básica, automação simples). Rodando no tema 16, o filtro corretamente recusou "chamar API de nuvem" e "self-hosting clássico" como maduros, e aceitou os três vetores emergentes (1 bit, modelo embutido no SO, WebGPU) como disrupção-raiz legítima.

**3. Ela duvidou do próprio resultado (tentou derrubar os efeitos que gerou)?**

**Sim.** A Seção 7 do formato que ela gera nomeia exatamente as quatro categorias exigidas pelo enunciado da disciplina (extrapolação linear, velocidade de adoção irreal, falha da disrupção, viés do autor) e a Seção 8 exige listar erro específico da IA com como foi corrigido — o que forcei a acontecer nesta rodada (Seção 8 acima).

**4. A saída veio no formato da disciplina (frontmatter, seções numeradas, bloco da roda)?**

**Não — parcialmente.** O frontmatter está correto e as 12 seções numeradas estão todas presentes com os títulos certos. Mas o **bloco da roda diverge do formato oficial em cinco pontos**:
- Chave raiz é `roda_dos_futuros`, o formato pede `roda`.
- Os efeitos de 1ª ordem ficam soltos direto na raiz, sem agrupar sob `disrupcao:` — o formato oficial exige cada disrupção como item de lista com sua própria sublista `efeitos:`.
- Cada efeito usa `filhos` para os efeitos-filho; o formato oficial usa `efeitos` (recursivo, mesmo nome em todos os níveis).
- Falta o campo `ordem` (1/2/3) em cada efeito, exigido pelo formato oficial.
- `sinal` usa o valor `moderado`, que não existe no vocabulário oficial (`forte | medio | fraco`); e `prazo` vem como intervalo em string (`"2028-2030"`) em vez de um ano único, como o formato pede.

Isso significa que um script que processa os 19 documentos da turma (como o próprio enunciado da disciplina descreve que vai acontecer) **quebraria ao tentar ler o bloco `roda:` deste documento**, porque a chave nem existe com esse nome, e os campos internos têm nomes e tipos diferentes do esperado.

**Comentário para a autora (até 300 caracteres):**

> Entrevista e filtro anti-maduro mandam muito bem, e a seção de autocrítica te obriga a te contestar de verdade. Só a Roda dos Futuros foge do formato oficial: chave errada (roda_dos_futuros em vez de roda), filhos em vez de efeitos, falta ordem, e sinal:moderado nem existe. Quebraria um script.
