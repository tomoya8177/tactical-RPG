import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
import type { xyz } from '$lib/types/xyz';
import { Box3, BufferGeometry, Line, Line3, Vector3 } from 'three';
import { getAngleForRangedAttack } from '../../../Attack/Simulation/getAngleForRangedAttack';
import type { Equipment } from '$lib/classes/Equipment/Equipment';
import type { Entity } from 'aframe';
import { createAframeEntity } from '$lib/createAframeEntity';
import { buildEntity } from './buildEntity';
import { STAGE } from '../../Stage';
type state = 'idle' | 'focus' | 'destination' | 'destinationInDanger' | 'target';

export class Tile {
	id: number | '';
	position: xyz;
	type: 'walkable' | 'unwalkable';
	material: tileMaterial;
	isGround: boolean;
	state: state;
	el: Entity;
	constructor(data) {
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
			this.el.querySelector('a-plane')?.setAttribute('color', this.material.color);
		};
		reset();
		switch (state) {
			case 'focus':
				break;
			case 'destination':
				this.el.querySelector('a-plane')?.setAttribute('color', 'green');
				break;
			case 'destinationInDanger':
				this.el.querySelector('a-plane')?.setAttribute('color', 'pink');
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
		return STAGE.units.find((unit) => unit.tile?.id == this.id) || null;
	}

	ifInDirectRange(attacker: Unit, range: number) {
		const distance = attacker.vector3.distanceTo(this.vector3);
		if (distance == 0) return false;
		return distance <= range;
	}
	ifInRange(attacker: Unit, weapon: Equipment) {
		if (!this.attackerCanSeeMe(attacker)) return false;
		const distance = attacker.vector3.distanceTo(this.vector3);
		const res = getAngleForRangedAttack(distance, this.y - attacker.y, weapon.range);
		if (typeof res == 'string') return false;

		return true;
	}
	attackerCanSeeMe(attacker: Unit): boolean {
		const start = new Vector3(attacker.x, attacker.y + 1.5, attacker.z);
		const end = new Vector3(this.x, this.y + 1.5, this.z);
		const fps = 240;
		let intersects = false;
		for (let i = 0; i < fps; i++) {
			const startX = start.x + (i * (end.x - start.x)) / fps;
			const startY = start.y + (i * (end.y - start.y)) / fps;
			const startZ = start.z + (i * (end.z - start.z)) / fps;
			const endX = start.x + ((i + 1) * (end.x - start.x)) / fps;
			const endY = start.y + ((i + 1) * (end.y - start.y)) / fps;
			const endZ = start.z + ((i + 1) * (end.z - start.z)) / fps;
			const lineStart = new Vector3(startX, startY, startZ);
			const lineEnd = new Vector3(endX, endY, endZ);
			const testBox = new Box3(lineStart, lineEnd);
			intersects = STAGE.structures.some((box) => {
				return box.intersectsBox(testBox);
			});
			if (intersects) i = fps;
		}
		return !intersects;
	}
	movementCost(point: number): number {
		return point * (1 + (this.material.move * -1) / 10);
	}
}
