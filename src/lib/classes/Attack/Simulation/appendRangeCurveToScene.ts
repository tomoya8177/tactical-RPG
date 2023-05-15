import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
import type { Entity } from 'aframe';
import { Vector3 } from 'three';
const southVector = new Vector3(0, 0, 1);
export const appendRangeCurveToScene = (curve: Entity, attacker: Unit, foe: Unit): Entity => {
	const scene = document.querySelector('a-scene');
	const targetVector = new Vector3(foe.x, 0, foe.z).sub(attacker.vector3);
	const angle = radians2degrees(southVector.angleTo(targetVector));
	let rotation;
	if (targetVector.x < 0) {
		rotation = -angle - 90;
	} else {
		rotation = angle - 90;
	}
	curve.setAttribute('rotation', `0 ${rotation} 0`);

	curve.setAttribute('position', `${attacker.x} ${attacker.y + 1.5} ${attacker.z}`);
	curve.classList.add('simulation-curve');

	scene.appendChild(curve);
	return curve;
};
