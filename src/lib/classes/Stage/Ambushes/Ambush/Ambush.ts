import type { attackResult } from '$lib/classes/Attack/Attack';
import { addressAttackResult } from '$lib/classes/Attack/addressAttackResult';
import { attackTarget } from '$lib/classes/Attack/attackTarget';
import { findTargetTiles } from '$lib/classes/Attack/findTargetTiles';
import type { Equipment } from '$lib/classes/Equipment/Equipment';
import { STAGE } from '../../Stage';
import type { Tile } from '../../Tiles/Tile/Tile';
import type { Unit } from '../../Units/Unit/Unit';

export class Ambush {
	attacker: Unit | null = null;
	weapon: Equipment | null = null;
	state: 'pending' | 'confirmed' = 'pending';
	foe: Unit | null = null;
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
		console.log({ attacker: this.attacker });
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
	ifTileInRader(tile: Tile): boolean {
		if (!this.attacker || !this.weapon) throw new Error('attacker or weapon is null');
		return findTargetTiles(this.attacker, this.weapon, STAGE.tiles).includes(tile);
	}
	attackTarget(foe): attackResult {
		this.foe = foe;
		if (!this.attacker || !this.foe || !this.weapon) throw new Error('attacker or weapon is null');
		return attackTarget(this.attacker, this.foe, this.weapon);
	}
	addressAttackResult(result: attackResult) {
		if (!this.attacker || !this.foe || !this.weapon) throw new Error('attacker or weapon is null');
		addressAttackResult(this.attacker, this.foe, this.weapon, result);
	}
}
