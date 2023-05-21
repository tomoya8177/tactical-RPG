import { dice3d6, roll3d6 } from '$lib/Maths/dice3d6';
import type { Actor } from '$lib/classes/Actor/Actor';
import { Skill } from '$lib/classes/Actor/Skill/Skill';
import { Equipment } from '$lib/classes/Equipment/Equipment';
import { randomNames } from './randomNames';

export const autoActor = (): Actor => {
	return {
		name: randomNames[Math.round(randomNames.length * Math.random())],
		ST: dice3d6(),
		DX: dice3d6(),
		IQ: dice3d6(),
		HT: dice3d6(),
		damage: 0,
		statuses: [],
		equipments: [
			new Equipment({
				name: 'Sword',
				lethality: 10,
				weight: 3,
				length: 1,
				skillToUse: 'Sword',
				type: 'weapon',
				attackType: 'swinging',
				harmType: 'bladed',
				attackCost: 1,
				protection: 0,
				maxLife: 10,
				life: 10,
				range: 1,
				rangeType: 'direct',
				equippedOn: 'waist',
				canParry: true
			}),
			new Equipment({
				name: 'Spear',
				lethality: 10,
				weight: 3,
				length: 2,
				skillToUse: 'Spear',
				type: 'weapon',
				attackType: 'thrusting',
				harmType: 'bladed',
				attackCost: 1.1,
				protection: 0,
				maxLife: 10,
				life: 10,
				range: 2,
				rangeType: 'direct',
				equippedOn: 'back',
				canParry: true
			}),
			new Equipment({
				name: 'Crossbow',
				lethality: 10,
				weight: 3,
				length: 1,
				skillToUse: 'Crossbow',
				type: 'weapon',
				attackType: 'thrusting',
				harmType: 'bladed',
				attackCost: 0.8,
				protection: 0,
				maxLife: 10,
				life: 10,
				range: 8,
				rangeType: 'ranged',
				equippedOn: 'leftHand',
				canParry: false
			}),
			new Equipment({
				name: 'GreatBow',
				lethality: 12,
				weight: 2,
				length: 1,
				skillToUse: 'Crossbow',
				type: 'weapon',
				attackType: 'thrusting',
				harmType: 'bladed',
				attackCost: 1.2,
				protection: 0,
				maxLife: 10,
				life: 10,
				range: 10,
				rangeType: 'ranged',
				equippedOn: 'rightHand',
				canParry: false
			})
		],
		skills: [
			new Skill({
				name: 'Sword',
				level: dice3d6(),
				type: 'physical'
			}),
			new Skill({
				name: 'Spear',
				level: dice3d6(),
				type: 'physical'
			}),
			new Skill({
				name: 'Crossbow',
				level: 15,
				type: 'physical'
			})
		]
	};
};
