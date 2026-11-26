import mqtt from 'mqtt';
import { aprender, dano, eficacia, nascer, petDaIA, TIPOS, type Golpe, type Pet } from './regras';

const $ = <T extends HTMLElement>(x: string) => document.getElementById(x) as T;
const id = (() => { try { return localStorage.getItem('bichos_id') || (localStorage.setItem('bichos_id', crypto.randomUUID().slice(0, 8)), localStorage.getItem('bichos_id')!); } catch { return crypto.randomUUID().slice(0, 8); } })();
const sala = (new URLSearchParams(location.search).get('sala') || 'aula').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'aula';
const base = `bichos-cin0055-v1/${sala}`;
let cliente: mqtt.MqttClient, eu: Pet | null = null, motor: any = null;
const outros = new Map<string, Pet & { t: number; x: number; y: number }>();
type Luta = { id: string; a: Pet; b: Pet; hp: Record<string, number>; vez: string; texto: string; fim?: string };
let luta: Luta | null = null;
const pub = (sub: string, x: unknown, retain = false) => cliente?.publish(`${base}/${sub}`, JSON.stringify(x), { retain });
const salvar = () => { try { if (eu) localStorage.setItem('bichos_pet', JSON.stringify(eu)); } catch { /* per-viewer only */ } };

// ---------- local AI (optional) ----------
async function ia() {
  if (motor) return motor;
  if (!$<HTMLInputElement>('usar-ia').checked) return null;
  const gpu = (navigator as any).gpu, ad = gpu && (await gpu.requestAdapter().catch(() => null)); if (!ad) return null;
  const w = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm@0.2.79' as string);
  motor = await w.CreateMLCEngine(`Qwen2.5-1.5B-Instruct-${ad.features.has('shader-f16') ? 'q4f16_1' : 'q4f32_1'}-MLC`, { initProgressCallback: (x: { text: string }) => { $('aviso-entrar').textContent = x.text.slice(0, 70); } });
  return motor;
}
async function json(prompt: string) { const m = await ia().catch(() => null); if (!m) return null; try { const r = await m.chat.completions.create({ temperature: 0.9, max_tokens: 220, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }); return JSON.parse(r.choices[0].message.content || '{}'); } catch { return null; } }

// ---------- plaza ----------
function conectar() {
  cliente = mqtt.connect('wss://broker.emqx.io:8084/mqtt', { clientId: `bichos-${id}-${Math.random().toString(16).slice(2, 6)}`, reconnectPeriod: 1500, will: { topic: `${base}/sai`, payload: JSON.stringify({ id }) } });
  cliente.on('connect', () => cliente.subscribe(`${base}/#`, {}, anunciar));
  cliente.on('message', (t, b) => {
    let d: any; try { d = JSON.parse(b.toString()); } catch { return; }
    const sub = t.slice(base.length + 1);
    if (sub === 'pet' && d?.id && d.id !== id) { const v = outros.get(d.id); outros.set(d.id, { ...d, t: Date.now(), x: v?.x ?? 10 + Math.random() * 70, y: v?.y ?? 45 + Math.random() * 40 }); praca(); }
    else if (sub === 'sai' && d?.id) { outros.delete(d.id); praca(); }
    else if (sub === 'desafio' && d?.para === id && !luta && eu) { if (confirm(`${d.de.nome} (de ${d.de.dono}) desafiou seu bicho. Aceitar?`)) começar(d.de, eu, d.luta, d.de.id); }
    else if (sub === 'luta' && luta && d?.id === luta.id && (d.para === id)) receber(d);
  });
}
function anunciar() { if (eu) pub('pet', { ...eu, memorias: [] }); }
setInterval(anunciar, 5000);
setInterval(() => { for (const [k, v] of outros) if (Date.now() - v.t > 20000) outros.delete(k); else { v.x = Math.max(4, Math.min(86, v.x + (Math.random() - 0.5) * 14)); v.y = Math.max(44, Math.min(86, v.y + (Math.random() - 0.5) * 10)); } praca(); }, 2500);

