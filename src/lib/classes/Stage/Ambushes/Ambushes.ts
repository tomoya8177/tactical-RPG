import { TURN } from '$lib/classes/Turn/Turn';
import type { Tile } from '../Tiles/Tile/Tile';
import type { Unit } from '../Units/Unit/Unit';
import type { Ambush } from './Ambush/Ambush';

export class Ambushes extends Array {
	of(unit: Unit) {
		console.log(this);
		return this.find((ambush) => ambush.attacker.id == unit.id);
	}
	clearFor(unit: Unit) {
		this.forEach((ambush) => {
			if (ambush.attacker.id == unit.id) {
				this.splice(this.indexOf(ambush), 1);
			}
		});
	}
	ifTileInSomeRader(tile: Tile): Ambush[] {
		const ambushes: Ambush[] = [];
		this.forEach((ambush) => {
			if (!ambush.isActiveAndTileInRader(tile)) return;
			const ambushIsMine = ambush.attacker.id == TURN.unit.id;
			const iAmInTheRaderAlready = ambush.ifTileInRader(TURN.unit.tile);
			if (!ambushIsMine && !iAmInTheRaderAlready) {
				ambushes.push(ambush);
			}
		});
		return ambushes;
	}
}
