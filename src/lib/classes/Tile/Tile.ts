import type { Unit } from '$lib/classes/Unit/Unit';
import type { xyz } from '$lib/types/xyz';
import { Vector3 } from 'three';
import { getAngleForRangedAttack } from '../Attack/Simulation/getAngleForRangedAttack';
import type { Equipment } from '$lib/classes/Equipment/Equipment';
export type tileMaterial =
	| 'dirt'
	| 'grass'
	| 'stone'
	| 'wood'
	| 'water'
	| 'lava'
	| 'sand'
	| 'snow'
	| 'ice'
	| 'metal'
	| 'air';
export class Tile {
	id: number | '';
	position: xyz;
	type: 'walkable' | 'unwalkable';
	material: tileMaterial;
	occupiedBy: Unit | null;
	isGround: boolean;
	constructor(data: Tile) {
		this.id = data.id;
		this.position = data.position;
		this.type = data.type;
		this.material = data.material;
		this.occupiedBy = null;
		this.isGround = true;
	}
	hideAttackTarget(): void {
		const el = document.getElementById(this.id.toString());
		el?.querySelectorAll('.attack-target')?.forEach((el) => {
			el.setAttribute('visible', false.toString());
		});
	}
	hideHighlighted(): void {
		const el = document.getElementById(this.id.toString());
		el?.querySelectorAll('.highlight')?.forEach((el) => {
			el.setAttribute('visible', 'false');
		});
	}
	highlight() {
		const el = document.getElementById(this.id.toString());
		el?.querySelectorAll('.highlight')?.forEach((el) => {
			el.setAttribute('visible', 'true');
		});
	}
	highlightAttackTarget() {
		const el = document.getElementById(this.id.toString());
		el?.querySelectorAll('.attack-target')?.forEach((el) => {
			el.setAttribute('visible', 'true');
		});
	}
	ifTileInDirectRange(attackOrigin: Vector3, range: number) {
		const attackTarget = new Vector3(this.position.x, 0, this.position.z);
		const distance = attackOrigin.distanceTo(attackTarget);
		if (distance == 0) return false;
		return distance <= range;
	}
	ifTileInRange(attackOrigin: Vector3, tile: Tile, weapon: Equipment, diffY: number) {
		const distance = attackOrigin.distanceTo(new Vector3(tile.position.x, 0, tile.position.z));
		const res = getAngleForRangedAttack(distance, diffY, weapon.range);
		if (typeof res == 'string') return false;
		// now check if the attack hits the ground
		for (let i of [0, 1]) {
			// const curve = drawCurveForRangedAttack(res[i], weapon.range);
			// const y = tile.position.y - diffY;
			// appendRangeCurveToScene(curve, tile.position, attackOrigin, y);
		}
		return true;
	}
}
