// Pixel pets drawn in code, same 2px style as the villagers. One species per type,
// recolored per pet; two frames for a bounce animation.
import * as Phaser from 'phaser';
import type { Tipo } from './regras';

// o outline, b body, c belly, e eye, w eye shine, x accent (fin/flame/leaf/spark)
const FORMAS: Record<Tipo, string[]> = {
  agua: [ // frog
    '...oo....oo...', '..owwo..owwo..', '..oeeo..oeeo..', '.obbbbbbbbbbo.', 'obbbbbbbbbbbbo', 'obbccccccccbbo', 'obcccmmmmcccbo', '.obccccccccbo.', '..obbo..obbo..', '..oxxo..oxxo..',
  ],
  fogo: [ // salamander with flame tail
    '..oooo........', '.obbbbo....xx.', 'obewbbbo..xxx.', 'obeebbbbooxx..', 'obbbbbbbbbbo..', '.occccccbbbo...', '..obbbbbbbo....', '..ob.o.ob.o....', '..oo..oo.......', '..............',
  ],
  planta: [ // sprout creature
    '.....xx.......', '....xxxx.xx...', '.....xx.xxx...', '....oooooo....', '...obbbbbbo...', '..obewbbewbo..', '..obeebbeebo..', '..obbccccbbo...', '...obbbbbbo...', '...oo....oo...',
  ],
  raio: [ // electric mouse
    'oo........oo..', 'obo......obo..', '.obooooooobo..', '.obbbbbbbbbo..', 'obewbbbbewbbo.', 'obeebxxbeebbo.', '.obbbbbbbbbo.x', '..obccccbbo.xx', '..obbbbbbo..x.', '..oo....oo....',
  ],
  sombra: [ // little ghost
    '....oooooo....', '...obbbbbbo...', '..obbbbbbbbo..', '..obewbbewbo..', '..obeebbeebo..', '..obbbbbbbbo..', '..obbbmmbbbo..', '..obbbbbbbbo..', '..obobbobbobo..', '..o.o..o..o...',
  ],
  luz: [ // star sprite
    '......oo......', '.....obbo.....', 'oooooobbooooo.', '.obbbbbbbbbbo.', '..obewbbewbo..', '..obeebbeebo..', '.obbbbccbbbbo.', 'obbbo....obbbo', 'oo..........oo', '..............',
  ],
};
export const COR_TIPO: Record<Tipo, number> = { fogo: 0xff7a3d, agua: 0x4fb3ff, planta: 0x6fd35c, raio: 0xffd23f, sombra: 0x9a7bff, luz: 0xfff0a8 };
const ACENTO: Record<Tipo, number> = { fogo: 0xffd23f, agua: 0xff8fb1, planta: 0x2f9e44, raio: 0xff8a00, sombra: 0x5b3fbf, luz: 0xffb800 };
const escurece = (c: number, f: number) => (Math.round(((c >> 16) & 255) * f) << 16) | (Math.round(((c >> 8) & 255) * f) << 8) | Math.round((c & 255) * f);

export function textura(scene: Phaser.Scene, tipo: Tipo, cor: number): string[] {
  const chaves = [0, 1].map((q) => `pet-${tipo}-${cor.toString(16)}-${q}`);
  chaves.forEach((chave, q) => {
    if (scene.textures.exists(chave)) return;
    const pal: Record<string, number> = { o: 0x1d1a2b, b: cor, c: escurece(cor, 1.25) > 0xffffff ? 0xffffff : 0xfff6df, e: 0x1d1a2b, w: 0xffffff, x: ACENTO[tipo], m: 0xc0394b };
    const g = scene.add.graphics(), u = 2, linhas = FORMAS[tipo];
    // frame 1 squashes one row for a hop
    linhas.forEach((linha, y) => { const yy = q && y > 6 ? y - 0.5 : y; for (let x = 0; x < linha.length; x++) { const c = pal[linha[x]]; if (c === undefined) continue; g.fillStyle(c, 1); g.fillRect(x * u, yy * u, u, u); } });
    g.generateTexture(chave, 14 * u, 10 * u); g.destroy();
  });
  return chaves;
}
