import { STAGE } from '../Stage/Stage';
import type { Tile } from '../Stage/Tiles/Tile/Tile';
import type { Unit } from '../Stage/Units/Unit/Unit';

export const findUnitOnTile = (tileId: number, tiles: Tile[]): Unit | undefined => {
	return STAGE.units.find((unit) => {
		return unit.tile.id == tileId;
	});
};
