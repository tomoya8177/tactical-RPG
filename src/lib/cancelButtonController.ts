import { ATTACK } from './classes/Attack/Attack';
import { CAMERA } from './classes/Camera/Camera';
import { STAGE } from './classes/Stage/Stage';
import { TURN } from './classes/Turn/Turn';
import { uiController } from './stores/uiControllerStore';

export const cancelButtonController = () => {
	switch (STAGE.state) {
		case 'idle':
			uiController.hide('actorData');
			STAGE.tiles.reset();
			if (TURN.unit) {
				STAGE.focusOnUnit(TURN.unit);
				uiController.show('actionMenu');
			}
			break;
		case 'selectingDirection':
			TURN.unit?.changeState('idle');
			STAGE.changeState('idle');
			break;
		case 'selectingWeapon':
		case 'selectingWeaponForAmbush':
			STAGE.changeState('idle');
			if (TURN.unit) {
				STAGE.focusOnUnit(TURN.unit);
			}
			break;
		case 'attack':
			switch (ATTACK.state) {
				case 'selectingTarget':
					STAGE.tiles.reset();
					STAGE.changeState('selectingWeapon');
					STAGE.units.forEach((unit) => {
						unit.changeState('idle');
					});
					if (!TURN.unit) return;
					CAMERA.move(TURN.unit.position);
					break;
				case 'simulating':
					ATTACK.changeState('selectingTarget');
					break;
			}
			break;
		case 'equipment':
			uiController.show('actionMenu');
			uiController.hide('equipmentMenu');
			STAGE.changeState('idle');
			break;
		case 'equipmentSelected':
			STAGE.changeState('equipment');
			break;
	}
};
