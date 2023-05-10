import { autoActor } from '$lib/presets/autoActor';
import type { Equipment } from '../Equipment/Equipment';
export class Actor {
	name: string;
	ST: number;
	DX: number;
	IQ: number;
	HT: number;
	damage: number;
	statuses: Array<string>;
	equipments: Array<Equipment>;
	skills: Array<{
		name: string;
		level: number;
	}>;
	constructor(data: Actor | null = null) {
		if (!data) {
			data = autoActor;
		}
		this.name = data.name;
		this.ST = data.ST;
		this.DX = data.DX;
		this.IQ = data.IQ;
		this.HT = data.HT;
		this.damage = data.damage;
		this.equipments = data.equipments;
		this.skills = data.skills;
		this.statuses = data.statuses;
	}
}
