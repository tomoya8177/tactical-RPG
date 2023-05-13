import type { Unit } from '$lib/classes/Unit/Unit';
import type { xyz } from '$lib/types/xyz';
import { Vector3 } from 'three';
import { getAngleForRangedAttack } from '../Attack/Simulation/getAngleForRangedAttack';
import type { Equipment } from '$lib/classes/Equipment/Equipment';
import { units } from '$lib/stores/unitStore';
import type { Entity } from 'aframe';
import { createAframeEntity } from '$lib/createAframeEntity';
import { buildEntity } from './buildEntity';
type state = 'idle' | 'focus' | 'destination' | 'target';
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
	isGround: boolean;
	state: state;
	el: Entity;
	constructor(data: Tile) {
		this.id = data.id;
		this.position = data.position;
		this.type = data.type;
		this.material = data.material;
		this.isGround = true;
		this.state = 'idle';
		this.el = buildEntity(this);
	}
	changeState(state: state) {
		const reset = () => {
			this.el.querySelector('a-plane')?.setAttribute('color', 'gray');
		};
		reset();
		switch (state) {
			case 'focus':
				break;
			case 'destination':
				this.el.querySelector('a-plane')?.setAttribute('color', 'green');
				break;
			case 'target':
				this.el.querySelector('a-plane')?.setAttribute('color', 'red');
				break;
		}
		this.state = state;
	}

	get vector3(): Vector3 {
		return new Vector3(this.position.x, 0, this.position.z);
	}
	get x(): number {
		return this.position.x;
	}
	get y(): number {
		return this.position.y;
	}
	get z(): number {
		return this.position.z;
	}
	get occupiedBy(): Unit | null {
		return units.getAll().find((unit) => unit.tile?.id == this.id) || null;
	}

	ifInDirectRange(attackOrigin: Vector3, range: number) {
		const distance = attackOrigin.distanceTo(this.vector3);
		if (distance == 0) return false;
		return distance <= range;
	}
	ifInRange(attackOrigin: Vector3, weapon: Equipment, diffY: number) {
		const distance = attackOrigin.distanceTo(this.vector3);
		const res = getAngleForRangedAttack(distance, diffY, weapon.range);
		if (typeof res == 'string') return false;

		return true;
	}
}
