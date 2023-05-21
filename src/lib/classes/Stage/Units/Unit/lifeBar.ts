import { createAframeEntity } from '$lib/createAframeEntity';
import type { Unit } from './Unit';

const height = 0.05;
const width = 1;
const duration = 500;
export const lifeBar = () => {
	const lifeBarGrey = createAframeEntity('a-plane', {
		width: 0,
		height: height,
		color: 'grey',
		shader: 'flat',
		position: '0.5 0 0'
	});
	const lifeBarLife = createAframeEntity('a-plane', {
		width: 1,
		height: height,
		color: 'lightgreen',
		shader: 'flat',
		position: '0 0 0'
	});
	const lifeBar = createAframeEntity('a-entity', {
		position: '0 2 0',
		'look-at-camera': '',
		scale: `${width} 1 1`
	});
	lifeBar.appendChild(lifeBarGrey);
	lifeBar.appendChild(lifeBarLife);
	lifeBarGrey.classList.add('life-bar-grey');
	lifeBarLife.classList.add('life-bar-life');
	return [lifeBar, lifeBarLife, lifeBarGrey];
};
export const updateLifeBar = (unit: Unit) => {
	if (!unit.lifeBars.life || !unit.lifeBars.grey || !unit.actor) return;
	const lifeWidth = unit.life / unit.maxLife;
	const greyWidth = unit.actor.damage / unit.maxLife;
	unit.lifeBars.life.setAttribute(
		'animation__1',
		`
			property: width;
			to: ${lifeWidth};
			dur:${duration}
			`
	);
	unit.lifeBars.life.setAttribute(
		'animation__2',
		`
			property: position;
			to: -${greyWidth / 2} 0 0;
			dur:${duration}`
	);
	unit.lifeBars.grey.setAttribute(
		'animation__1',
		`
			property: width;
			to: ${greyWidth};
			dur:${duration}
			`
	);
	unit.lifeBars.grey.setAttribute(
		'animation__2',
		`
			property: position;
			to:${lifeWidth / 2} 0 0;
				dur:${duration};`
	);
	let newColor = 'lightgreen';
	if (unit.hasStatus('down')) newColor = 'orange';
	if (unit.hasStatus('unconscious')) newColor = 'red';
	setTimeout(() => {
		console.log('updating color ', newColor);
		unit.lifeBars.life?.setAttribute('color', newColor);
	}, duration / 2);
};
