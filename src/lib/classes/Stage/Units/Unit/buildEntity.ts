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
		shadow: 'cast: true; receive: true;',
		src: 'assets/medieval_soldier.glb',
		position: ' 0 -0.1 0',
		scale: '0.5 0.5 0.5',
		color: '#ff0000',
		material: `color:#ff0000;
    shader:flat;`
	});
	entity.appendChild(model);

	return entity;
};
