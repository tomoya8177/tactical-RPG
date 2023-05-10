import { CAMERA } from '$lib/classes/Camera/Camera';
import 'aframe';
import type { Entity } from 'aframe';
const speed = 0.2;
const decelerationFactor = 0.9;
const minimumVelocity = 0.005;
AFRAME.registerComponent('tactics-navigation', {
	velocityX: 0,
	velocityY: 0,
	velocityZ: 0,
	rig: null as Entity | null,
	init: function () {
		this.velocityX = 0;
		this.velocityY = 0;
		this.velocityZ = 0;
		this.rig = document.getElementById('rig') as Entity;
		window.addEventListener('keydown', (e) => {
			this.onKeyDown(e);
		});
	},
	onKeyDown: function (e: KeyboardEvent) {
		switch (e.code) {
			case 'KeyD':
				switch (CAMERA.corner) {
					case 'SW':
						this.velocityX = speed;
						break;
					case 'SE':
						this.velocityZ = speed * -1;
						break;
					case 'NE':
						this.velocityX = speed * -1;
						break;
					case 'NW':
						this.velocityZ = speed;
						break;
				}
				break;
			case 'KeyA':
				switch (CAMERA.corner) {
					case 'SW':
						this.velocityX = speed * -1;
						break;
					case 'SE':
						this.velocityZ = speed;
						break;
					case 'NE':
						this.velocityX = speed;
						break;
					case 'NW':
						this.velocityZ = speed * -1;
						break;
				}
				break;
			case 'KeyW':
				switch (CAMERA.corner) {
					case 'SW':
						this.velocityZ = speed * -1;
						break;
					case 'SE':
						this.velocityX = speed * -1;
						break;
					case 'NE':
						this.velocityZ = speed;
						break;
					case 'NW':
						this.velocityX = speed;
						break;
				}
				break;
			case 'KeyS':
				switch (CAMERA.corner) {
					case 'SW':
						this.velocityZ = speed;
						break;
					case 'SE':
						this.velocityX = speed;
						break;
					case 'NE':
						this.velocityZ = speed * -1;
						break;
					case 'NW':
						this.velocityX = speed * -1;
						break;
				}
				break;
			case 'KeyQ':
				this.velocityY = speed;
				break;
			case 'KeyE':
				this.velocityY = speed * -1;
				break;
			case 'KeyR':
				CAMERA.rotateCamera('left');
				break;
			case 'KeyT':
				CAMERA.rotateCamera('right');
				break;
		}
	},
	tick: function () {
		if (!this.rig) return;
		this.rig.object3D.position.x += this.velocityX;
		this.rig.object3D.position.y += this.velocityY;
		this.rig.object3D.position.z += this.velocityZ;
		this.velocityX *= decelerationFactor;
		this.velocityY *= decelerationFactor;
		this.velocityZ *= decelerationFactor;
		if (this.velocityX < minimumVelocity && this.velocityX > minimumVelocity * -1)
			this.velocityX = 0;
		if (this.velocityY < minimumVelocity && this.velocityY > minimumVelocity * -1)
			this.velocityY = 0;
		if (this.velocityZ < minimumVelocity && this.velocityZ > minimumVelocity * -1)
			this.velocityZ = 0;
	}
});
