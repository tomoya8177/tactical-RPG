import type { Entity } from 'aframe';
import type { Tile } from './Tile';
import { createAframeEntity } from '$lib/createAframeEntity';

export const buildEntity = (tile: Tile): Entity => {
	const entity = createAframeEntity('a-entity', {
		'stage-tile-component': '',
		position: `${tile.x} ${tile.y} ${tile.z}`
	});
	entity.id = tile.id.toString();
	const plane = createAframeEntity('a-plane', {
		width: 1,
		height: 1,
		rotation: '-90 0 0'
	});
	entity.appendChild(plane);
	const box = createAframeEntity('a-box', {
		material: 'wireframe:true',
		width: 1,
		height: tile.y + 5,
		depth: 1,
		position: `0 ${(tile.y / 2 + 2.5) * -1} 0`
	});
	box.classList.add('ground');
	entity.appendChild(box);
	return entity;
};
