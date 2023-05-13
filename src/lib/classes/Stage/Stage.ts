import { testStage } from '$lib/classes/Stage/testStage';
import { uiController } from '$lib/stores/uiControllerStore';
import { units } from '$lib/stores/unitStore';
import { Pathfinder, type path } from '../Pathfinder/Pathfinder';
import type { Unit } from '../Unit/Unit';
import { Tile } from '../Tile/Tile';
import { CAMERA } from '../Camera/Camera';
import type { Entity } from 'aframe';
import { TURN } from '../Turn/Turn';
import { Box3 } from 'three';
const PATHFINDER = new Pathfinder();
type state =
	| 'idle'
	| 'selectingWeapon'
	| 'attack'
	| 'selectingDestination'
	| 'moving'
	| 'selectingDirection'
	| 'defencing'
	| 'equipment'
	| 'exchangingEquipment'
	| 'pickpocketing'
	| 'firstAid';
class Stage {
	id: string | null;
	isTest: boolean;
	state: state | null = null;
	tiles: Array<Tile> = [];
	unitOnFocus: Unit | null;
	paths: Array<path> = [];
	structures: Array<Box3> = [];
	constructor(stageId = null) {
		this.id = stageId;
		this.isTest = stageId == null ? true : false;
		this.unitOnFocus = null;
	}
	init(): void {
		const tiles = document.getElementById('tiles');
		if (this.isTest) {
			this.tiles = testStage(20, 20);
			this.tiles.forEach((tile) => {
				tiles?.appendChild(tile.el);
				//tile.el.setAttribute('position', tile.position);
			});
		}
		const grounds = Array.from(document.querySelectorAll('.ground')) as Array<Entity>;
		this.structures = [];
		grounds.forEach((ground) => {
			const box = new Box3().setFromObject(ground.object3D);
			this.structures.push(box);
		});
		console.log({ structures: this.structures });
	}

	hideAttackableTiles(): void {
		this.tiles.forEach((tile) => {
			tile.changeState('idle');
		});
	}
	resetAllTiles(): void {
		this.tiles.forEach((tile) => {
			tile.changeState('idle');
		});
	}
	changeState(state: state) {
		console.log('changing stage state', { state });
		switch (state) {
			case 'idle':
				uiController.hide('chooseWeaponMenu');
				uiController.show('actionMenu');
				break;
			case 'selectingWeapon':
				uiController.hide('actionMenu');
				this.resetAllTiles();
				uiController.show('chooseWeaponMenu');
				break;
		}
		this.state = state;
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
			const grounds = this.tiles.filter((tile) => tile.type == 'walkable');
			const tile = grounds[Math.round(Math.random() * grounds.length - 1)];
			return [tile];
		}
		return this.tiles.filter((tile) => tile.x == x && tile.z == z);
	}
	findPath(unit: Unit): Array<path> {
		PATHFINDER.init(
			this.tiles.map((tile) => {
				return tile;
			})
		);
		if (!unit.position || !unit.direction || unit.currentTaskPoint < 2) return [];
		this.paths = PATHFINDER.findPath(unit.position, unit.direction, unit.movement, 0, []);
		//add a path where you don't make any move
		if (unit.tile) {
			this.paths.push({
				tileId: unit.tile?.id,
				steps: [],
				position: unit.position,
				consumedPoints: 0
			});
		}
		this.paths.forEach((path) => {
			const tile = this.tiles.find((tile) => tile.id == path.tileId);
			tile?.changeState('destination');
		});
		return this.paths;
	}

	async moveUnit(tileId: number): Promise<void> {
		this.resetAllTiles();
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
