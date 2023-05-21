import type { Equipment } from '../Equipment/Equipment';
import type { Unit } from '../Stage/Units/Unit/Unit';

export const getAttackTime = (attacker: Unit, foe: Unit, weapon: Equipment) => {
	const distance = attacker.vector3.distanceTo(foe.vector3);
	return Math.max(1, distance / weapon.range);
};
