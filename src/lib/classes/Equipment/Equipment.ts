import type { bodyPartsSlug } from '$lib/presets/bodyParts';
export type equipmentTypes =
	| 'weapon'
	| 'armor'
	| 'helmet'
	| 'mask'
	| 'shield'
	| 'gloves'
	| 'boots'
	| 'bandage'
	| 'accessory';
export class Equipment {
	name: string;
	weight: number;
	lethality: number;
	length: number;
	skillToUse: string;
	attackType: attackType;
	attackCost: number;
	harmType: harmType;
	type: equipmentTypes;
	canParry: boolean;

	protection: number;
	life: number;
	maxLife: number;
	range: number;
	rangeType: rangeType;
	equippedOn: bodyPartsSlug | null = null;
	constructor(data: Equipment) {
		this.name = data.name;
		this.weight = data.weight;
		this.lethality = data.lethality;
		this.length = data.length;
		this.skillToUse = data.skillToUse;
		this.attackType = data.attackType;
		this.harmType = data.harmType;
		this.type = data.type;
		this.protection = data.protection;
		this.life = data.life;
		this.maxLife = data.maxLife;
		this.attackCost = data.attackCost || 1;
		this.range = data.range || 30;
		this.rangeType = data.rangeType || 'direct';
		this.equippedOn = data.equippedOn || null;
		this.canParry = data.canParry || false;
	}
}
export type rangeType = 'direct' | 'ranged';
export type attackType = 'thrusting' | 'swinging';
export type harmType = 'blunt' | 'bladed';
export type damageType = 'impaling' | 'cutting' | 'crushing';
