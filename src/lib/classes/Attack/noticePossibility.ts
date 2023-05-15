import { Vector3 } from 'three';
import type { Unit } from '../Stage/Units/Unit/Unit';
import { radians2degrees } from '$lib/Maths/radian2degrees';

export const noticePossibility = (attacker: Unit, foe: Unit) => {
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
	const attackerVector = new Vector3(attacker.position.x, attacker.position.y, attacker.position.z);
	const v2 = attackerVector.sub(foeVector);
	let angle = radians2degrees(v1.angleTo(v2));
	if (angle < 45) {
		return 1;
	} else if (angle < 135) {
		return 0.5;
	} else {
		return 0.1;
	}
};
