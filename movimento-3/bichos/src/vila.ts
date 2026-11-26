// The Bichos plaza, adapted from A Testemunha's village: same map engine, daytime, an arena instead of the crime scene.
// Everything is drawn in code; collision uses the same WorldMap shape as PixelHub's movement.
import * as Phaser from 'phaser';
import { TILE_SIZE, type WorldMap } from './pixelhub/shared';

export const MW = 48;
export const MH = 32;
const T = TILE_SIZE;

// ---------------- layout ----------------
type Rect = { x: number; y: number; w: number; h: number };
interface Predio extends Rect { nome: string; porta: number; parede: number; teto: number; tetoE: number; tipo?: 'capela' | 'casa' | 'cabana' }

export const PREDIOS: Predio[] = [
  { nome: 'ARENA', x: 18, y: 1, w: 10, h: 8, porta: 22, parede: 0xeee4cf, teto: 0xa8414c, tetoE: 0x7f2f38, tipo: 'capela' },
  { nome: 'CRECHE DOS OVOS', x: 3, y: 4, w: 8, h: 6, porta: 6, parede: 0xf0d6a2, teto: 0xc9763a, tetoE: 0x9d5a2b },
  { nome: 'LOJINHA', x: 32, y: 4, w: 7, h: 6, porta: 35, parede: 0xcfe6bf, teto: 0x4c8448, tetoE: 0x386637 },
  { nome: 'CENTRO DE CURA', x: 3, y: 19, w: 8, h: 6, porta: 6, parede: 0xc4b2dc, teto: 0x55457a, tetoE: 0x40345d },
  { nome: 'CASAS', x: 31, y: 19, w: 8, h: 6, porta: 34, parede: 0xe9c6b2, teto: 0x7a5640, tetoE: 0x5d4131, tipo: 'casa' },
  { nome: 'CABANA', x: 43, y: 4, w: 4, h: 4, porta: 44, parede: 0x9a7350, teto: 0x5b4330, tetoE: 0x45321f, tipo: 'cabana' },
];
export const COFRE: [number, number] = [25, 10];
export const LAMPIOES: [number, number][] = [[14, 12], [31, 12], [14, 19], [31, 19], [19, 10], [27, 10], [9, 14], [37, 14], [21, 24], [9, 26], [35, 26], [44, 13], [16, 28]];
const TUMULOS: [number, number][] = [[13, 22], [15, 22], [17, 22], [13, 24], [15, 24], [17, 24]];
const CEMITERIO: Rect = { x: 12, y: 21, w: 7, h: 5 };
const FONTE: Rect = { x: 22, y: 15, w: 2, h: 2 };

