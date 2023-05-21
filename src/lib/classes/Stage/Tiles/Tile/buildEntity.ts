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
		shadow: 'cast: true; receive: true;',
		width: 1,
		height: 1,
		rotation: '-90 0 0',
		color: `${tile.material.color}`
	});
	if (tile.material.slug == 'waterSurface') {
		entity.classList.add('unclickable');
		plane.classList.add('unclickable');
		plane.setAttribute('shadow', 'receive:true;cast:false');
		plane.setAttribute('opacity', '0.5');
		plane.setAttribute('material', 'shader: flat; src: #water;');
	}
	entity.appendChild(plane);
	if (tile.material.slug != 'waterSurface') {
		const box = createAframeEntity('a-box', {
			shadow: 'cast: true; receive: true;',
			width: 1,
			height: tile.y + 5,
			depth: 1,
			color: `${tile.material.color}`,
			position: `0 ${(tile.y / 2 + 2.5) * -1 - 0.01} 0`
		});
		box.classList.add('ground');
		entity.appendChild(box);
	}
	return entity;
};
