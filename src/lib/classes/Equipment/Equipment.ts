export const bodyParts = {
	head: {
		title: 'Head'
	},
	torso: {
		title: 'Torso'
	},
	leftArm: {
		title: 'Left Arm'
	},
	rightArm: {
		title: 'Right Arm'
	},
	leftLeg: {
		title: 'Left Leg'
	},
	rightLeg: {
		title: 'Right Leg'
	},
	waist: {
		title: 'Waist'
	},

	back: {
		title: 'Back'
	}
};

type bodyParts = keyof typeof bodyParts;
export class Equipment {
	name: string;
	weight: number;
	lethality: number;
	length: number;
	skillToUse: string;
	attackType: attackType;
	attackCost: number;
	harmType: harmType;
	type: 'weapon' | 'armor' | 'shield';
	protection: number;
	life: number;
	maxLife: number;
	range: number;
	rangeType: rangeType;
	equippedOn: bodyParts | null = null;
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
	}
}
export type rangeType = 'direct' | 'ranged';
export type attackType = 'thrusting' | 'swinging';
export type harmType = 'blunt' | 'bladed';
export type damageType = 'impaling' | 'cutting' | 'crushing';
