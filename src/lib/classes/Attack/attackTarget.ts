import { roll3d6 } from '$lib/Maths/dice3d6';
import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { attackResult } from '$lib/types/attackResult';
import { Vector3 } from 'three';
import type { Unit } from '../Stage/Units/Unit/Unit';
import type { Equipment } from '../Equipment/Equipment';
import { systemConfig } from '$lib/systemConfig';
import { noticePossibility } from './noticePossibility';
import { getDamage } from './getDamage';
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
		let [weapon, parry] = foe.parry;
		return roll3d6(parry).result;
	};
	const giveDamageToFoe = () => {
		const damage = getDamage(attacker, foe, equipment);
		foe.giveDamage(damage);
		return damage;
	};
	if (!checkIfAttackHits()) {
		foe.promptResult('Miss');

		return {
			result: 'miss',
			damage: 0,
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
				foeIsDead: false
			};
		}
		if (checkIfFoeCanParry()) {
			foe.promptResult('Parry');

			return {
				result: 'parry',
				damage: 0,
				foeIsDead: false
			};
		}
	}
	const damage = giveDamageToFoe();
	if (damage === 'error') {
		return {
			result: 'error',
			damage: 0,
			foeIsDead: false
		};
	}
	if (foe.life <= 0) {
		foe.addStatus('dead');
	}
	return {
		result: 'hit',
		damage: damage,
		foeIsDead: foe.life <= 0
	};
};
