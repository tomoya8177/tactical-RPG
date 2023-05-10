import type { Unit } from '../Unit/Unit';
import type { Equipment } from '../Equipment/Equipment';
import type { attackResult } from '$lib/types/attackResult';
import { uiController } from '$lib/stores/uiControllerStore';
import { findTargetTiles } from './findTargetTiles';
import { findUnitOnTile } from './findUnitOnTile';
import { TURN } from '../Turn/Turn';
import { STAGE } from '../Stage/Stage';
import { attackTarget } from './attackTarget';
import { units } from '$lib/stores/unitStore';
import type { Tile } from '../Tile/Tile';
import { Simulation } from './Simulation/Simulation';
export const ticksPerSecond = 60;

type state =
	| 'idle'
	| 'selectingWeapon'
	| 'selectingTarget'
	| 'simulating'
	| 'executing'
	| 'finished';

class Attack {
	state: state = 'idle';
	attacker: Unit | null = null;
	attackerTile: Tile | null;
	weapon: Equipment | null = null;
	foe: Unit | null = null;
	simulation: Simulation | null = null;
	simulationResult: attackResult | null = null;
	result: attackResult | null = null;
	constructor() {
		this.state = 'idle';
		this.attacker = null;
		this.attackerTile = null;
		this.weapon = null;
		this.foe = null;
		this.simulationResult = null;
		this.result = null;
	}
	init(attacker: Unit | null = null, tile: Tile | null = null): void {
		if (!attacker) attacker = TURN.unit;
		if (!tile) tile = STAGE.findTiles(attacker?.position.x, attacker?.position.z)[0];
		this.attacker = attacker;
		this.attackerTile = tile;
		this.changeState('selectingWeapon');
	}

	changeState(state: state): void {
		switch (state) {
			case 'idle':
				break;
			case 'selectingWeapon':
				uiController.hide('actionMenu');
				uiController.show('chooseWeaponMenu');
				break;
			case 'selectingTarget':
				if (!this.attacker || !this.weapon) return;
				uiController.hide('attackSimulation');
				this.simulation?.removeCurves();
				const attackTargetTiles = findTargetTiles(this.attacker, this.weapon, STAGE.tiles);
				attackTargetTiles.forEach((tile) => {
					if (tile.id == '' || !TURN.unit) return;
					const targetUnit = findUnitOnTile(tile.id, STAGE.tiles);
					if (targetUnit && targetUnit.id != TURN.unit.id) {
						targetUnit.highlightAttackTarget();
					}
					tile.highlightAttackTarget();
				});
				break;
			case 'simulating':
				if (!this.attacker || !this.foe || !this.attackerTile || !this.weapon) return;
				this.simulation = new Simulation(this.attacker, this.foe, this.weapon);
				uiController.hide('actorData');
				console.log(this);
				const simulationResult = this.simulation.simulate();
				uiController.show('attackSimulation');

				break;
			case 'executing':
				this.simulation?.destroy();

				uiController.hide('attackSimulation');

				break;
			case 'finished':
				this.attacker = null;
				this.weapon = null;
				this.foe = null;
				STAGE.highlightUnit();
				uiController.show('actionMenu');
				break;
		}
		this.state = state;
	}
	setWeapon(weapon: Equipment): void {
		this.weapon = weapon;
		this.changeState('selectingTarget');
	}
	setFoe(foe: Unit): void {
		this.foe = foe;
		this.changeState('simulating');
	}
	execute(): void {
		if (!this.attacker || !this.foe || !this.weapon) return;
		this.changeState('executing');
		const result: attackResult = attackTarget(this.attacker, this.foe, this.weapon);
		console.log({ result });
		this.attacker.consumeTaskPoint(this.weapon.attackCost);
		switch (result.result) {
			case 'miss':
				break;
			case 'dodge':
				this.foe.consumeTaskPoint(0.3);
				break;
			case 'parry':
				this.foe.consumeTaskPoint(0.75);
				break;
		}
		if (result.foeIsDead) {
			this.foe.remove();
			units.remove(this.foe);
		}
		this.changeState('finished');
	}
}
export const ATTACK = new Attack();