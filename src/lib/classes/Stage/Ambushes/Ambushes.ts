import type { Unit } from '../Units/Unit/Unit';

export class Ambushes extends Array {
	of(unit: Unit) {
		console.log(this);
		return this.find((ambush) => ambush.attacker.id == unit.id);
	}
	clearFor(unit: Unit) {
		this.forEach((ambush) => {
			if (ambush.attacker.id == unit.id) {
				this.splice(this.indexOf(ambush), 1);
			}
		});
	}
}
