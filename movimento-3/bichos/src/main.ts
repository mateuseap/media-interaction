// Bichos: everyone walks the plaza with their own pet. Each pet's mind is a local LLM in the
// owner's browser; the pet learns only from its owner and battles on its own when pets meet.
import * as Phaser from 'phaser';
import mqtt from 'mqtt';
import { IDLE_INPUT, TILE_SIZE, stepPlayer, type MovementInput, type Position } from './pixelhub/shared';
import { PlayerSprite } from './pixelhub/game/PlayerSprite';
import { createAvatarTextures } from './pixelhub/game/textures';
import { SPAWNS, VILA, VISUAIS, cabeca, corpos, desenharVisual, montarVila } from './vila';
import { aprender, dano, eficacia, nascer, petDaIA, TIPOS, type Golpe, type Pet } from './regras';
import { COR_TIPO, textura } from './sprites';

const $ = <T extends HTMLElement>(x: string) => document.getElementById(x) as T;
const SALA = (new URLSearchParams(location.search).get('sala') || 'aula').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24) || 'aula';
const BASE = `bichos-cin0055-v2/${SALA}`;
const ID = (() => { try { const v = localStorage.getItem('bichos_id') || crypto.randomUUID().slice(0, 8); localStorage.setItem('bichos_id', v); return v; } catch { return crypto.randomUUID().slice(0, 8); } })();
const PERTO = 56, RECARGA = 25000;
const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);

type Gente = { id: string; dono: string; visual: number; x: number; y: number; pet: Omit<Pet, 'memorias'> & { cor: number; guardado: boolean; px: number; py: number }; t: number };
let cliente: mqtt.MqttClient, nome = '', visual = 0, meuPet: Pet | null = null, cor = 0, guardado = false, motor: any = null;
const gente = new Map<string, Gente>();
const placar = new Map<string, { nome: string; dono: string; v: number }>();
const recarga = new Map<string, number>();
let lutando = false, cena: Praca | null = null, dica = '';
const salvar = () => { try { if (meuPet) localStorage.setItem('bichos_pet2', JSON.stringify({ meuPet, cor })); } catch { /* per-viewer only */ } };
const pub = (s: string, x: unknown, retain = false) => cliente?.publish(`${BASE}/${s}`, JSON.stringify(x), { retain });