// tile codes: G grass, R road, P plaza, W water, B bridge, H building, A tree, F fountain, L lamp, C safe, S grave, X fence
const grade: string[][] = Array.from({ length: MH }, () => Array(MW).fill('G'));
const pinta = (x0: number, y0: number, x1: number, y1: number, c: string) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (y >= 0 && y < MH && x >= 0 && x < MW) grade[y][x] = c; };
pinta(1, 15, 39, 16, 'R'); pinta(22, 9, 23, 30, 'R'); pinta(3, 27, 39, 28, 'R');
pinta(15, 11, 30, 20, 'P'); pinta(16, 9, 29, 10, 'P');
pinta(6, 10, 7, 14, 'R'); pinta(35, 10, 36, 14, 'R'); pinta(6, 25, 7, 26, 'R'); pinta(34, 25, 35, 26, 'R');
pinta(40, 0, 42, MH - 1, 'W'); pinta(40, 15, 42, 16, 'B'); pinta(43, 15, 46, 16, 'R'); pinta(44, 8, 45, 14, 'R');
for (const p of PREDIOS) pinta(p.x, p.y, p.x + p.w - 1, p.y + p.h - 1, 'H');
pinta(FONTE.x, FONTE.y, FONTE.x + 1, FONTE.y + 1, 'F');
pinta(CEMITERIO.x, CEMITERIO.y, CEMITERIO.x + CEMITERIO.w - 1, CEMITERIO.y, 'X'); pinta(CEMITERIO.x, CEMITERIO.y + CEMITERIO.h - 1, CEMITERIO.x + CEMITERIO.w - 1, CEMITERIO.y + CEMITERIO.h - 1, 'X');
pinta(CEMITERIO.x, CEMITERIO.y, CEMITERIO.x, CEMITERIO.y + CEMITERIO.h - 1, 'X'); pinta(CEMITERIO.x + CEMITERIO.w - 1, CEMITERIO.y, CEMITERIO.x + CEMITERIO.w - 1, CEMITERIO.y + CEMITERIO.h - 1, 'X');
grade[CEMITERIO.y + CEMITERIO.h - 1][15] = 'G';
for (const [x, y] of TUMULOS) grade[y][x] = 'S';
for (const [x, y] of LAMPIOES) grade[y][x] = 'L';
grade[COFRE[1]][COFRE[0]] = 'C';
for (let x = 0; x < MW; x++) { grade[0][x] = grade[0][x] === 'W' ? 'W' : 'A'; grade[MH - 1][x] = grade[MH - 1][x] === 'W' || grade[MH - 1][x] === 'R' ? grade[MH - 1][x] : 'A'; }
for (let y = 0; y < MH; y++) { grade[y][0] = 'A'; grade[y][MW - 1] = 'A'; }
const hashT = (x: number, y: number) => { let h = (x * 73856093) ^ (y * 19349663); h = (h ^ (h >>> 13)) >>> 0; return h; };
const ARVORES_FIXAS: [number, number][] = [[2, 2], [12, 3], [14, 7], [2, 12], [12, 10], [29, 3], [30, 8], [39, 2], [39, 10], [2, 17], [12, 18], [20, 22], [26, 23], [29, 22], [38, 23], [2, 25], [11, 29], [19, 29], [28, 29], [37, 30], [45, 2], [43, 10], [46, 11], [44, 20], [46, 24], [43, 28], [45, 30], [27, 25], [18, 13]];
for (const [x, y] of ARVORES_FIXAS) if (grade[y][x] === 'G') grade[y][x] = 'A';
grade[30][22] = 'R'; grade[30][23] = 'R'; grade[31][22] = 'A'; grade[31][23] = 'A';

const ANDA = 'GRPB';
export const VILA: WorldMap = { width: MW, height: MH, tiles: grade.flat().map((c) => (ANDA.includes(c) ? 0 : 1)) };
export const SPAWNS: [number, number][] = [[18, 13], [27, 13], [18, 18], [27, 18], [20, 12], [25, 19], [16, 16], [29, 16]];
export const LUGARES: Record<string, [number, number]> = {
  'a porta da capela': [22, 10], 'o cofre arrombado': [24, 11], 'a padaria': [7, 11], 'a quitanda': [36, 11], 'o bar': [7, 25],
  'as casas': [35, 25], 'a fonte': [21, 14], 'a ponte': [41, 16], 'a cabana': [44, 9], 'o cemitério': [15, 26], 'a praça': [26, 17],
};

// ---------------- painting ----------------
function rgb(g: Phaser.GameObjects.Graphics, c: number, x: number, y: number, w: number, h: number): void { g.fillStyle(c, 1); g.fillRect(x, y, w, h); }

