import { roll3d6 } from '$lib/Maths/dice3d6';
import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { attackResult } from '$lib/types/attackResult';
import { Vector3 } from 'three';
import type { Unit } from '../Unit/Unit';
import type { Equipment } from '../Equipment/Equipment';
import { systemConfig } from '$lib/systemConfig';
export const attackTarget = (attacker: Unit, foe: Unit, equipment: Equipment): attackResult => {
	const checkIfAttackHits = () => {
		const skillLv = attacker.getLv(equipment.skillToUse);
		console.log(skillLv);
		return roll3d6(skillLv).result;
	};
	const checkIfFoeNoticesAttack = () => {
		let v1;
		switch (foe.direction) {
			case 'S':
				v1 = new Vector3(0, 0, 1);
				break;
			case 'W':
				v1 = new Vector3(-1, 0, 0);
				break;
			case 'N':
				v1 = new Vector3(0, 0, -1);
				break;
			case 'E':
				v1 = new Vector3(1, 0, 0);
				break;
		}
		const foeVector = new Vector3(foe.position.x, foe.position.y, foe.position.z);
		const attackerVector = new Vector3(
			attacker.position.x,
			attacker.position.y,
			attacker.position.z
		);
		const v2 = attackerVector.sub(foeVector);
		console.log({ v2 });
		let angle = radians2degrees(v1.angleTo(v2));
		console.log({ angle });
		if (angle < 45) {
			return true;
		} else if (angle < 135) {
			return Math.random() > 0.5;
		} else {
			return Math.random() > 0.9;
		}
	};
	const checkIfFoeCanDodge = () => {
		if (foe.currentTaskPoint < systemConfig.taskPointDodge) return false;
		let dodge = foe.dodge;
		return roll3d6(dodge).result;
	};
	const checkIfFoeCanParry = () => {
		if (foe.currentTaskPoint < systemConfig.taskPointParry) return false;

		let parry = foe.parry();
		return roll3d6(parry).result;
	};
	const giveDamageToFoe = () => {
		const giveDamageBonus = (equipment: Equipment, damage: number) => {
			switch (equipment.attackType) {
				case 'thrusting':
					switch (equipment.harmType) {
						case 'blunt':
							return damage;
						case 'bladed':
							return damage * 2;
					}
					break;
				case 'swinging':
					switch (equipment.harmType) {
						case 'blunt':
							return damage;
						case 'bladed':
							return damage * 1.5;
					}
					break;
			}
		};
		if (!attacker.actor || !foe.actor) return 'error';
		let damage = Math.max(0, equipment.lethality - 10 + (6 * attacker.actor.ST) / 18);
		const armor = foe.actor.equipments.find((equipment) => equipment.type === 'armor');
		if (armor || typeof armor !== 'undefined') {
			armor.life = armor.life - Math.min(damage, armor.protection);
			damage = Math.max(0, damage - armor.protection);
		}
		damage = giveDamageBonus(equipment, damage);
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
