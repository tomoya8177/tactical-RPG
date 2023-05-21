import { autoActor } from '$lib/presets/autoActor';
import type { unitStatusType } from '$lib/types/unitStatus';
import type { Equipment } from '../Equipment/Equipment';
import type { Unit } from '../Stage/Units/Unit/Unit';
import { Equipments } from './Equipments/Equipments';
import type { Skill } from './Skill/Skill';
import { Statuses } from './Statuses/Statuses';
export class Actor {
	name: string;
	ST: number;
	DX: number;
	IQ: number;
	HT: number;
	damage: number;
	statuses: Statuses = new Statuses();
	equipments: Equipments = new Equipments(this);
	skills: Array<Skill>;
	constructor(data: Actor | null = null) {
		if (!data) {
			data = autoActor();
		}
		this.name = data.name;
		this.ST = data.ST;
		this.DX = data.DX;
		this.IQ = data.IQ;
		this.HT = data.HT;
		this.damage = data.damage;
		data.equipments.forEach((equipment: Equipment) => {
			this.equipments.push(equipment);
		});
		this.skills = data.skills;
		data.statuses.forEach((status: unitStatusType) => {
			this.statuses.push(status);
		});
	}
	setUnit(unit: Unit) {
		this.equipments.unit = unit;
	}
}
