import { roll3d6 } from '$lib/Maths/dice3d6';
import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { attackResult } from '$lib/types/attackResult';
import { Vector3 } from 'three';
import type { Unit } from '../Stage/Units/Unit/Unit';
import type { Equipment } from '../Equipment/Equipment';
import { systemConfig } from '$lib/systemConfig';
import { noticePossibility } from './noticePossibility';
import { getDamage, giveDamageBonus } from './getDamage';
import { getUnitStatusObejct, unitStatus } from '$lib/presets/unitStatus';
import { checkWhichBodyPartIsHit } from './checkWhichBodyPartIsHit';
import type { unitStatusType } from '$lib/types/unitStatus';

export const attackTarget = (
	attacker: Unit,
	foe: Unit,
	equipment: Equipment,
	attackTime: number
): attackResult => {
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
		return roll3d6(dodge * attackTime).result;
	};
	const checkIfFoeCanParry = () => {
		const parries = foe.actor.equipments.getParryWeapons();
		console.log({ parries });
		if (parries.length === 0) return false;
		return roll3d6(parries[0].level * attackTime).result;
	};

	const givenState: unitStatusType[] = [];
	if (!checkIfAttackHits()) {
		foe.prompt.message('Miss');

		return {
			result: 'miss',
			damage: 0,
			foeIsDead: false,
			givenState: []
		};
	}
	if (!foe.actor.statuses.has('unconscious') && checkIfFoeNoticesAttack()) {
		console.log('noticed');
		if (checkIfFoeCanDodge()) {
			foe.prompt.message('Dodge');

			return {
				result: 'dodge',
				damage: 0,
				givenState: [],

				foeIsDead: false
			};
		}
		if (checkIfFoeCanParry()) {
			foe.prompt.message('Parry');

			return {
				result: 'parry',
				damage: 0,
				givenState: [],

				foeIsDead: false
			};
		}
	}
	const bodyPart = checkWhichBodyPartIsHit(attacker, foe);
	console.log({ bodyPart });

	let damage = getDamage(attacker, foe, equipment);
	if (damage > foe.actor.HT / 2) {
		const status = getUnitStatusObejct('down');
		givenState.push(status);
	}
	damage = giveDamageBonus(damage, equipment, bodyPart);

	// if weapon's damage type was bladed and the damage was more than 1/2 of foe's HT, foe will be given the "bleeding" status
	if (equipment.harmType === 'bladed' && damage > foe.actor.HT / 2) {
		const status = getUnitStatusObejct('bleeding');
		givenState.push(status);
	}

	foe.giveDamage(damage);

	//	const damage = giveDamageToFoe();
	if (damage === 'error') {
		return {
			result: 'error',
			damage: 0,
			givenState: [],
			bodyPart,
			foeIsDead: false
		};
	}
	if (foe.life <= 0) {
		foe.actor.statuses.add('dead');
	}

	return {
		result: 'hit',
		damage: damage,
		givenState,
		bodyPart,
		foeIsDead: foe.life <= 0
	};
};