// ---------- local AI ----------
async function ia() {
  if (motor) return motor;
  if (!$<HTMLInputElement>('usar-ia').checked) return null;
  const gpu = (navigator as any).gpu, ad = gpu && (await gpu.requestAdapter().catch(() => null)); if (!ad) return null;
  const w = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm@0.2.79' as string);
  motor = await w.CreateMLCEngine(`Qwen2.5-1.5B-Instruct-${ad.features.has('shader-f16') ? 'q4f16_1' : 'q4f32_1'}-MLC`, { initProgressCallback: (x: { text: string }) => { $('estado').textContent = `Mente do bicho: ${x.text.slice(0, 60)}`; } });
  return motor;
}
async function json(prompt: string) { const m = await ia().catch(() => null); if (!m) return null; try { const r = await m.chat.completions.create({ temperature: 0.9, max_tokens: 200, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }); return JSON.parse(r.choices[0].message.content || '{}'); } catch { return null; } }

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
    const kb = this.input.keyboard; if (kb) { kb.disableGlobalCapture(); this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT', false) as any; }
    const [sx, sy] = SPAWNS[hash(ID) % SPAWNS.length]; this.pos = { x: sx * TILE_SIZE + 16, y: sy * TILE_SIZE + 16 }; this.petPos = { x: this.pos.x + 24, y: this.pos.y + 10 };
    this.pronta = true; this.cameras.main.startFollow(this.dono(ID, nome, visual, this.pos).container, true, 0.12, 0.12);
  }
  input2(): MovementInput { const a = document.activeElement; if (a instanceof HTMLInputElement) return IDLE_INPUT; const d = (k: string) => this.keys[k]?.isDown === true; return { up: d('W') || d('UP'), down: d('S') || d('DOWN'), left: d('A') || d('LEFT'), right: d('D') || d('RIGHT') }; }
  dono(id: string, n: string, v: number, p: Position) {
    let s = this.donos.get(id); if (s) return s;
    const vis = VISUAIS[v] || VISUAIS[0];
    s = new PlayerSprite(this, p.x, p.y, n, '#' + vis.roupa.toString(16).padStart(6, '0'), id === ID ? 'você' : '', '#f2ead8', cabeca(this, `cab-${v}`, vis.cab, vis.cabelo, vis.pele), [`corpo-${vis.corpo}-0`, `corpo-${vis.corpo}-1`]);
    this.donos.set(id, s); return s;
  }
  pet(id: string, p: { nome: string; tipo: Pet['tipo']; cor: number }, pos: Position) {
    let c = this.pets.get(id); if (c) return c;
    const [k0, k1] = textura(this, p.tipo, p.cor), img = this.add.image(0, 0, k0).setOrigin(0.5, 1);
    const sombra = this.add.ellipse(0, 1, 22, 6, 0x000000, 0.25);
    const rot = this.add.text(0, -24, p.nome, { fontFamily: '"Pixelify Sans", monospace', fontSize: '9px', color: '#1d1a2b', backgroundColor: id === ID ? '#ffd447' : '#fff8e7', padding: { x: 3, y: 1 } }).setOrigin(0.5, 1);
    c = this.add.container(pos.x, pos.y, [sombra, img, rot]).setDepth(4); c.setData('img', img).setData('k', [k0, k1]);
    this.pets.set(id, c); return c;
  }
  balao(id: string, txt: string) { const c = this.pets.get(id); if (!c) return; const b = this.add.text(c.x, c.y - 34, txt, { fontFamily: '"Pixelify Sans", monospace', fontSize: '10px', color: '#1d1a2b', backgroundColor: '#ffffff', padding: { x: 4, y: 2 }, wordWrap: { width: 150 } }).setOrigin(0.5, 1).setDepth(8); this.tweens.add({ targets: b, y: b.y - 8, alpha: 0, delay: 2600, duration: 500, onComplete: () => b.destroy() }); }
  golpe(de: string, para: string, valor: number, tipo: Pet['tipo']) {
    const a = this.pets.get(de), b = this.pets.get(para); if (!a || !b) return;
    this.tweens.add({ targets: a, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, duration: 160, yoyo: true });
    const f = this.add.circle(b.x, b.y - 10, 4, COR_TIPO[tipo]).setDepth(9); this.tweens.add({ targets: f, scale: 5, alpha: 0, duration: 380, onComplete: () => f.destroy() });
    const n = this.add.text(b.x, b.y - 30, `-${valor}`, { fontFamily: '"Pixelify Sans", monospace', fontSize: '14px', color: '#ff4d5e', stroke: '#1d1a2b', strokeThickness: 3 }).setOrigin(0.5).setDepth(9);
    this.tweens.add({ targets: n, y: n.y - 22, alpha: 0, duration: 900, onComplete: () => n.destroy() });
    this.tweens.add({ targets: b, alpha: 0.3, duration: 70, yoyo: true, repeat: 2 });
  }
  update(time: number, dt: number) {
    if (!this.pronta) return;
    const inp = this.input2(), anda = inp.up || inp.down || inp.left || inp.right;
    if (anda && !lutando) this.pos = stepPlayer(VILA, this.pos, inp, dt);
    // own pet trots behind its owner unless kept home
    if (!guardado && !lutando) { const dx = this.pos.x - this.petPos.x, dy = this.pos.y - this.petPos.y, d = Math.hypot(dx, dy); if (d > 30) { const k = Math.min(1, (d - 26) / d) * Math.min(1, dt * 0.006); this.petPos.x += dx * k; this.petPos.y += dy * k; } }
    const eu = this.donos.get(ID)!; eu.setPosition(this.pos.x, this.pos.y); eu.updateWalk(time, anda);
    if (meuPet) { const c = this.pet(ID, { ...meuPet, cor }, this.petPos); c.setPosition(this.petPos.x, this.petPos.y).setVisible(!guardado); }
    for (const [id, g] of gente) {
      const s = this.dono(id, g.dono, g.visual, g); const k = 1 - Math.exp(-dt * 0.01);
      s.setPosition(Phaser.Math.Linear(s.x, g.x, k), Phaser.Math.Linear(s.y, g.y, k)); s.updateWalk(time, Math.abs(s.x - g.x) + Math.abs(s.y - g.y) > 1);
      const c = this.pet(id, g.pet, { x: g.pet.px, y: g.pet.py }); c.setPosition(Phaser.Math.Linear(c.x, g.pet.px, k), Phaser.Math.Linear(c.y, g.pet.py, k)).setVisible(!g.pet.guardado);
    }
    // two-frame hop for every pet
    const q = Math.floor(time / 260) % 2; for (const c of this.pets.values()) { const ks = c.getData('k') as string[]; (c.getData('img') as Phaser.GameObjects.Image).setTexture(ks[q]); }
    if (time - this.ultimo > 120) { this.ultimo = time; enviarPos(); }
    if (!lutando && meuPet && !guardado) procurarLuta();
  }
}

