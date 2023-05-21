import { systemConfig } from '$lib/systemConfig';
import type { xyz } from '$lib/types/xyz';
import type { Entity } from 'aframe';
import type { Actor } from '../../../Actor/Actor';
import type { direction } from '$lib/types/direction';
import { showDecimal } from '$lib/Maths/showDecimal';
import { createAframeEntity } from '$lib/createAframeEntity';
import { lifeBar, updateLifeBar } from './lifeBar';
import { triangles } from './triangles';
import type { Tile } from '../../Tiles/Tile/Tile';
import { Vector3 } from 'three';
import type { Equipment } from '../../../Equipment/Equipment';
import { buildEntity } from './buildEntity';
import { TURN } from '../../../Turn/Turn';
import { inTurnIndicator } from './inTurnIndicator';
import { roll3d6 } from '$lib/Maths/dice3d6';
import type { unitStatusSlugs, unitStatusType } from '$lib/types/unitStatus';
import { getUnitStatusObejct } from '$lib/presets/unitStatus';
import { Navigation } from './Navigation/Navigation';
import type { parryInstance } from '$lib/types/parryInstance';
export type unitState = 'idle' | 'target' | 'focused' | 'directing' | 'inTurn';
export class Unit {
	id: number;
	state: unitState;
	type: 'actor' | null;
	actor: Actor;
	tile: Tile;
	position: xyz;
	direction: direction;
	currentWaitTurn: number;
	taskPoint: number;
	currentTaskPoint: number;
	consumedMovementPoint: number;
	navigation: Navigation;
	lifeBars: {
		main: Entity | null;
		life: Entity | null;
		grey: Entity | null;
	} = {
		main: null,
		life: null,
		grey: null
	};

	el: Entity;
	constructor(id: number, type: 'actor' | null = null, actor: Actor, tile: Tile) {
		this.id = id;
		this.state = 'idle';
		this.type = type == null ? 'actor' : type;
		this.actor = actor;
		this.actor.setUnit(this);
		this.tile = tile;
		this.position = tile.position;
		this.direction = type == null ? 'S' : 'S';
		this.currentWaitTurn = this.waitTurn;
		this.taskPoint = systemConfig.defaultTaskPoint;
		this.currentTaskPoint = systemConfig.defaultTaskPoint;
		this.consumedMovementPoint = 0;
		this.navigation = new Navigation(this);
		this.el = buildEntity(this);
		this.lifeBars = {
			main: null,
			life: null,
			grey: null
		};
		[this.lifeBars.main, this.lifeBars.life, this.lifeBars.grey] = lifeBar();
		this.el.appendChild(this.lifeBars.main);

		const scene = document.querySelector('a-scene');
		scene?.appendChild(this.el);
	}

	get speed(): number {
		if (!this.actor) return 0;
		// if actor's HT - damage is less than 3, then your speed is half.
		let movement =
			(this.actor.DX + this.actor.HT - this.actor.damage / 3) / 2 -
			(this.actor.equipments.totalWeight - 10) / this.actor.ST;
		return Math.max(0, movement);
	}

