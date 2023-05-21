import type { attackResult } from '$lib/types/attackResult';
import type { Equipment } from '../Equipment/Equipment';
import { STAGE } from '../Stage/Stage';
import type { Unit } from '../Stage/Units/Unit/Unit';
import { getUnitStatusObejct } from '$lib/presets/unitStatus';

export const addressAttackResult = (
	attacker: Unit,
	foe: Unit,
	weapon: Equipment,
	result: attackResult
): void => {
	let promptMessage = '';
	if (!foe.actor.statuses.has('unconscious')) {
		const tobeUnconscious = foe.checkUnconscious();
		if (tobeUnconscious) {
			result.givenState.push(getUnitStatusObejct('unconscious'));

			result.givenState.push(getUnitStatusObejct('down'));
		}
	}
	result.givenState.forEach((status) => {
		if (foe.actor.statuses.has(status.slug)) return;
		foe.actor.statuses.push(status);
		promptMessage += ' +' + status.name;
		if (status.slug == 'down') {
			foe.WT.current += foe.WT.get() / 2;
		}
	});
	if (result.damage) {
		foe.updateLifeBar();
		promptMessage = Math.round(result.damage * 10) + promptMessage;
	}

	foe.prompt.message(promptMessage);

	attacker.TP.consume(weapon.attackCost);
	switch (result.result) {
		case 'miss':
			break;
		case 'dodge':
			foe.TP.consume(0.3);
			break;
		case 'parry':
			foe.TP.consume(0.75);
			break;
	}
	if (result.foeIsDead) {
		//foe.remove();
		STAGE.units.remove(foe);
	}
};
