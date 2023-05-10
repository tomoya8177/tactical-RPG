import { units } from '$lib/stores/unitStore';
import { STAGE } from '../Stage/Stage';
import type { Tile } from '../Tile/Tile';
import type { Unit } from '../Unit/Unit';

export const findUnitOnTile = (tileId: number, tiles: Tile[]): Unit | undefined => {
	return units.getAll().find((unit) => {
		return unit.position == tiles.find((tile) => tile.id == tileId)?.position;
	});
};
