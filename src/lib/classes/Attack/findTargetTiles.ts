import { Box3, Vector3 } from 'three';
import type { Equipment } from '../Equipment/Equipment';
import type { Tile } from '../Stage/Tiles/Tile/Tile';
import type { Unit } from '../Stage/Units/Unit/Unit';
import type { Entity } from 'aframe';
import { radians2degrees } from '$lib/Maths/radian2degrees';
import { tileInFront } from './tileInFront';
import { attackTarget } from './attackTarget';

export const findTargetTiles = (unit: Unit, weapon: Equipment, tiles: Tile[]): Array<Tile> => {
	if (!unit.position) return [];
	let tilesInRange;
	switch (weapon.rangeType) {
		case 'direct':
			tilesInRange = tiles.filter((tile) => tile.ifInDirectRange(unit, weapon.length));
			break;
		case 'ranged': {
			tilesInRange = tiles.filter((tile) => tile.ifInRange(unit, weapon));
			break;
		}
	}
	tilesInRange = tilesInRange.filter((tile) => {
		return tileInFront(unit, tile) && tile.type == 'walkable';
	});
	tilesInRange = tilesInRange.filter((tile) => {
		return tile.id != unit.tile.id;
	});
	return tilesInRange;
};
