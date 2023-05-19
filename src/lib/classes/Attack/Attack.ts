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
import { addressAttackResult } from './addressAttackResult';
export const ticksPerSecond = 60;
export const unitStatus = ['dead', 'down', 'bleeding', 'burning', 'stunned', 'blinded'];
export interface attackResult {
	result: string;
	foeIsDead: boolean;
	givenState: Array<typeof unitStatus>;
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
	init(attacker: Unit | null = null): void {
		if (!TURN.unit) return;
		if (!attacker) attacker = TURN.unit;
		//if (!tile) tile = STAGE.tiles.findByXZ(attacker.x, attacker.z)[0];
		this.attacker = attacker;
		//this.attacker.tile = tile;
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
				//STAGE.focusOnUnit(this.attacker);
				this.attacker = null;
				this.weapon = null;
				this.foe = null;
				STAGE.changeState('idle');
				break;
		}
		this.state = state;
	}
	async setWeapon(weapon: Equipment): Promise<void> {
		this.weapon = weapon;
		await this.changeState('selectingTarget');
	}
	async setFoe(foe: Unit): Promise<void> {
		this.foe = foe;
		await this.changeState('simulating');
		STAGE.units.forEach((unit) => {
			unit.changeState('idle');
		});
	}
	execute(): void {
		if (!this.attacker || !this.foe || !this.weapon) return;
		this.changeState('executing');
		this.attackTarget();
		this.changeState('finished');
	}
	attackTarget(): attackResult {
		if (!this.attacker || !this.foe || !this.weapon) throw new Error('attacker is null');
		const result: attackResult = attackTarget(this.attacker, this.foe, this.weapon);
		console.log({ result });
		addressAttackResult(this.attacker, this.foe, this.weapon, result);

		return result;
	}
}
export const ATTACK = new Attack();