function chao(g: Phaser.GameObjects.Graphics, x: number, y: number, c: string): void {
  const X = x * T, Y = y * T, h = hashT(x, y);
  // objects standing on the plaza keep the paving under them
  if ('FLC'.includes(c)) c = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => grade[y + dy]?.[x + dx] === 'P') ? 'P' : 'G';
  if (c === 'W') {
    rgb(g, 0x2c5f8c, X, Y, T, T);
    if ((h + y) % 3 === 0) rgb(g, 0x4b87ba, X + (h % 18), Y + (h % 24), 10, 2);
    if (h % 5 === 0) rgb(g, 0x3a74a6, X + 4 + (h % 14), Y + 6 + (h % 16), 6, 2);
    if (x === 40) rgb(g, 0x1f4566, X, Y, 4, T);
    if (x === 42) rgb(g, 0x1f4566, X + T - 4, Y, 4, T);
    return;
  }
  // grass everywhere under objects, so trees and lamps sit on a natural ground
  rgb(g, (x + y) % 2 ? 0x4f8a45 : 0x4b8441, X, Y, T, T);
  if (h % 4 === 0) { rgb(g, 0x3e7036, X + (h % 24), Y + 6 + (h % 18), 2, 5); rgb(g, 0x3e7036, X + 3 + (h % 24), Y + 8 + (h % 18), 2, 3); }
  if (h % 13 === 0) { rgb(g, [0xf4e285, 0xf2a1c4, 0xffffff, 0xb6d7ff][h % 4], X + (h % 26), Y + (h % 26), 3, 3); }
  if (c === 'R') {
    rgb(g, 0x6f6455, X, Y, T, T);
    for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) {
      const k = hashT(x * 4 + sx, y * 4 + sy), off = sy % 2 ? 4 : 0;
      rgb(g, [0x958a77, 0x8b806e, 0x9f9481][k % 3], X + sx * 8 + off - (sx === 3 && off ? 4 : 0), Y + sy * 8 + 1, sx === 3 && off ? 4 : 7, 6);
    }
  }
  if (c === 'P') {
    rgb(g, 0xa89d8a, X, Y, T, T);
    rgb(g, 0x938977, X, Y, T, 2); rgb(g, 0x938977, X, Y, 2, T);
    rgb(g, 0x9c927f, X + 16, Y + 2, 2, 30); rgb(g, 0x9c927f, X + 2, Y + 16, 30, 2);
    if ((x + y) % 4 === 0) rgb(g, 0xb8ae9b, X + 6, Y + 6, 6, 6);
  }
  if (c === 'B') {
    rgb(g, 0x8a6448, X, Y, T, T);
    for (let i = 0; i < T; i += 8) rgb(g, 0x6e4f38, X + i, Y, 2, T);
    if (y === 15) { rgb(g, 0x4e3726, X, Y, T, 4); rgb(g, 0x5a3f2c, X + 6, Y - 6, 4, 8); }
    if (y === 16) { rgb(g, 0x4e3726, X, Y + T - 4, T, 4); }
  }
}

function arvore(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  const X = x * T, Y = y * T, h = hashT(x, y), pinheiro = h % 3 === 0;
  g.fillStyle(0x000000, 0.28); g.fillEllipse(X + 16, Y + 28, 26, 9);
  rgb(g, 0x5d4129, X + 13, Y + 16, 6, 13);
  if (pinheiro) {
    for (let i = 0; i < 4; i++) { rgb(g, 0x1f5a35, X + 4 + i * 2, Y + 14 - i * 6, 24 - i * 4, 7); rgb(g, 0x2e7445, X + 6 + i * 2, Y + 14 - i * 6, 10 - i, 3); }
  } else {
    g.fillStyle(0x2a6334, 1); g.fillCircle(X + 16, Y + 6, 15); g.fillCircle(X + 7, Y + 12, 9); g.fillCircle(X + 25, Y + 12, 9);
    g.fillStyle(0x3b8445, 1); g.fillCircle(X + 13, Y + 3, 9); g.fillCircle(X + 23, Y + 7, 6);
    g.fillStyle(0x58a35f, 1); g.fillCircle(X + 11, Y, 4);
    if (h % 5 === 0) { g.fillStyle(0xd94b4b, 1); g.fillCircle(X + 20, Y + 10, 2); g.fillCircle(X + 9, Y + 8, 2); }
  }
}

function lampiao(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  const X = x * T, Y = y * T;
  g.fillStyle(0x000000, 0.3); g.fillEllipse(X + 16, Y + 29, 14, 5);
  rgb(g, 0x2a2a30, X + 14, Y - 6, 4, 34); rgb(g, 0x2a2a30, X + 10, Y + 26, 12, 4);
  rgb(g, 0x2a2a30, X + 9, Y - 14, 14, 3); rgb(g, 0xffe39a, X + 10, Y - 11, 12, 9); rgb(g, 0xfff6d6, X + 13, Y - 10, 5, 6); rgb(g, 0x2a2a30, X + 9, Y - 2, 14, 3);
}

