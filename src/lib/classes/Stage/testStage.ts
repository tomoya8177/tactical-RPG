import { Tile } from '../Tile/Tile';
export const testStage = (x: number, z: number, y: number | null = null): Tile[] => {
	const checkYIsTooDifferent = (y) => {
		const prevTile = stageTiles.find((tile) => tile.id == count - 1);
		const prevRowTile = stageTiles.find((tile) => tile.id == count - x - 1);
		if (!prevRowTile || !prevTile) {
			//nothingaa
		} else if (Math.abs(y - prevTile.position.y) > 0.5) {
			y = giveModerateY(y, prevTile.position.y);
		} else if (Math.abs(y - prevRowTile.position.y) > 0.5) {
			y = giveModerateY(y, prevRowTile.position.y);
		}
		return y;
	};
	const stageTiles: Tile[] = [];
	let count = 10000;
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < z; j++) {
			const position = {
				x: i,
				z: j,
				y: Math.round(Math.random() * 15) * 0.25 - 1.4
			};
			if (i > 0 && j > 0) {
				position.y = checkYIsTooDifferent(position.y);
			}
			const tile = new Tile({
				id: count,
				position,
				isGround: true,
				type: position.y > 0 ? 'walkable' : 'unwalkable',
				material: 'dirt'
			});
			stageTiles.push(tile);
			count++;
		}
	}

	return stageTiles;
};
const giveModerateY = (y: number, theTileY: number) => {
	if (y > theTileY) {
		y = theTileY + 0.25;
	} else {
		y = theTileY - 0.25;
	}
	return y;
};
