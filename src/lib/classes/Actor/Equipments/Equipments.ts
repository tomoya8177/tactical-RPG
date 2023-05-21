import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
import type { parryInstance } from '$lib/types/parryInstance';
import type { Actor } from '../Actor';

export class Equipments extends Array {
	actor: Actor;
	unit: Unit | null = null;
	constructor(actor: Actor, unit: Unit | null = null) {
		super();
		this.actor = actor;
	}
	get totalWeight(): number {
		return (
			this.map((equipment) => equipment.weight).reduce(
				(weight, currentWeight) => weight + currentWeight,
				0
			) || 0
		);
	}
	removeUnequipped(): void {
		this.forEach((equipment, index) => {
			if (!equipment.equippedOn) this.splice(index, 1);
		});
	}
	getParryWeapons(): Array<parryInstance> {
		return this.filter((equipment) => {
			if (!equipment.canParry) return false;
			if (equipment.equippedOn == 'rightHand') return true;
			if (equipment.equippedOn == 'leftHand') return true;
			return false;
		}).map((equipment) => {
			if (!this.unit) throw new Error('unit is not set');
			return {
				equipment,
				level: Math.max(
					this.unit.getLv(equipment.skillToUse) / 2,
					this.unit.getLv(equipment.skillToUse) / 2,
					(this.unit.getLv('Fencing') * 2) / 3,
					(this.unit.getLv('Quarterstaff') * 2) / 3
				)
			};
		});
	}
}
