// Bichos: everyone walks the plaza with their own pet. Each pet's mind is a local LLM in the
// owner's browser; it learns only from its owner and decides its own moves in battle.
import * as Phaser from 'phaser';
import mqtt from 'mqtt';
import { IDLE_INPUT, TILE_SIZE, stepPlayer, type MovementInput, type Position } from './pixelhub/shared';
import { PlayerSprite } from './pixelhub/game/PlayerSprite';
import { createAvatarTextures } from './pixelhub/game/textures';
import { SPAWNS, VILA, VISUAIS, cabeca, corpos, desenharVisual, montarVila } from './vila';
import { aprender, dano, eficacia, nascer, petDaIA, TIPOS, type Golpe, type Pet, type Tipo } from './regras';
import { COR_TIPO, textura } from './sprites';

const $ = <T extends HTMLElement>(x: string) => document.getElementById(x) as T;
const PARAMS = new URLSearchParams(location.search);
const SALA = (PARAMS.get('sala') || 'aula').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'aula';
const MIN = Math.max(2, Math.min(30, +(PARAMS.get('min') || 6)));
const BASE = `bichos-cin0055-v3/${SALA}`;
const ID = (() => { try { const v = localStorage.getItem('bichos_id') || crypto.randomUUID().slice(0, 8); localStorage.setItem('bichos_id', v); return v; } catch { return crypto.randomUUID().slice(0, 8); } })();
const PERTO = 80, RECARGA = 8000;
const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
const hex = (n: number) => '#' + n.toString(16).padStart(6, '0');
const limpa = (x: unknown, n: number) => String(x ?? '').replace(/[<>]/g, '').trim().slice(0, n);
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Resumo = { id: string; dono: string; nome: string; tipo: Tipo; cor: number; hpMax: number };
type PetPublico = Omit<Pet, 'memorias'> & { cor: number; guardado: boolean; px: number; py: number; pontos: number; torneio: string; ia: boolean };
type Gente = { id: string; dono: string; visual: number; x: number; y: number; pet: PetPublico; t: number };
type Escolha = { g: Golpe; fala: string; motivo: string; ia: boolean; obedeceu: boolean | null; lembrou: boolean };

let cliente: mqtt.MqttClient, nome = '', visual = 0, meuPet: Pet | null = null, cor = 0, guardado = false, motor: any = null, iaPronta = false;
let torneio: { id: string; fim: number } | null = null, pontos = 0, pontosDe = '', mostrouFim = '';
const gente = new Map<string, Gente>(), recarga = new Map<string, number>();
let lutando = false, cena: Praca | null = null, dica = '', alvoPerto: Gente | null = null;
let esperando: ((x: unknown) => void) | null = null;
const salvar = () => { try { if (meuPet) localStorage.setItem('bichos_pet3', JSON.stringify({ meuPet, cor, visual, pontos, pontosDe })); } catch { /* per-viewer only */ } };
const pub = (s: string, x: unknown, retain = false) => cliente?.publish(`${BASE}/${s}`, JSON.stringify(x), { retain });
const estado = (t: string) => { $('estado').textContent = t; };

// ---------- local AI ----------
async function ia() {
  if (motor) return motor;
  if (!$<HTMLInputElement>('usar-ia').checked) return null;
  const gpu = (navigator as any).gpu, ad = gpu && (await gpu.requestAdapter().catch(() => null)); if (!ad) return null;
  const w = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm@0.2.79' as string);
  motor = await w.CreateMLCEngine(`Qwen2.5-1.5B-Instruct-${ad.features.has('shader-f16') ? 'q4f16_1' : 'q4f32_1'}-MLC`, { initProgressCallback: (x: { text: string }) => { $('aviso').textContent = `Baixando a mente: ${x.text.slice(0, 60)}`; } });
  iaPronta = true; ficha();
  return motor;
}
async function json(prompt: string) { const m = await ia().catch(() => null); if (!m) return null; try { const r = await m.chat.completions.create({ temperature: 0.8, max_tokens: 180, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }); return JSON.parse(r.choices[0].message.content || '{}'); } catch { return null; } }

