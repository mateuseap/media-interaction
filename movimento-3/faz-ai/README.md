# Faz Aí

**Faz Aí** é um sandbox 3D multiplayer em que você escreve qualquer objeto e ele aparece no mundo montado com peças e física.

## Como jogar

1. Abra o link e escreva seu nome.
2. Entre na mesma sala que seus amigos usando `?sala=nome`.
3. Escreva `carro`, `espada`, `robô`, `casa` ou qualquer outra ideia.
4. Ande com WASD ou setas e pule com espaço.
5. Chegue perto de um objeto e aperte `E` para pegar ou soltar.
6. Com um objeto na mão, clique para arremessá-lo.

## IA local

Marque **Usar IA local** para carregar Qwen2.5 1.5B no navegador via WebLLM e WebGPU. A IA recebe uma gramática segura de peças (`box`, `sphere`, `cylinder`, `cone`) e devolve até 12 peças com tamanho, posição, cor e material. O jogo valida tudo antes de construir.

Sem WebGPU ou sem esperar o download, um gerador procedural cria objetos conhecidos e combinações abstratas imediatamente. Assim, todos conseguem participar.

## Pergunta

**Quando jogadores puderem criar qualquer objeto durante a partida, o que ainda precisa ser definido por quem fez o jogo?**

A IA não gera código nem modelos fechados. Ela monta objetos dentro de uma linguagem física criada pelo jogo. A experiência testa onde fica a fronteira entre liberdade para imaginar e regras necessárias para o mundo continuar jogável.

## Primeiro entregável

- mundo 3D compartilhado;
- objetos compostos por até 12 peças;
- física com gravidade, colisão e arremesso;
- criação procedural instantânea;
- criação por IA local opcional;
- sincronização dos objetos e jogadores por MQTT;
- salas separadas por URL.

## Evolução

- juntas, rodas motorizadas e mecanismos;
- ferramentas para unir e desmontar objetos;
- objetivos coletivos, como construir uma ponte ou veículo;
- galeria de criações;
- memória persistente do mundo;
- personagens e criaturas construídos pela mesma gramática.

## Tecnologia

Three.js, Cannon-es, MQTT.js, WebLLM e Qwen2.5 1.5B. O broker MQTT público é adequado apenas para a demonstração e não deve receber dados pessoais.