function predio(g: Phaser.GameObjects.Graphics, p: Predio): void {
  const X = p.x * T, Y = p.y * T, W = p.w * T, H = p.h * T, telhado = Math.floor(H * 0.52);
  g.fillStyle(0x000000, 0.3); g.fillRect(X + 6, Y + 10, W, H);
  rgb(g, p.parede, X, Y + telhado, W, H - telhado);
  rgb(g, 0x000000, X, Y + H - 3, W, 3);
  for (let i = 0; i < telhado; i += 4) rgb(g, (i / 4) % 2 ? p.teto : p.tetoE, X - 4 + i / 4, Y + i, W + 8 - i / 2, 4);
  rgb(g, p.tetoE, X - 4, Y + telhado - 4, W + 8, 4);
  rgb(g, 0x000000, X, Y + telhado, W, 3);
  const portaX = p.porta * T, portaY = Y + H - 30;
  if (p.tipo === 'capela') {
    // bell tower, cross, rose window, and the forced double door left ajar
    const cx = X + W / 2;
    rgb(g, 0xe2d6bd, cx - 22, Y - 10, 44, telhado + 6); rgb(g, p.teto, cx - 28, Y - 22, 56, 14); rgb(g, p.tetoE, cx - 24, Y - 28, 48, 8);
    rgb(g, 0xeee4cf, cx - 2, Y - 50, 4, 24); rgb(g, 0xeee4cf, cx - 10, Y - 42, 20, 4);
    rgb(g, 0x3a3226, cx - 9, Y + 2, 18, 18); rgb(g, 0xd9a53a, cx - 6, Y + 6, 12, 12);
    g.fillStyle(0x2b2b40, 1); g.fillCircle(cx, Y + telhado + 22, 15); g.fillStyle(0xb73a54, 1); g.fillCircle(cx, Y + telhado + 22, 12);
    g.fillStyle(0x4a7fd1, 1); g.fillCircle(cx - 5, Y + telhado + 18, 5); g.fillStyle(0xf0c35a, 1); g.fillCircle(cx + 5, Y + telhado + 25, 5); g.fillStyle(0x57a85d, 1); g.fillCircle(cx + 4, Y + telhado + 16, 3);
    rgb(g, 0x2b1d14, portaX - 6, portaY - 6, 52, 36); rgb(g, 0x0c0907, portaX + 2, portaY, 36, 30);
    rgb(g, 0x6e4a2c, portaX - 14, portaY + 2, 14, 28); rgb(g, 0x6e4a2c, portaX + 42, portaY + 4, 12, 26);
    rgb(g, 0x2b1d14, portaX - 6, portaY + 12, 4, 4);
    for (const wx of [X + 18, X + W - 38]) { rgb(g, 0x2b2b40, wx, Y + telhado + 14, 20, 34); rgb(g, 0x6c4fb3, wx + 3, Y + telhado + 17, 14, 28); rgb(g, 0xf0c35a, wx + 3, Y + telhado + 30, 14, 3); }
    return;
  }
  rgb(g, 0x4a3020, portaX + 4, portaY, 24, 30); rgb(g, 0x6b4630, portaX + 7, portaY + 3, 18, 27); rgb(g, 0xf0c35a, portaX + 20, portaY + 15, 3, 3);
  for (let wx = X + 12; wx < X + W - 28; wx += 40) {
    if (Math.abs(wx - portaX) < 36) continue;
    rgb(g, 0x3b2a1e, wx - 2, Y + telhado + 12, 28, 24); rgb(g, 0xffd27a, wx, Y + telhado + 14, 24, 20); rgb(g, 0x3b2a1e, wx + 11, Y + telhado + 14, 2, 20); rgb(g, 0x3b2a1e, wx, Y + telhado + 23, 24, 2);
  }
  if (p.tipo === 'casa' || p.tipo === 'cabana') { rgb(g, 0x6b5a4e, X + W - 30, Y - 6, 12, 22); rgb(g, 0x4e423a, X + W - 32, Y - 8, 16, 4); }
  if (p.nome === 'BAR DO ZÉ') for (let i = 0; i < W; i += 12) { g.fillStyle([0xff5d6c, 0xffd166, 0x6be0a8, 0x7cc4ff][(i / 12) % 4], 1); g.fillCircle(X + 6 + i, Y + telhado + 6, 3); }
  if (p.nome === 'PADARIA') { rgb(g, 0xc9763a, X + 10, Y + H - 22, 30, 4); rgb(g, 0xf5f0e6, X + 10, Y + H - 18, 30, 6); }
  if (p.nome === 'QUITANDA') { for (let i = 0; i < 4; i++) { g.fillStyle([0xe8a33d, 0xd9534f, 0x7bc96f, 0xf2e05a][i], 1); g.fillCircle(X + 14 + i * 9, Y + H - 12, 4); } }
}

