import { STAGE } from '$lib/classes/Stage/Stage';
import type { Tile } from '$lib/classes/Stage/Tiles/Tile/Tile';
import 'aframe';
import type { Entity } from 'aframe';

AFRAME.registerComponent('stage-tile-component', {
	tile: {} as Tile,

	init: function () {
		this.tile = STAGE.tiles.find((tile) => tile.id == Number(this.el.id));
		this.el.addEventListener('click', () => {
			switch (this.tile.state) {
				case 'destination':
				case 'destinationInDanger':
					if (STAGE.state != 'moving') return;
					STAGE.moveUnit(Number(this.el.id));
					break;
			}
		});
	}
});
