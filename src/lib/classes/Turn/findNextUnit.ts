import { units } from '$lib/stores/unitStore';

export const findNextUnit = () => {
	let nextUnit = units.getAll()[0];
	units.getAll().forEach((unit) => {
		if (nextUnit.currentWaitTurn > unit.currentWaitTurn) {
			nextUnit = unit;
		}
	});
	return nextUnit;
};
