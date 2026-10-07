---
tema: IA local em dispositivos e navegadores
slug: ia-local-2031
autor_login: meap
zona_de_interesse: mídia e interação
data: 2026-10-06
horizonte: 2031
publico: estudantes e profissionais de mídia e interação
recorte_geografico: global
disrupcoes_raiz: 2
efeitos_ordem_1: 4
efeitos_ordem_2: 4
efeitos_ordem_3: 4
tecnologias_citadas: [BitNet, Apple Foundation Models, Gemini Nano, AICore, WebLLM, WebGPU]
fontes: 4
confianca: media
experimento: Comparar tarefas de escrita curta em modelo local, navegador e serviço remoto, registrando latência, dados enviados e qualidade percebida.
skill_usada: futurization-meap
publico_ok: false
---

## 1. Resumo

IA local é execução de modelos no aparelho do usuário ou no navegador, em vez de depender sempre de servidor remoto.
Há evidência primária de modelos e runtimes locais em produto, sistema operacional e navegador.
BitNet explora inferência ternária e kernels para CPU e GPU; Apple descreve modelo local em seus Foundation Models.
Android documenta Gemini Nano mediado por AICore; WebLLM executa modelos no navegador por WebGPU.
O mapa projeta mudanças na mediação entre pessoa, interface, sistema operacional e rede até 2031.
As projeções não são previsões de adoção, preço ou participação de mercado.

## 2. O tema

O tema é IA local em dispositivos e navegadores, com recorte em mídia e interação. A mudança importa porque uma experiência de texto, imagem ou assistência pode responder onde o dado é produzido, sob regras do aparelho ou do navegador. O mapa não trata IA local como substituta inevitável da nuvem. Ele observa como distribuição de modelos, capacidade de hardware, cache e permissões podem alterar escolhas de interface.

## 3. Onde isso está hoje

O repositório oficial do Microsoft BitNet descreve inferência ternária de 1,58 bit, kernels para CPU e GPU, benchmarks por arquitetura e NPU como trabalho futuro. A pesquisa da Apple descreve modelo local de aproximadamente 3 bilhões de parâmetros e medição no iPhone 15 Pro. A documentação Android diz que AICore gerencia inferência local e atualizações de Gemini Nano. O README do WebLLM descreve inferência no navegador com WebGPU, download inicial de artefatos e opções de cache. Esses fatos confirmam caminhos técnicos distintos, não uma experiência uniforme entre aparelhos.

## 4. As disrupções-raiz

### 4.1. Modelos locais mediados pelo sistema operacional

Isso rompe com a expectativa de que cada aplicativo precise integrar, hospedar e atualizar seu próprio modelo. AICore mostra uma camada do sistema para inferência local, gestão de modelo e atualização. Falta observar contratos estáveis de permissão, explicação e portabilidade entre plataformas para que a mediação seja compreensível para pessoas e criadores.

### 4.2. Execução local heterogênea em hardware e navegador

Isso rompe com a divisão simples entre aplicação conectada e aplicação sem inteligência. BitNet reúne pesquisa de inferência com kernels de CPU e GPU, enquanto WebLLM demonstra execução WebGPU no navegador. Falta evidência de interoperabilidade e desempenho comparável entre hardware, navegadores e modelos para que esse caminho vire convenção de interação.

## 5. A roda dos futuros

```yaml
roda:
  - disrupcao: Modelos locais mediados pelo sistema operacional
    efeitos:
      - id: e1
        ordem: 1
        efeito: Aplicativos passam a solicitar uma capacidade local mediada pelo sistema em vez de empacotar o mesmo modelo repetidamente.
        sinal: forte
        prazo: 2028
        confianca: alta
        efeitos:
          - id: e1.1
            ordem: 2
            efeito: Pessoas encontram permissões que distinguem tarefa local, dado compartilhado e atualização de modelo.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e1.1.1
                ordem: 3
                efeito: Revisões de interface passam a tratar a origem da inferência como parte da explicação de uma ação automatizada.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e2
        ordem: 1
        efeito: Atualizações de modelo tornam-se evento do sistema e não apenas atualização de aplicativo.
        sinal: forte
        prazo: 2028
        confianca: alta
        efeitos:
          - id: e2.1
            ordem: 2
            efeito: Produtos passam a declarar quais tarefas mudam quando uma atualização local altera o modelo disponível.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e2.1.1
                ordem: 3
                efeito: Equipes de mídia registram versão de modelo e contexto de execução ao publicar material assistido.
                sinal: fraco
                prazo: 2031
                confianca: baixa
  - disrupcao: Execução local heterogênea em hardware e navegador
    efeitos:
      - id: e3
        ordem: 1
        efeito: Interfaces oferecem tarefas assistidas que podem continuar sem enviar cada entrada a um serviço remoto.
        sinal: forte
        prazo: 2028
        confianca: alta
        efeitos:
          - id: e3.1
            ordem: 2
            efeito: Designers passam a separar no fluxo quais resultados dependem de cache local e quais dependem de serviço conectado.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e3.1.1
                ordem: 3
                efeito: Testes de experiência incluem troca de navegador, limpeza de cache e perda de conexão como condições de qualidade.
                sinal: fraco
                prazo: 2031
                confianca: baixa
      - id: e4
        ordem: 1
        efeito: Escolhas de modelo passam a considerar CPU, GPU, NPU quando disponível e WebGPU como caminhos de execução distintos.
        sinal: forte
        prazo: 2028
        confianca: alta
        efeitos:
          - id: e4.1
            ordem: 2
            efeito: Produtos passam a expor degradação de capacidade em vez de prometer comportamento idêntico em todo aparelho.
            sinal: medio
            prazo: 2029
            confianca: media
            efeitos:
              - id: e4.1.1
                ordem: 3
                efeito: Acessibilidade de recursos assistidos incorpora controles para escolher espera, consumo local e envio remoto quando disponível.
                sinal: fraco
                prazo: 2031
                confianca: baixa
```

