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
		this.unit.TP.reset();
		console.log('clearing');
		STAGE.ambushes.clearFor(this.unit);
		console.log('cleared');
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
			unit.WT.consume(this.unit.WT.current);
		});
		this.unit.WT.reset();
		this.unit.navigation.consumedMovementPoint = 0;

		uiController.hide('actorData');
		uiController.hide('actionMenu');

		STAGE.tiles.reset();
		this.unit.resetState();
		this.unit = null;
		STAGE.units.forEach((unit) => {
			if (unit.checkDead()) {
				STAGE.units.remove(unit);
			}
		});
		this.start();
	}
}

export const TURN = new Turn();
