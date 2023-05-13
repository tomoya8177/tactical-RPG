import { createAframeEntity } from '$lib/createAframeEntity';
import type { Unit } from './Unit';
import { lifeBar } from './lifeBar';

export const buildEntity = (unit: Unit) => {
	const entity = createAframeEntity('a-entity', {
		'unit-component': '',
		position: unit.position
	});
	entity.id = unit.id.toString();
	const model = createAframeEntity('a-gltf-model', {
		src: 'assets/medieval_soldier.glb',
		scale: '0.5 0.5 0.5',
		color: '#ff0000',
		material: `color:#ff0000;
    shader:flat;`
	});
	entity.appendChild(model);
	unit.lifeBars = {
		main: null,
		life: null,
		grey: null
	};
	[unit.lifeBars.main, unit.lifeBars.life, unit.lifeBars.grey] = lifeBar();
	entity.appendChild(unit.lifeBars.main);
	return entity;
};
