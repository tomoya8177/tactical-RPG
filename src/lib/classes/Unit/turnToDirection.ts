import { systemConfig } from '$lib/systemConfig';
import type { direction } from '$lib/types/direction';
import type { Entity } from 'aframe';
const toY = (direction: direction, yRotation: number) => {
	switch (direction) {
		case 'S':
			return yRotation;

		case 'N':
			return yRotation + 180;

		case 'W':
			return yRotation + 90;

		case 'E':
			return yRotation - 90;
	}
};
const finalDirection = (to: number): direction => {
	switch (to % 360) {
		case 0:
			return 'S';

		case 90:
			return 'E';

		case 180:
			return 'N';

		case 270:
			return 'W';
	}
	return 'S';
};
export const turnToDirection = (yRotation: number, direction: direction, unitEl: Entity) => {
	if (yRotation < 0) yRotation = 360 + yRotation;
	const to = toY(direction, yRotation);

	unitEl.setAttribute(
		'animation',
		`property:rotation;
			 to: 0 ${to} 0;
			  dur:${systemConfig.moveAnimationSeconds};loop:1;delay:0`
	);
	return finalDirection(to);
};
