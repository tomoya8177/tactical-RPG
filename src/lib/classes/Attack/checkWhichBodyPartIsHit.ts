import { dice3d6 } from '$lib/Maths/dice3d6';
import type { bodyPartsSlug } from '$lib/presets/bodyParts';
import type { Unit } from '../Stage/Units/Unit/Unit';
import { checkAttackFromFB, checkAttackFromLR } from './Simulation/checkAttackFrom';

export const checkWhichBodyPartIsHit = (attacker: Unit, foe: Unit): bodyPartsSlug => {
	const attackFromLR = checkAttackFromLR(attacker, foe);
	const attackFromFB = checkAttackFromFB(attacker, foe);
	const roll = Math.round(dice3d6());
	switch (roll) {
		case 3:
		case 4:
		case 5:
			return 'head';
		case 6:
			//far arm
			return attackFromLR === 'left' ? 'rightArm' : 'leftArm';
		case 7:
			//hand
			return attackFromLR === 'left' ? 'leftHand' : 'rightHand';
		case 8:
			//near arm
			return attackFromLR === 'left' ? 'leftArm' : 'rightArm';
		case 9:
		case 10:
		case 11:
			if (attackFromFB === 'back') return 'back';
			if (Math.random() > 0.3) return 'torso';
			return 'waist';
		case 12:
			//far leg
			return attackFromLR === 'left' ? 'rightLeg' : 'leftLeg';
		case 13:
		case 14:
			//near leg
			return attackFromLR === 'left' ? 'leftLeg' : 'rightLeg';
		case 15:
		case 16:
			//far leg
			return attackFromLR === 'left' ? 'rightLeg' : 'leftLeg';
		case 17:
		case 18:
			//heart
			return 'heart';
		default:
			return 'torso';
	}
};
