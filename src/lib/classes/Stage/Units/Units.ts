import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';

export class Units extends Array {
	init(units: Unit[]) {
		units.forEach((unit) => {
			this.push(unit);
		});
	}
	remove(unit: Unit) {
		this.splice(this.indexOf(unit), 1);
	}
}
