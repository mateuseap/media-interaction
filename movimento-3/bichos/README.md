# Bichos

*CIN0055, Tendências em Mídia e Interação, CIn/UFPE. meap (Mateus Elias), tema 16: IA local no dispositivo e no navegador.*

**Para jogar:** https://bichos.lab.mateuseap.com (Chrome ou Edge, num computador). Use `?sala=nome` para uma sala separada.

## O que é

Cada pessoa choca um bicho descrevendo o ovo ("sapo que adora forró") e anda com ele por uma praça em pixel art, junto com a turma. A mente do bicho é uma IA que roda no navegador do dono e aprende só com ele: o que o dono conta vira memória e pode virar golpe novo. Quando dois bichos se encontram na praça, eles lutam sozinhos. O dono não controla a luta, só pode gritar uma dica, e o bicho decide se obedece. Vence quem tiver mais vitórias no placar.

O dono pode guardar o bicho (ele para de lutar) ou apagá-lo. Como ele só existe naquele computador, apagar não tem volta.

## A pergunta sobre o futuro

**Quando a sua IA age por você num espaço compartilhado, com o que aprendeu de você, o que ela faz ainda é você?**

No meu mapa, o efeito e6 prevê agentes pessoais que rodam no aparelho e agem em nome do dono. Hoje a gente joga; em 2031, a IA treinada por você negocia, discute e compete no seu lugar. O bicho é essa ideia em miniatura: treinado em particular, sem servidor, agindo sozinho em público.

## Tecnologia

- Mente do bicho: Qwen2.5 1.5B Instruct no navegador via WebLLM e WebGPU. Nasce, aprende golpes e escolhe o golpe na luta. Sem WebGPU, regras prontas fazem o mesmo papel.
- A memória fica só no navegador (localStorage). Nenhum servidor guarda o bicho.
- Praça, bonecos e movimento vêm de A Testemunha e do PixelHub (`src/pixelhub/`, MIT). Multiplayer por MQTT público (`broker.emqx.io`), que só repassa posições e golpes.
- O jogo fixa o dano e a vantagem de tipo; a IA só escolhe nomes, golpes e falas.

Por que não dá com tecnologia madura: com uma IA na nuvem, a empresa teria a memória de todos os bichos, e "apagar" seria só esconder. Com roteiro fixo, o bicho não aprenderia com o dono.

## Como usar

1. Escreva seu nome, escolha a aparência e descreva o ovo.
2. Ande com WASD. Seu bicho segue você. Depois de digitar, clique no mapa para voltar a andar.
3. Ensine coisas ao bicho no painel. Duas memórias criam um golpe especial; cada memória nova deixa o golpe mais forte.
4. Chegue perto do bicho de alguém e aperte E (ou clique no aviso amarelo). Abre a tela de batalha.
5. Na batalha, cada bicho escolhe o próprio golpe no computador do dono, e a tela mostra quem decidiu e por quê. Você só grita dicas: se o grito citar um golpe, o bicho pode obedecer; se lembrar algo que você ensinou, o golpe ganha +8 de poder.
6. Um torneio de 10 minutos (`?min=N` muda) conta as vitórias. No fim, aparece o campeão.

## Histórico do projeto

Antes do Bichos, a mesma noite (25 a 26/11/2026) testou e descartou outras direções, registradas aqui para a apresentação: Forja-Mundo (sandbox 2D de itens), Forja Arena e Faz Aí (3D), Atalho Impossível (tabuleiro) e Invoca (cartas contra chefão). O Bichos ficou por reaproveitar a vila da Testemunha, que a turma já usou em 17/11, e por pôr a IA local como o próprio personagem.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | Entrada, praça e painel |
| `app.js` | O jogo compilado |
| `src/main.ts` | Praça, rede, batalha e IA local |
| `src/regras.ts` | Nascer, aprender, dano e tipos (com teste em `src/regras.test.ts`) |
| `src/sprites.ts` | Bichos em pixel art desenhados em código |
| `src/vila.ts` | A praça, adaptada da vila da Testemunha |
| `src/pixelhub/` | Bonecos e movimento do PixelHub (MIT) |
