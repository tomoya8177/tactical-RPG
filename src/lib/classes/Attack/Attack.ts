import type { Unit } from '../Stage/Units/Unit/Unit';
import type { Equipment } from '../Equipment/Equipment';
import { uiController } from '$lib/stores/uiControllerStore';
import { findTargetTiles } from './findTargetTiles';
import { findUnitOnTile } from './findUnitOnTile';
import { TURN } from '../Turn/Turn';
import { STAGE } from '../Stage/Stage';
import { attackTarget } from './attackTarget';
import type { Tile } from '../Stage/Tiles/Tile/Tile';
import { Simulation } from './Simulation/Simulation';
export const ticksPerSecond = 60;

export interface attackResult {
	result: string;
	foeIsDead: boolean;
	damage: number;
}

type state = 'idle' | 'selectingTarget' | 'simulating' | 'executing' | 'finished';

class Attack {
	state: state = 'idle';
	attacker: Unit | null = null;
	weapon: Equipment | null = null;
	foe: Unit | null = null;
	simulation: Simulation | null = null;
	simulationResult: attackResult | null = null;
	result: attackResult | null = null;
	constructor() {
		this.state = 'idle';
		this.attacker = null;
		this.weapon = null;
		this.foe = null;
		this.simulationResult = null;
		this.result = null;
	}
	init(attacker: Unit | null = null, tile: Tile | null = null): void {
		if (!TURN.unit) return;
		if (!attacker) attacker = TURN.unit;
		if (!tile) tile = STAGE.tiles.findByXZ(attacker.x, attacker.z)[0];
		this.attacker = attacker;
		this.attacker.tile = tile;
		STAGE.changeState('selectingWeapon');
		//		this.changeState('selectingWeapon');
	}

	async changeState(state: state): Promise<void> {
		switch (state) {
			case 'idle':
				break;

			case 'selectingTarget':
				if (!this.attacker || !this.weapon) throw new Error('attacker is null');
				uiController.hide('attackSimulation');
				this.simulation?.removeCurves();
				const attackTargetTiles = findTargetTiles(this.attacker, this.weapon, STAGE.tiles);
				attackTargetTiles.forEach((tile) => {
					if (tile.id == '' || !TURN.unit) throw new Error('tile is null');
					const targetUnit = findUnitOnTile(tile.id, STAGE.tiles);
					if (targetUnit && targetUnit.id != TURN.unit.id) {
						targetUnit.highlightAttackTarget();
					}
					tile.changeState('target');
				});
				break;
			case 'simulating':
				if (!this.attacker || !this.foe || !this.attacker.tile || !this.weapon)
					throw new Error('attacker is null');
				this.simulation = new Simulation(this.attacker, this.foe, this.weapon);
				uiController.hide('actorData');
				const simulationResult = await this.simulation.simulate();
				uiController.show('attackSimulation');

				break;
			case 'executing':
				this.simulation?.destroy();

				uiController.hide('attackSimulation');

				break;
			case 'finished':
				if (!this.attacker) throw new Error('attacker is null');
				STAGE.focusOnUnit(this.attacker);
				this.attacker = null;
				this.weapon = null;
				this.foe = null;
				STAGE.changeState('idle');
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
		STAGE.units.forEach((unit) => {
			unit.changeState('idle');
		});
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
			STAGE.units.remove(this.foe);
		}
		this.changeState('finished');
	}
}
export const ATTACK = new Attack();
