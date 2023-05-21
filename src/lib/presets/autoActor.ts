import type { Actor } from '$lib/classes/Actor/Actor';
import { Equipment } from '$lib/classes/Equipment/Equipment';
import { randomNames } from './randomNames';

export const autoActor = (): Actor => {
	return {
		name: randomNames[Math.round(randomNames.length * Math.random())],
		ST: Math.round(10 * Math.random()) + 5,
		DX: Math.round(10 * Math.random()) + 5,
		IQ: Math.round(10 * Math.random()) + 5,
		HT: Math.round(10 * Math.random()) + 5,
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
				equippedOn: 'waist'
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
				equippedOn: 'back'
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
				equippedOn: 'leftHand'
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
				equippedOn: 'rightHand'
			})
		],
		skills: [
			{
				name: 'Sword',
				level: Math.round(10 * Math.random()) + 5
			},
			{
				name: 'Spear',
				level: Math.round(10 * Math.random()) + 5
			},
			{
				name: 'Crossbow',
				level: 15
			}
		]
	};
};
