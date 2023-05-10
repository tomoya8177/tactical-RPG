import { systemConfig } from '$lib/systemConfig';
import type { path, step } from '$lib/types/path';
import type { Entity } from 'aframe';

export const moveToTile = async (path: path, unitEl: Entity) => {
	const animationCount = path.steps.length;
	path.steps.forEach((step: step, i) => {
		let property, from, to;
		switch (step.movement) {
			case 'MF':
				property = 'position';
				from = `${step.startPosition?.x} ${step.startPosition?.y} ${step.startPosition?.z}`;
				to = `${step.endPosition?.x} ${step.endPosition?.y} ${step.endPosition?.z}`;

				break;
			case 'TR':
				property = 'rotation';

				from = `0 ${step.startYRotation} 0`;
				to = `0 ${step.endYRotation} 0`;
				break;
			case 'TL':
				property = 'rotation';

				from = `0 ${step.startYRotation} 0`;
				to = `0 ${step.endYRotation} 0`;

				break;
		}
		unitEl?.setAttribute(
			'animation__' + i,
			`
				property: ${property};
				dur: ${systemConfig.moveAnimationSeconds};
				loop:0;

				easing: linear;

				from:${from};
				to:${to};
				delay: ${systemConfig.moveAnimationSeconds * i};
				`
		);
	});
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, systemConfig.moveAnimationSeconds * animationCount);
	});
};
