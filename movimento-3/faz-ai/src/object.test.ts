import {strict as assert} from 'node:assert';import {procedural,sanitizeRecipe} from './object';
const car=procedural('carro voador vermelho');assert.equal(car.parts.length,5);assert.equal(car.parts.filter(p=>p.shape==='cylinder').length,4);
const sword=procedural('espada de gelo');assert.ok(sword.parts.length>=3);
assert.ok(!procedural('<b>oi').name.includes('<'));
const safe=sanitizeRecipe({name:'<b>x',parts:[{shape:'hack'},{shape:'box',size:[99,-1,1],position:[99,99,99],color:'red',material:'uranio'}]},car);assert.equal(safe.name,'bx');assert.equal(safe.parts.length,1);assert.deepEqual(safe.parts[0].size,[4,.05,1]);assert.equal(safe.parts[0].color,'#4ecdc4');
console.log('object rules ok');
