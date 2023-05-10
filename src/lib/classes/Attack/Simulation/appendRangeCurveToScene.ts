import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { xyz } from '$lib/types/xyz';
import type { Entity } from 'aframe';
import { Vector3 } from 'three';
const southVector = new Vector3(0, 0, 1);
export const appendRangeCurveToScene = (
	curve: Entity,
	tilePosition: xyz,
	attackOrigin: Vector3,
	unitY: number
) => {
	const scene = document.querySelector('a-scene');
	const entity = document.createElement('a-entity');
	const targetVector = new Vector3(tilePosition.x, 0, tilePosition.z).sub(attackOrigin);
	const angle = radians2degrees(southVector.angleTo(targetVector));
	let rotation;
	if (targetVector.x < 0) {
		rotation = -angle;
	} else {
		rotation = angle;
	}

	entity.setAttribute('position', { x: attackOrigin.x, y: unitY, z: attackOrigin.z });
	curve.setAttribute('rotation', `0 ${rotation - 90} 0`);
	entity.appendChild(curve);
	scene.appendChild(entity);
};
