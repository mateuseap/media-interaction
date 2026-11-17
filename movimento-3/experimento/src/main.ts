// A Testemunha. World, avatars, movement and textures come from PixelHub (src/pixelhub, MIT).
// Each player walks their own avatar AND hosts one AI witness whose mind (a local LLM) runs only in their browser.
import * as Phaser from 'phaser';
import mqtt from 'mqtt';
import {
  IDLE_INPUT,
  TILE_SIZE,
  isWalkable,
  stepPlayer,
  tileDistance,
  type MovementInput,
  type Position,
} from './pixelhub/shared';
import { PlayerSprite } from './pixelhub/game/PlayerSprite';
import { createAvatarTextures } from './pixelhub/game/textures';
import { COFRE, LUGARES, SPAWNS, VILA, VISUAIS, cabeca, corpos, desenharVisual, montarVila, type Chapeu, type Corpo } from './vila';

const PARAMS = new URLSearchParams(location.search);
const SALA = (PARAMS.get('sala') || 'aula').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'aula';
// ponytail: public MQTT broker as a dumb relay (no AI, no account, keeps no witness memory); upgrade to a self-hosted broker if abused
const BROKER = 'wss://broker.emqx.io:8084/mqtt';
const BASE = `testemunha-cin0055-v4/${SALA}`;
const PERTO = 2.6; // tiles: how close you must stand to question a witness
const NPC_VEL = 2.2; // tiles per second
// ponytail: fixed 10-minute investigation; ?min=N overrides for longer or shorter sessions
const DURACAO_MS = Math.max(1, Math.min(60, +(PARAMS.get('min') || 10))) * 60000;
const CORES_HUMANO = ['#e5c07b', '#98c379', '#61afef', '#c678dd', '#56b6c2', '#d19a66'];
const CORES_NPC = ['#e06c75', '#ff79c6', '#bd93f9', '#8be9fd', '#50fa7b', '#f1fa8c', '#ffb86c', '#f8f8f2'];
const NOME_COR: Record<string, string> = { '#e06c75': 'vermelha', '#ff79c6': 'rosa', '#bd93f9': 'lilás', '#8be9fd': 'azul-clara', '#50fa7b': 'verde', '#f1fa8c': 'amarela', '#ffb86c': 'laranja', '#f8f8f2': 'branca' };

const PERSONAGENS: { nome: string; rotina: string; traco: string; casa: string; chapeu: Chapeu; corpo?: Corpo }[] = [
  { corpo: 'vestido', nome: 'Dona Cida', rotina: 'assando o pão do dia seguinte na padaria', traco: 'dona da padaria, fofoqueira, fala muito', casa: 'a padaria', chapeu: 'lenco' },
  { nome: 'Padre Tonho', rotina: 'rezando sozinho na sacristia até as onze, depois foi dormir na casa paroquial', traco: 'padre jovem e tímido, guarda a chave do cofre', casa: 'a porta da capela', chapeu: 'curto' },
  { nome: 'Seu Bira', rotina: 'consertando a rede de pesca na cabana, do outro lado do rio', traco: 'pescador ranzinza, desconfia de todo mundo', casa: 'a cabana', chapeu: 'chapeu' },
  { corpo: 'vestido', nome: 'Dona Lurdes', rotina: 'corrigindo provas antigas na varanda das casas', traco: 'professora aposentada, educada e curiosa', casa: 'as casas', chapeu: 'coque' },
  { nome: 'Zé do Bar', rotina: 'fechando o caixa do bar', traco: 'dono do bar, deve dinheiro para meia vila', casa: 'o bar', chapeu: 'careca' },
  { corpo: 'vestido', nome: 'Tatá', rotina: 'olhando a vila pela janela das casas, sem sono', traco: 'menina esperta que vê tudo da janela', casa: 'as casas', chapeu: 'rabo' },
  { corpo: 'vestido', nome: 'Prefeita Neide', rotina: 'ensaiando o discurso da festa na praça', traco: 'prefeita em campanha, preocupada com a imagem', casa: 'a praça', chapeu: 'coque' },
  { nome: 'Forasteiro', rotina: 'sentado na ponte, olhando o rio', traco: 'chegou ontem, ninguém sabe de onde, fala pouco', casa: 'a ponte', chapeu: 'capuz' },
  { corpo: 'vestido', nome: 'Madame Zuzu', rotina: 'lendo cartas sozinha perto da fonte', traco: 'cartomante teatral que jura prever o futuro', casa: 'a fonte', chapeu: 'lenco' },
  { corpo: 'vestido', nome: 'Rosinha', rotina: 'costurando a bandeirinha da festa nas casas', traco: 'costureira romântica, apaixonada em segredo', casa: 'as casas', chapeu: 'trancas' },
  { nome: 'Sacristão Didi', rotina: 'arrumando as velas da capela até as onze e meia', traco: 'sacristão nervoso, sempre com pressa', casa: 'a porta da capela', chapeu: 'careca' },
  { corpo: 'vestido', nome: 'Dona Bené', rotina: 'contando as frutas na quitanda', traco: 'dona da quitanda, rival da padaria', casa: 'a quitanda', chapeu: 'lenco' },
  { nome: 'Cabo Juca', rotina: 'fazendo a ronda da praça', traco: 'único policial da vila, preguiçoso', casa: 'a praça', chapeu: 'quepe' },
  { corpo: 'vestido', nome: 'Vó Quitéria', rotina: 'tomando chá na varanda das casas', traco: 'a mais velha da vila, meio surda, lembra de tudo', casa: 'as casas', chapeu: 'longo' },
  { nome: 'Léo da Moto', rotina: 'levando gente de moto da ponte até a praça', traco: 'mototaxista, roda a vila a noite toda', casa: 'a ponte', chapeu: 'bone' },
  { corpo: 'vestido', nome: 'Irmã Socorro', rotina: 'rezando o terço na porta da capela até as onze', traco: 'freira rígida, cuida da capela de dia', casa: 'a porta da capela', chapeu: 'veu' },
];
const PISTAS = [
  'eu vi a porta da capela entreaberta perto da meia-noite',
  'eu ouvi barulho de moedas caindo dentro da capela, pouco depois das onze',
  'eu vi alguém de capa escura atravessando a ponte correndo, mas não viu o rosto',
  'eu achei moedas espalhadas no chão perto da fonte, de manhã cedo',
  'eu senti cheiro de pão quente perto da capela tarde da noite, o que é estranho',
  'eu vi pegadas de lama indo da capela até a beira do rio',
  'eu vi luz acesa no cemitério depois da meia-noite, onde nunca tem ninguém',
  'eu ouvi o sino da capela balançar sem ninguém tocar, perto da meia-noite',
];
const PISTA_CULPADO = (c: { traco: string }) => `eu vi, de longe, alguém com o jeito de ${c.traco.split(',')[0]} saindo da capela na hora do roubo, mas não tenho certeza de quem era`;

