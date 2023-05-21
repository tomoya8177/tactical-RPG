import { addressAttackResult } from '$lib/classes/Attack/addressAttackResult';
import type { path, step } from '$lib/classes/Pathfinder/Pathfinder';
import { systemConfig } from '$lib/systemConfig';
import type { Entity } from 'aframe';

export const moveToTile = async (path: path, unitEl: Entity) => {
	const setSingleAnimation = (
		property: string,
		from: string,
		to: string,
		i: number,
		dur: number = systemConfig.moveAnimationSeconds
	): void => {
		unitEl?.setAttribute(
			'animation__' + i,
			`
				property: ${property};
				dur: ${dur};
				easing: linear;
				from:${from};
				to:${to};
				delay: ${ellapsedTime};
				`
		);
	};

	const animationCount = path.steps.length;
	let ellapsedTime = 0;
	path.steps.forEach((step: step, i) => {
		//address the result of the ambush attacks if there's any

		switch (step.movement) {
			case 'MF':
				//horizontal movement
				const property = 'position';
				const from = `${step.startPosition.x} ${step.startPosition.y} ${step.startPosition.z}`;
				const to = `${step.endPosition.x} ${step.endPosition.y} ${step.endPosition.z}`;

				if (step.startPosition.y > step.endPosition.y) {
					//going down
					//move horizontally first
					const thisTo = `${step.endPosition.x} ${step.startPosition.y} ${step.endPosition.z}`;
					setSingleAnimation(property, from, thisTo, Number('10' + i));
					ellapsedTime += systemConfig.moveAnimationSeconds;
					//then move vertically
					const thisFrom = `${step.endPosition.x} ${step.startPosition.y} ${step.endPosition.z}`;
					const dur = systemConfig.moveAnimationSeconds / 2;
					setSingleAnimation(property, thisFrom, to, Number('11' + i), dur);
					ellapsedTime += dur;
				} else {
					//climbing up
					//move vertically first
					const thisTo = `${step.startPosition.x} ${step.endPosition.y} ${step.startPosition.z}`;
					const dur = systemConfig.moveAnimationSeconds / 2;
					setSingleAnimation(property, from, thisTo, Number('10' + i), dur);
					ellapsedTime += dur;
					//then move horizontally
					const thisFrom = `${step.startPosition.x} ${step.endPosition.y} ${step.startPosition.z}`;
					setSingleAnimation(property, thisFrom, to, Number('11' + i));
					ellapsedTime += systemConfig.moveAnimationSeconds;
				}

				break;
			case 'TR':
				{
					const property = 'rotation';
					const from = `0 ${step.startYRotation} 0`;
					const to = `0 ${step.endYRotation} 0`;
					setSingleAnimation(property, from, to, i);
					ellapsedTime += systemConfig.moveAnimationSeconds;
				}
				break;
			case 'TL':
				{
					const property = 'rotation';
					const from = `0 ${step.startYRotation} 0`;
					const to = `0 ${step.endYRotation} 0`;
					setSingleAnimation(property, from, to, i);
					ellapsedTime += systemConfig.moveAnimationSeconds;
				}
				break;
		}
		step.ambushes.forEach((ambushInstance) => {
			const attackResult = ambushInstance.attackResult;
			setTimeout(() => {
				ambushInstance.ambush.addressAttackResult(attackResult);
			}, ellapsedTime);
			ellapsedTime += systemConfig.moveAnimationSeconds;
		});
	});
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, ellapsedTime);
	});
};