// ---------- network ----------
function enviarPos() { if (!meuPet || !cena) return; const { memorias, ...pub0 } = meuPet; void memorias; pub(`gente/${ID}`, { id: ID, dono: nome, visual, x: Math.round(cena.pos.x), y: Math.round(cena.pos.y), pet: { ...pub0, cor, guardado, px: Math.round(cena.petPos.x), py: Math.round(cena.petPos.y) }, t: Date.now() }); }
function conectar() {
  cliente = mqtt.connect('wss://broker.emqx.io:8084/mqtt', { clientId: `bichos-${ID}-${Math.random().toString(16).slice(2, 6)}`, reconnectPeriod: 1500, will: { topic: `${BASE}/sai`, payload: JSON.stringify({ id: ID }) } });
  cliente.on('connect', () => { cliente.subscribe(`${BASE}/#`); $('rede').textContent = `sala ${SALA}`; });
  cliente.on('message', (t, b) => {
    let d: any; try { d = JSON.parse(b.toString()); } catch { return; }
    const sub = t.slice(BASE.length + 1);
    if (sub.startsWith('gente/') && d?.id && d.id !== ID && d.pet && TIPOS.includes(d.pet.tipo)) { gente.set(d.id, { ...d, t: Date.now() }); placar.set(d.id, { nome: d.pet.nome, dono: d.dono, v: d.pet.vitorias | 0 }); desenharPlacar(); }
    else if (sub === 'sai' && d?.id) { gente.delete(d.id); placar.delete(d.id); for (const m of [cena?.donos, cena?.pets]) { const x: any = m?.get(d.id); x?.destroy?.(); m?.delete(d.id); } desenharPlacar(); }
    else if (sub === `luta/${ID}`) receberLuta(d);
    else if (sub === 'feed' && d?.t) feed(d.t);
  });
}
setInterval(() => { for (const [k, g] of gente) if (Date.now() - g.t > 15000) { gente.delete(k); placar.delete(k); const s: any = cena?.donos.get(k); s?.destroy?.(); cena?.donos.delete(k); cena?.pets.get(k)?.destroy(); cena?.pets.delete(k); } desenharPlacar(); }, 4000);

