import { Box3, Vector3 } from 'three';
import type { Equipment } from '../Equipment/Equipment';
import type { Tile } from '../Tile/Tile';
import type { Unit } from '../Unit/Unit';
import type { Entity } from 'aframe';

export const findTargetTiles = (unit: Unit, weapon: Equipment, tiles: Tile[]): Array<Tile> => {
	if (!unit.position) return [];
	const attackOrigin = new Vector3(unit.position.x, 0, unit.position.z);
	switch (weapon.rangeType) {
		case 'direct':
			return tiles.filter((tile) => tile.ifTileInDirectRange(attackOrigin, weapon.length));
		case 'ranged': {
			return tiles.filter((tile) =>
				tile.ifTileInRange(attackOrigin, tile, weapon, tile.position.y - unit.position.y)
			);
		}
	}
};
