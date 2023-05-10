import type { Tile } from '../Tile/Tile';

export const checkIfUnitCanMoveToTile = (nextTile: Tile) => {
	if (!nextTile) {
		return false;
	}
	if (nextTile.occupiedBy !== null) return false;
	if (nextTile.type != 'walkable') return false;
	return true;
};
