import { roll3d6 } from '$lib/Maths/dice3d6';
import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { attackResult } from '$lib/types/attackResult';
import { Vector3 } from 'three';
import type { Unit } from '../Stage/Units/Unit/Unit';
import type { Equipment } from '../Equipment/Equipment';
import { systemConfig } from '$lib/systemConfig';
import { noticePossibility } from './noticePossibility';
import { getDamage } from './getDamage';
import type { unitStatus } from './Attack';
export const attackTarget = (attacker: Unit, foe: Unit, equipment: Equipment): attackResult => {
	const checkIfAttackHits = () => {
		const skillLv = attacker.getLv(equipment.skillToUse);
		console.log(skillLv);
		return roll3d6(skillLv).result;
	};
	const checkIfFoeNoticesAttack = () => {
		const possiblity = noticePossibility(attacker, foe);
		return Math.random() < possiblity;
	};
	const checkIfFoeCanDodge = () => {
		let dodge = foe.dodge;
		return roll3d6(dodge).result;
	};
	const checkIfFoeCanParry = () => {
		const parries = foe.parry;
		return roll3d6(parries[0].level).result;
	};

	const givenState: typeof unitStatus = [];
	if (!checkIfAttackHits()) {
		foe.promptResult('Miss');

		return {
			result: 'miss',
			damage: 0,
			givenState: [],
			foeIsDead: false
		};
	}
	if (checkIfFoeNoticesAttack()) {
		console.log('noticed');
		if (checkIfFoeCanDodge()) {
			foe.promptResult('Dodge');

			return {
				result: 'dodge',
				damage: 0,
				givenState: [],
				foeIsDead: false
			};
		}
		if (checkIfFoeCanParry()) {
			foe.promptResult('Parry');

			return {
				result: 'parry',
				damage: 0,

				givenState: [],
				foeIsDead: false
			};
		}
	}
	const damage = getDamage(attacker, foe, equipment);
	if (!!foe.actor && damage > foe.actor.HT / 2) {
		givenState.push('down');
	}
	//	const damage = giveDamageToFoe();
	if (damage === 'error') {
		return {
			result: 'error',
			damage: 0,
			givenState: [],
			foeIsDead: false
		};
	}
	if (foe.life <= 0) {
		foe.addStatus('dead');
	}

	return {
		result: 'hit',
		damage: damage,
		givenState,
		foeIsDead: foe.life <= 0
	};
};
