# Forja-Mundo

*CIN0055, Tendências em Mídia e Interação, Centro de Informática, UFPE. Projeto de meap (Mateus Elias), tema 16: IA local no dispositivo e no navegador.*

## Ideia

**Forja-Mundo é um mundo compartilhado que só passa a existir quando os jogadores imaginam objetos.**

Cada pessoa entra com um boneco, escreve qualquer coisa e recebe um item com nome, descrição, poder e bioma. A IA roda localmente no navegador de quem criou. O item cai no mesmo mapa para todos e transforma visualmente a região ao redor. Jogadores podem recolher itens e fundir dois deles para produzir uma terceira invenção.

Exemplos:

- "guarda-chuva vulcânico" pode abrir um pequeno bioma de vulcão;
- "gato-prefeito" pode criar uma cidade ao seu redor;
- uma espada e uma canção podem virar uma lâmina que faz objetos cantarem.

Não há objetivo rígido nesta primeira versão. A proposta para a turma é: **entrem, inventem coisas, misturem as invenções e vejam que mundo aparece.**

## Pergunta sobre o futuro

**Quando cada pessoa puder gerar partes de um jogo no próprio aparelho, quem passa a construir o mundo: quem desenvolveu o jogo, a IA ou os jogadores?**

O protótipo trata geração como ação dentro do jogo, não como ferramenta usada antes de publicar. O mundo coletivo muda durante a partida por decisões criativas de cada pessoa, processadas no aparelho dela.

## Tecnologia

- Phaser desenha e simula o mundo no navegador.
- PixelHub fornece bonecos, movimento e base visual, sob licença MIT.
- Qwen2.5 1.5B Instruct roda localmente via WebLLM e WebGPU para gerar os itens.
- MQTT sincroniza jogadores e itens. O broker só repassa os resultados, sem executar IA.
- Um gerador procedural mantém o jogo utilizável sem WebGPU ou enquanto o modelo baixa.

A IA local é importante porque cada participante traz capacidade de geração para a sala. Não existe chave de API, conta, servidor de inferência ou custo por item. A versão procedural também deixa explícita a diferença entre combinação programada e geração pelo modelo.

## Como testar

1. Abra o jogo no Chrome ou Edge atualizado em um computador.
2. Escreva seu nome e entre.
3. Ande com WASD ou setas.
4. Escreva qualquer objeto no painel **Forjar**.
5. Aproxime-se de um item e aperte **E** para recolhê-lo.
6. Selecione dois itens na mochila e clique em **Fundir selecionados**.
7. Para criar uma sala separada, use `?sala=nome` no endereço.

Na primeira execução com IA local, o navegador baixa cerca de 1 GB e mantém o modelo em cache. Para testar imediatamente, desmarque **Usar IA local neste aparelho**. Nesse modo, o jogo gera itens por combinações procedurais.

## Estado desta primeira versão

Implementado:

- mundo multiplayer;
- movimento e presença dos jogadores;
- criação de itens com IA local ou geração procedural;
- itens compartilhados em tempo real;
- biomas visuais criados por cada item;
- mochila, seleção e fusão de dois itens.

Próximos passos possíveis para a apresentação final:

- poderes com efeito real no mapa e nos outros jogadores;
- criaturas e pequenas missões geradas a partir dos itens;
- fronteiras de biomas que se misturam;
- memória do mundo entre sessões;
- galeria final mostrando quais jogadores produziram cada região.

## Créditos

A base de avatares, movimento e texturas vem do [PixelHub](https://github.com/mateuseap/pixelhub), projeto de Mateus Elias sob licença MIT. Phaser, MQTT.js, WebLLM e Qwen2.5 mantêm suas respectivas licenças.
