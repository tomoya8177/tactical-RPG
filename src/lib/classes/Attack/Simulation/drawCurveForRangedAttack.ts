import type { Equipment } from '$lib/classes/Equipment/Equipment';
import { createAframeEntity } from '$lib/createAframeEntity';
import { systemConfig } from '$lib/systemConfig';
import type { Entity } from 'aframe';

export const drawCurveForRangedAttack = (
	distance: number,
	angle: number,
	weapon: Equipment,
	ticksPerSecond: number
): Entity => {
	const curve = createAframeEntity('a-entity', {
		visible: 'false'
	});

	const speedX = (weapon.range * Math.cos(angle)) / ticksPerSecond;
	let speedY = (weapon.range * Math.sin(angle)) / ticksPerSecond;
	let x = speedX;
	let y = speedY;
	let prevX = 0;
	let prevY = 0;
	while (y > -45 && y < 45 && distance > x) {
		const line = createAframeEntity('a-entity', {
			line: `
      start: ${prevX} ${prevY} 0;
      end: ${x} ${y} 0;
      color: #000;
      `
		});
		curve.appendChild(line);

		prevX = x;
		prevY = y;
		speedY -= systemConfig.gravity / (ticksPerSecond * ticksPerSecond);
		x += speedX;
		y += speedY;
	}

	return curve;
};
