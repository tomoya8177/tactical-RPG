import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';

export const checkAttackFromLR = (attacker: Unit, foe: Unit): 'left' | 'right' => {
	//compare 2 vectors and return the direction the attack is coming from
	switch (foe.direction) {
		case 'N':
			return attacker.x > foe.x ? 'right' : 'left';
		case 'S':
			return attacker.x > foe.x ? 'left' : 'right';
		case 'E':
			return attacker.z > foe.z ? 'right' : 'left';
		case 'W':
			return attacker.z > foe.z ? 'left' : 'right';
	}
};
export const checkAttackFromFB = (attacker: Unit, foe: Unit): 'front' | 'back' => {
	//compare 2 vectors and return the direction the attack is coming from
	switch (foe.direction) {
		case 'N':
			return attacker.z > foe.z ? 'back' : 'front';
		case 'S':
			return attacker.z > foe.z ? 'front' : 'back';
		case 'E':
			return attacker.x > foe.x ? 'back' : 'front';
		case 'W':
			return attacker.x > foe.x ? 'front' : 'back';
	}
};
