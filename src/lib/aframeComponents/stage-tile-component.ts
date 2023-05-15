import { STAGE } from '$lib/classes/Stage/Stage';
import { Tile } from '$lib/classes/Stage/Tiles/Tile/Tile';
import 'aframe';
import type { Entity } from 'aframe';
AFRAME.registerComponent('stage-tile-component', {
	init: function () {
		this.tile = STAGE.tiles.find((tile) => tile.id == Number(this.el.id));
		this.el.addEventListener('click', () => {
			switch (this.tile.state) {
				case 'destination':
					if (STAGE.state != 'moving') return;
					STAGE.moveUnit(Number(this.el.id));
					break;
			}
		});
	}
});
