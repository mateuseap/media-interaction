export const SHAPES = ['box', 'sphere', 'cylinder', 'cone'] as const;
export const MATERIALS = ['wood', 'metal', 'rubber', 'glass', 'stone', 'neon'] as const;
export type Shape = typeof SHAPES[number];
export type Material = typeof MATERIALS[number];
export type Part = { shape: Shape; size: [number, number, number]; position: [number, number, number]; rotation: [number, number, number]; color: string; material: Material };
export type ObjectRecipe = { name: string; description: string; parts: Part[] };

const colors=['#ff6b6b','#4ecdc4','#ffe66d','#7f8cff','#c77dff','#f4a261','#95d5b2'];
const hash=(s:string)=>[...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const clean=(s:unknown,n=60)=>String(s??'').replace(/[<>]/g,'').trim().slice(0,n);
function part(shape:Shape,size:[number,number,number],position:[number,number,number],color:string,material:Material='metal'):Part{return{shape,size,position,rotation:[0,0,0],color,material}}
export function procedural(prompt:string):ObjectRecipe{
 const p=clean(prompt,100)||'coisa misteriosa',l=p.toLowerCase(),h=hash(l),c=colors[h%colors.length],parts:Part[]=[];
 if(/carro|moto|ve[ií]culo/.test(l)){parts.push(part('box',[2.4,.55,1.2],[0,.65,0],c,'metal'));for(const x of [-.8,.8])for(const z of [-.65,.65])parts.push(part('cylinder',[.32,.18,.32],[x,.35,z],'#222831','rubber'))}
 else if(/cadeira|trono/.test(l)){parts.push(part('box',[1,.18,1],[0,.55,0],c,'wood'),part('box',[1,1.4,.18],[0,1.25,.42],c,'wood'));for(const x of [-.4,.4])for(const z of [-.38,.38])parts.push(part('cylinder',[.07,.65,.07],[x,.25,z],c,'wood'))}
 else if(/espada|faca|lan[cç]a/.test(l)){parts.push(part('box',[.13,2,.05],[0,1.3,0],'#dce6ee','metal'),part('box',[.65,.12,.15],[0,.32,0],c,'metal'),part('cylinder',[.1,.65,.1],[0,0,0],'#3a2b28','wood'))}
 else if(/rob[oô]|boneco|pessoa/.test(l)){parts.push(part('box',[.8,1.1,.45],[0,1.3,0],c),part('sphere',[.48,.48,.48],[0,2.1,0],c));for(const x of [-.55,.55])parts.push(part('cylinder',[.12,1,.12],[x,1.25,0],c));for(const x of [-.25,.25])parts.push(part('cylinder',[.14,1,.14],[x,.25,0],c))}
 else if(/casa|castelo/.test(l)){parts.push(part('box',[2.4,1.5,2],[0,.9,0],c,'stone'),part('cone',[1.8,1.5,1.8],[0,2.4,0],'#a44a3f','stone'))}
 else {const n=3+h%4;for(let i=0;i<n;i++){const sh=SHAPES[(h>>i*2)%SHAPES.length],s=.35+((h>>i*3)%70)/100;parts.push(part(sh,[s,s*(.7+((h>>i)%7)/10),s],[(i-(n-1)/2)*.55,.5+i*.35,((h>>i*4)%5-2)*.15],colors[(h+i)%colors.length],MATERIALS[(h+i)%MATERIALS.length]))}}
 return{name:p,description:`${p}, montado com ${parts.length} peças físicas.`,parts};
}
export function sanitizeRecipe(raw:unknown,fallback:ObjectRecipe):ObjectRecipe{
 if(!raw||typeof raw!=='object')return fallback;const o=raw as any,out:Part[]=[];
 if(Array.isArray(o.parts))for(const x of o.parts.slice(0,12)){if(!x||!SHAPES.includes(x.shape)||!Array.isArray(x.size)||!Array.isArray(x.position))continue;const nums=(a:any[],def:number[])=>def.map((d,i)=>clamp(Number(a[i])||d,.05,4)) as [number,number,number];out.push({shape:x.shape,size:nums(x.size,[.5,.5,.5]),position:nums(x.position,[0,.5,0]).map((v,i)=>i===1?clamp(v,.05,5):clamp(v,-3,3)) as [number,number,number],rotation:nums(Array.isArray(x.rotation)?x.rotation:[0,0,0],[.001,.001,.001]).map(v=>clamp(v,-3.14,3.14)) as [number,number,number],color:/^#[0-9a-f]{6}$/i.test(x.color)?x.color:'#4ecdc4',material:MATERIALS.includes(x.material)?x.material:'metal'})}
 return{name:clean(o.name,40)||fallback.name,description:clean(o.description,120)||fallback.description,parts:out.length?out:fallback.parts};
}