function praca() {
  if (!eu || $('tela-praca').hidden) return;
  const campo = $('campo'); campo.querySelectorAll('.pet').forEach((e) => e.remove());
  const todos = [{ ...eu, x: 40, y: 60, meu: true }, ...[...outros.values()].map((p) => ({ ...p, meu: false }))];
  for (const p of todos) {
    const el = document.createElement('div'); el.className = `pet${p.meu ? ' meu' : ''}`; el.style.left = `${p.x}%`; el.style.top = `${p.y}%`;
    el.innerHTML = `<div class="bicho"></div><div class="placa"></div>`;
    el.querySelector('.bicho')!.textContent = p.emoji; el.querySelector('.placa')!.textContent = p.meu ? `${p.nome} (seu)` : `${p.nome} · ${p.dono}`;
    if (!p.meu) el.onclick = () => desafiar(p);
    campo.append(el);
  }
  $('aviso').textContent = outros.size ? 'Clique no bicho de alguém para desafiar' : `Sala "${sala}": mande o link para a turma`;
}
function ficha() {
  if (!eu) return;
  $('f-emoji').textContent = eu.emoji; $('f-nome').textContent = eu.nome; $('f-tipo').textContent = eu.tipo; $('f-tipo').className = `tag t-${eu.tipo}`;
  $('f-vit').textContent = `${eu.vitorias} vitória${eu.vitorias === 1 ? '' : 's'}`; $('f-pers').textContent = eu.personalidade;
  $('f-golpes').innerHTML = ''; for (const g of eu.golpes) { const s = document.createElement('span'); s.className = `tag t-${g.tipo}`; s.textContent = `${g.nome} ${g.poder}`; $('f-golpes').append(s); }
  const m = $('memorias'); m.innerHTML = '<b>Memórias (só neste computador)</b>';
  for (const x of [...eu.memorias].reverse()) { const p = document.createElement('div'); p.textContent = `• ${x}`; m.append(p); }
}

// ---------- battle ----------
function desafiar(p: Pet) { const l = crypto.randomUUID().slice(0, 8); pub('desafio', { para: p.id, de: { ...eu, memorias: [] }, luta: l }); $('aviso').textContent = `Desafio enviado para ${p.nome}...`; começar(eu!, p, l, eu!.id, true); }
function começar(a: Pet, b: Pet, lid: string, primeiro: string, esperando = false) {
  luta = { id: lid, a, b, hp: { [a.id]: a.hpMax, [b.id]: b.hpMax }, vez: primeiro, texto: esperando ? `Esperando ${b.dono} aceitar...` : `${a.nome} começa!` };
  $('tela-batalha').hidden = false; batalha();
}
const op = () => (luta!.a.id === id ? luta!.b : luta!.a);
function batalha() {
  const l = luta; if (!l || !eu) return; const o = op();
  $('eu-bicho').textContent = eu.emoji; $('op-bicho').textContent = o.emoji; $('eu-nome').textContent = eu.nome; $('op-nome').textContent = `${o.nome} (${o.dono})`;
  for (const [k, p] of [['eu', eu], ['op', o]] as const) { const hp = Math.max(0, l.hp[p.id]); $(`${k}-hp`).textContent = `${hp}/${p.hpMax}`; const b = $(`${k}-barra`); b.style.width = `${(hp / p.hpMax) * 100}%`; b.className = hp < 35 ? 'mal' : ''; }
  $('b-texto').textContent = l.texto;
  const acoes = $('b-acoes'); acoes.innerHTML = '';
  if (l.fim) { const v = document.createElement('button'); v.className = 'btn'; v.textContent = 'Voltar para a praça'; v.onclick = () => { luta = null; $('tela-batalha').hidden = true; praca(); }; acoes.append(v); return; }
  if (l.vez !== id) return;
  for (const g of eu.golpes) { const bt = document.createElement('button'); bt.className = `golpe t-${g.tipo}`; bt.innerHTML = `<span></span><small></small>`; bt.querySelector('span')!.textContent = g.nome; bt.querySelector('small')!.textContent = `${g.tipo} · poder ${g.poder}${eficacia(g.tipo, o.tipo) > 1 ? ' · super efetivo' : ''}`; bt.onclick = () => atacar(g, ''); acoes.append(bt); }
  const livre = document.createElement('div'); livre.className = 'livre';
  livre.innerHTML = `<input maxlength="80" placeholder="Ou dê uma ordem: lembra do cuscuz e ataca!"><button class="btn">Ordenar</button>`;
  const inp = livre.querySelector('input')!; livre.querySelector('button')!.onclick = () => ordem(inp.value); inp.onkeydown = (e) => { if (e.key === 'Enter') ordem(inp.value); };
  acoes.append(livre);
}
async function ordem(txt: string) {
  if (!eu || !luta || luta.vez !== id || !txt.trim()) return;
  $('b-texto').textContent = `${eu.nome} está pensando...`;
  const x = await json(`Você é ${eu.nome}, um bicho de batalha (${eu.personalidade}). Memórias do seu dono: ${eu.memorias.join('; ') || 'nenhuma'}. Golpes: ${eu.golpes.map((g, i) => `${i}=${g.nome}`).join(', ')}. O dono ordenou: "${txt}". Escolha o golpe e diga uma frase curta e engraçada na batalha. JSON: {"golpe":0,"fala":"..."}`);
  const i = Number(x?.golpe), g = eu.golpes[Number.isInteger(i) && i >= 0 && i < eu.golpes.length ? i : eu.golpes.length - 1];
  // Reusing a taught memory in the order boosts the hit: the pet "remembers".
  const lembra = eu.memorias.some((m) => m.split(/\s+/).some((w) => w.length > 4 && txt.toLowerCase().includes(w.toLowerCase())));
  atacar(lembra ? { ...g, poder: g.poder + 8 } : g, String(x?.fala || (lembra ? 'Eu lembro disso!' : txt)).replace(/[<>]/g, '').slice(0, 90));
}
function atacar(g: Golpe, fala: string) {
  const l = luta!; const o = op(); const d = dano(g, o.tipo);
  l.hp[o.id] -= d.valor;
  l.texto = `${eu!.nome} usou ${g.nome}!${fala ? ` "${fala}"` : ''} ${d.ef > 1 ? 'É super efetivo! ' : d.ef < 1 ? 'Não foi muito efetivo... ' : ''}${d.critico ? 'Crítico! ' : ''}−${d.valor}`;
  if (l.hp[o.id] <= 0) { l.fim = id; l.texto += ` ${o.nome} desmaiou! ${eu!.nome} venceu!`; eu!.vitorias++; salvar(); ficha(); } else l.vez = o.id;
  pub('luta', { id: l.id, para: o.dono === eu!.dono ? '' : o.id, hp: l.hp, vez: l.vez, texto: l.texto, fim: l.fim, golpeDe: id, valor: d.valor });
  anima(true, d.valor); batalha();
}
function receber(d: any) {
  const l = luta!; if (l.texto.startsWith('Esperando')) l.texto = '';
  l.hp = d.hp; l.vez = d.vez; l.texto = d.texto; l.fim = d.fim;
  if (d.fim && d.fim !== id && eu) { /* lost: memories stay, no penalty */ }
  anima(false, d.valor); batalha();
}
function anima(meu: boolean, valor: number) {
  const atk = $(meu ? 'eu-bicho' : 'op-bicho'), alvo = $(meu ? 'op-bicho' : 'eu-bicho');
  atk.classList.remove('bate'); alvo.classList.remove('dor'); void atk.offsetWidth; atk.classList.add('bate'); setTimeout(() => alvo.classList.add('dor'), 200);
  const r = alvo.getBoundingClientRect(), n = document.createElement('div'); n.className = 'numero'; n.textContent = `−${valor}`; n.style.left = `${r.left + r.width / 2 - 30}px`; n.style.top = `${r.top}px`; document.body.append(n); setTimeout(() => n.remove(), 1000);
}

