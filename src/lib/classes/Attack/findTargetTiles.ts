import { Box3, Vector3 } from 'three';
import type { Equipment } from '../Equipment/Equipment';
import type { Tile } from '../Stage/Tiles/Tile/Tile';
import type { Unit } from '../Stage/Units/Unit/Unit';
import type { Entity } from 'aframe';
import { radians2degrees } from '$lib/Maths/radian2degrees';

export const findTargetTiles = (unit: Unit, weapon: Equipment, tiles: Tile[]): Array<Tile> => {
	const tileInSight = (tile: Tile): boolean => {
		const tileVector = new Vector3(tile.position.x, 0, tile.position.z).sub(unit.vector3);

		const angle = radians2degrees(unit.directionVector.angleTo(tileVector));
		if (angle >= 135) {
			return false;
		} else {
			return true;
		}
	};

	if (!unit.position) return [];
	let tilesInRange;
	switch (weapon.rangeType) {
		case 'direct':
			tilesInRange = tiles.filter((tile) => tile.ifInDirectRange(unit.vector3, weapon.length));
			break;
		case 'ranged': {
			tilesInRange = tiles.filter((tile) =>
				tile.ifInRange(unit.vector3, weapon, tile.position.y - unit.position.y)
			);
			break;
		}
	}
	tilesInRange = tilesInRange.filter((tile) => {
		return tileInSight(tile);
	});
	return tilesInRange;
};
