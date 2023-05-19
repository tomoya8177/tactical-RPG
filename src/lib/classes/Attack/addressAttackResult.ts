import type { Equipment } from '../Equipment/Equipment';
import { STAGE } from '../Stage/Stage';
import type { Unit } from '../Stage/Units/Unit/Unit';
import type { attackResult } from './Attack';

export const addressAttackResult = (
	attacker: Unit,
	foe: Unit,
	weapon: Equipment,
	result: attackResult
): void => {
	if (result.damage) {
		foe.giveDamage(result.damage);
	}
	attacker.consumeTaskPoint(weapon.attackCost);
	switch (result.result) {
		case 'miss':
			break;
		case 'dodge':
			foe.consumeTaskPoint(0.3);
			break;
		case 'parry':
			foe.consumeTaskPoint(0.75);
			break;
	}
	if (result.foeIsDead) {
		foe.remove();
		STAGE.units.remove(foe);
	}
};
