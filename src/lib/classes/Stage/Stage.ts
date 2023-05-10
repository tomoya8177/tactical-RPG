import { testStage } from '$lib/classes/Stage/testStage';
import { uiController } from '$lib/stores/uiControllerStore';
import { units } from '$lib/stores/unitStore';
import { Pathfinder } from '../Pathfinder/Pathfinder';
import type { Unit } from '../Unit/Unit';
import type { Tile } from '../Tile/Tile';
import { CAMERA } from '../Camera/Camera';
import type { path } from '$lib/types/path';
import type { Entity } from 'aframe';
import { TURN } from '../Turn/Turn';
const PATHFINDER = new Pathfinder();
class Stage {
	id: string | null;
	isTest: boolean;
	tiles: Array<Tile>;
	unitOnFocus: Unit | null;
	paths: Array<any>;
	constructor(stageId = null) {
		this.id = stageId;
		this.isTest = stageId == null ? true : false;
		this.tiles = stageId == null ? testStage(20, 10) : [];
		this.unitOnFocus = null;
		this.paths = [];
	}

	clearTileHighlights(): void {
		units.getAll().forEach((unit) => {
			if (unit.state != 'directing') {
				unit.unhighlightAttackTarget();
			}
		});
		this.hideHighlightedTiles();
		this.hideAttackableTiles();
	}
	hideAttackableTiles(): void {
		this.tiles.forEach((tile) => {
			tile.hideAttackTarget();
		});
	}
	hideHighlightedTiles(): void {
		this.tiles.forEach((tile) => {
			tile.hideHighlighted();
		});
	}
	async highlightUnit(): Promise<boolean> {
		const unit = this.unitOnFocus;
		if (!unit) return Promise.resolve(false);
		await CAMERA.move(unit.position);
		uiController.show('actorData');
		//uiController.update({ actionMenu: true });

		this.findPath(unit);
		return Promise.resolve(true);
	}
	async focusOnUnit(unit: Unit): Promise<boolean> {
		this.unitOnFocus = unit;
		await this.highlightUnit();
		return Promise.resolve(true);
	}

	findTiles(x: number | null = null, z: number | null = null): Array<Tile> {
		if (x == null && z == null) {
			const tile = this.tiles[Math.round(Math.random() * this.tiles.length - 1)];
			return [tile];
		}
		return this.tiles.filter((tile) => tile.position.x == x && tile.position.z == z);
	}
	findPath(unit: Unit): Array<path> {
		PATHFINDER.init(
			this.tiles.map((tile) => {
				tile.occupiedBy = null;
				if (units.getAll().find((unit) => unit.position == tile.position)) {
					tile.occupiedBy = unit;
				}
				return tile;
			})
		);
		if (!unit.position || !unit.direction || unit.currentTaskPoint < 2) return [];
		this.paths = PATHFINDER.findPath(unit.position, unit.direction, unit.movement, 0, []);
		this.paths.forEach((path) => {
			const tile = this.tiles.find((tile) => tile.id == path.tileId);
			tile?.highlight();
		});
		return this.paths;
	}

	async moveUnit(tileId: number): Promise<void> {
		this.hideHighlightedTiles();
		const path = this.paths.find((path) => path.tileId == tileId);
		const UNIT = units.getAll().find((unit) => unit.id == TURN.unit?.id);
		if (!UNIT) return;
		uiController.hide('actorData');
		uiController.hide('actionMenu');
		await UNIT.moveToTile(path);
		CAMERA.move(UNIT?.position || null);
	}
}
const STAGE = new Stage();
export { STAGE };
