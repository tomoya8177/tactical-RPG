import { addressAttackResult } from '$lib/classes/Attack/addressAttackResult';
import { attackTarget } from '$lib/classes/Attack/attackTarget';
import { findTargetTiles } from '$lib/classes/Attack/findTargetTiles';
import { getAttackTime } from '$lib/classes/Attack/getAttackTime';
import { tileInFront } from '$lib/classes/Attack/tileInFront';
import type { Equipment } from '$lib/classes/Equipment/Equipment';
import type { attackResult } from '$lib/types/attackResult';
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
	get attackTime(): number {
		if (!this.attacker || !this.foe || !this.weapon) return 1;
		return getAttackTime(this.attacker, this.foe, this.weapon);
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

		switch (this.weapon.rangeType) {
			case 'direct':
				return (
					tile.ifInDirectRange(this.attacker, this.weapon.length) &&
					tileInFront(this.attacker, tile)
				);
			case 'ranged': {
				return tile.ifInRange(this.attacker, this.weapon) && tileInFront(this.attacker, tile);
			}
		}
	}
	attackTarget(foe: Unit): attackResult {
		if (!this.attacker || !this.weapon) throw new Error('undefined attacker');
		this.foe = foe;

		return attackTarget(this.attacker, this.foe, this.weapon, this.attackTime);
	}
	addressAttackResult(result: attackResult) {
		if (!this.attacker || !this.foe || !this.weapon) throw new Error('attacker or weapon is null');
		addressAttackResult(this.attacker, this.foe, this.weapon, result);
	}
	isActiveAndTileInRader(tile: Tile): boolean {
		if (this.state != 'confirmed') return false;
		if (!this.ifTileInRader(tile)) return false;
		if (!this.attacker) return false;
		if (!this.weapon) return false;
		if (this.attacker.TP.current < this.weapon.attackCost) return false;
		return true;
	}
}
