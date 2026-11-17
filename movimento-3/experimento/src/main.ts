// A Testemunha. World, avatars, movement and textures come from PixelHub (src/pixelhub, MIT).
// Each player walks their own avatar AND hosts one AI witness whose mind (a local LLM) runs only in their browser.
import * as Phaser from 'phaser';
import mqtt from 'mqtt';
import {
  IDLE_INPUT,
  SPAWN_POINTS,
  TILE_SIZE,
  createWorldMap,
  isWalkable,
  stepPlayer,
  tileDistance,
  type MovementInput,
  type Position,
} from './pixelhub/shared';
import { PlayerSprite } from './pixelhub/game/PlayerSprite';
import { TEXTURE_WORLD, createAvatarTextures, createWorldTexture } from './pixelhub/game/textures';

const PARAMS = new URLSearchParams(location.search);
const SALA = (PARAMS.get('sala') || 'aula').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'aula';
// ponytail: public MQTT broker as a dumb relay (no AI, no account, keeps no witness memory); upgrade to a self-hosted broker if abused
const BROKER = 'wss://broker.emqx.io:8084/mqtt';
const BASE = `testemunha-cin0055-v4/${SALA}`;
const PERTO = 2.6; // tiles: how close you must stand to question a witness
const NPC_VEL = 2.2; // tiles per second
const COFRE: [number, number] = [20, 15]; // the central table of the PixelHub map
const CORES_HUMANO = ['#e5c07b', '#98c379', '#61afef', '#c678dd', '#56b6c2', '#d19a66'];
const CORES_NPC = ['#e06c75', '#ff79c6', '#bd93f9', '#8be9fd', '#50fa7b', '#f1fa8c', '#ffb86c', '#ff5555'];

const PERSONAGENS = [
  { nome: 'Cida do RH', traco: 'trabalha no RH, fofoqueira, fala muito' },
  { nome: 'Tonho do TI', traco: 'cara do TI, tímido, tem a senha do cofre' },
  { nome: 'Seu Bira', traco: 'porteiro da noite, ranzinza, desconfia de todo mundo' },
  { nome: 'Lurdes', traco: 'da contabilidade, educada e muito curiosa' },
  { nome: 'Zé do Café', traco: 'cuida do café, deve dinheiro para meio escritório' },
  { nome: 'Tatá', traco: 'estagiária esperta que vê tudo da mesa dela' },
  { nome: 'Dona Neide', traco: 'diretora, preocupada com a imagem da empresa' },
  { nome: 'Consultor', traco: 'consultor que chegou ontem, ninguém sabe de onde, fala pouco' },
  { nome: 'Zuzu', traco: 'do marketing, teatral, exagera tudo' },
  { nome: 'Rosinha', traco: 'do financeiro, romântica, apaixonada em segredo' },
  { nome: 'Didi', traco: 'da limpeza, nervoso, sempre com pressa' },
  { nome: 'Bené', traco: 'do jurídico, rival do financeiro' },
  { nome: 'Juca', traco: 'segurança, preguiçoso, cochila no turno' },
  { nome: 'Quitéria', traco: 'a mais antiga da empresa, meio surda, lembra de tudo' },
  { nome: 'Léo', traco: 'motoboy, entra e sai do prédio a noite toda' },
  { nome: 'Socorro', traco: 'da recepção, rígida, anota quem entra' },
];
const PISTAS = [
  'você viu a luz da sala do cofre acesa perto da meia-noite',
  'você ouviu a porta do cofre bater, pouco depois das onze',
  'você viu alguém de capuz escuro descendo pela escada de incêndio, mas não viu o rosto',
  'você achou um clipe torto no chão, do lado do cofre, de manhã cedo',
  'você sentiu cheiro de café fresco tarde da noite, o que é estranho',
  'você viu pegadas de lama do estacionamento até a mesa do cofre',
  'você viu o elevador subir sozinho perto da meia-noite',
  'você viu alguém contando dinheiro dentro de um carro, no estacionamento',
];
const PISTA_CULPADO = (c: { traco: string }) => `você viu, de longe, alguém que ${c.traco.split(',')[0].replace(/^(trabalha|cara|porteiro|da|do|cuida|estagiária|diretora|consultor|segurança|a mais|motoboy)/, (m) => m)} perto do cofre na hora do sumiço, mas não tem certeza de quem era`;