// ---------- scene ----------
class Praca extends Phaser.Scene {
  keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  pos: Position = { x: 0, y: 0 }; petPos: Position = { x: 0, y: 0 };
  donos = new Map<string, PlayerSprite>(); pets = new Map<string, Phaser.GameObjects.Container>();
  ultimo = 0; pronta = false;
  constructor() { super('praca'); }
  create() {
    createAvatarTextures(this); corpos(this); montarVila(this);
    this.cameras.main.setBounds(0, 0, VILA.width * TILE_SIZE, VILA.height * TILE_SIZE).setBackgroundColor('#4b8441').setRoundPixels(true);
    const kb = this.input.keyboard; if (kb) { kb.disableGlobalCapture(); this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E', false) as any; }
    const [sx, sy] = SPAWNS[hash(ID) % SPAWNS.length]; this.pos = { x: sx * TILE_SIZE + 16, y: sy * TILE_SIZE + 16 }; this.petPos = { x: this.pos.x + 24, y: this.pos.y + 10 };
    this.pronta = true; this.cameras.main.startFollow(this.dono(ID, nome, visual, this.pos).container, true, 0.12, 0.12);
    ficha();
  }
  livre() { const a = document.activeElement; return !(a instanceof HTMLInputElement); }
  lerInput(): MovementInput { if (!this.livre() || lutando) return IDLE_INPUT; const d = (k: string) => this.keys[k]?.isDown === true; return { up: d('W') || d('UP'), down: d('S') || d('DOWN'), left: d('A') || d('LEFT'), right: d('D') || d('RIGHT') }; }
  dono(id: string, n: string, v: number, p: Position) {
    let s = this.donos.get(id); if (s) return s;
    const vis = VISUAIS[v] || VISUAIS[0];
    s = new PlayerSprite(this, p.x, p.y, n, hex(vis.roupa), id === ID ? 'você' : '', '#f2ead8', cabeca(this, `cab-${v}`, vis.cab, vis.cabelo, vis.pele), [`corpo-${vis.corpo}-0`, `corpo-${vis.corpo}-1`]);
    this.donos.set(id, s); return s;
  }
  pet(id: string, p: { nome: string; tipo: Tipo; cor: number }, pos: Position) {
    let c = this.pets.get(id); if (c) return c;
    const [k0, k1] = textura(this, p.tipo, p.cor), img = this.add.image(0, 0, k0).setOrigin(0.5, 1);
    const sombra = this.add.ellipse(0, 1, 22, 6, 0x000000, 0.25);
    const rot = this.add.text(0, -24, p.nome, { fontFamily: '"Pixelify Sans", monospace', fontSize: '9px', color: '#1d1a2b', backgroundColor: id === ID ? '#ffd447' : '#fff8e7', padding: { x: 3, y: 1 } }).setOrigin(0.5, 1);
    c = this.add.container(pos.x, pos.y, [sombra, img, rot]).setDepth(4); c.setData('img', img).setData('k', [k0, k1]);
    this.pets.set(id, c); return c;
  }
  balao(id: string, txt: string) { const c = this.pets.get(id); if (!c) return; const b = this.add.text(c.x, c.y - 34, txt, { fontFamily: '"Pixelify Sans", monospace', fontSize: '10px', color: '#1d1a2b', backgroundColor: '#ffffff', padding: { x: 4, y: 2 }, wordWrap: { width: 150 } }).setOrigin(0.5, 1).setDepth(8); this.tweens.add({ targets: b, y: b.y - 8, alpha: 0, delay: 2600, duration: 500, onComplete: () => b.destroy() }); }
  golpe(de: string, para: string, tipo: Tipo) {
    const a = this.pets.get(de), b = this.pets.get(para); if (!a || !b) return;
    this.tweens.add({ targets: a, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, duration: 160, yoyo: true });
    const f = this.add.circle(b.x, b.y - 10, 4, COR_TIPO[tipo]).setDepth(9); this.tweens.add({ targets: f, scale: 5, alpha: 0, duration: 380, onComplete: () => f.destroy() });
  }
  update(time: number, dt: number) {
    if (!this.pronta) return;
    const inp = this.lerInput(), anda = inp.up || inp.down || inp.left || inp.right;
    if (anda) this.pos = stepPlayer(VILA, this.pos, inp, dt);
    if (!guardado) { const dx = this.pos.x - this.petPos.x, dy = this.pos.y - this.petPos.y, d = Math.hypot(dx, dy); if (d > 30) { const k = Math.min(1, (d - 26) / d) * Math.min(1, dt * 0.006); this.petPos.x += dx * k; this.petPos.y += dy * k; } }
    const eu = this.donos.get(ID)!; eu.setPosition(this.pos.x, this.pos.y); eu.updateWalk(time, anda);
    if (meuPet) this.pet(ID, { ...meuPet, cor }, this.petPos).setPosition(this.petPos.x, this.petPos.y).setVisible(!guardado);
    const k = 1 - Math.exp(-dt * 0.01);
    for (const [id, g] of gente) {
      const s = this.dono(id, g.dono, g.visual, g);
      s.setPosition(Phaser.Math.Linear(s.x, g.x, k), Phaser.Math.Linear(s.y, g.y, k)); s.updateWalk(time, Math.abs(s.x - g.x) + Math.abs(s.y - g.y) > 1);
      const c = this.pet(id, g.pet, { x: g.pet.px, y: g.pet.py }); c.setPosition(Phaser.Math.Linear(c.x, g.pet.px, k), Phaser.Math.Linear(c.y, g.pet.py, k)).setVisible(!g.pet.guardado);
    }
    const q = Math.floor(time / 260) % 2; for (const c of this.pets.values()) { const ks = c.getData('k') as string[]; (c.getData('img') as Phaser.GameObjects.Image).setTexture(ks[q]); }
    // nearest pet you can challenge
    alvoPerto = null; let melhor = PERTO;
    if (!lutando && !guardado) for (const g of gente.values()) { if (g.pet.guardado) continue; const d = Math.hypot(g.pet.px - this.pos.x, g.pet.py - this.pos.y); if (d < melhor) { melhor = d; alvoPerto = g; } }
    $('perto').textContent = alvoPerto ? `Aperte E para desafiar ${alvoPerto.pet.nome} (de ${alvoPerto.dono})` : '';
    $('perto').hidden = !alvoPerto;
    if (alvoPerto && this.livre() && Phaser.Input.Keyboard.JustDown(this.keys.E)) desafiar(alvoPerto);
    if (time - this.ultimo > 120) { this.ultimo = time; enviarPos(); }
  }
}

// ---------- network ----------
function enviarPos() {
  if (!meuPet || !cena) return; const { memorias, ...resto } = meuPet; void memorias;
  pub(`gente/${ID}`, { id: ID, dono: nome, visual, x: Math.round(cena.pos.x), y: Math.round(cena.pos.y), pet: { ...resto, cor, guardado, px: Math.round(cena.petPos.x), py: Math.round(cena.petPos.y), pontos: pontosDe === torneio?.id ? pontos : 0, torneio: torneio?.id ?? '', ia: iaPronta }, t: Date.now() });
}
function conectar() {
  cliente = mqtt.connect('wss://broker.emqx.io:8084/mqtt', { clientId: `bichos-${ID}-${Math.random().toString(16).slice(2, 6)}`, reconnectPeriod: 1500, will: { topic: `${BASE}/sai`, payload: JSON.stringify({ id: ID }) } });
  cliente.on('connect', () => { cliente.subscribe(`${BASE}/#`); $('rede').textContent = `sala ${SALA}`; setTimeout(() => { if (!torneio) novoTorneio(); }, 1800); });
  cliente.on('message', (t, b) => {
    let d: any; try { d = JSON.parse(b.toString()); } catch { return; }
    const sub = t.slice(BASE.length + 1);
    if (sub.startsWith('gente/') && d?.id && d.id !== ID && d.pet && TIPOS.includes(d.pet.tipo)) { gente.set(d.id, { ...d, t: Date.now() }); placar(); }
    else if (sub === 'sai' && d?.id) tirar(d.id);
    else if (sub === 'torneio' && d?.id && Number.isFinite(d.fim)) { torneio = { id: String(d.id), fim: Number(d.fim) }; if (pontosDe !== torneio.id) { pontos = 0; pontosDe = torneio.id; salvar(); } $('fim').hidden = true; placar(); }
    else if (sub === `luta/${ID}`) void receberLuta(d);
    else if (sub === 'anima' && d?.atk && !lutando) cena?.golpe(d.atk, d.def, d.tipo);
    else if (sub === 'feed' && d?.t) feed(limpa(d.t, 140), !!d.forte);
  });
}
function tirar(id: string) { gente.delete(id); const s: any = cena?.donos.get(id); s?.destroy?.(); cena?.donos.delete(id); cena?.pets.get(id)?.destroy(); cena?.pets.delete(id); placar(); }
setInterval(() => { for (const [k, g] of gente) if (Date.now() - g.t > 15000) tirar(k); }, 4000);
function novoTorneio() { pub('torneio', { id: crypto.randomUUID().slice(0, 8), fim: Date.now() + MIN * 60000 }, true); }

// ---------- tournament clock ----------
setInterval(() => {
  if (!torneio) return;
  const s = Math.max(0, Math.round((torneio.fim - Date.now()) / 1000));
  $('relogio').textContent = s ? `Torneio ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : 'Torneio encerrado';
  if (!s && mostrouFim !== torneio.id && !lutando) { mostrouFim = torneio.id; fimTorneio(); }
}, 1000);
function ranking() {
  const tid = torneio?.id ?? '';
  return [...(meuPet ? [{ nome: meuPet.nome, dono: `${nome} (você)`, v: pontosDe === tid ? pontos : 0, eu: true }] : []), ...[...gente.values()].map((g) => ({ nome: g.pet.nome, dono: g.dono, v: g.pet.torneio === tid ? g.pet.pontos : 0, eu: false }))].sort((a, b) => b.v - a.v);
}
function placar() { $('placar').innerHTML = ''; for (const l of ranking()) { const li = document.createElement('li'); li.textContent = `${l.nome} · ${l.dono} · ${l.v} vitória${l.v === 1 ? '' : 's'}`; if (l.eu) li.className = 'eu'; $('placar').append(li); } }
function fimTorneio() {
  const r = ranking(), c = r[0];
  $('fim-titulo').textContent = c && c.v > 0 ? `${c.nome} é campeão!` : 'Ninguém venceu desta vez';
  $('fim-texto').textContent = c && c.v > 0 ? `Bicho de ${c.dono.replace(' (você)', '')}, com ${c.v} vitória${c.v === 1 ? '' : 's'}. Cada um foi treinado só pelo próprio dono, e lutou sozinho.` : 'Chegue perto do bicho de alguém e aperte E.';
  $('fim-lista').innerHTML = ''; for (const l of r) { const li = document.createElement('li'); li.textContent = `${l.nome} (${l.dono}): ${l.v}`; $('fim-lista').append(li); }
  $('fim').hidden = false;
}

// ---------- battle ----------
const palavras = (s: string) => s.toLowerCase().split(/[^\p{L}]+/u).filter((w) => w.length > 3 && w !== 'golpe');
// Each pet's own mind picks the move. Without local AI, simple rules stand in.
async function escolher(p: Pet, alvo: { nome: string; tipo: Tipo }): Promise<Escolha> {
  const grito = dica.toLowerCase(); dica = '';
  const pedido = grito ? p.golpes.findIndex((g) => palavras(g.nome).some((w) => grito.includes(w))) : -1;
  const lembrou = !!grito && p.memorias.some((m) => palavras(m).some((w) => grito.includes(w)));
  const x = await json(`Você é ${p.nome}, um bicho de batalha do tipo ${p.tipo}. Seu dono te ensinou: ${p.memorias.join('; ') || 'nada ainda'}. ${grito ? `Seu dono grita agora: "${grito}".` : ''} Seus golpes: ${p.golpes.map((g, i) => `${i}=${g.nome} (${g.tipo}, poder ${g.poder})`).join(', ')}. Oponente: ${alvo.nome}, tipo ${alvo.tipo}. Regras: água vence fogo, fogo vence planta, planta vence água, raio vence água, sombra e luz vencem uma à outra. Escolha o golpe. Só JSON: {"golpe":0,"motivo":"até 10 palavras","fala":"grito curto e engraçado"}`);
  const i = Number(x?.golpe), usouIa = !!x && Number.isInteger(i) && i >= 0 && i < p.golpes.length;
  const melhor = p.golpes.reduce((b, g, j) => (g.poder * eficacia(g.tipo, alvo.tipo) > p.golpes[b].poder * eficacia(p.golpes[b].tipo, alvo.tipo) ? j : b), 0);
  const idx = usouIa ? i : pedido >= 0 ? pedido : melhor, g = p.golpes[idx], ef = eficacia(g.tipo, alvo.tipo);
  const motivo = (usouIa && limpa(x.motivo, 80)) || (pedido >= 0 ? `o dono pediu ${g.nome}` : ef > 1 ? `${g.tipo} é forte contra ${alvo.tipo}` : `${g.nome} era o golpe mais forte`);
  return { g: lembrou ? { ...g, poder: g.poder + 8 } : g, fala: (usouIa && limpa(x.fala, 70)) || (lembrou ? 'Eu lembro disso!' : `${g.nome}!`), motivo, ia: usouIa, obedeceu: pedido >= 0 ? idx === pedido : null, lembrou };
}
function resumo(): Resumo { return { id: ID, dono: nome, nome: meuPet!.nome, tipo: meuPet!.tipo, cor, hpMax: meuPet!.hpMax }; }
function desafiar(g: Gente) {
  if (lutando || !meuPet) return;
  if ((recarga.get(g.id) ?? 0) > Date.now()) { estado(`Espere um pouco para desafiar ${g.pet.nome} de novo.`); return; }
  recarga.set(g.id, Date.now() + RECARGA); void lutar(g);
}
// The challenger hosts the fight; the other browser only picks its own moves.
async function lutar(g: Gente) {
  lutando = true;
  const A = resumo(), B: Resumo = { id: g.id, dono: g.dono, nome: g.pet.nome, tipo: g.pet.tipo, cor: g.pet.cor, hpMax: g.pet.hpMax };
  const hp: Record<string, number> = { [A.id]: A.hpMax, [B.id]: B.hpMax };
  const ev = (e: any) => { const m = { ...e, de: ID }; pub(`luta/${B.id}`, m); mostrar(m); };
  pub(`luta/${B.id}`, { tipo: 'inicio', de: ID, a: A, b: B }); abrir(A, B);
  caixa(`${A.dono} desafiou ${B.dono}! ${A.nome} contra ${B.nome}.`, 'Cada bicho decide sozinho, no computador do próprio dono.');
  pub('feed', { t: `${A.nome} (${A.dono}) desafiou ${B.nome} (${B.dono})!` });
  await espera(1600);
  for (let turno = 0; turno < 14 && hp[A.id] > 0 && hp[B.id] > 0; turno++) {
    const minha = turno % 2 === 0, quem = minha ? A : B, alvo = minha ? B : A;
    ev({ tipo: 'pensando', quem: quem.id, nome: quem.nome, dono: quem.dono });
    let esc: Escolha;
    if (minha) esc = await escolher(meuPet!, alvo);
    else {
      pub(`luta/${B.id}`, { tipo: 'sua-vez', de: ID, alvo: A });
      const r: any = await new Promise((ok) => { esperando = ok; setTimeout(() => ok(null), 20000); });
      const base = g.pet.golpes.find((x) => x.nome === r?.g?.nome) ?? g.pet.golpes[0];
      esc = r ? { g: r.lembrou ? { ...base, poder: base.poder + 8 } : base, fala: limpa(r.fala, 70) || base.nome, motivo: limpa(r.motivo, 80), ia: !!r.ia, obedeceu: r.obedeceu ?? null, lembrou: !!r.lembrou } : { g: base, fala: '...', motivo: `o computador de ${B.dono} não respondeu`, ia: false, obedeceu: null, lembrou: false };
    }
    const d = dano(esc.g, alvo.tipo); hp[alvo.id] = Math.max(0, hp[alvo.id] - d.valor);
    ev({ tipo: 'golpe', quem: quem.id, nome: quem.nome, dono: quem.dono, alvo: alvo.id, golpe: esc.g, fala: esc.fala, motivo: esc.motivo, ia: esc.ia, obedeceu: esc.obedeceu, lembrou: esc.lembrou, valor: d.valor, ef: d.ef, critico: d.critico, hp: { ...hp } });
    pub('anima', { atk: quem.id, def: alvo.id, tipo: esc.g.tipo });
    await espera(2200);
  }
  const v = hp[A.id] >= hp[B.id] ? A : B;
  ev({ tipo: 'fim', vencedor: v.id, nome: v.nome, dono: v.dono });
  pub('feed', { t: `${v.nome} (${v.dono}) venceu a batalha!`, forte: true });
}
async function receberLuta(d: any) {
  if (d.tipo === 'inicio' && d.a && d.b) { lutando = true; abrir(d.b, d.a); caixa(`${d.a.dono} desafiou você! ${d.a.nome} contra ${d.b.nome}.`, 'Seu bicho vai lutar sozinho. Você pode gritar dicas.'); }
  else if (d.tipo === 'sua-vez' && meuPet) { const e = await escolher(meuPet, d.alvo); pub(`luta/${d.de}`, { tipo: 'escolha', ...e }); }
  else if (d.tipo === 'escolha') { esperando?.(d); esperando = null; }
  else mostrar(d);
}

// ---------- battle screen ----------
let lados: { eu: Resumo; op: Resumo } | null = null;
function pintarPet(cv: HTMLCanvasElement, r: Resumo) {
  if (!cena) return; const [k] = textura(cena, r.tipo, r.cor), src = cena.textures.get(k).getSourceImage() as CanvasImageSource;
  const c = cv.getContext('2d')!; c.clearRect(0, 0, cv.width, cv.height); c.imageSmoothingEnabled = false; c.drawImage(src, 0, 0, cv.width, cv.height);
}
function abrir(eu: Resumo, op: Resumo) {
  lados = { eu, op }; $('batalha').hidden = false; $('b-fechar').hidden = true; $('b-grito-linha').hidden = false;
  for (const [k, r] of [['eu', eu], ['op', op]] as const) { $(`b-${k}-nome`).textContent = r.nome; $(`b-${k}-dono`).textContent = r.id === ID ? 'seu bicho' : `de ${r.dono}`; $(`b-${k}-tipo`).textContent = r.tipo; $(`b-${k}-tipo`).style.background = hex(COR_TIPO[r.tipo]); pintarPet($(`b-${k}-pet`), r); hpBar(k, r.hpMax, r.hpMax); }
}
function hpBar(k: 'eu' | 'op', hp: number, max: number) { const b = $(`b-${k}-barra`); b.style.width = `${(hp / max) * 100}%`; b.className = hp / max < 0.25 ? 'mal' : hp / max < 0.5 ? 'meio' : ''; $(`b-${k}-hp`).textContent = `${hp}/${max}`; }
function caixa(t: string, m = '') { $('b-texto').textContent = t; $('b-motivo').textContent = m; }
function mostrar(e: any) {
  if (!lados) return;
  const k = e.quem === lados.eu.id ? 'eu' : 'op';
  if (e.tipo === 'pensando') caixa(`${e.nome} está pensando...`, e.quem === ID ? (iaPronta ? '🧠 A mente do seu bicho está rodando neste computador.' : '⚙️ Sem IA neste computador: seu bicho usa regras simples.') : `🧠 Pensando no computador de ${e.dono}.`);
  else if (e.tipo === 'golpe') {
    const outro = k === 'eu' ? 'op' : 'eu', atk = $(`b-${k}-pet`), alvo = $(`b-${outro}-pet`);
    atk.classList.remove('bate'); alvo.classList.remove('dor'); void atk.offsetWidth; atk.classList.add('bate'); setTimeout(() => alvo.classList.add('dor'), 220);
    for (const [kk, r] of [['eu', lados.eu], ['op', lados.op]] as const) hpBar(kk, e.hp[r.id], r.hpMax);
    const ef = e.ef > 1 ? ' É super efetivo!' : e.ef < 1 ? ' Não foi muito efetivo...' : '';
    caixa(`${e.nome} usou ${e.golpe.nome}! "${e.fala}"${ef}${e.critico ? ' Crítico!' : ''} (-${e.valor})`,
      `${e.ia ? '🧠 A IA' : '⚙️ A regra'} ${e.quem === ID ? 'neste computador' : `no computador de ${e.dono}`} decidiu: ${e.motivo}.${e.obedeceu === true ? ' Obedeceu ao grito.' : e.obedeceu === false ? ' Ignorou o grito.' : ''}${e.lembrou ? ' Lembrou do que o dono ensinou: +8 de poder.' : ''}`);
    if (e.quem === ID) cena?.balao(ID, e.fala);
  } else if (e.tipo === 'fim') {
    const ganhei = e.vencedor === ID;
    caixa(ganhei ? `${e.nome} venceu! +1 no torneio.` : `${e.nome} venceu. Seu bicho desmaiou.`, ganhei ? 'Ensine mais coisas para ele ficar ainda mais forte.' : 'Ensine coisas novas: cada memória deixa o golpe especial mais forte.');
    if (ganhei && meuPet) { meuPet.vitorias++; if (pontosDe === torneio?.id) pontos++; salvar(); ficha(); }
    lutando = false; $('b-fechar').hidden = false; $('b-grito-linha').hidden = true; enviarPos(); placar();
    setTimeout(() => { if (!lutando) fechar(); }, 6000);
  }
}
function fechar() { $('batalha').hidden = true; lados = null; }

// ---------- panel ----------
function feed(t: string, forte = false) { const p = document.createElement('p'); p.textContent = t; if (forte) p.className = 'forte'; const f = $('feed'); f.prepend(p); while (f.children.length > 30) f.lastChild?.remove(); }
function ficha() {
  if (!meuPet || !cena?.pronta) return;
  pintarPet($('f-pet'), resumo());
  $('f-nome').textContent = meuPet.nome; $('f-tipo').textContent = meuPet.tipo; $('f-tipo').style.background = hex(COR_TIPO[meuPet.tipo]);
  $('f-vit').textContent = `${meuPet.vitorias} vitória${meuPet.vitorias === 1 ? '' : 's'} no total`;
  $('f-mente').textContent = iaPronta ? '🧠 Mente: IA rodando neste computador' : '⚙️ Mente: regras simples (IA desligada)';
  $('f-golpes').innerHTML = ''; for (const g of meuPet.golpes) { const s = document.createElement('span'); s.className = 'tag'; s.style.background = hex(COR_TIPO[g.tipo]); s.textContent = `${g.nome} · ${g.poder}`; $('f-golpes').append(s); }
  const n = meuPet.memorias.length;
  $('f-proximo').textContent = meuPet.golpes.length > 3 ? `Golpe especial com poder ${meuPet.golpes[3].poder}. Cada memória nova aumenta o poder (máx. 40).` : `Ensine ${n % 2 === 0 ? 2 : 1} coisa${n % 2 === 0 ? 's' : ''} para ele criar um golpe especial.`;
  $('f-mem').innerHTML = ''; for (const m of [...meuPet.memorias].reverse()) { const p = document.createElement('div'); p.textContent = `• ${m}`; $('f-mem').append(p); }
  $('guardar').textContent = guardado ? 'Soltar o bicho' : 'Guardar o bicho (não luta)';
  placar();
}

// ---------- entry and controls ----------
function escolhaVisual() {
  const caixaV = $('visuais'); visual = hash(ID) % VISUAIS.length;
  VISUAIS.forEach((v, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'visual'; b.setAttribute('aria-pressed', String(i === visual)); b.setAttribute('aria-label', `Aparência ${i + 1}`); const cv = document.createElement('canvas'); desenharVisual(cv, v); b.append(cv); b.onclick = () => { visual = i; for (const x of caixaV.children) x.setAttribute('aria-pressed', String(x === b)); }; caixaV.append(b); });
}
escolhaVisual();
async function entrar() {
  $('entrada').hidden = true; $('jogo').hidden = false; conectar();
  await document.fonts.load('12px "Pixelify Sans"').catch(() => {});
  cena = new Praca(); const pai = $('game');
  const tam = () => ({ width: Math.max(160, Math.floor(pai.clientWidth / 2)), height: Math.max(120, Math.floor(pai.clientHeight / 2)) });
  const game = new Phaser.Game({ type: Phaser.AUTO, parent: 'game', banner: false, pixelArt: true, scale: { mode: Phaser.Scale.NONE, zoom: 2, ...tam() }, scene: cena });
  addEventListener('resize', () => { const t = tam(); game.scale.resize(t.width, t.height); });
  estado('Ande com WASD. Clique no mapa para voltar a andar depois de digitar.');
  feed(`${meuPet!.nome} chegou na praça com ${nome}.`, true);
  if ($<HTMLInputElement>('usar-ia').checked) void ia();
}
$('chocar').onclick = async () => {
  nome = limpa($<HTMLInputElement>('nome').value, 16); const desc = $<HTMLInputElement>('desc').value.trim();
  if (!nome || !desc) { $('aviso').textContent = 'Escreva seu nome e descreva o ovo.'; return; }
  $<HTMLButtonElement>('chocar').disabled = true; $('aviso').textContent = 'O ovo está rachando...';
  let p = nascer(desc, nome, ID);
  const x = await json(`Crie um bicho de batalha a partir de: "${desc}". tipo: ${TIPOS.join('|')}. 3 golpes com nomes criativos em português. Só JSON: {"nome":"1 ou 2 palavras","tipo":"","golpes":[{"nome":"","tipo":""},{"nome":"","tipo":""},{"nome":"","tipo":""}]}`);
  if (x) p = petDaIA(x, p);
  meuPet = p; cor = COR_TIPO[p.tipo]; salvar(); await entrar();
};
$('ensinar').onclick = async () => {
  const inp = $<HTMLInputElement>('memoria'), txt = inp.value.trim(); if (!meuPet || !txt) return; inp.value = ''; inp.blur();
  $('f-resposta').textContent = `${meuPet.nome} está ouvindo...`;
  const x = await json(`Você é ${meuPet.nome}, um bicho de batalha. Seu dono te contou: "${txt}". Invente um golpe inspirado nisso e responda ao dono com uma frase curta. Só JSON: {"nome":"até 3 palavras","tipo":"${TIPOS.join('|')}","fala":"resposta curta"}`);
  const palavra = (palavras(txt).filter((w) => !/^(gosto|odeio|adoro|sempre|quando|muito)$/.test(w)).pop() || 'memória').replace(/^\p{L}/u, (c) => c.toUpperCase()).slice(0, 14);
  const novo = x?.nome ? x : meuPet.memorias.length % 2 === 1 ? { nome: `Golpe ${palavra}`, tipo: meuPet.tipo } : undefined;
  meuPet = aprender(meuPet, txt, novo); salvar();
  const g = meuPet.golpes[3];
  $('f-resposta').textContent = `${meuPet.nome}: "${limpa(x?.fala, 80) || (novo ? 'Aprendi um golpe novo!' : 'Vou lembrar disso!')}"${novo && g ? ` Novo golpe: ${g.nome} (${g.tipo}, poder ${g.poder}).` : ''}`;
  ficha(); cena?.balao(ID, novo ? `Aprendi ${g?.nome}!` : 'Vou lembrar disso!'); enviarPos();
};
$('memoria').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('ensinar').click(); });
$('b-gritar').onclick = () => { const i = $<HTMLInputElement>('b-grito'); dica = limpa(i.value, 80); i.value = ''; i.blur(); if (dica) { caixa(`Você gritou: "${dica}"`, 'Seu bicho decide se obedece no próximo golpe dele.'); pub('feed', { t: `${nome} gritou: ${dica}` }); } };
$('b-grito').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('b-gritar').click(); });
$('b-fechar').onclick = fechar;
$('guardar').onclick = () => { guardado = !guardado; if (!guardado && cena) cena.petPos = { x: cena.pos.x + 20, y: cena.pos.y + 8 }; ficha(); enviarPos(); };
$('apagar').onclick = () => { if (!confirm('Apagar seu bicho? Ele só existe neste computador. Não tem volta.')) return; try { localStorage.removeItem('bichos_pet3'); } catch { /* */ } pub(`gente/${ID}`, '', true); location.reload(); };
$('perto').onclick = () => { if (alvoPerto) desafiar(alvoPerto); };
$('novo-torneio').onclick = () => { $('fim').hidden = true; novoTorneio(); };
// clicking the map hands the keyboard back to walking
$('game').addEventListener('pointerdown', (e) => { if ((e.target as HTMLElement).closest('input,button')) return; (document.activeElement as HTMLElement | null)?.blur(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') (document.activeElement as HTMLElement | null)?.blur(); });
addEventListener('pagehide', () => pub('sai', { id: ID }));
(window as any).__ir = (x: number, y: number) => { if (cena) { cena.pos = { x, y }; cena.petPos = { x: x + 20, y: y + 8 }; } };
try { const s = JSON.parse(localStorage.getItem('bichos_pet3') || 'null'); if (s?.meuPet) { meuPet = s.meuPet; cor = s.cor; visual = s.visual ?? visual; pontos = s.pontos ?? 0; pontosDe = s.pontosDe ?? ''; nome = meuPet!.dono; $('voltar').hidden = false; $('voltar').textContent = `Voltar com ${meuPet!.nome}`; $('voltar').onclick = () => void entrar(); } } catch { /* first visit */ }
