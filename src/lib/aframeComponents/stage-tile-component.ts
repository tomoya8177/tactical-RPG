import { STAGE } from '$lib/classes/Stage/Stage';
import 'aframe';
import type { Entity } from 'aframe';
AFRAME.registerComponent('stage-tile-component', {
	init: function () {
		this.el.querySelectorAll('.highlight').forEach((el) => {
			el.addEventListener('click', () => {
				if (el.getAttribute('visible') == 'false') return;
				STAGE.moveUnit(Number(this.el.id));
			});
		});
	}
});