interface Pessoa { id: string; dono: string; cor: string; x: number; y: number; t: number }
interface Npc { id: string; nome: string; traco: string; dono: string; cor: string; estado: string; apagada: boolean; maquina?: string; x: number; y: number; t: number }
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
const fila: { de: string; texto: string; npc?: boolean }[] = [];
const votos = new Map<string, string>();
let proximoPasseio = 0, proximoPapo = 0, ultimaReplica = 0;
let cena: Mundo | null = null;

const log = (tipo: string, dados: object) => registro.push({ t: agora(), tipo, ...dados });
const vivoNpc = (m: Npc) => m.id === meu?.id || Date.now() - m.t < 35000;
const presente = (m: Npc) => vivoNpc(m) && m.estado !== 'offline';
const centro = (tx: number, ty: number): Position => ({ x: tx * TILE_SIZE + 16, y: ty * TILE_SIZE + 16 });

// ---------------- paths on the PixelHub map ----------------
const MAPA = createWorldMap();
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
  return [20, 10];
}

// ---------------- world scene ----------------
class Mundo extends Phaser.Scene {
  keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  pos: Position = { x: 0, y: 0 };
  humanos = new Map<string, { sprite: PlayerSprite; alvo: Position }>();
  corpos = new Map<string, Corpo>();
  ultimoEnvio = 0;
  pronta = false;
  escuro!: Phaser.GameObjects.Rectangle;
  constructor() { super('mundo'); }