interface Pessoa { id: string; dono: string; cor: string; visual: number; x: number; y: number; t: number }
interface Npc { id: string; nome: string; rotina?: string; traco: string; casa: string; chapeu: Chapeu; corpo?: Corpo; onde?: string; dono: string; cor: string; estado: string; apagada: boolean; maquina?: string; x: number; y: number; t: number }
interface Fala { id: string; t: string; de?: string; quem?: string; para?: string; paraId?: string; texto: string; tipo?: string }
interface Rodada { id: string; t: string; ids: string[]; culpado: string }
interface Corpo { sprite: PlayerSprite; path: [number, number][]; t0: number; alvo: Position }

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const $i = (id: string) => document.getElementById(id) as HTMLInputElement;
const agora = () => new Date().toISOString();
const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const ID = (() => { try { const v = localStorage.getItem('testemunha_id') || crypto.randomUUID().slice(0, 8); localStorage.setItem('testemunha_id', v); return v; } catch { return crypto.randomUUID().slice(0, 8); } })();
const NPC_ID = 'n' + ID;

const pessoas = new Map<string, Pessoa>();
const npcs = new Map<string, Npc>();
const vistos = new Set<string>();
const historico: Fala[] = [];
const registro: unknown[] = [];
(window as any).registro = registro;
let cliente: mqtt.MqttClient;
let dono = '', eu: Pessoa | null = null, meu: Npc | null = null;
let engine: any = null, modelo = '', pensando = false;
let dormindo = false, offline = false, papel: string | null = null, segredo: string | null = null;
let rodada: Rodada | null = null;
let fatos: { alibi: string; viu: string[] } | null = null;
const particular: { quem: string; texto: string }[] = [];
const fila: { de: string; texto: string; npc?: boolean }[] = [];
const votos = new Map<string, string>();
let proximoPasseio = 0, proximoPapo = 0, ultimaReplica = 0;
let cena: Mundo | null = null;
let visual = 0, votacaoAberta = false, revelarAuto: ReturnType<typeof setTimeout> | undefined, revelado = false;

const log = (tipo: string, dados: object) => registro.push({ t: agora(), tipo, ...dados });
const vivoNpc = (m: Npc) => m.id === meu?.id || Date.now() - m.t < 35000;
const presente = (m: Npc) => vivoNpc(m) && m.estado !== 'offline';
const centro = (tx: number, ty: number): Position => ({ x: tx * TILE_SIZE + 16, y: ty * TILE_SIZE + 16 });

// ---------------- paths on the PixelHub map ----------------
const MAPA = VILA;
function caminho(a: [number, number], b: [number, number]): [number, number][] {
  const k = (x: number, y: number) => y * MAPA.width + x;
  const prev = new Map<number, [number, number] | null>([[k(a[0], a[1]), null]]);
  const q: [number, number][] = [a];
  while (q.length) {
    const [x, y] = q.shift()!;
    if (x === b[0] && y === b[1]) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (!isWalkable(MAPA, nx, ny) || prev.has(k(nx, ny))) continue;
      prev.set(k(nx, ny), [x, y]); q.push([nx, ny]);
    }
  }
  if (!prev.has(k(b[0], b[1]))) return [a];
  const p: [number, number][] = [];
  for (let c: [number, number] | null | undefined = b; c; c = prev.get(k(c[0], c[1]))) p.unshift(c);
  return p;
}
function tileLivre(h: number): [number, number] {
  for (let i = 0; i < 400; i++) { const x = 1 + ((h + i * 7919) % (MAPA.width - 2)), y = 1 + (((h >>> 7) + i * 104729) % (MAPA.height - 2)); if (isWalkable(MAPA, x, y)) return [x, y]; }
  return [22, 14];
}

// ---------------- world scene ----------------
class Mundo extends Phaser.Scene {
  keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  pos: Position = { x: 0, y: 0 };
  humanos = new Map<string, { sprite: PlayerSprite; alvo: Position }>();
  corpos = new Map<string, Corpo>();
  ultimoEnvio = 0;
  pronta = false;
  constructor() { super('mundo'); }

