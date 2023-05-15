import { createAframeEntity } from '$lib/createAframeEntity';

export const triangles = () => {
	const triangles = createAframeEntity('a-entity');

	triangles.classList.add('triangles');
	for (let i = 0; i < 4; i++) {
		let direction = '';
		switch (i) {
			case 0:
				direction = 'N';
				break;
			case 1:
				direction = 'S';
				break;
			case 2:
				direction = 'W';
				break;
			case 3:
				direction = 'E';
				break;
		}
		const entity = createAframeEntity('a-entity', {
			rotation: `0 ${direction == 'S' ? 180 : ''}${direction == 'N' ? 0 : ''}${
				direction == 'W' ? 270 : ''
			}${direction == 'E' ? 90 : ''} 0`,
			position: '0 1.75 0'
		});

		const triangle = createAframeEntity('a-triangle', {
			scale: '0.5 0.3 1',
			rotation: '-90 0 0',
			position: '0 0 -0.8'
		});
		triangle.classList.add(direction);
		entity.appendChild(triangle);
		triangles.appendChild(entity);
	}
	return triangles;
};
