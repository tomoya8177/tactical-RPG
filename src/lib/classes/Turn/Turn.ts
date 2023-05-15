import { uiController } from '$lib/stores/uiControllerStore';
import { STAGE } from '../Stage/Stage';
import type { Unit } from '../Stage/Units/Unit/Unit';
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
		STAGE.ambushes.clearFor(this.unit);
		await STAGE.focusOnUnit(this.unit);
		STAGE.changeState('idle');
		this.unit.changeState('inTurn');
		uiController.show('actionMenu');
	}
	end() {
		if (!this.unit) return;
		STAGE.units.forEach((unit) => {
			if (!this.unit) return;
			if (this.unit.id == unit.id) return;
			unit.consumeWaitTurn(this.unit?.currentWaitTurn);
		});
		this.unit.resetWaitTurn();
		this.unit.consumedMovementPoint = 0;

		uiController.hide('actorData');
		uiController.hide('actionMenu');

		STAGE.tiles.reset();
		this.unit.resetState();
		this.unit = null;
		this.start();
	}
}

export const TURN = new Turn();
