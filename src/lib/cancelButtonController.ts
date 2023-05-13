import { ATTACK } from './classes/Attack/Attack';
import { CAMERA } from './classes/Camera/Camera';
import { STAGE } from './classes/Stage/Stage';
import { TURN } from './classes/Turn/Turn';
import { uiController } from './stores/uiControllerStore';
import { units } from './stores/unitStore';

export const cancelButtonController = () => {
	switch (STAGE.state) {
		case 'idle':
			uiController.hide('actorData');
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
			STAGE.changeState('idle');
			if (TURN.unit) {
				STAGE.focusOnUnit(TURN.unit);
			}
			break;
		case 'attack':
			switch (ATTACK.state) {
				case 'selectingTarget':
					ATTACK.changeState('selectingWeapon');

					STAGE.resetAllTiles();
					STAGE.changeState('selectingWeapon');
					units.getAll().forEach((unit) => {
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
	}
};