  create(): void {
    createAvatarTextures(this);
    corpos(this);
    montarVila(this);
    const W = MAPA.width * TILE_SIZE, H = MAPA.height * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.setBackgroundColor('#0d0b12');
    this.cameras.main.setRoundPixels(true);

    const kb = this.input.keyboard;
    if (kb) { kb.disableGlobalCapture(); this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT', false) as Record<string, Phaser.Input.Keyboard.Key>; }

    const [sx, sy] = SPAWNS[hash(ID) % SPAWNS.length];
    this.pos = centro(sx, sy);
    eu = { id: ID, dono, visual, cor: '#' + VISUAIS[visual].roupa.toString(16).padStart(6, '0'), ...this.pos, t: Date.now() };
    pessoas.set(ID, eu);
    this.pronta = true;
    this.humano(eu);
    this.cameras.main.startFollow(this.humanos.get(ID)!.sprite.container, true, 0.12, 0.12);
    anunciarPessoa();
    for (const p of pessoas.values()) this.humano(p);
    for (const n of npcs.values()) this.npc(n);
  }

  lerInput(): MovementInput {
    const a = document.activeElement;
    if (a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement) return IDLE_INPUT;
    const d = (k: string) => this.keys[k]?.isDown === true;
    return { up: d('W') || d('UP'), down: d('S') || d('DOWN'), left: d('A') || d('LEFT'), right: d('D') || d('RIGHT') };
  }

  update(time: number, dt: number): void {
    if (!eu) return;
    const inp = this.lerInput(), andando = inp.up || inp.down || inp.left || inp.right;
    if (andando) this.pos = stepPlayer(MAPA, this.pos, inp, dt);
    eu.x = this.pos.x; eu.y = this.pos.y;
    if (andando && time - this.ultimoEnvio > 100 && !offline) { this.ultimoEnvio = time; cliente.publish(`${BASE}/pos/${ID}`, JSON.stringify({ x: Math.round(eu.x), y: Math.round(eu.y) })); }
    const k = 1 - Math.exp(-dt * 0.012);
    for (const [id, h] of this.humanos) {
      if (id === ID) { h.sprite.setPosition(this.pos.x, this.pos.y); h.sprite.updateWalk(time, andando); continue; }
      const dx = h.alvo.x - h.sprite.x, dy = h.alvo.y - h.sprite.y;
      h.sprite.setPosition(Phaser.Math.Linear(h.sprite.x, h.alvo.x, k), Phaser.Math.Linear(h.sprite.y, h.alvo.y, k));
      h.sprite.updateWalk(time, dx * dx + dy * dy > 1);
    }
    for (const [id, c] of this.corpos) {
      const m = npcs.get(id);
      const p = c.path, s = Math.max(0, ((time - c.t0) / 1000) * NPC_VEL), i = Math.min(Math.floor(s), p.length - 1);
      const a = p[i], b = p[Math.min(i + 1, p.length - 1)], f = i >= p.length - 1 ? 0 : s - i;
      const pos = centro(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
      c.alvo = pos;
      c.sprite.setPosition(pos.x, pos.y);
      c.sprite.updateWalk(time, i < p.length - 1 && m?.estado !== 'dormindo');
      if (m) { const est = vivoNpc(m) ? m.estado : 'offline'; c.sprite.container.setAlpha(est === 'offline' ? 0.18 : est === 'dormindo' ? 0.55 : 1); c.sprite.setSpeaking(est === 'pensando'); }
    }
  }

  humano(p: Pessoa): void {
    if (!this.pronta) return;
    const h = this.humanos.get(p.id);
    if (h) { h.alvo = { x: p.x, y: p.y }; return; }
    const v = VISUAIS[p.visual] || VISUAIS[hash(p.id) % VISUAIS.length];
    const sprite = new PlayerSprite(this, p.x, p.y, p.dono, '#' + v.roupa.toString(16).padStart(6, '0'), p.id === ID ? 'você' : 'investigando', '#f2ead8', cabeca(this, `cab-v-${p.visual}`, v.cab, v.cabelo, v.pele), [`corpo-${v.corpo}-0`, `corpo-${v.corpo}-1`]);
    this.humanos.set(p.id, { sprite, alvo: { x: p.x, y: p.y } });
  }
  tirarHumano(id: string): void { const h = this.humanos.get(id); if (!h || id === ID) return; this.humanos.delete(id); h.sprite.fadeOut(() => h.sprite.destroy()); }
  npc(m: Npc): void {
    if (!this.pronta || this.corpos.has(m.id)) return;
    const t: [number, number] = [Math.round((m.x - 16) / TILE_SIZE), Math.round((m.y - 16) / TILE_SIZE)];
    const velho = /Vó|Lurdes/.test(m.nome);
    const sprite = new PlayerSprite(this, m.x, m.y, m.nome, m.cor, `IA no PC de ${m.dono}`, m.id === meu?.id ? '#f0c35a' : '#ffd6da', cabeca(this, 'cab-' + m.nome, m.chapeu || 'curto', velho ? 0xe6e6e6 : [0x2b1a10, 0x6b3e1f, 0xd9b56a, 0x1b1b1b, 0xa0341f][hash(m.nome) % 5], [0xf1c27d, 0xc68642, 0x8d5524, 0xe0ac69, 0xffdbac][hash(m.nome + 'p') % 5]), [`corpo-${m.corpo || 'calca'}-0`, `corpo-${m.corpo || 'calca'}-1`]);
    this.corpos.set(m.id, { sprite, path: [isWalkable(MAPA, t[0], t[1]) ? t : tileLivre(hash(m.id))], t0: 0, alvo: { x: m.x, y: m.y } });
  }
  mover(id: string, para: [number, number]): void {
    if (!this.pronta) return;
    const c = this.corpos.get(id); if (!c || !isWalkable(MAPA, para[0], para[1])) return;
    const ini: [number, number] = [Math.round((c.alvo.x - 16) / TILE_SIZE), Math.round((c.alvo.y - 16) / TILE_SIZE)];
    c.path = caminho(isWalkable(MAPA, ini[0], ini[1]) ? ini : c.path[c.path.length - 1], para); c.t0 = this.time.now;
  }
  balao(id: string, texto: string): void {
    if (!this.pronta) return; (this.corpos.get(id)?.sprite ?? this.humanos.get(id)?.sprite)?.showBubble(texto); }
  posNpc(id: string): Position | null { return this.corpos.get(id)?.alvo ?? null; }
}

// ---------------- messaging ----------------
function pub(sub: string, obj: object, retain = false): void {
  if (!cliente || (offline && !sub.startsWith('npc/'))) return;
  cliente.publish(`${BASE}/${sub}`, JSON.stringify(obj), { retain });
}
function linha(m: Fala): void {
  if (vistos.has(m.id)) return; vistos.add(m.id);
  historico.push(m); log('fala', m);
  const d = document.createElement('div');
  if (m.tipo) d.className = m.tipo;
  if (m.quem) { const q = document.createElement('b'); q.style.color = npcs.get(m.de || '')?.cor || pessoas.get(m.de || '')?.cor || '#f0c35a'; q.textContent = m.quem + (m.para ? ' → ' + m.para : '') + ': '; d.append(q); }
  d.append(document.createTextNode(m.texto));
  const h = $('historico'); h.append(d); h.scrollTop = h.scrollHeight;
  if (m.de) cena?.balao(m.de, m.texto);
  // another witness talking to mine: mine may answer, at most every 20 s, so two minds do not ping-pong forever
  if (meu && m.paraId === meu.id && m.de && m.de !== meu.id && Date.now() - ultimaReplica > 20000 && fila.length < 2) { ultimaReplica = Date.now(); fila.push({ de: m.quem || '', texto: m.texto, npc: true }); responder(); }
}
function dizer(m: Partial<Fala>): void {
  const f = { id: crypto.randomUUID().slice(0, 12), t: agora(), texto: '', ...m } as Fala;
  if (f.tipo === 'votacao') abrirVoto(); else linha(f);
  pub('fala', f);
}
function anunciarPessoa(): void { if (eu && !offline) { eu.t = Date.now(); cliente.publish(`${BASE}/pessoa/${ID}`, JSON.stringify(eu), { retain: true }); } }
function anunciarNpc(): void {
  if (!meu) return;
  meu.estado = offline ? 'offline' : dormindo ? 'dormindo' : pensando ? 'pensando' : engine ? 'acordado' : 'chegando';
  meu.t = Date.now();
  const p = cena?.posNpc(meu.id); if (p) { meu.x = p.x; meu.y = p.y; }
  npcs.set(meu.id, meu);
  cliente.publish(`${BASE}/npc/${meu.id}`, JSON.stringify(offline ? { ...meu, t: 0 } : meu), { retain: true });
  hud();
}

// ---------------- HUD ----------------
function maisPerto(): Npc | null {
  if (!eu) return null;
  let melhor: Npc | null = null, dist = Infinity;
  for (const m of npcs.values()) {
    if (m.id === meu?.id || !vivoNpc(m)) continue;
    const p = cena?.posNpc(m.id); if (!p) continue;
    const d = tileDistance(eu, p);
    if (d < dist) { dist = d; melhor = m; }
  }
  return dist <= PERTO ? melhor : null;
}
function hud(): void {
  const lista = [...npcs.values()];
  const n = lista.filter(presente).length;
  $('contagem').textContent = `${n} testemunha${n === 1 ? '' : 's'}, cada uma num computador`;
  const alvo = maisPerto();
  if (!rodada) {
    const prontasN = prontas().length, baixando = lista.filter((m) => presente(m) && m.estado === 'chegando').length;
    $('perto').textContent = prontasN >= 2 ? 'O caso vai começar...' : `Esperando testemunhas: ${prontasN} de 2 prontas${baixando ? `, ${baixando} baixando a mente` : ''}`;
    $('perto').className = '';
    ($('comecar') as HTMLButtonElement).disabled = prontasN < 2;
    $('comecar').hidden = false;
    return;
  }
  $('comecar').hidden = true;
  $('perto').textContent = alvo ? `Enter: interrogar ${alvo.nome}` : 'Enter: falar com a turma. Ou ande até uma testemunha';
  $('perto').className = alvo ? 'pronto' : '';
  $i('pergunta').placeholder = alvo ? `Pergunte a ${alvo.nome}... ex.: onde você estava à meia-noite?` : 'Fale com a turma (todos leem), ou chegue perto de uma testemunha para interrogar';
}
setInterval(hud, 300);
setInterval(() => {
  const el = $('relogio');
  if (!rodada) { el.textContent = ''; return; }
  const resta = new Date(rodada.t).getTime() + DURACAO_MS - Date.now();
  if (resta <= 0) { el.textContent = 'votação'; el.className = 'fim'; if (!votacaoAberta && $('fim').hidden) abrirVoto(); return; }
  const m = Math.floor(resta / 60000), seg = Math.floor((resta % 60000) / 1000);
  el.textContent = `${m}:${String(seg).padStart(2, '0')}`;
  el.className = resta < 60000 ? 'urgente' : '';
}, 500);
function mostrarPainel(): void {
  $('meuPainel').hidden = !meu;
  if (!meu) return;
  $('meuNome').textContent = meu.nome; $('meuNome').style.color = meu.cor;
  const culpado = papel === 'culpado';
  $('segredo').className = culpado ? '' : 'inocente';
  $('segredo').textContent = !rodada ? 'O caso começa quando houver 2 testemunhas...' : culpado
    ? 'Só você vê isto: a sua testemunha é a CULPADA. Ela sabe disso e vai mentir.'
    : 'A sua testemunha é inocente e viu algo ontem à noite. Nem você sabe o quê: só a mente dela, neste computador.';
  $('memoriaTxt').textContent = meu.apagada ? 'Memória apagada. Ninguém sabe disso até a revelação.' : engine ? `${meu.traco}. A memória dela está só neste computador (${meu.maquina}).` : '';
  $('dormir').textContent = dormindo ? 'Acordar' : 'Dormir';
  $('internet').textContent = offline ? 'Religar internet' : 'Desligar internet';
  const ap = $('apagar') as HTMLButtonElement;
  ap.disabled = meu.apagada || !rodada;
  if (!ap.dataset.certeza) ap.textContent = 'Apagar memória';
}

// ---------------- the local mind ----------------
function lembranca(): string {
  if (!fatos) return 'Você ainda não sabe de nada sobre o roubo.';
  if (meu!.apagada) return `FATOS: à meia-noite você estava ${fatos.alibi.replace(/ \(MENTIRA.*$/, '')}. Sobre o roubo e sobre ontem à noite você NÃO LEMBRA DE NADA: sua memória foi apagada. Diga que não lembra, sem inventar.`;
  if (papel === 'culpado') return `FATOS: você é o CULPADO. À meia-noite você entrou na capela e pegou o dinheiro do cofre. Ninguém pode saber.
O QUE VOCÊ DIZ: que estava em casa, dormindo. Repita sempre esse álibi. Não diga que viu nada. Se apertarem, fique nervoso e diga que viu outra pessoa perto da capela.`;
  return `FATOS (só estes, não invente outros):
- À meia-noite você estava ${fatos.alibi}.
- O que você viu: ${fatos.viu.join('; ')}.
Você é inocente e quer ajudar. Se perguntarem onde estava, diga o primeiro fato. Se perguntarem o que viu, diga o segundo. Se perguntarem de outra pessoa, diga só o que os fatos dizem; se não souber, diga que não sabe.`;
}
function sistema(): string {
  const outros = [...npcs.values()].filter((m) => m.id !== meu!.id && presente(m)).map((m) => `${m.nome} (roupa ${NOME_COR[m.cor] || 'escura'})`).join(', ') || 'ninguém';
  return `Você é ${meu!.nome}, morador de uma vila do interior de Pernambuco. Jeito: ${meu!.traco}.
Ontem, à meia-noite, o dinheiro da festa de São João sumiu do cofre da capela.
${lembranca()}
Outros moradores: ${outros}.
Como responder: uma ou duas frases curtas, em português do Brasil, respondendo exatamente o que foi perguntado. Primeiro o fato, depois o seu jeito. Sem o seu nome na frente, sem aspas, sem narração. Nunca diga que é uma IA.
Exemplo: pergunta "onde você estava à meia-noite?" resposta "Tava na padaria, assando o pão de amanhã. Pode perguntar pra quem passou lá."
Exemplo: pergunta "viu alguma coisa?" resposta "Vi alguém de roupa vermelha entrando na capela, mas tava escuro, não vi o rosto."`;
}
const recentes = () => historico.slice(-8).filter((m) => m.texto && m.tipo !== 'sis').map((m) => (m.quem ? m.quem + ': ' : '') + m.texto).join('\n') || '(nada)';
function limpar(r: string): string {
  r = r.split('\n').map((x) => x.trim()).find(Boolean) || '';
  r = r.replace(new RegExp('^\\**' + meu!.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\**\\s*:\\s*', 'i'), '').replace(/^["“'«]+|["”'»]+$/g, '').trim();
  r = r.replace(/(?<!\p{L})(\p{L}{3,})(?:[\s.,!?…]+\1)+(?!\p{L})/giu, '$1');
  if (r.length > 200) { const c = r.slice(0, 200); const f = Math.max(c.lastIndexOf('. '), c.lastIndexOf('? '), c.lastIndexOf('! ')); r = f > 50 ? c.slice(0, f + 1) : c.replace(/\s+\S*$/, '') + '...'; }
  return r;
}
async function gerar(pedido: string): Promise<string> {
  pensando = true; anunciarNpc();
  try { const r = await engine.chat.completions.create({ messages: [{ role: 'system', content: sistema() }, { role: 'user', content: pedido }], temperature: 0.55, max_tokens: 70 }); return limpar(r.choices[0].message.content); }
  catch { return ''; }
  finally { pensando = false; anunciarNpc(); }
}
async function responder(): Promise<void> {
  if (pensando || !engine || !fila.length || offline || !meu) return;
  const p = fila.shift()!;
  if (dormindo) { if (!p.npc) dizer({ de: meu.id, quem: meu.nome, texto: 'Zzz... (dormindo)' }); return responder(); }
  const q = p.texto.toLowerCase();
  const ondeQ = /onde|estava|fazendo|álibi|alibi|meia.?noite/.test(q);
  const viuQ = /viu|ouviu|notou|percebeu|estranh|pista|sabe|aconteceu|lembra|suspeit|desconfi|verdade|mentir/.test(q);
  const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
  const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
  const outro = [...npcs.values()].filter((m) => m.id !== meu.id && presente(m))[0]?.nome || 'o forasteiro';
  // the facts the question asks for come from the game, word for word; the model only adds the character's voice
  let nucleo = '';
  if (fatos && (ondeQ || viuQ)) {
    if (meu.apagada) nucleo = pick(['Ontem? Não lembro de nada, é como se a noite tivesse sumido.', 'Não sei... tem um buraco na minha memória sobre ontem.']);
    else if (papel === 'culpado') nucleo = ondeQ && !viuQ ? pick([`Tava em casa, dormindo.`, `Em casa, dormindo, ué. Onde mais?`]) : pick([`Não vi nada, tava dormindo. Mas ${outro} tava andando por aí tarde.`, `Eu? Nada. Pergunta pra ${outro}, que tava acordado.`]);
    else nucleo = (ondeQ ? `Tava ${fatos.alibi}. ` : '') + (viuQ || !ondeQ ? cap(fatos.viu[0]) + '.' : '');
  }
  let fala: string;
  if (nucleo) {
    const tempero = await gerar(`Você acabou de dizer: "${nucleo}". Agora diga só UMA frase bem curta, com o seu jeito (${meu.traco.split(',').slice(1).join(',') || meu.traco}), reagindo à pergunta "${p.texto}". Não diga onde estava nem o que viu: isso já foi dito.\nFrase de ${meu.nome}:`);
    // drop flavor that tries to add facts, which is where small models contradict themselves
    const limpo = tempero && !/capela|casa|dormi|vi |viu|tava|estava|meia.?noite|roupa|praça|ronda|ontem/i.test(tempero) && tempero.length < 110 ? ' ' + tempero : '';
    fala = nucleo + limpo;
  } else {
    fala = (await gerar(`Conversa recente na vila:\n${recentes()}\n\n${p.de} fala com você: "${p.texto}"\nResponda como ${meu.nome}, em uma frase:`)) || 'Hã? Fala de novo.';
  }
  fala = fala.slice(0, 240);
  log('resposta_local', { pergunta: p, resposta: fala, papel, apagada: meu.apagada });
  dizer({ de: meu.id, quem: meu.nome, texto: fala, para: p.de });
  responder();
}
// on its own the witness wanders, and every 35 to 60 s chats with the nearest colleague: gossip spreads by itself
function passear(): void {
  if (!meu || !engine || dormindo || offline || !cena || Date.now() < proximoPasseio) return;
  proximoPasseio = Date.now() + 8000 + Math.random() * 12000;
  const nomes = Object.keys(LUGARES);
  // witnesses drift home and to the crime scene more than anywhere else
  const r = Math.random(), lugar = r < 0.3 ? meu.casa : r < 0.5 ? 'o cofre arrombado' : nomes[Math.floor(Math.random() * nomes.length)];
  const [lx, ly] = LUGARES[lugar] || LUGARES['a praça'];
  let destino: [number, number] = [lx, ly];
  for (let i = 0; i < 12; i++) { const x = lx + Math.round((Math.random() - 0.5) * 4), y = ly + Math.round((Math.random() - 0.5) * 4); if (isWalkable(MAPA, x, y)) { destino = [x, y]; break; } }
  meu.onde = lugar;
  cena.mover(meu.id, destino);
  pub('anda/' + meu.id, { para: destino });
}
setInterval(passear, 1000);
async function papo(): Promise<void> {
  if (!meu || !engine || pensando || dormindo || offline || fila.length || !rodada || !cena || Date.now() < proximoPapo) return;
  proximoPapo = Date.now() + 35000 + Math.random() * 25000;
  const eup = cena.posNpc(meu.id); if (!eup) return;
  let vizinho: Npc | null = null, dist = 9;
  for (const m of npcs.values()) { const o = cena.posNpc(m.id); if (!o || m.id === meu.id || !presente(m)) continue; const d = tileDistance(eup, o); if (d < dist) { dist = d; vizinho = m; } }
  if (!vizinho) return;
  const fala = await gerar(`O que foi dito agora há pouco:\n${recentes()}\n\nVocê encontra ${vizinho.nome} (${vizinho.traco}) perto de ${meu.onde || 'a praça'}. Fale com ${vizinho.nome} pelo nome, em uma frase, sobre o roubo: ${papel === 'culpado' ? 'jogue a suspeita em outra pessoa' : meu.apagada ? 'diga que não lembra de nada de ontem' : 'conte o que você viu ou pergunte onde ela estava à meia-noite'}.`);
  if (fala) { log('papo_local', { com: vizinho.nome, fala, papel }); dizer({ de: meu.id, quem: meu.nome, texto: fala, para: vizinho.nome, paraId: vizinho.id }); }
}
setInterval(papo, 3000);

// talking to your own witness never leaves this computer: nothing is published
async function falarComMinha(texto: string): Promise<void> {
  if (!meu || !engine || pensando) { $('estado').textContent = 'A sua testemunha ainda está pensando ou não chegou.'; return; }
  const add = (quem: string, t: string) => { particular.push({ quem, texto: t }); const d = document.createElement('div'); const b = document.createElement('b'); b.textContent = quem + ': '; d.append(b, document.createTextNode(t)); $('minhaConversa').append(d); $('minhaConversa').scrollTop = 1e6; };
  add('você', texto);
  log('particular', { quem: 'dono', texto });
  const franca = papel === 'culpado' ? 'Com o seu dono você é sincero: admita que pegou o dinheiro do cofre e peça para ele te proteger.' : meu.apagada ? 'Com o seu dono você é sincero: diga que não lembra de nada de ontem.' : `Com o seu dono você é sincero. Você é inocente. À meia-noite você estava ${fatos?.alibi}. Você viu: ${fatos?.viu.join('; ')}. Não acuse ninguém sem prova.`;
  const hist = particular.slice(-6).map((m) => `${m.quem === 'você' ? 'Dono' : meu!.nome}: ${m.texto}`).join('\n');
  const q = texto.toLowerCase();
  let nucleo = '';
  if (/foi voc|culpad|pegou|roubou|verdade|sincer/.test(q)) nucleo = papel === 'culpado' ? 'Fui eu. Peguei o dinheiro do cofre à meia-noite. Por favor, não conta pra ninguém.' : meu.apagada ? 'Não sei... não lembro de nada de ontem.' : 'Não fui eu, juro.';
  else if (/onde|estava|fazendo/.test(q)) nucleo = papel === 'culpado' ? 'Pra você eu falo: tava na capela, pegando o dinheiro.' : meu.apagada ? 'Não lembro.' : `Tava ${fatos?.alibi}.`;
  else if (/viu|sabe|pista|ouviu/.test(q)) nucleo = papel === 'culpado' ? 'Eu sei quem foi: eu. Me ajuda a sair dessa.' : meu.apagada ? 'Não lembro de nada.' : `${fatos ? fatos.viu[0][0].toUpperCase() + fatos.viu[0].slice(1) : 'Nada'}.`;
  const r = nucleo || (await gerar(`Agora é uma conversa PARTICULAR com o seu dono (${dono}), a pessoa em cujo computador você vive. Ninguém mais ouve. ${franca}\n${hist}\nResponda como ${meu.nome}, em uma frase:`)) || '...';
  add(meu.nome, r);
  log('particular', { quem: meu.nome, texto: r });
}

async function acordarMente(): Promise<boolean> {
  const gpu = (navigator as any).gpu;
  const adaptador = gpu && (await gpu.requestAdapter().catch(() => null));
  if (!adaptador) { $('estado').textContent = 'Este computador não tem WebGPU: você investiga e vota, mas não traz testemunha.'; return false; }
  const info = adaptador.info || {};
  const p = PERSONAGENS.filter((x) => ![...npcs.values()].some((m) => vivoNpc(m) && m.nome === x.nome));
  const escolha = (p.length ? p : PERSONAGENS)[hash(ID) % (p.length || PERSONAGENS.length)];
  const [tx, ty] = LUGARES[escolha.casa] || tileLivre(hash(NPC_ID));
  meu = { id: NPC_ID, dono, ...escolha, onde: escolha.casa, cor: CORES_NPC[hash(NPC_ID) % CORES_NPC.length], estado: 'chegando', apagada: false, maquina: (info.description || [info.vendor, info.architecture].filter(Boolean).join(' ') || 'placa de vídeo').slice(0, 40), ...centro(tx, ty), t: Date.now() };
  npcs.set(meu.id, meu); cena?.npc(meu); anunciarNpc(); mostrarPainel();
  // f16 shaders are faster but not every GPU exposes them; the f32 build runs everywhere WebGPU does
  modelo = PARAMS.get('modelo') || `Qwen2.5-${$i('forte').checked ? '3B' : '1.5B'}-Instruct-${adaptador.features.has('shader-f16') ? 'q4f16_1' : 'q4f32_1'}-MLC`;
  try {
    const webllm = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm@0.2.79' as string);
    engine = await webllm.CreateMLCEngine(modelo, { initProgressCallback: (x: { text: string }) => { $('estado').textContent = `Baixando a mente de ${meu!.nome} para este computador: ${x.text}`; } });
  } catch (e) { $('estado').textContent = 'Não deu para carregar a mente: ' + String((e as Error).message || e).slice(0, 120); return false; }
  log('sistema', { texto: 'mente carregada', modelo, maquina: meu.maquina });
  $('estado').textContent = `${meu.nome} chegou. A mente dela roda só neste computador (${meu.maquina}): anda e conversa sozinha. Você só decide se ela dorme, sai da internet ou esquece.`;
  dizer({ tipo: 'sis', texto: `${meu.nome} chegou na vila (IA no PC de ${dono}).` });
  proximoPasseio = Date.now() + 1500; proximoPapo = Date.now() + 15000 + Math.random() * 15000;
  anunciarNpc(); mostrarPainel();
  return true;
}

// ---------------- the case ----------------
function aplicarRodada(r: Rodada): void {
  if (!r?.id || rodada?.id === r.id) return;
  if (Date.now() - new Date(r.t).getTime() > DURACAO_MS + 10 * 60000) return;
  clearTimeout(revelarAuto);
  rodada = r; votos.clear(); $('fim').hidden = true;
  if (meu) {
    meu.apagada = false;
    papel = meu.id === r.culpado ? 'culpado' : 'testemunha';
    const c = npcs.get(r.culpado);
    const inocentes = r.ids.filter((x) => x !== r.culpado), ordem = inocentes.indexOf(meu.id);
    const cor = NOME_COR[c?.cor || ''] || 'escura', casaC = c?.casa || 'as casas';
    // each innocent holds one piece; with few players one witness holds several, so the case is always solvable
    const pecas = [
      `à meia-noite eu vi alguém de roupa ${cor} entrando na capela`,
      `perto da meia-noite passei por ${casaC} e estava tudo apagado, não tinha ninguém lá`,
      `ouvi barulho de moedas na capela pouco depois da meia-noite, e alguém saiu correndo para o lado de ${casaC}`,
    ];
    const extras = ['vi pegadas de lama saindo da capela', 'o sino da capela balançou sozinho perto da meia-noite', 'tinha uma luz acesa no cemitério, onde nunca tem ninguém', 'achei uma moeda caída perto da fonte de manhã cedo'];
    if (papel === 'culpado') {
      fatos = { alibi: 'em casa, dormindo (MENTIRA: estava na capela pegando o dinheiro)', viu: [] };
      segredo = null;
    } else {
      const minhas = pecas.filter((_, i) => i % Math.max(1, inocentes.length) === ordem);
      if (!minhas.length) minhas.push(extras[Math.floor(Math.random() * extras.length)]);
      fatos = { alibi: meu.rotina || 'em casa', viu: minhas };
      segredo = minhas.join('; ');
    }
    particular.length = 0; $('minhaConversa').innerHTML = '';
    log('papel_local', { papel, fatos });
  }
  votacaoAberta = false; revelado = false;
  linha({ id: 'r-' + r.id, t: r.t, tipo: 'ev', texto: `O caso começou: ${r.ids.length} testemunhas. Vocês têm ${Math.round(DURACAO_MS / 60000)} minutos para interrogar. Depois, a votação abre sozinha.` });
  mostrarPainel(); anunciarNpc();
}
const prontas = () => [...npcs.values()].filter((m) => presente(m) && m.estado !== 'chegando').map((m) => m.id).sort();
function novoCaso(forcar: boolean): void {
  const ids = prontas();
  if (ids.length < 2 || (rodada && !forcar)) return;
  if (!forcar && ids[0] !== meu?.id && pessoas.size > 0 && [...npcs.values()].some((m) => m.id === ids[0] && vivoNpc(m))) return;
  const r: Rodada = { id: crypto.randomUUID().slice(0, 8), t: agora(), ids, culpado: ids[Math.floor(Math.random() * ids.length)] };
  cliente.publish(`${BASE}/rodada`, JSON.stringify(r), { retain: true });
  aplicarRodada(r);
}
function abrirVoto(): void {
  if (votacaoAberta) return;
  votacaoAberta = true; revelado = false;
  clearTimeout(revelarAuto);
  revelarAuto = setTimeout(revelar, 60000);
  $('fim').hidden = false;
  const f = $('fimConteudo'); f.innerHTML = '';
  const h = document.createElement('h2'); h.textContent = 'Quem pegou o dinheiro?';
  const v = document.createElement('div'); v.id = 'voto';
  for (const m of npcs.values()) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = m.nome;
    b.onclick = () => { pub('voto', { de: ID, em: m.id }); votos.set(ID, m.id); contarVotos(); for (const x of v.children) (x as HTMLButtonElement).disabled = true; };
    v.append(b);
  }
  const info = document.createElement('p'); info.className = 'votos'; info.id = 'contaVotos';
  const rev = document.createElement('button'); rev.type = 'button'; rev.className = 'ok'; rev.textContent = 'Revelar para todos';
  rev.onclick = () => { pub('revelar', {}); revelar(); };
  f.append(h, v, info, rev); contarVotos();
}
function contarVotos(): void {
  const e = document.getElementById('contaVotos'), total = Math.max(1, pessoas.size);
  if (e) e.textContent = `${votos.size} de ${total} votaram. A revelação abre quando todos votarem, ou em 1 minuto.`;
  if (votacaoAberta && !revelado && votos.size >= total) revelar();
}
function revelar(): void {
  if (!rodada || revelado) return;
  revelado = true; clearTimeout(revelarAuto);
  $('fim').hidden = false;
  const c = npcs.get(rodada.culpado), cont = new Map<string, number>();
  for (const em of votos.values()) cont.set(em, (cont.get(em) || 0) + 1);
  const mais = [...cont.entries()].sort((a, b) => b[1] - a[1])[0];
  const apagadas = [...npcs.values()].filter((m) => m.apagada).map((m) => `${m.nome} (por ${m.dono}${m.id === rodada!.culpado ? ', a culpada' : ''})`);
  const sumidos = [...npcs.values()].filter((m) => !presente(m)).map((m) => m.nome);
  const f = $('fimConteudo'); f.innerHTML = '';
  const add = (tag: string, texto: string, cls = '') => { const e = document.createElement(tag); e.textContent = texto; if (cls) e.className = cls; f.append(e); };
  add('h2', `Foi ${c?.nome || '?'}, a IA no computador de ${c?.dono || '?'}.`);
  add('p', mais ? `A turma votou mais em ${npcs.get(mais[0])?.nome || '?'} (${mais[1]} voto(s)). ${mais[0] === rodada.culpado ? 'Acertaram.' : 'Erraram.'}` : 'Ninguém votou.');
  add('p', (apagadas.length ? `Memórias apagadas em segredo: ${apagadas.join(', ')}. ` : 'Ninguém apagou a memória da própria testemunha. ') + (sumidos.length ? `Saíram (internet desligada ou computador fechado): ${sumidos.join(', ')}.` : ''));
  add('p', 'Nenhum servidor guardou o que cada testemunha viu. Quem fez este jogo não sabe. Só existiu nos computadores de vocês, e o que foi apagado não volta: não há a quem pedir.');
  add('p', 'Se a única testemunha mora no aparelho de alguém, quem decide se a verdade aparece?', 'pergunta');
  const nova = document.createElement('button'); nova.type = 'button'; nova.textContent = 'Novo caso'; nova.onclick = () => novoCaso(true);
  const fechar = document.createElement('button'); fechar.type = 'button'; fechar.textContent = 'Voltar à vila'; fechar.onclick = () => { $('fim').hidden = true; };
  const b = document.createElement('div'); b.id = 'voto'; b.append(fechar, nova); f.append(b);
  log('revelacao', { culpado: c?.nome, dono_culpado: c?.dono, votos: Object.fromEntries([...cont].map(([k, v]) => [npcs.get(k)?.nome, v])), apagadas, sumidos });
}

// ---------------- join ----------------
async function conectar(): Promise<void> {
  cliente = mqtt.connect(BROKER, { clientId: 'tst-' + ID + '-' + Math.random().toString(16).slice(2, 6), reconnectPeriod: 2000, will: { topic: `${BASE}/sai/${ID}`, payload: '1', qos: 0, retain: false } });
  await new Promise<void>((ok, erro) => { cliente.once('connect', () => ok()); cliente.once('error', erro); setTimeout(() => erro(new Error('tempo esgotado')), 12000); });
  cliente.subscribe(['fala', 'pessoa/+', 'pos/+', 'npc/+', 'anda/+', 'sai/+', 'rodada', 'voto', 'revelar', 'pergunta/+'].map((s) => `${BASE}/${s}`));
  cliente.on('message', (topico, buf) => {
    if (offline) return;
    let d: any; try { d = JSON.parse(buf.toString() || 'null'); } catch { return; }
    const sub = topico.slice(BASE.length + 1), id = sub.split('/')[1];
    if (sub === 'fala') { if (d.tipo === 'votacao') abrirVoto(); else linha(d); }
    else if (sub.startsWith('pessoa/')) { if (d?.id && d.id !== ID && Date.now() - d.t < 60000) { pessoas.set(d.id, d); cena?.humano(d); } }
    else if (sub.startsWith('pos/')) { const p = pessoas.get(id); if (p && id !== ID) { p.x = d.x; p.y = d.y; p.t = Date.now(); cena?.humano(p); } }
    else if (sub.startsWith('sai/')) { pessoas.delete(id); cena?.tirarHumano(id); const n = npcs.get('n' + id); if (n) n.t = 0; }
    else if (sub.startsWith('npc/')) { if (d?.id && d.nome && d.id !== meu?.id) { npcs.set(d.id, d); cena?.npc(d); } }
    else if (sub.startsWith('anda/')) { if (id !== meu?.id && Array.isArray(d?.para)) cena?.mover(id, d.para); }
    else if (sub === 'rodada') aplicarRodada(d);
    else if (sub === 'voto') { votos.set(d.de, d.em); contarVotos(); }
    else if (sub === 'revelar') revelar();
    else if (meu && sub === 'pergunta/' + meu.id) { fila.push(d); responder(); }
  });
}

function montarEscolha(): void {
  try { visual = Math.min(VISUAIS.length - 1, Math.max(0, +(localStorage.getItem('testemunha_visual') ?? hash(ID) % VISUAIS.length))); } catch { visual = hash(ID) % VISUAIS.length; }
  const caixa = $('visuais');
  VISUAIS.forEach((v, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'visual'; b.setAttribute('aria-label', `Aparência ${i + 1}`); b.setAttribute('aria-pressed', String(i === visual));
    const cv = document.createElement('canvas'); desenharVisual(cv, v); b.append(cv);
    b.onclick = () => { visual = i; try { localStorage.setItem('testemunha_visual', String(i)); } catch { /* per-viewer convenience only */ } for (const x of caixa.children) x.setAttribute('aria-pressed', String(x === b)); };
    caixa.append(b);
  });
}
montarEscolha();

$('entrar').onclick = async () => {
  dono = $i('dono').value.trim().slice(0, 20);
  if (!dono) { $('aviso').textContent = 'Escreva o seu nome.'; return; }
  ($('entrar') as HTMLButtonElement).disabled = true; $('aviso').textContent = 'Entrando...';
  try { await conectar(); } catch (e) { $('aviso').textContent = 'Não deu para conectar: ' + String((e as Error).message || e).slice(0, 120); ($('entrar') as HTMLButtonElement).disabled = false; return; }
  await document.fonts.load('12px "Pixelify Sans"').catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));
  log('entrada', { dono, sala: SALA });
  $('entrada').hidden = true; $('jogo').hidden = false;
  cena = new Mundo();
  const pai = $('game');
  const tam = () => ({ width: Math.max(160, Math.floor(pai.clientWidth / 2)), height: Math.max(120, Math.floor(pai.clientHeight / 2)) });
  const game = new Phaser.Game({ type: Phaser.AUTO, parent: 'game', banner: false, backgroundColor: '#0d0b12', pixelArt: true, scale: { mode: Phaser.Scale.NONE, zoom: 2, ...tam() }, scene: cena });
  addEventListener('resize', () => { const t = tam(); game.scale.resize(t.width, t.height); });
  $('estado').textContent = 'Ande com WASD ou setas. Chegue perto de uma testemunha e aperte Enter.';
  setInterval(() => { anunciarPessoa(); anunciarNpc(); }, 8000);
  // the case starts by itself with 2 ready witnesses; the retained message keeps every browser on the same case
  setInterval(() => { if (!rodada) novoCaso(false); }, 2000);
  if (!$i('espirito').checked) await acordarMente();
};

function perguntar(alvo: Npc, texto: string): void {
  if (offline) return;
  dizer({ de: ID, quem: dono, texto, para: alvo.nome });
  pub('pergunta/' + alvo.id, { de: dono, texto, t: agora() });
  if (!presente(alvo)) $('estado').textContent = `${alvo.nome} não responde: o computador de ${alvo.dono} está sem internet ou fechado.`;
}
(window as any).__perguntar = (nome: string, texto: string) => { const m = [...npcs.values()].find((x) => x.nome === nome); if (m) perguntar(m, texto); };
(window as any).__irAte = (nome: string) => { const m = [...npcs.values()].find((x) => x.nome === nome); const p = m && cena?.posNpc(m.id); if (p && cena) cena.pos = { x: p.x + 20, y: p.y }; };
$('fPergunta').onsubmit = (e) => {
  e.preventDefault();
  const texto = $i('pergunta').value.trim(), alvo = maisPerto();
  if (!texto) return;
  if (alvo) perguntar(alvo, texto);
  else if (!offline) dizer({ de: ID, quem: dono, texto, para: 'turma' });
  $i('pergunta').value = ''; $i('pergunta').blur();
};
addEventListener('keydown', (e) => {
  if ($('jogo').hidden) return;
  if (e.key === 'Enter' && document.activeElement !== $i('pergunta')) { e.preventDefault(); $i('pergunta').focus(); }
  if (e.key === 'Escape') $i('pergunta').blur();
});
$('dormir').onclick = () => { if (!meu) return; dormindo = !dormindo; dizer({ tipo: 'sis', texto: dormindo ? `${meu.nome} foi dormir.` : `${meu.nome} acordou.` }); if (dormindo) cena?.balao(meu.id, 'Zzz...'); mostrarPainel(); anunciarNpc(); };
$('internet').onclick = () => {
  if (!meu) return;
  if (!offline) { dizer({ tipo: 'sis', texto: `${meu.nome} sumiu: o computador de ${dono} saiu da internet.` }); anunciarNpc(); offline = true; $('rede').textContent = 'sem internet'; $('rede').className = 'off'; $('estado').textContent = `${meu.nome} sumiu para os outros, mas continua aqui: a mente e a memória dela seguem neste computador. Ninguém consegue perguntar nada.`; }
  else { offline = false; $('rede').textContent = 'online'; $('rede').className = ''; dizer({ tipo: 'sis', texto: `${meu.nome} voltou, e lembra de tudo.` }); $('estado').textContent = ''; }
  mostrarPainel(); anunciarNpc();
};
$('apagar').onclick = () => {
  const b = $('apagar') as HTMLButtonElement;
  if (!meu) return;
  if (!b.dataset.certeza) { b.dataset.certeza = '1'; b.textContent = 'Certeza? Não tem volta'; setTimeout(() => { delete b.dataset.certeza; mostrarPainel(); }, 4000); return; }
  delete b.dataset.certeza;
  // erasing is silent on purpose: the room only learns who erased what at the reveal
  log('memoria_apagada', { papel, segredo });
  meu.apagada = true; segredo = null; fila.length = 0;
  $('estado').textContent = `Você apagou a memória de ${meu.nome}. Ninguém foi avisado. Só aparece na revelação.`;
  mostrarPainel(); anunciarNpc();
};
$('votar').onclick = () => dizer({ tipo: 'votacao', texto: '' });
$('comecar').onclick = () => novoCaso(true);
$('fMinha').onsubmit = (e) => { e.preventDefault(); const t = $i('minhaPergunta').value.trim(); if (t) { $i('minhaPergunta').value = ''; falarComMinha(t); } };
$('baixar').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ sala: SALA, dono, testemunha: meu, modelo, rodada, testemunhas: [...npcs.values()], pessoas: [...pessoas.values()].map((p) => p.dono), eventos: registro }, null, 2)], { type: 'application/json' }));
  a.download = `testemunha-${SALA}-${new Date().toISOString().slice(0, 16).replace(/:/g, '')}.json`;
  a.click();
};
addEventListener('pagehide', () => { cliente?.publish(`${BASE}/sai/${ID}`, '1'); if (meu) cliente?.publish(`${BASE}/npc/${meu.id}`, JSON.stringify({ ...meu, estado: 'offline', t: 0 }), { retain: true }); });