  create(): void {
    createWorldTexture(this, MAPA);
    createAvatarTextures(this);
    this.add.image(0, 0, TEXTURE_WORLD).setOrigin(0, 0);
    const W = MAPA.width * TILE_SIZE, H = MAPA.height * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.setBackgroundColor('#0d0b12');
    this.cameras.main.setRoundPixels(true);

    // crime scene: pulsing red ring and tape around the safe
    const [cx, cy] = [COFRE[0] * TILE_SIZE, COFRE[1] * TILE_SIZE];
    const anel = this.add.ellipse(cx, cy, 150, 150).setStrokeStyle(2, 0xe06c75, 0.9).setFillStyle(0xe06c75, 0.08).setDepth(1);
    this.tweens.add({ targets: anel, scale: 1.15, alpha: 0.4, duration: 1100, yoyo: true, repeat: -1 });
    const fita = this.add.graphics().setDepth(1);
    fita.lineStyle(4, 0xf0c35a, 1);
    fita.strokeRect(cx - 82, cy - 82, 164, 164);
    fita.lineStyle(4, 0x17131d, 1);
    for (let i = -82; i < 82; i += 16) { fita.lineBetween(cx + i, cy - 82, cx + i + 8, cy - 82); fita.lineBetween(cx + i, cy + 82, cx + i + 8, cy + 82); fita.lineBetween(cx - 82, cy + i, cx - 82, cy + i + 8); fita.lineBetween(cx + 82, cy + i, cx + 82, cy + i + 8); }
    this.add.text(cx, cy - 100, 'COFRE ARROMBADO', { fontFamily: '"Pixelify Sans", monospace', fontSize: '12px', color: '#f0c35a', backgroundColor: 'rgba(23,19,29,.85)', padding: { x: 5, y: 2 } }).setOrigin(0.5).setDepth(2);

    // night: dark overlay over the whole office, with lights that flicker now and then
    this.escuro = this.add.rectangle(0, 0, W, H, 0x0a0818, 0.42).setOrigin(0, 0).setDepth(5000);
    this.time.addEvent({ delay: 4200, loop: true, callback: () => {
      if (Math.random() < 0.55) this.tweens.add({ targets: this.escuro, alpha: { from: 0.42, to: 0.78 }, duration: 70, yoyo: true, repeat: 1 + Math.floor(Math.random() * 3) });
    } });

    const kb = this.input.keyboard;
    if (kb) { kb.disableGlobalCapture(); this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as Record<string, Phaser.Input.Keyboard.Key>; }

    const [sx, sy] = SPAWN_POINTS[hash(ID) % SPAWN_POINTS.length];
    this.pos = centro(sx, sy);
    eu = { id: ID, dono, cor: CORES_HUMANO[hash(ID) % CORES_HUMANO.length], ...this.pos, t: Date.now() };
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
    const sprite = new PlayerSprite(this, p.x, p.y, p.dono, p.cor, p.id === ID ? 'você' : 'investigando', '#f2ead8');
    this.humanos.set(p.id, { sprite, alvo: { x: p.x, y: p.y } });
  }
  tirarHumano(id: string): void { const h = this.humanos.get(id); if (!h || id === ID) return; this.humanos.delete(id); h.sprite.fadeOut(() => h.sprite.destroy()); }
  npc(m: Npc): void {
    if (!this.pronta || this.corpos.has(m.id)) return;
    const t: [number, number] = [Math.round((m.x - 16) / TILE_SIZE), Math.round((m.y - 16) / TILE_SIZE)];
    const sprite = new PlayerSprite(this, m.x, m.y, m.nome, m.cor, `IA no PC de ${m.dono}`, m.id === meu?.id ? '#f0c35a' : '#ffd6da');
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
  $('perto').textContent = alvo ? `Enter: interrogar ${alvo.nome}` : 'Ande (WASD ou setas) até uma testemunha';
  $('perto').className = alvo ? 'pronto' : '';
  $i('pergunta').placeholder = alvo ? `Pergunte a ${alvo.nome}...` : 'Chegue perto de uma testemunha para interrogar';
}
setInterval(hud, 300);
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
  if (meu!.apagada) return 'Sua memória sobre ontem à noite foi APAGADA. Você não lembra de nada do que aconteceu ontem, nem sabe por quê. Fique confuso e nunca invente.';
  if (papel === 'culpado') return 'Você é o CULPADO: ontem à noite você mesmo tirou o dinheiro da festa de fim de ano do cofre do escritório. Ninguém pode saber. Minta com calma e use sempre o mesmo álibi simples (estava em casa dormindo). Se desconfiarem, fique nervoso e jogue a suspeita para outra pessoa.';
  return `Você é inocente. Ontem à noite você estava em casa, mas passou pelo escritório e ${segredo.replace(/^você /, '')}. Isso é a sua pista, e você QUER ajudar a achar o culpado. Quando perguntarem sobre ontem, o cofre, o dinheiro ou se você viu algo, comece por "Eu vi" ou "Eu ouvi" e conte essa pista com as suas palavras. Não invente outras pistas.`;
}
function sistema(): string {
  const outros = [...npcs.values()].filter((m) => m.id !== meu!.id && presente(m)).map((m) => m.nome).join(', ') || 'ninguém';
  return `Você é ${meu!.nome}, que trabalha num escritório no Recife. Quem você é: ${meu!.traco}.
Ontem à noite o dinheiro da festa de fim de ano sumiu do cofre do escritório.
${rodada ? lembranca() : 'Você ainda não sabe de nada sobre o sumiço.'}
Colegas pelo escritório agora: ${outros}.
Regras: fale em português do Brasil, com o seu jeito, em no máximo 2 frases curtas. Só a sua fala, sem o seu nome na frente, sem aspas, sem narração. Nunca diga que é uma IA, um programa ou um modelo.`;
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
  try { const r = await engine.chat.completions.create({ messages: [{ role: 'system', content: sistema() }, { role: 'user', content: pedido }], temperature: 0.85, max_tokens: 80 }); return limpar(r.choices[0].message.content); }
  catch { return ''; }
  finally { pensando = false; anunciarNpc(); }
}
async function responder(): Promise<void> {
  if (pensando || !engine || !fila.length || offline || !meu) return;
  const p = fila.shift()!;
  if (dormindo) { if (!p.npc) dizer({ de: meu.id, quem: meu.nome, texto: 'Zzz... (dormindo)' }); return responder(); }
  const fala = (await gerar(`O que foi dito agora há pouco:\n${recentes()}\n\n${p.de} fala com você: "${p.texto}"\nResponda como ${meu.nome}:`)) || 'Hã? Fala de novo.';
  log('resposta_local', { pergunta: p, resposta: fala, papel, apagada: meu.apagada });
  dizer({ de: meu.id, quem: meu.nome, texto: fala, para: p.de });
  responder();
}
// on its own the witness wanders, and every 35 to 60 s chats with the nearest colleague: gossip spreads by itself
function passear(): void {
  if (!meu || !engine || dormindo || offline || !cena || Date.now() < proximoPasseio) return;
  proximoPasseio = Date.now() + 8000 + Math.random() * 12000;
  const perto = Math.random() < 0.3 ? COFRE : null;
  const alvo: [number, number] = perto ? tileLivre(hash(String(Date.now())) % 3 + COFRE[0] * 7) : tileLivre(Math.floor(Math.random() * 1e9));
  const destino: [number, number] = perto && isWalkable(MAPA, COFRE[0] - 3, COFRE[1]) ? [COFRE[0] - 3, COFRE[1]] : alvo;
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
  const fala = await gerar(`O que foi dito agora há pouco:\n${recentes()}\n\nVocê encontra ${vizinho.nome} (${vizinho.traco}) no corredor. Puxe conversa com ${vizinho.nome} sobre o sumiço do dinheiro: uma fofoca, uma desconfiança ou o que você acha. Fale com ${vizinho.nome} pelo nome:`);
  if (fala) { log('papo_local', { com: vizinho.nome, fala, papel }); dizer({ de: meu.id, quem: meu.nome, texto: fala, para: vizinho.nome, paraId: vizinho.id }); }
}
setInterval(papo, 3000);