// ---------- start ----------
$('chocar').onclick = async () => {
  const nome = $<HTMLInputElement>('nome').value.replace(/[<>]/g, '').trim().slice(0, 16), desc = $<HTMLInputElement>('desc').value.trim();
  if (!nome || !desc) { $('aviso-entrar').textContent = 'Escreva seu nome e descreva o ovo.'; return; }
  $('chocar').setAttribute('disabled', ''); $('aviso-entrar').textContent = 'Chocando...';
  let p = nascer(desc, nome, id);
  const x = await json(`Crie um bicho de batalha estilo Pokémon a partir de: "${desc}". tipo entre ${TIPOS.join('|')}. 3 golpes com nomes criativos em português. JSON: {"nome":"1 palavra","emoji":"1 emoji de animal","tipo":"","golpes":[{"nome":"","tipo":""},{"nome":"","tipo":""},{"nome":"","tipo":""}]}`);
  if (x) p = petDaIA(x, p);
  eu = p; salvar(); entrar();
};
$('ensinar').onclick = async () => {
  const inp = $<HTMLInputElement>('memoria'), txt = inp.value.trim(); if (!eu || !txt) return; inp.value = '';
  let novo: { nome: string; tipo: any } | undefined;
  const x = await json(`Seu dono contou a você, bicho ${eu.nome}: "${txt}". Invente um golpe de batalha inspirado nisso. JSON: {"nome":"até 3 palavras","tipo":"${TIPOS.join('|')}"}`);
  novo = x?.nome ? x : eu.memorias.length % 2 === 1 ? { nome: `${txt.split(/\s+/).filter((w) => w.length > 3).pop() || 'Lembrança'} Lendário`.replace(/^\p{L}/u, (c) => c.toUpperCase()), tipo: eu.tipo } : undefined;
  eu = aprender(eu, txt, novo); salvar(); ficha(); anunciar();
};
$('memoria').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('ensinar').click(); });
function entrar() { $('tela-entrar').hidden = true; $('tela-praca').hidden = false; ficha(); conectar(); praca(); }
try { const s = localStorage.getItem('bichos_pet'); if (s) { eu = JSON.parse(s); entrar(); } } catch { /* first visit */ }