function cofre(g: Phaser.GameObjects.Graphics): void {
  const X = COFRE[0] * T, Y = COFRE[1] * T;
  g.fillStyle(0x000000, 0.3); g.fillEllipse(X + 16, Y + 28, 30, 8); rgb(g, 0x8a6a2e, X + 4, Y + 16, 24, 12); rgb(g, 0xffd447, X + 8, Y + 2, 16, 14); rgb(g, 0xffe98a, X + 11, Y + 4, 4, 8); rgb(g, 0xffd447, X + 2, Y + 4, 6, 3); rgb(g, 0xffd447, X + 24, Y + 4, 6, 3);
  if (X >= 0) return;
  g.fillStyle(0x000000, 0.35); g.fillEllipse(X + 16, Y + 28, 30, 8);
  rgb(g, 0x3b3f47, X + 3, Y + 4, 26, 24); rgb(g, 0x22252b, X + 6, Y + 7, 20, 18); rgb(g, 0x555b66, X + 26, Y + 6, 10, 20); rgb(g, 0xb9bec7, X + 31, Y + 14, 3, 4);
  for (const [dx, dy] of [[-8, 26], [-4, 30], [34, 28], [40, 22], [-12, 18], [12, 34], [26, 36], [46, 32]]) { g.fillStyle(0xf0c35a, 1); g.fillCircle(X + dx, Y + dy, 3); g.fillStyle(0xb8892c, 1); g.fillCircle(X + dx + 1, Y + dy + 1, 1); }
  rgb(g, 0xf5f0e6, X + 40, Y + 6, 10, 7); rgb(g, 0x7aa36b, X + 41, Y + 8, 8, 3);
}

function cemiterio(g: Phaser.GameObjects.Graphics): void {
  const { x, y, w, h } = CEMITERIO;
  rgb(g, 0x6aa84f, (x + 1) * T, (y + 1) * T, (w - 2) * T, (h - 2) * T);
  for (let i = x; i < x + w; i++) for (const j of [y, y + h - 1]) { if (grade[j][i] !== 'X') continue; rgb(g, 0x2b2b30, i * T, j * T + 12, T, 3); rgb(g, 0x2b2b30, i * T, j * T + 22, T, 3); for (let k = 2; k < T; k += 8) rgb(g, 0x2b2b30, i * T + k, j * T + 4, 3, 24); }
  for (let j = y; j < y + h; j++) for (const i of [x, x + w - 1]) { rgb(g, 0x2b2b30, i * T + 14, j * T, 3, T); for (let k = 2; k < T; k += 8) rgb(g, 0x2b2b30, i * T + 8, j * T + k, 18, 3); }
  for (const [tx, ty] of TUMULOS) {
    const X = tx * T, Y = ty * T;
    g.fillStyle(0x000000, 0.3); g.fillEllipse(X + 16, Y + 28, 22, 6);
    for (let i = 0; i < 5; i++) { g.fillStyle([0xff6b8a, 0xffd447, 0xffffff, 0xb57bff, 0xff9a3c][(tx + ty + i) % 5], 1); g.fillCircle(X + 6 + i * 5, Y + 14 + (i % 2) * 6, 4); }
  }
}

function fonte(g: Phaser.GameObjects.Graphics): void {
  const X = FONTE.x * T, Y = FONTE.y * T;
  g.fillStyle(0x7d7464, 1); g.fillCircle(X + 32, Y + 34, 34); g.fillStyle(0x9a9080, 1); g.fillCircle(X + 32, Y + 32, 31);
  g.fillStyle(0x3d78ad, 1); g.fillCircle(X + 32, Y + 32, 25); g.fillStyle(0x5b97c9, 1); g.fillCircle(X + 26, Y + 27, 8);
  rgb(g, 0xcfc7b6, X + 27, Y + 10, 10, 24); rgb(g, 0xe0d8c8, X + 22, Y + 6, 20, 6); rgb(g, 0xa8d5f5, X + 30, Y, 4, 8);
}