async function acordarMente(): Promise<boolean> {
  const gpu = (navigator as any).gpu;
  const adaptador = gpu && (await gpu.requestAdapter().catch(() => null));
  if (!adaptador) { $('estado').textContent = 'Este computador não tem WebGPU: você investiga e vota, mas não traz testemunha.'; return false; }
  const info = adaptador.info || {};
  const p = PERSONAGENS.filter((x) => ![...npcs.values()].some((m) => vivoNpc(m) && m.nome === x.nome));
  const escolha = (p.length ? p : PERSONAGENS)[hash(ID) % (p.length || PERSONAGENS.length)];
  const [tx, ty] = tileLivre(hash(NPC_ID));
  meu = { id: NPC_ID, dono, ...escolha, cor: CORES_NPC[hash(NPC_ID) % CORES_NPC.length], estado: 'chegando', apagada: false, maquina: (info.description || [info.vendor, info.architecture].filter(Boolean).join(' ') || 'placa de vídeo').slice(0, 40), ...centro(tx, ty), t: Date.now() };
  npcs.set(meu.id, meu); cena?.npc(meu); anunciarNpc(); mostrarPainel();
  // f16 shaders are faster but not every GPU exposes them; the f32 build runs everywhere WebGPU does
  modelo = PARAMS.get('modelo') || `Qwen2.5-${$i('forte').checked ? '3B' : '1.5B'}-Instruct-${adaptador.features.has('shader-f16') ? 'q4f16_1' : 'q4f32_1'}-MLC`;
  try {
    const webllm = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm@0.2.79' as string);
    engine = await webllm.CreateMLCEngine(modelo, { initProgressCallback: (x: { text: string }) => { $('estado').textContent = `Baixando a mente de ${meu!.nome} para este computador: ${x.text}`; } });
  } catch (e) { $('estado').textContent = 'Não deu para carregar a mente: ' + String((e as Error).message || e).slice(0, 120); return false; }
  log('sistema', { texto: 'mente carregada', modelo, maquina: meu.maquina });
  $('estado').textContent = `${meu.nome} chegou. A mente dela roda só neste computador (${meu.maquina}): anda e conversa sozinha. Você só decide se ela dorme, sai da internet ou esquece.`;
  dizer({ tipo: 'sis', texto: `${meu.nome} chegou ao escritório (IA no PC de ${dono}).` });
  proximoPasseio = Date.now() + 1500; proximoPapo = Date.now() + 15000 + Math.random() * 15000;
  anunciarNpc(); mostrarPainel();
  return true;
}

