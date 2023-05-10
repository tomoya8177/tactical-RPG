import type { xyz } from '$lib/types/xyz';
import type { Entity } from 'aframe';

class Camera {
	position: xyz;
	el: Entity | null;
	offsetter: Entity | null;
	corner: 'SW' | 'SE' | 'NW' | 'NE';
	constructor() {
		this.position = { x: 0, y: 0, z: 0 };
		this.el = document.getElementById('rig') as Entity;
		this.offsetter = this.el?.querySelector('.offsetter') || null;
		this.corner = 'SW';
	}
	init(): void {
		this.el = document.getElementById('rig') as Entity;
		if (!this.el) return;
		this.offsetter = this.el.querySelector('.offsetter');
	}
	move(toPosition: xyz | null): Promise<boolean> {
		if (!toPosition || !this.el) return Promise.resolve(false);
		this.el.setAttribute(
			'animation',
			`
			property: position;
			from: ${this.el.getAttribute('position').x} ${this.el.getAttribute('position').y} ${
				this.el.getAttribute('position').z
			};
			to:${toPosition.x} ${toPosition.y} ${toPosition.z};
			dur:500,
			loop:1
		`
		);
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 500);
		});
	}
	rotateCamera(direction: 'left' | 'right'): void {
		if (!this.offsetter) return;
		const currentYRotation = this.offsetter.getAttribute('rotation').y;
		const newYRotation = direction == 'right' ? currentYRotation + 90 : currentYRotation - 90;
		this.offsetter.setAttribute(
			'animation',
			`
			property: rotation;
			from: 0 ${currentYRotation} 0;
			to: 0 ${newYRotation} 0;
			dur:500
			`
		);
		if (direction == 'right') {
			switch (this.corner) {
				case 'SW':
					this.corner = 'SE';
					break;
				case 'SE':
					this.corner = 'NE';
					newYRotation;
					break;
				case 'NE':
					this.corner = 'NW';
					break;
				case 'NW':
					this.corner = 'SW';
					break;
			}
		} else {
			switch (this.corner) {
				case 'SW':
					this.corner = 'NW';
					break;
				case 'SE':
					this.corner = 'SW';
					break;
				case 'NE':
					this.corner = 'SE';
					break;
				case 'NW':
					this.corner = 'NE';
					break;
			}
		}
	}
}

export const CAMERA = new Camera();
