import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';

export class Units extends Array {
	init(units: Unit[]) {
		units.forEach((unit) => {
			this.push(unit);
		});
	}
	remove(unit: Unit) {
		unit.el.parentElement?.removeChild(unit.el);
		this.splice(this.indexOf(unit), 1);
	}
}