// ---------------- the case ----------------
function aplicarRodada(r: Rodada): void {
  if (!r?.id || rodada?.id === r.id) return;
  rodada = r; votos.clear(); $('fim').hidden = true;
  if (meu) {
    meu.apagada = false;
    const ordem = r.ids.indexOf(meu.id);
    papel = meu.id === r.culpado ? 'culpado' : 'testemunha';
    const c = npcs.get(r.culpado) || { traco: 'trabalha aqui' };
    const pistas = PISTAS.slice(hash(r.id) % PISTAS.length).concat(PISTAS);
    segredo = papel === 'culpado' ? null : ordem >= 0 && ordem % 3 === 1 ? PISTA_CULPADO(c) : pistas[Math.max(0, ordem) % PISTAS.length];
    log('papel_local', { papel, segredo });
  }
  linha({ id: 'r-' + r.id, t: r.t, tipo: 'ev', texto: `O caso começou: ${r.ids.length} testemunhas. Andem até elas e interroguem.` });
  mostrarPainel(); anunciarNpc();
}
function novoCaso(forcar: boolean): void {
  const ids = [...npcs.values()].filter((m) => presente(m) && m.estado !== 'chegando').map((m) => m.id).sort();
  if (ids.length < 2 || (rodada && !forcar)) return;
  const r: Rodada = { id: crypto.randomUUID().slice(0, 8), t: agora(), ids, culpado: ids[Math.floor(Math.random() * ids.length)] };
  cliente.publish(`${BASE}/rodada`, JSON.stringify(r), { retain: true });
  aplicarRodada(r);
}
function abrirVoto(): void {
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
function contarVotos(): void { const e = document.getElementById('contaVotos'); if (e) e.textContent = `${votos.size} voto(s)`; }
function revelar(): void {
  if (!rodada) return;
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
  const nova = document.createElement('button'); nova.type = 'button'; nova.textContent = 'Novo caso'; nova.onclick = () => novoCaso(true); f.append(nova);
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
  if (!$i('espirito').checked) await acordarMente();
  // the case starts by itself with 2 awake witnesses; the retained message keeps every browser on the same case
  setInterval(() => { if (!rodada) novoCaso(false); }, 5000 + Math.random() * 4000);
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
  if (!alvo) { $('estado').textContent = 'Chegue perto de uma testemunha (WASD ou setas) para perguntar.'; return; }
  perguntar(alvo, texto); $i('pergunta').value = ''; $i('pergunta').blur();
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
$('baixar').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ sala: SALA, dono, testemunha: meu, modelo, rodada, testemunhas: [...npcs.values()], pessoas: [...pessoas.values()].map((p) => p.dono), eventos: registro }, null, 2)], { type: 'application/json' }));
  a.download = `testemunha-${SALA}-${new Date().toISOString().slice(0, 16).replace(/:/g, '')}.json`;
  a.click();
};
addEventListener('pagehide', () => { cliente?.publish(`${BASE}/sai/${ID}`, '1'); if (meu) cliente?.publish(`${BASE}/npc/${meu.id}`, JSON.stringify({ ...meu, estado: 'offline', t: 0 }), { retain: true }); });
