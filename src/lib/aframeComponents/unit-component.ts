import { ATTACK } from '$lib/classes/Attack/Attack';
import { STAGE } from '$lib/classes/Stage/Stage';
import { TURN } from '$lib/classes/Turn/Turn';
import type { Unit } from '$lib/classes/Unit/Unit';
import { uiController } from '$lib/stores/uiControllerStore';
import { units } from '$lib/stores/unitStore';
import type { direction } from '$lib/types/direction';
import 'aframe';
import type { Entity } from 'aframe';
declare module 'aframe' {
	interface EntityEventMap {
		animationcomplete: CustomEvent;
	}
}
AFRAME.registerComponent('unit-component', {
	unit: null as Unit | null,
	schema: {
		tiles: { type: 'array', default: [] }
	},
	init: function () {
		this.unit = units.getOne(Number(this.el.id));

		units.subscribe((array) => {
			this.unit = units.getOne(Number(this.el.id));
		});
		this.el.addEventListener('click', async (event) => {
			if (!this.unit) return;
			console.log('clicked', this.unit, event.target, this.data.state);
			switch (this.unit.state) {
				case 'idle':
					STAGE.clearTileHighlights();
					if (this.unit.id != TURN.unit?.id) {
						uiController.hide('actionMenu');
					}
					uiController.hide('actorData');
					await STAGE.focusOnUnit(this.unit);
					if (this.unit.id == TURN.unit?.id) {
						uiController.show('actionMenu');
					}
					uiController.show('actorData');
					break;
				case 'target': {
					STAGE.clearTileHighlights();
					ATTACK.setFoe(this.unit);

					break;
				}
				case 'directing':
					{
						console.log(event.target);
						console.log('triangle clicked', this.el);
						if (!event.target) break;
						const yRotation = this.el.getAttribute('rotation').y;
						const target = event.target as Entity;

						const direction = target.classList[0] as direction;
						if (!direction) {
							break;
						}
						await this.unit.turnToDirection(yRotation, direction);
						this.unit.changeState('idle');
						uiController.show('actionMenu');
					}
					break;
			}
		});

		this.el.addEventListener('animationcomplete', (event) => {
			if (!this.unit) return;

			this.el.removeAttribute(event.detail.name);
		});
	}
});
