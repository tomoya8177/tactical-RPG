import type { direction } from '$lib/types/direction';
import type { xyz } from '$lib/types/xyz';
import type { Tile } from '../Tile/Tile';

export const findNextTile = (tiles: Array<Tile>, direction: direction, position: xyz) => {
	let nextTile = tiles.find((tile) => {
		switch (direction) {
			case 'S':
				if (tile.position.x == position.x && tile.position.z == position.z + 1) {
					return true;
				}
				break;
			case 'N':
				if (tile.position.x == position.x && tile.position.z == position.z - 1) {
					return true;
				}
				break;
			case 'W':
				if (tile.position.x == position.x - 1 && tile.position.z == position.z) {
					return true;
				}
				break;
			case 'E':
				if (tile.position.x == position.x + 1 && tile.position.z == position.z) {
					return true;
				}
				break;
		}
		return false;
	});
	if (!nextTile) {
		return false;
	}
	return nextTile;
};
