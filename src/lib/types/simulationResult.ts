import type { Equipment } from '$lib/classes/Equipment/Equipment';
import type { Entity } from 'aframe';

export type rangeSimulationResult = {
	curve: Entity | null;
	intercepted: boolean;
	outOfRange: boolean;
};
export type simulationResult = {
	result: string;
	hit: number;
	notice: number;
	dodge: number;
	parry: Array<{
		equipment: Equipment;
		level: number;
	}>;
	damage: number;
};
