import type { Unit } from '../Unit';

export class WT {
	unit: Unit;
	current: number;
	constructor(unit: Unit) {
		this.unit = unit;
		this.current = this.get();
	}
	get(): number {
		return (
			(this.unit.actor.equipments.totalWeight + 100) / (this.unit.actor.DX + this.unit.actor.IQ)
		);
	}
	consume(waitTurnToConsume: number): void {
		if (this.unit.actor.statuses.has('bleeding')) {
			this.unit.actor.damage += 0.2 * waitTurnToConsume;
			this.unit.updateLifeBar();
		}
		if (this.unit.actor.statuses.has('unconscious')) return;
		this.current = this.current - waitTurnToConsume;
		if (this.current < this.unit.WT.get() / 2) {
			this.unit.actor.statuses.remove('down');
		}
	}
	reset(): void {
		this.current = this.unit.WT.get();
	}
}
