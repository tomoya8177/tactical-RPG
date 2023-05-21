import { systemConfig } from '$lib/systemConfig';
import type { Unit } from '../Unit';

export class TP {
	unit: Unit;
	current: number;
	constructor(unit: Unit) {
		this.unit = unit;
		this.current = systemConfig.defaultTaskPoint;
	}
	consume(value: number) {
		this.current -= value;
	}
	reset() {
		this.current = systemConfig.defaultTaskPoint;
	}
}