// ---------- battles: each pet's local mind picks its own move ----------
// The lower id hosts the fight so both sides agree on one outcome.
function procurarLuta() {
  if (!cena || !meuPet) return;
  for (const [id, g] of gente) {
    if (g.pet.guardado || (recarga.get(id) ?? 0) > Date.now()) continue;
    if (Math.hypot(g.pet.px - cena.petPos.x, g.pet.py - cena.petPos.y) > PERTO) continue;
    recarga.set(id, Date.now() + RECARGA);
    if (ID < id) void lutar(id, g); return;
  }
}
async function escolher(p: Pet, alvo: { nome: string; tipo: Pet['tipo'] }): Promise<{ g: Golpe; fala: string }> {
  const x = await json(`Você é ${p.nome}, um bicho de batalha. Seu dono te ensinou: ${p.memorias.join('; ') || 'nada ainda'}. ${dica ? `Agora ele grita: "${dica}".` : ''} Seus golpes: ${p.golpes.map((g, i) => `${i}=${g.nome} (${g.tipo})`).join(', ')}. Oponente: ${alvo.nome}, tipo ${alvo.tipo}. Escolha um golpe e uma fala curta e engraçada. JSON: {"golpe":0,"fala":""}`);
  const i = Number(x?.golpe);
  // no local mind: pick the most effective move, which a trained pet would also learn
  const melhor = [...p.golpes].sort((a, b) => b.poder * eficacia(b.tipo, alvo.tipo) - a.poder * eficacia(a.tipo, alvo.tipo))[0];
  const g = Number.isInteger(i) && p.golpes[i] ? p.golpes[i] : melhor;
  const lembra = !!dica && p.memorias.some((m) => m.split(/\s+/).some((w) => w.length > 4 && dica.toLowerCase().includes(w.toLowerCase())));
  dica = '';
  return { g: lembra ? { ...g, poder: g.poder + 8 } : g, fala: String(x?.fala || (lembra ? 'Eu lembro disso!' : g.nome + '!')).replace(/[<>]/g, '').slice(0, 70) };
}
async function lutar(oid: string, g: Gente) {
  lutando = true; const eu = meuPet!, op = g.pet, hp = { [ID]: eu.hpMax, [oid]: op.hpMax };
  feed(`${eu.nome} e ${op.nome} se encontraram. Batalha!`, true);
  pub(`luta/${oid}`, { tipo: 'inicio', de: ID, nome: eu.nome });
  for (let turno = 0; turno < 12 && hp[ID] > 0 && hp[oid] > 0; turno++) {
    const minhaVez = turno % 2 === 0;
    let golpe: Golpe, fala: string;
    if (minhaVez) ({ g: golpe, fala } = await escolher(eu, op));
    else {
      // ask the other browser to pick with its own local mind
      pub(`luta/${oid}`, { tipo: 'sua-vez', de: ID, alvo: { nome: eu.nome, tipo: eu.tipo } });
      const r: any = await new Promise((ok) => { esperando = ok; setTimeout(() => ok(null), 15000); });
      golpe = r?.golpe && op.golpes.some((x) => x.nome === r.golpe.nome) ? op.golpes.find((x) => x.nome === r.golpe.nome)! : op.golpes[0];
      if (r?.bonus) golpe = { ...golpe, poder: golpe.poder + 8 };
      fala = String(r?.fala || golpe.nome).replace(/[<>]/g, '').slice(0, 70);
    }
    const [atk, def, alvoTipo] = minhaVez ? [ID, oid, op.tipo] : [oid, ID, eu.tipo];
    const d = dano(golpe, alvoTipo); hp[def] = Math.max(0, hp[def] - d.valor);
    const ev = { tipo: 'golpe', atk, def, valor: d.valor, gtipo: golpe.tipo, fala, txt: `${minhaVez ? eu.nome : op.nome} usou ${golpe.nome}${d.ef > 1 ? ', super efetivo' : ''}: -${d.valor}`, hp };
    pub(`luta/${oid}`, ev); mostrar(ev);
    await new Promise((r) => setTimeout(r, 1300));
  }
  const venceu = hp[ID] >= hp[oid];
  fim(venceu, op.nome); pub(`luta/${oid}`, { tipo: 'fim', venceu: !venceu, contra: eu.nome });
  const vencedor = venceu ? `${eu.nome} (${nome})` : `${op.nome} (${g.dono})`;
  pub('feed', { t: `${vencedor} venceu a batalha!` });
}
let esperando: ((x: unknown) => void) | null = null;
async function receberLuta(d: any) {
  if (d.tipo === 'inicio') { lutando = true; feed(`${d.nome} desafiou ${meuPet?.nome}. Batalha!`, true); }
  else if (d.tipo === 'sua-vez' && meuPet) { const { g, fala } = await escolher(meuPet, d.alvo); pub(`luta/${d.de}`, { tipo: 'escolha', golpe: g, fala, bonus: g.poder > (meuPet.golpes.find((x) => x.nome === g.nome)?.poder ?? 0) }); }
  else if (d.tipo === 'escolha') { esperando?.(d); esperando = null; }
  else if (d.tipo === 'golpe') mostrar(d);
  else if (d.tipo === 'fim') fim(d.venceu, d.contra);
}
function mostrar(ev: any) { cena?.golpe(ev.atk, ev.def, ev.valor, ev.gtipo); cena?.balao(ev.atk, ev.fala); feed(ev.txt); const h = ev.hp?.[ID]; if (typeof h === 'number') $('hp').textContent = `${h}/${meuPet?.hpMax ?? 100} HP`; }
function fim(venceu: boolean, contra: string) {
  lutando = false; $('hp').textContent = '';
  if (venceu && meuPet) { meuPet.vitorias++; salvar(); ficha(); }
  feed(venceu ? `${meuPet?.nome} venceu ${contra}!` : `${meuPet?.nome} perdeu para ${contra}. Ensine mais e tente de novo.`, true);
  enviarPos();
}