	get movement(): number {
		return this.speed - this.consumedMovementPoint;
	}
	get dodge(): number {
		if (this.currentTaskPoint < systemConfig.taskPointDodge) return 0;
		if (!this.actor) return 0;

		return Math.max((this.DX + this.HT) / 4, this.DX / 2);
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
	get ST(): number {
		return this.actor.ST + this.tile?.material.ST;
	}
	get DX(): number {
		return this.actor.DX + this.tile?.material.DX;
	}
	get HT(): number {
		return this.actor.HT;
	}
	get vector3(): Vector3 {
		return new Vector3(this.x, 0, this.z);
	}

	get directionVector(): Vector3 {
		switch (this.direction) {
			case 'N':
				return new Vector3(0, 0, -1);
			case 'S':
				return new Vector3(0, 0, 1);
			case 'E':
				return new Vector3(1, 0, 0);
			case 'W':
				return new Vector3(-1, 0, 0);
			default:
				return new Vector3(0, 0, 0);
		}
	}
	giveDamage(damage: number): void {
		if (!this.actor) return;

		this.actor.damage += damage;
		//	this.updateLifeBar();
	}
	promptMessage(message: string): void {
		const resultText = createAframeEntity('a-text', {
			'look-at-camera': '',
			position: '0 2.2 0',
			align: 'center',
			value: message,
			font: systemConfig.popUpFont
		});
		this.el.appendChild(resultText);
		setTimeout(() => {
			this.el.removeChild(resultText);
		}, 2000);
	}
	promptResult(message: string): void {
		this.promptMessage(message);
	}
	promptDamage(damage: number): void {
		this.promptMessage((showDecimal(damage, 1) * 10).toString());
	}
	updateLifeBar(): void {
		updateLifeBar(this);
	}
	get waitTurn(): number {
		return (this.actor.equipments.totalWeight + 100) / (this.actor.DX + this.actor.IQ);
	}
	getLv(skillName: string): number {
		const skill = this.actor?.skills.find((skill) => skill.name == skillName);
		if (!skill) return 6;

		return skill.type == 'physical' ? skill.level + this.tile?.material.DX : skill.level;
	}
	resetState(): void {
		const triangles = this.el.querySelector('.triangles');
		if (triangles) {
			this.el.removeChild(triangles);
		}
		const inTurnIndicator = this.el.querySelector('.in-turn-indicator');
		if (inTurnIndicator) {
			this.el.removeChild(inTurnIndicator);
		}
	}
	changeState(state: unitState) {
		this.resetState();
		switch (state) {
			case 'idle':
				//this.resetState()
				if (TURN.unit?.id == this.id) {
					this.changeState('inTurn');
				}
				break;
			case 'directing':
				this.el.appendChild(triangles());
				break;
			case 'inTurn':
				this.el.appendChild(inTurnIndicator());
				if (this.checkUnconscious()) {
					this.actor.statuses.add('unconscious');
					this.updateLifeBar();
					TURN.end();
				}

				break;
		}
		this.state = state;
	}

	consumeTaskPoint(value: number) {
		this.currentTaskPoint -= value;
	}
	resetTaskPoint() {
		this.currentTaskPoint = this.taskPoint;
	}
	hasStatus(statusSlug: unitStatusSlugs): boolean {
		return this.actor.statuses.some((status) => status.slug == statusSlug);
	}
	isUnconscious(): boolean {
		return this.actor.statuses.some((status) => status.slug == 'unconscious');
	}
	isDown(): boolean {
		return this.actor.statuses.some((status) => status.slug == 'down');
	}
	consumeWaitTurn(waitTurnToConsume: number): void {
		if (this.actor.statuses.has('bleeding')) {
			this.actor.damage += 0.2 * waitTurnToConsume;
			this.updateLifeBar();
		}
		if (this.isUnconscious()) return;
		this.currentWaitTurn = this.currentWaitTurn - waitTurnToConsume;
		console.log(this.actor?.name, ' his current wait turn is ', this.currentWaitTurn);
		if (this.currentWaitTurn < this.waitTurn / 2) {
			this.actor.statuses.remove('down');
		}
	}
	resetWaitTurn(): void {
		this.currentWaitTurn = this.waitTurn;
	}
	get life(): number {
		if (!this.actor) return 0;
		return this.actor.HT * 3 - this.actor.damage;
	}
	get maxLife(): number {
		if (!this.actor) return 0;
		return this.actor.HT * 3;
	}

	checkUnconscious(): boolean {
		if (this.actor.statuses.has('unconscious')) {
			return true;
		}
		if (1.5 * this.actor.HT - this.actor.damage <= 0) {
			if (roll3d6(this.actor.HT).result) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	checkDead(): boolean {
		if (this.life < 0) {
			return true;
		} else {
			return false;
		}
	}
}
