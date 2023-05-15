import { createAframeEntity } from '$lib/createAframeEntity';
import { systemConfig } from '$lib/systemConfig';
import type { Entity } from 'aframe';

export const inTurnIndicator = (): Entity => {
	const triangle = createAframeEntity('a-triangle', {
		color: 'gold',
		shader: 'flat',
		position: '0 0 0',
		rotation: '0 0 -180',
		scale: '0.2 0.1 0'
	});
	const text = createAframeEntity('a-text', {
		value: 'In Turn',
		font: systemConfig.popUpFont,
		shader: 'flat',
		geometry: `primitive:plane;width: 0.8;
		height: 0.16;`,
		width: 3,
		material: 'color:gold; side:double;shader:flat;',
		align: 'center',
		position: '0 0.1 0',
		color: 'black'
	});
	const entity = createAframeEntity('a-entity', {
		position: '0 2 0',
		'look-at-camera': ''
	});
	entity.appendChild(text);
	entity.appendChild(triangle);
	entity.classList.add('in-turn-indicator');
	return entity;
};
