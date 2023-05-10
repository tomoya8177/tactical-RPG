import 'aframe';
import type { Entity } from 'aframe';
import { Vector3 } from 'three';
AFRAME.registerComponent('look-at-camera', {
	tick: function () {
		const camera = document.getElementById('camera') as Entity;
		if (!camera) return;
		const worldPos = new Vector3();
		worldPos.setFromMatrixPosition(camera.object3D.matrixWorld);
		this.el.object3D.lookAt(worldPos);
	}
});