// ---------- panel ----------
function feed(t: string, forte = false) { const p = document.createElement('p'); p.textContent = t; if (forte) p.className = 'forte'; const f = $('feed'); f.prepend(p); while (f.children.length > 30) f.lastChild?.remove(); }
function desenharPlacar() {
  const linhas = [...(meuPet ? [{ nome: meuPet.nome, dono: `${nome} (você)`, v: meuPet.vitorias }] : []), ...placar.values()].sort((a, b) => b.v - a.v);
  $('placar').innerHTML = ''; for (const l of linhas) { const li = document.createElement('li'); li.textContent = `${l.nome} · ${l.dono} · ${l.v} vitória${l.v === 1 ? '' : 's'}`; $('placar').append(li); }
}
function ficha() {
  if (!meuPet) return;
  const cv = $<HTMLCanvasElement>('f-pet'), c = cv.getContext('2d')!; c.clearRect(0, 0, cv.width, cv.height);
  const src = cena?.textures.exists(`pet-${meuPet.tipo}-${cor.toString(16)}-0`) ? (cena.textures.get(`pet-${meuPet.tipo}-${cor.toString(16)}-0`).getSourceImage() as CanvasImageSource) : null;
  if (src) { c.imageSmoothingEnabled = false; c.drawImage(src, 0, 0, 84, 60); }
  $('f-nome').textContent = meuPet.nome; $('f-tipo').textContent = meuPet.tipo; $('f-tipo').style.background = '#' + COR_TIPO[meuPet.tipo].toString(16).padStart(6, '0');
  $('f-vit').textContent = `${meuPet.vitorias} vitória${meuPet.vitorias === 1 ? '' : 's'}`;
  $('f-golpes').innerHTML = ''; for (const g of meuPet.golpes) { const s = document.createElement('span'); s.className = 'tag'; s.style.background = '#' + COR_TIPO[g.tipo].toString(16).padStart(6, '0'); s.textContent = `${g.nome} ${g.poder}`; $('f-golpes').append(s); }
  $('f-mem').innerHTML = ''; for (const m of [...meuPet.memorias].reverse()) { const p = document.createElement('div'); p.textContent = `• ${m}`; $('f-mem').append(p); }
  $('guardar').textContent = guardado ? 'Soltar o bicho' : 'Guardar o bicho (não luta)';
  desenharPlacar();
}

