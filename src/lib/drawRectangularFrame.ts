import { createAframeEntity } from './createAframeEntity';
import { systemConfig } from './systemConfig';

const thickness = 0.04;
export const drawRectangularFrame = (width: number, color: string) => {
	const lines = createAframeEntity('a-entity');

	for (let i = 0; i < 4; i++) {
		const offsetter = createAframeEntity('a-entity', {
			rotation: `0 0 ${i * 90}`
		});
		const line = createAframeEntity('a-box', {
			width: width,
			height: thickness,
			depth: thickness,
			position: `0 ${width / 2 - thickness / 2} ${thickness / 2}}`,
			color: color,
			material: `emissive:${color}`
		});
		offsetter.appendChild(line);
		line.classList.add('unclickable');
		lines.appendChild(offsetter);
	}
	lines.classList.add('frame');
	return lines;
};
