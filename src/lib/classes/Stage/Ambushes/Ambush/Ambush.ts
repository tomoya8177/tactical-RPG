import { findTargetTiles } from '$lib/classes/Attack/findTargetTiles';
import type { Equipment } from '$lib/classes/Equipment/Equipment';
import { STAGE } from '../../Stage';
import type { Unit } from '../../Units/Unit/Unit';

export class Ambush {
	attacker: Unit | null = null;
	weapon: Equipment | null = null;
	state: 'pending' | 'confirmed' = 'pending';
	init(unit: Unit) {
		this.attacker = unit;
		console.log('ambush initialized', this);
		return this;
	}
	setWeapon(weapon: Equipment) {
		this.weapon = weapon;
	}
	highlightRange() {
		if (!this.attacker || !this.weapon) throw new Error('attacker or weapon is null');
		findTargetTiles(this.attacker, this.weapon, STAGE.tiles).forEach((tile) => {
			tile.changeState('target');
		});
	}
	confirm() {
		this.state = 'confirmed';
	}
	cancel() {
		this.state = 'pending';
	}
}