// ---------- entry ----------
function escolhaVisual() {
  const caixa = $('visuais'); visual = hash(ID) % VISUAIS.length;
  VISUAIS.forEach((v, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'visual'; b.setAttribute('aria-pressed', String(i === visual)); b.setAttribute('aria-label', `Aparência ${i + 1}`); const cv = document.createElement('canvas'); desenharVisual(cv, v); b.append(cv); b.onclick = () => { visual = i; for (const x of caixa.children) x.setAttribute('aria-pressed', String(x === b)); }; caixa.append(b); });
}
escolhaVisual();
async function entrar() {
  $('entrada').hidden = true; $('jogo').hidden = false; conectar();
  await document.fonts.load('12px "Pixelify Sans"').catch(() => {});
  cena = new Praca(); const pai = $('game');
  const tam = () => ({ width: Math.max(160, Math.floor(pai.clientWidth / 2)), height: Math.max(120, Math.floor(pai.clientHeight / 2)) });
  const game = new Phaser.Game({ type: Phaser.AUTO, parent: 'game', banner: false, pixelArt: true, scale: { mode: Phaser.Scale.NONE, zoom: 2, ...tam() }, scene: cena });
  addEventListener('resize', () => { const t = tam(); game.scale.resize(t.width, t.height); });
  setTimeout(ficha, 400);
  $('estado').textContent = 'Ande com WASD. Quando seu bicho encontrar outro, eles lutam sozinhos.';
  feed(`${meuPet!.nome} chegou na praça com ${nome}.`, true);
}
$('chocar').onclick = async () => {
  nome = $<HTMLInputElement>('nome').value.replace(/[<>]/g, '').trim().slice(0, 16); const desc = $<HTMLInputElement>('desc').value.trim();
  if (!nome || !desc) { $('aviso').textContent = 'Escreva seu nome e descreva o ovo.'; return; }
  $<HTMLButtonElement>('chocar').disabled = true; $('aviso').textContent = 'O ovo está rachando...';
  let p = nascer(desc, nome, ID);
  const x = await json(`Crie um bicho de batalha a partir de: "${desc}". tipo: ${TIPOS.join('|')}. 3 golpes com nomes criativos em português. JSON: {"nome":"1 ou 2 palavras","tipo":"","golpes":[{"nome":"","tipo":""},{"nome":"","tipo":""},{"nome":"","tipo":""}]}`);
  if (x) p = petDaIA(x, p);
  meuPet = p; cor = COR_TIPO[p.tipo]; salvar(); await entrar();
};
$('ensinar').onclick = async () => {
  const inp = $<HTMLInputElement>('memoria'), txt = inp.value.trim(); if (!meuPet || !txt) return; inp.value = '';
  const x = await json(`Seu dono contou a você, bicho ${meuPet.nome}: "${txt}". Invente um golpe inspirado nisso. JSON: {"nome":"até 3 palavras","tipo":"${TIPOS.join('|')}"}`);
  const palavra = (txt.split(/\s+/).filter((w) => w.length > 3 && !/^(amo|gosto|odeio|adoro|sempre|quando|muito)$/i.test(w)).pop() || 'Memória').replace(/^\p{L}/u, (c) => c.toUpperCase()).slice(0, 14);
  const novo = x?.nome ? x : meuPet.memorias.length % 2 === 1 ? { nome: `Golpe ${palavra}`, tipo: meuPet.tipo } : undefined;
  meuPet = aprender(meuPet, txt, novo); salvar(); ficha(); cena?.balao(ID, novo ? `Aprendi ${novo.nome}!` : 'Vou lembrar disso!');
};
$('memoria').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('ensinar').click(); });
$('gritar').onclick = () => { const i = $<HTMLInputElement>('grito'); dica = i.value.trim().slice(0, 80); if (dica) { cena?.balao(ID, `"${dica}"`); feed(`${nome} gritou: ${dica}`); } i.value = ''; };
$('grito').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('gritar').click(); });
$('guardar').onclick = () => { guardado = !guardado; if (!guardado && cena) cena.petPos = { x: cena.pos.x + 20, y: cena.pos.y + 8 }; ficha(); enviarPos(); };
$('apagar').onclick = () => { if (!confirm('Apagar seu bicho? Ele só existe neste computador. Não tem volta.')) return; try { localStorage.removeItem('bichos_pet2'); } catch { /* */ } pub(`gente/${ID}`, '', true); location.reload(); };
addEventListener('pagehide', () => pub('sai', { id: ID }));
(window as any).__ir = (x: number, y: number) => { if (cena) { cena.pos = { x, y }; cena.petPos = { x: x + 20, y: y + 8 }; } };
try { const s = JSON.parse(localStorage.getItem('bichos_pet2') || 'null'); if (s?.meuPet) { meuPet = s.meuPet; cor = s.cor; nome = meuPet!.dono; $('voltar').hidden = false; $('voltar').textContent = `Voltar com ${meuPet!.nome}`; $('voltar').onclick = () => void entrar(); } } catch { /* first visit */ }
