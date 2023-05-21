import { createAframeEntity } from './createAframeEntity';

export const drawRectangular = (width: number, height: number, color: string) => {
	const lines = createAframeEntity('a-entity');
	const topLine = createAframeEntity('a-entity', {
		line: `
		start: -${width / 2} ${height / 2} 0;
		end: ${width / 2} ${height / 2} 0;
		color: ${color};
		`
	});
	const bottomLine = createAframeEntity('a-entity', {
		line: `
		start: -${width / 2} -${height / 2} 0;
		end: ${width / 2} -${height / 2} 0;
		color: ${color};
		`
	});
	const leftLine = createAframeEntity('a-entity', {
		line: `
		start: -${width / 2} -${height / 2} 0;
		end: -${width / 2} ${height / 2} 0;
		color: ${color};
		`
	});
	const rightLine = createAframeEntity('a-entity', {
		line: `
		start: ${width / 2} -${height / 2} 0;
		end: ${width / 2} ${height / 2} 0;
		color: ${color};
		`
	});
	//lines.classList.add('unclickable');
	topLine.classList.add('unclickable');
	bottomLine.classList.add('unclickable');
	leftLine.classList.add('unclickable');
	rightLine.classList.add('unclickable');

	lines.appendChild(bottomLine);
	lines.appendChild(leftLine);
	lines.appendChild(rightLine);
	lines.appendChild(topLine);
	return lines;
};
