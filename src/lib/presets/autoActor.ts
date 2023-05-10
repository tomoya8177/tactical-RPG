import { Equipment } from '$lib/classes/Equipment/Equipment';
import { randomNames } from './randomNames';

export const autoActor = {
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
			life: 10
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
			life: 10
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
			range: 10,
			rangeType: 'ranged'
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
			level: Math.round(10 * Math.random()) + 5
		}
	]
};