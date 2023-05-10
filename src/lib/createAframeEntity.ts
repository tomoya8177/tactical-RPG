import type { Entity } from 'aframe';
import type { xyz } from './types/xyz';

export const createAframeEntity = (
	tag: string,
	attributes: { [key: string]: string | number | xyz } = {}
) => {
	const element = document.createElement(tag) as Entity;
	Object.entries(attributes).forEach(([key, value]) => {
		element.setAttribute(key, value);
	});
	return element;
};
