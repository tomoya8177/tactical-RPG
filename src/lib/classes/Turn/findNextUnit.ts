import { STAGE } from '../Stage/Stage';
import type { Unit } from '../Stage/Units/Unit/Unit';

export const findNextUnit = (): Unit => {
	let nextUnit = STAGE.units[0];
	STAGE.units.forEach((unit) => {
		if (nextUnit.currentWaitTurn > unit.currentWaitTurn) {
			nextUnit = unit;
		}
	});
	return nextUnit;
};
