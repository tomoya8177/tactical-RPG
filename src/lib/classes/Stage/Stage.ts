import { testStage } from '$lib/classes/Stage/testStage';
import { uiController } from '$lib/stores/uiControllerStore';
import { Pathfinder, type path } from '../Pathfinder/Pathfinder';
import type { Unit } from './Units/Unit/Unit';
import { Tile } from './Tiles/Tile/Tile';
import { CAMERA } from '../Camera/Camera';
import type { Entity } from 'aframe';
import { TURN } from '../Turn/Turn';
import { Box3 } from 'three';
import { Tiles } from './Tiles/Tiles';
import { Units } from './Units/Units';
import { Ambushes } from './Ambushes/Ambushes';
const PATHFINDER = new Pathfinder();
type state =
	| 'idle'
	| 'selectingWeapon'
	| 'attack'
	| 'selectingWeaponForAmbush'
	| 'ambush'
	| 'selectingDestination'
	| 'moving'
	| 'selectingDirection'
	| 'defencing'
	| 'equipment'
	| 'equipmentSelected'
	| 'exchangingEquipment'
	| 'pickpocketing'
	| 'firstAid';
class Stage {
	id: string | null;
	isTest: boolean;
	state: state | null = null;
	tiles: Tiles = new Tiles();
	units: Units = new Units();
	ambushes: Ambushes = new Ambushes();
	unitOnFocus: Unit | null;
	paths: Array<path> = [];
	structures: Array<Box3> = [];
	constructor(stageId = null) {
		this.id = stageId;
		this.isTest = stageId == null ? true : false;
		this.unitOnFocus = null;
	}
	init(): void {
		const tilesEl = document.getElementById('tilesContainer');
		console.log('stage init');
		if (this.isTest) {
			this.tiles.init(testStage(20, 20));
			this.tiles.forEach((tile) => {
				tilesEl?.appendChild(tile.el);
				//tile.el.setAttribute('position', tile.position);
			});
		}
		setTimeout(() => {
			const grounds = Array.from(document.querySelectorAll('.ground')) as Array<Entity>;
			this.structures = [];
			grounds.forEach((ground) => {
				const box = new Box3().setFromObject(ground.object3D);
				this.structures.push(box);
			});
			console.log({ structures: this.structures });
		}, 100);
	}

	changeState(state: state) {
		console.log('changing stage state', { state });
		switch (state) {
			case 'idle':
				uiController.hide('equipmentMenu');
				uiController.hide('chooseWeaponMenu');
				uiController.show('actionMenu');
				uiController.hide('ambushConfirmationMenu');
				this.tiles.reset();
				break;
			case 'selectingWeapon':
			case 'selectingWeaponForAmbush':
				uiController.hide('ambushConfirmationMenu');
				uiController.hide('actionMenu');
				this.tiles.reset();
				uiController.show('chooseWeaponMenu');
				break;
			case 'ambush':
				uiController.show('ambushConfirmationMenu');
		}
		this.state = state;
	}
	async focusOnUnit(unit: Unit): Promise<void> {
		this.unitOnFocus = unit;
		await CAMERA.move(unit.position);
		uiController.show('actorData');
		//uiController.update({ actionMenu: true });
		console.log(' fidingPath ');
		this.findPath(unit);
		console.log(' found Path ');
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
			const inAmbushRader = STAGE.ambushes.ifTileInSomeRader(tile).length > 0;
			if (inAmbushRader) {
				tile.changeState('destinationInDanger');
			} else {
				tile.changeState('destination');
			}
		});
		return this.paths;
	}

	async moveUnit(tileId: number): Promise<void> {
		this.tiles.reset();
		const path = this.paths.find((path) => path.tileId == tileId);
		const UNIT = STAGE.units.find((unit) => unit.id == TURN.unit?.id);
		if (!UNIT) return;
		uiController.hide('actorData');
		uiController.hide('actionMenu');
		await UNIT.moveToTile(path);
		CAMERA.move(UNIT?.position || null);
	}
}
const STAGE = new Stage();
export { STAGE };
