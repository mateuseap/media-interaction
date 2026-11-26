// Pure pet + battle rules. The AI only names things and picks which move; numbers stay here.
export const TIPOS = ['fogo', 'agua', 'planta', 'raio', 'sombra', 'luz'] as const;
export type Tipo = (typeof TIPOS)[number];
export type Golpe = { nome: string; tipo: Tipo; poder: number };
export type Pet = { id: string; dono: string; nome: string; emoji: string; tipo: Tipo; personalidade: string; hpMax: number; golpes: Golpe[]; memorias: string[]; vitorias: number };

// Rock-paper-scissors ring, plus sombra/luz beat each other.
const FORTE: Record<Tipo, Tipo> = { fogo: 'planta', planta: 'agua', agua: 'fogo', raio: 'agua', sombra: 'luz', luz: 'sombra' };
export const eficacia = (atk: Tipo, def: Tipo) => (FORTE[atk] === def ? 1.5 : FORTE[def] === atk ? 0.75 : 1);

const limpa = (x: unknown, n: number) => String(x ?? '').replace(/[<>]/g, '').trim().slice(0, n);
export const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
const PALAVRAS: [RegExp, Tipo][] = [[/fogo|lava|drag|pimenta|vulc|chama/, 'fogo'], [/agua|água|mar|peixe|sapo|rã|polvo|chuva|mangue/, 'agua'], [/planta|flor|árvore|arvore|cacto|capivara|jaca|folha/, 'planta'], [/raio|eletr|robô|robo|trovão|neon/, 'raio'], [/sombra|fantasma|morcego|noite|gato preto/, 'sombra'], [/luz|sol|estrela|anjo|vaga-lume|vagalume/, 'luz']];
const EMOJI: Record<Tipo, string> = { fogo: '🦎', agua: '🐸', planta: '🌱', raio: '🐹', sombra: '🦇', luz: '🦋' };
const GOLPES: Record<Tipo, string[]> = { fogo: ['Brasa', 'Chama Brava', 'Fornalha'], agua: ['Jato', 'Maré', 'Tsunami'], planta: ['Cipó', 'Folha Navalha', 'Raiz Antiga'], raio: ['Choque', 'Faísca', 'Trovão'], sombra: ['Susto', 'Mordida Escura', 'Apagão'], luz: ['Clarão', 'Raio Solar', 'Aurora'] };

export function nascer(desc: string, dono: string, id: string): Pet {
  const d = limpa(desc, 60) || 'bicho misterioso', t = d.toLowerCase(), h = hash(t);
  const tipo = PALAVRAS.find(([r]) => r.test(t))?.[1] ?? TIPOS[h % TIPOS.length];
  const nome = d.split(/\s+/)[0].replace(/^\p{L}/u, (c) => c.toUpperCase()).slice(0, 14);
  return { id, dono, nome, emoji: EMOJI[tipo], tipo, personalidade: d, hpMax: 100, golpes: GOLPES[tipo].map((n, i) => ({ nome: n, tipo, poder: 18 + i * 6 })), memorias: [], vitorias: 0 };
}

// AI output is untrusted: keep types valid, clamp power, max 4 moves.
export function petDaIA(bruto: unknown, base: Pet): Pet {
  const o = (bruto && typeof bruto === 'object' ? bruto : {}) as Record<string, unknown>;
  const tipo = TIPOS.includes(o.tipo as Tipo) ? (o.tipo as Tipo) : base.tipo;
  const golpes = Array.isArray(o.golpes) ? (o.golpes as Record<string, unknown>[]).slice(0, 3).map((g, i) => ({ nome: limpa(g?.nome, 18) || base.golpes[i]?.nome || 'Golpe', tipo: TIPOS.includes(g?.tipo as Tipo) ? (g.tipo as Tipo) : tipo, poder: 18 + i * 6 })) : base.golpes;
  return { ...base, nome: limpa(o.nome, 14) || base.nome, emoji: limpa(o.emoji, 4) || base.emoji, tipo, golpes: golpes.length ? golpes : base.golpes };
}

// Teaching: each memory can unlock a 4th move, which grows with how much you taught.
export function aprender(p: Pet, memoria: string, golpeNovo?: { nome: string; tipo: Tipo }): Pet {
  const memorias = [...p.memorias, limpa(memoria, 120)].slice(-12);
  const extra = golpeNovo ? { nome: limpa(golpeNovo.nome, 18) || 'Lembrança', tipo: TIPOS.includes(golpeNovo.tipo) ? golpeNovo.tipo : p.tipo, poder: Math.min(40, 20 + 2 * memorias.length) } : null;
  return { ...p, memorias, golpes: extra ? [...p.golpes.slice(0, 3), extra] : p.golpes };
}

export function dano(g: Golpe, alvo: Tipo, rnd = Math.random) {
  const ef = eficacia(g.tipo, alvo), critico = rnd() < 0.1;
  return { valor: Math.round(g.poder * ef * (critico ? 1.5 : 1) * (0.9 + rnd() * 0.2)), ef, critico };
}