export function montarVila(scene: Phaser.Scene): void {
  const W = MW * T, H = MH * T;
  const g = scene.add.graphics();
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) chao(g, x, y, grade[y][x]);
  cemiterio(g); fonte(g);
  for (const p of PREDIOS) predio(g, p);
  cofre(g);
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (grade[y][x] === 'A') arvore(g, x, y); if (grade[y][x] === 'L') lampiao(g, x, y); }
  g.generateTexture('vila', W, H); g.destroy();
  scene.add.image(0, 0, 'vila').setOrigin(0, 0).setDepth(0);

  // soft light textures for lamps and lanterns
  for (const [chave, r] of [['luz', 128], ['luzp', 48]] as [string, number][]) {
    if (scene.textures.exists(chave)) continue;
    const tex = scene.textures.createCanvas(chave, r * 2, r * 2)!, c = tex.getContext(), gr = c.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gr; c.fillRect(0, 0, r * 2, r * 2); tex.refresh();
  }
  if (!scene.textures.exists('faisca')) { const f = scene.add.graphics(); f.fillStyle(0xffffff, 1); f.fillRect(0, 0, 3, 3); f.generateTexture('faisca', 3, 3); f.destroy(); }

  const sino = scene.add.image(22.5 * T + 16, 1 * T + 10, 'luzp').setTint(0xffd27a).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5).setDepth(2);
  scene.tweens.add({ targets: sino, alpha: 0.15, duration: 1800, yoyo: true, repeat: -1 });

  // the arena circle in front of the stadium, where pets that meet fight
  const [cx, cy] = [COFRE[0] * T + 16, COFRE[1] * T + 16];
  const ring = scene.add.graphics().setDepth(1);
  ring.lineStyle(4, 0xffd447, 0.9); ring.strokeCircle(cx - 16, cy + 60, 80); ring.lineStyle(2, 0xffffff, 0.6); ring.strokeCircle(cx - 16, cy + 60, 66);
  for (const p of PREDIOS) scene.add.text((p.x + p.w / 2) * T, p.y * T + Math.floor(p.h * T * 0.52) - 6, p.nome, { fontFamily: '"Pixelify Sans", monospace', fontSize: '11px', color: '#f3ecdc', backgroundColor: 'rgba(12,10,16,.75)', padding: { x: 4, y: 1 } }).setOrigin(0.5, 1).setDepth(3);
  scene.add.text(15.5 * T, (CEMITERIO.y + 2) * T + 10, 'JARDIM', { fontFamily: '"Pixelify Sans", monospace', fontSize: '10px', color: '#c9c3d6', backgroundColor: 'rgba(12,10,16,.7)', padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(3);

  // fireflies over the grass, mist over the river and the graveyard
  scene.add.particles(0, 0, 'faisca', { x: { min: 0, max: W }, y: { min: 0, max: H }, lifespan: { min: 2500, max: 5000 }, speedX: { min: -10, max: 10 }, speedY: { min: -14, max: 6 }, alpha: { start: 0.9, end: 0 }, scale: { start: 1, end: 0.3 }, tint: 0xffffff, blendMode: 'ADD', frequency: 300 }).setDepth(3);
  scene.add.particles(0, 0, 'luzp', { x: { min: 40 * T, max: 43 * T }, y: { min: 0, max: H }, lifespan: 6000, speedY: { min: -4, max: 4 }, speedX: { min: -3, max: 3 }, alpha: { start: 0.07, end: 0 }, scale: { start: 0.6, end: 1.6 }, tint: 0xbfd7ff, frequency: 260 }).setDepth(2);

}

// ---------------- heads ----------------
export type Chapeu = 'chapeu' | 'bone' | 'veu' | 'capuz' | 'lenco' | 'quepe' | 'longo' | 'careca' | 'curto' | 'coque' | 'trancas' | 'rabo' | 'franja';
export const CABECAS: Record<Chapeu, string[]> = {
  curto: ['..........', '..........', '..hhhhhh..', '.hhhhhhhh.', '.hsssssss.', '.hsessseh.', '.ssssssss.', '..ssssss..'],
  longo: ['..........', '..........', '..hhhhhh..', '.hhhhhhhh.', 'hhsssssshh', 'hhsessseshh'.slice(0, 10), 'hhsssssshh', 'hh.ssss.hh'],
  careca: ['..........', '..........', '..........', '..ssssss..', '.ssssssss.', '.ssessses.', '.ssssssss.', '..shhhhs..'],
  chapeu: ['..........', '...cccc...', 'cccccccccc', '.hhhhhhhh.', '.hsssssss.', '.hsessseh.', '.ssssssss.', '..ssssss..'],
  bone: ['..........', '..........', '..kkkkkk..', '.kkkkkkkkkk'.slice(0, 10), '.hsssssss.', '.hsessseh.', '.ssssssss.', '..ssssss..'],
  quepe: ['..........', '..qqqqqq..', '.qqqyqqqq.', '.qqqqqqqq.', '.ssssssss.', '.ssessses.', '.ssssssss.', '..ssssss..'],
  veu: ['..........', '..vvvvvv..', '.vvvvvvvv.', 'vvwwwwwwvv', 'vvssssssvv', 'vvsesseevv'.replace('ee', 'se'), 'vvssssssvv', 'vv.ssss.vv'],
  capuz: ['..........', '..pppppp..', '.pppppppp.', 'pppppppppp', 'pp.ssss.pp', 'pp.esse.pp', 'pp.ssss.pp', '.pp....pp.'],
  lenco: ['..........', '..........', '.llllllll.', 'llllllllll', '.hsssssss.', '.hsessseh.', '.ssssssss.', '..ssssss..'],
  coque: ['....hh....', '...hhhh...', '..hhhhhh..', '.hhhhhhhh.', '.hsssssss.', '.hsessseh.', '.ssssssss.', '..ssmmss..'],
  trancas: ['..........', '..........', '..hhhhhh..', '.hhhhhhhh.', 'hhsssssshh', 'hhsesssehh', 'hhssmmsshh', 'h..ssss..h'],
  rabo: ['..........', '..........', '..hhhhhh..', '.hhhhhhhhh', '.hsssssshh', '.hsesssehh', '.sssmmsssh', '..ssssss.h'],
  franja: ['..........', '..........', '..hhhhhh..', '.hhhhhhhh.', 'hhhhhhhhhh', 'hhsesssehh', 'hhssmmsshh', 'hh.ssss.hh'],
};
export type Corpo = 'calca' | 'vestido';
// 12x8 bodies, drawn white and tinted with the outfit color; d = shoes
export const CORPOS: Record<Corpo, [string[], string[]]> = {
  calca: [
    ['..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '..bbbbbbbb..', '...gg..gg...', '...gg..gg...', '...dd..dd...'],
    ['..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '..bbbbbbbb..', '..gg....gg..', '..gg....gg..', '..dd....dd..'],
  ],
  vestido: [
    ['..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '..bbbbbbbb..', '..bbbbbbbb..', '.bbbbbbbbbb.', 'bbbbbbbbbbbb', '...dd..dd...'],
    ['..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '..bbbbbbbb..', '..bbbbbbbb..', '.bbbbbbbbbb.', '.bbbbbbbbbbb', '..dd....dd..'],
  ],
};
// b tinted by the outfit color; g is a darker trouser shade so legs read even when tinted
const COR_CORPO: Record<string, number> = { b: 0xffffff, g: 0x9a9aa6, d: 0x2a2233 };
export function corpos(scene: Phaser.Scene): void {
  for (const tipo of Object.keys(CORPOS) as Corpo[]) CORPOS[tipo].forEach((mapa, q) => {
    const chave = `corpo-${tipo}-${q}`;
    if (scene.textures.exists(chave)) return;
    const g = scene.add.graphics();
    mapa.forEach((linha, y) => { for (let x = 0; x < linha.length; x++) { const c = COR_CORPO[linha[x]]; if (c !== undefined) { g.fillStyle(c, 1); g.fillRect(x * 2, y * 2, 2, 2); } } });
    g.generateTexture(chave, 24, 16); g.destroy();
  });
}
export interface Visual { cab: Chapeu; corpo: Corpo; cabelo: number; pele: number; roupa: number }
export const VISUAIS: Visual[] = [
  { cab: 'longo', corpo: 'vestido', cabelo: 0x2b1a10, pele: 0xc68642, roupa: 0xe06c75 },
  { cab: 'coque', corpo: 'vestido', cabelo: 0x6b3e1f, pele: 0xffdbac, roupa: 0x61afef },
  { cab: 'trancas', corpo: 'vestido', cabelo: 0x1b1b1b, pele: 0x8d5524, roupa: 0xe5c07b },
  { cab: 'rabo', corpo: 'calca', cabelo: 0xa0341f, pele: 0xf1c27d, roupa: 0x98c379 },
  { cab: 'franja', corpo: 'vestido', cabelo: 0xd9b56a, pele: 0xe0ac69, roupa: 0xc678dd },
  { cab: 'lenco', corpo: 'vestido', cabelo: 0x2b1a10, pele: 0x8d5524, roupa: 0x56b6c2 },
  { cab: 'curto', corpo: 'calca', cabelo: 0x2b1a10, pele: 0xc68642, roupa: 0x61afef },
  { cab: 'bone', corpo: 'calca', cabelo: 0x1b1b1b, pele: 0x8d5524, roupa: 0xe5c07b },
  { cab: 'chapeu', corpo: 'calca', cabelo: 0x6b3e1f, pele: 0xffdbac, roupa: 0xd19a66 },
  { cab: 'careca', corpo: 'calca', cabelo: 0x2b1a10, pele: 0xe0ac69, roupa: 0xe06c75 },
  { cab: 'capuz', corpo: 'calca', cabelo: 0x2e2e36, pele: 0xf1c27d, roupa: 0x5c6370 },
  { cab: 'curto', corpo: 'vestido', cabelo: 0xa0341f, pele: 0xf1c27d, roupa: 0xff79c6 },
];
const css = (n: number) => '#' + n.toString(16).padStart(6, '0');
const mistura = (a: number, b: number) => { const r = (((a >> 16) & 255) * ((b >> 16) & 255)) / 255, g = (((a >> 8) & 255) * ((b >> 8) & 255)) / 255, bl = ((a & 255) * (b & 255)) / 255; return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl); };
/** Draws a villager onto a 2D canvas (24x30 px), the same pixels the game uses; for the picker. */
export function desenharVisual(cv: HTMLCanvasElement, v: Visual): void {
  cv.width = 24; cv.height = 30;
  const c = cv.getContext('2d')!;
  c.clearRect(0, 0, 24, 30);
  CORPOS[v.corpo][0].forEach((linha, y) => { for (let x = 0; x < linha.length; x++) { const k = COR_CORPO[linha[x]]; if (k === undefined) continue; c.fillStyle = css(linha[x] === 'd' ? k : mistura(k, v.roupa)); c.fillRect(x * 2, 14 + y * 2, 2, 2); } });
  const cores = coresCabeca(v.cabelo, v.pele);
  CABECAS[v.cab].forEach((linha, y) => { for (let x = 0; x < linha.length; x++) { const k = cores[linha[x]]; if (k === undefined) continue; c.fillStyle = css(k); c.fillRect(2 + x * 2, y * 2, 2, 2); } });
}
function coresCabeca(cabelo: number, pele: number): Record<string, number> {
  return { h: cabelo, s: pele, e: 0x1b1426, m: 0xb5525f, c: 0xc9a25a, k: 0xd9534f, q: 0x22344f, y: 0xf0c35a, v: 0x1f1f26, w: 0xf5f0e6, p: 0x2e2e36, l: 0x8e3bd6 };
}
export function cabeca(scene: Phaser.Scene, chave: string, chapeu: Chapeu, cabelo: number, pele: number): string {
  if (scene.textures.exists(chave)) return chave;
  const cores = coresCabeca(cabelo, pele);
  const g = scene.add.graphics(), u = 2;
  CABECAS[chapeu].forEach((linha, y) => { for (let x = 0; x < linha.length; x++) { const c = cores[linha[x]]; if (c !== undefined) { g.fillStyle(c, 1); g.fillRect(x * u, y * u, u, u); } } });
  g.generateTexture(chave, 10 * u, 8 * u); g.destroy();
  return chave;
}
