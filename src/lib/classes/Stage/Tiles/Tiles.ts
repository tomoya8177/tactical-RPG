import type { Tile } from '$lib/classes/Stage/Tiles/Tile/Tile';

export class Tiles extends Array {
	init(tiles: Tile[]) {
		tiles.forEach((tile) => {
			this.push(tile);
		});
	}
	reset() {
		this.forEach((tile) => {
			tile.changeState('idle');
		});
	}
	getRandomWalkableTile(): Tile {
		const grounds = this.filter((tile) => tile.type == 'walkable');
		const tile = grounds[Math.round(Math.random() * grounds.length - 1)];
		return tile;
	}
	findByXZ(x: number, z: number): Tile[] {
		return this.filter((tile) => tile.x == x && tile.z == z);
	}
}
