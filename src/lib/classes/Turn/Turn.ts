import { uiController } from '$lib/stores/uiControllerStore';
import { units } from '$lib/stores/unitStore';
import { STAGE } from '../Stage/Stage';
import type { Unit } from '../Unit/Unit';
import { findNextUnit } from './findNextUnit';

class Turn {
	unit: Unit | null;
	constructor() {
		this.unit = null;
	}
	async start(unit: Unit | null = null) {
		if (!unit) unit = findNextUnit();
		this.unit = unit;
		this.unit.resetTaskPoint();
		await STAGE.focusOnUnit(this.unit);
		STAGE.changeState('idle');
		this.unit.changeState('inTurn');
		uiController.show('actionMenu');
	}
	end() {
		if (!this.unit) return;
		units.getAll().forEach((unit) => {
			if (!this.unit) return;
			if (this.unit.id == unit.id) return;
			unit.consumeWaitTurn(this.unit?.currentWaitTurn);
		});
		this.unit.resetWaitTurn();
		this.unit.consumedMovementPoint = 0;

		uiController.hide('actorData');
		uiController.hide('actionMenu');

		STAGE.resetAllTiles();
		this.unit.resetState();
		this.unit = null;
		this.start();
	}
}

export const TURN = new Turn();