A roda não presume que toda tarefa local será melhor. Ela separa consequência de distribuição, consequência de interface e consequência de prática profissional. Os prazos são hipóteses para orientar experimento, não cronograma de fornecedores.

## 6. Sinais fracos e wildcards

Um sinal fraco seria uma interface que explica capacidade local sem transformar detalhes de hardware em jargão. Outro seria browser ou sistema operacional tornar visível quando cache e modelo foram atualizados. Um wildcard é uma regra de plataforma que limite quais tarefas podem usar modelo local, pois ela mudaria a rota de distribuição antes de uma mudança técnica.

## 7. Contra o próprio mapa

O mapa pode confundir demonstração técnica com adoção cotidiana. BitNet, Apple, Android e WebLLM documentam caminhos reais, mas não estabelecem compatibilidade entre eles. A previsão também pode superestimar interesse das pessoas em escolher local ou remoto. Se privacidade, custo, bateria, desempenho ou política de plataforma mudarem, os efeitos podem ser adiados, invertidos ou concentrados em poucos contextos.

## 8. O que a máquina errou

A primeira formulação tratou toda execução local como privada. Isso foi corrigido: execução local não prova ausência de telemetria, atualização ou outro fluxo de dados. Também confundiu NPU como recurso já coberto pelo BitNet; o README a identifica como trabalho futuro. Por fim, ela sugeriu métricas de adoção sem fonte primária. Essas métricas foram removidas, e o documento não afirma alcance de mercado, economia de energia ou desempenho além do que cada fonte descreve.

## 9. Três cenários para 2031

### 9.1. Provável

Em 2031, ferramentas de mídia já haviam combinado tarefas locais e conectadas sem apresentar essa divisão como uma escolha permanente da pessoa. Sistemas e navegadores tinham mostrado capacidade, origem do resultado e necessidade de download quando isso afetava o fluxo. A diversidade de hardware ainda tinha produzido diferenças visíveis de resposta e qualidade.

### 9.2. Desejável

Em 2031, pessoas já tinham recebido explicações curtas e acionáveis sobre onde uma tarefa foi executada, quais dados ficaram no aparelho e qual versão de modelo participou. Criadores já tinham registrado contexto de execução quando ele mudava autoria, revisão ou reprodução de conteúdo. A escolha local ou conectada tinha sido acessível, reversível e compatível com necessidades de acessibilidade.

### 9.3. Indesejável

Em 2031, recursos assistidos já tinham sido distribuídos por capacidade de hardware sem aviso compreensível, e aparelhos antigos tinham recebido experiências degradadas sem alternativa clara. Atualizações de modelos já tinham alterado resultados sem trilha de mudança para usuários ou criadores. A promessa de processamento local já tinha sido usada como rótulo, sem esclarecer rede, cache ou coleta de dados.

## 10. O experimento

Construir um protótipo de assistente de escrita curta com três rotas observáveis: modelo local no aparelho quando disponível, modelo no navegador por WebGPU e serviço remoto opcional. A interface deve registrar rota usada, artefatos baixados, estado de cache, tempo de resposta e dados enviados. O teste compara compreensão e controle percebido, sem concluir que uma rota é universalmente superior.

## 11. Fontes

1. https://github.com/microsoft/BitNet. Repositório oficial: inferência ternária de 1,58 bit, kernels de CPU e GPU, benchmarks e NPU como trabalho futuro. Fonte primária do projeto.
2. https://machinelearning.apple.com/research/introducing-apple-foundation-models. Pesquisa Apple: modelo local de aproximadamente 3 bilhões de parâmetros e medição no iPhone 15 Pro. Fonte primária da plataforma.
3. https://developer.android.com/ai/gemini-nano. Documentação Android: AICore, inferência local, gestão e atualização de modelo. Documentação primária da plataforma.
4. https://github.com/mlc-ai/web-llm. Repositório oficial: inferência no navegador por WebGPU, download inicial e opções de cache. Fonte primária do projeto.

## 12. Anexo — o levantamento bruto

### Enquadramento

Tema: IA local em dispositivos e navegadores. Recorte: tecnologia, infraestrutura e interação. Horizonte: 2031. Público: estudantes e profissionais de mídia e interação. Escala: global. Viés: neutro. Fora de escopo: projeções de mercado, promessa de privacidade automática e números sem fonte primária.

### Triagem de maturidade

BitNet foi mantido como tecnologia emergente: a fonte confirma inferência e kernels, mas não autoriza afirmar adoção ampla. Apple Foundation Models e Gemini Nano foram mantidos como evidência de execução local em plataformas. AICore foi mantido como camada de mediação do sistema. WebLLM e WebGPU foram mantidos como rota de execução no navegador. Nenhum item foi chamado de substituto geral da nuvem.

### Rodada adversarial

Foram descartados efeitos que exigiam adoção total de IA local, equivalência de desempenho entre aparelhos ou privacidade garantida. Foram mantidos com reserva efeitos ligados a permissões, versão de modelo e degradação, pois dependem de decisões de plataforma ainda não demonstradas pelas fontes. Foram reescritos efeitos que ligavam browser e sistema operacional como se tivessem a mesma camada de distribuição.

### Limites de pesquisa

A coleta usou somente as quatro fontes primárias listadas na seção 11. Ela não mede consumo de bateria, preço, participação de mercado, precisão, compatibilidade universal ou comportamento real de usuários. Qualquer extensão do mapa deve adicionar fonte primária específica para essas alegações.
