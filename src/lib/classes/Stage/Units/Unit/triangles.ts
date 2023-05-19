import { createAframeEntity } from '$lib/createAframeEntity';

export const triangles = () => {
	const triangles = createAframeEntity('a-entity');

	triangles.classList.add('triangles');
	for (let i = 0; i < 4; i++) {
		let direction = '';
		switch (i) {
			case 0:
				direction = 'Front';
				break;
			case 1:
				direction = 'Left';
				break;
			case 2:
				direction = 'Right';
				break;
			case 3:
				direction = 'Back';
				break;
		}
		const entity = createAframeEntity('a-entity', {
			rotation: `0 ${direction == 'Front' ? 180 : ''}${direction == 'Back' ? 0 : ''}${
				direction == 'Left' ? 270 : ''
			}${direction == 'Right' ? 90 : ''} 0`,
			position: '0 1.75 0'
		});

		const triangle = createAframeEntity('a-triangle', {
			color: `${direction == 'Back' ? 'blue' : ''}${direction == 'Front' ? 'red' : ''}`,
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
