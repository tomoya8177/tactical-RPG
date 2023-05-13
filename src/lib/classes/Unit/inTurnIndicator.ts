import { createAframeEntity } from '$lib/createAframeEntity';
import type { Entity } from 'aframe';

export const inTurnIndicator = (): Entity => {
	const triangle = createAframeEntity('a-triangle', {
		color: 'gold',
		shader: 'flat',
		position: '0 0 0',
		rotation: '0 0 -180',
		scale: '0.3 0.15 0.3'
	});
	const text = createAframeEntity('a-text', {
		value: 'In Turn',
		align: 'center',
		position: '0 0.3 0',
		color: 'gold'
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
