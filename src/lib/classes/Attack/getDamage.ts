import type { Equipment } from '../Equipment/Equipment';
import type { Unit } from '../Stage/Units/Unit/Unit';

export const getDamage = (attacker: Unit, foe: Unit, weapon: Equipment): number => {
	if (!attacker.actor || !foe.actor) return 0;
	let damage = Math.max(0, weapon.lethality - 10 + (6 * attacker.actor.ST) / 18);
	const armor = foe.actor.equipments.find((weapon) => weapon.type === 'armor');
	if (armor || typeof armor !== 'undefined') {
		armor.life = armor.life - Math.min(damage, armor.protection);
		damage = Math.max(0, damage - armor.protection);
	}
	return damage;
};
export const giveDamageBonus = (damage: number, weapon: Equipment) => {
	switch (weapon.attackType) {
		case 'thrusting':
			switch (weapon.harmType) {
				case 'blunt':
					return damage;
				case 'bladed':
					return damage * 2;
			}
			break;
		case 'swinging':
			switch (weapon.harmType) {
				case 'blunt':
					return damage;
				case 'bladed':
					return damage * 1.5;
			}
			break;
	}
};
