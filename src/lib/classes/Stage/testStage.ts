import { createAframeEntity } from '$lib/createAframeEntity';
import { tileMaterials } from '$lib/presets/tileMaterial';
import { Tile } from './Tiles/Tile/Tile';
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
				y: Math.round(Math.random() * 15) * 0.25 - 1.5
			};

			if (i > 0 && j > 0) {
				position.y = checkYIsTooDifferent(position.y);
			}
			let material;
			if (position.y < -1) {
				const underwaterTiles = tileMaterials.filter(
					(material) => material.isUnderwater && material.slug != 'water'
				);
				material = underwaterTiles[Math.round(Math.random() * (underwaterTiles.length - 1))];
			} else if (position.y < -0.5) {
				material = tileMaterials.find((material) => material.slug == 'underwaterSandDeep');
			} else if (position.y < 0) {
				material = tileMaterials.find((material) => material.slug == 'underwaterSandShallow');
			} else {
				let walkableTiles = tileMaterials.filter(
					(material) => material.walkable && !material.isUnderwater
				);
				material = walkableTiles[Math.round(Math.random() * (walkableTiles.length - 1))];
			}
			const tile = new Tile({
				id: count,
				position,
				isGround: true,
				type: material.walkable && position.y > -1 ? 'walkable' : 'unwalkable',
				material
			});
			stageTiles.push(tile);
			count++;
		}
	}
	stageTiles.forEach((tile) => {
		if (tile.y < 0) {
			const waterSurface = new Tile({
				id: count,
				position: { x: tile.x, z: tile.z, y: 0 },
				isGround: false,
				type: 'unwalkable',
				material: tileMaterials.find((material) => material.slug == 'waterSurface')
			});
			stageTiles.push(waterSurface);
		}
		count++;
	});

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
