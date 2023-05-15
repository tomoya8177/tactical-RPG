import { systemConfig } from '$lib/systemConfig';
import type { xyz } from '$lib/types/xyz';
import type { Entity } from 'aframe';
import type { Actor } from '../../../Actor/Actor';
import { moveToTile } from './moveToTile';
import { turnToDirection } from './turnToDirection';
import type { direction } from '$lib/types/direction';
import { showDecimal } from '$lib/Maths/showDecimal';
import { createAframeEntity } from '$lib/createAframeEntity';
import { lifeBar, updateLifeBar } from './lifeBar';
import { triangles } from './triangles';
import type { Tile } from '../../Tiles/Tile/Tile';
import type { path } from '../../../Pathfinder/Pathfinder';
import { STAGE } from '../../Stage';
import { Vector3 } from 'three';
import type { Equipment } from '../../../Equipment/Equipment';
import { buildEntity } from './buildEntity';
import { TURN } from '../../../Turn/Turn';
import { inTurnIndicator } from './inTurnIndicator';
export type unitState = 'idle' | 'target' | 'focused' | 'directing' | 'inTurn';
export class Unit {
	id: number;
	state: unitState;
	type: 'actor' | null;
	actor: Actor | null;
	tile: Tile | null;
	position: xyz;
	direction: direction;
	currentWaitTurn: number;
	taskPoint: number;
	currentTaskPoint: number;
	consumedMovementPoint: number;
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
	constructor(id: number, type: 'actor' | null = null, actor: Actor | null = null, tile: Tile) {
		this.id = id;
		this.state = 'idle';
		this.type = type == null ? 'actor' : type;
		this.actor = type == null ? null : actor;
		this.tile = tile;
		this.position = tile.position;
		this.direction = type == null ? 'S' : 'S';
		this.currentWaitTurn = this.waitTurn;
		this.taskPoint = systemConfig.defaultTaskPoint;
		this.currentTaskPoint = systemConfig.defaultTaskPoint;
		this.consumedMovementPoint = 0;
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
	get totalEquipmentWeight(): number {
		return (
			this.actor?.equipments
				.map((equipment) => equipment.weight)
				.reduce((weight, currentWeight) => weight + currentWeight, 0) || 0
		);
	}

	get speed(): number {
		if (!this.actor) return 0;
		return Math.max(
			0,
			(this.actor?.DX + this.actor?.HT - this.actor?.damage / 3) / 2 -
				(this.totalEquipmentWeight - 10) / this.actor.ST
		);
	}

	get movement(): number {
		return this.speed - this.consumedMovementPoint;
	}
	get dodge(): number {
		if (this.currentTaskPoint < systemConfig.taskPointDodge) return 0;
		if (!this.actor) return 0;

		return Math.max((this.actor?.DX + this.actor?.HT) / 4, this.actor?.DX / 2);
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
	get vector3(): Vector3 {
		return new Vector3(this.x, 0, this.z);
	}
	get parry(): [Equipment | null, number] {
		if (this.currentTaskPoint < systemConfig.taskPointParry) return [null, 0];
		if (!this.actor) return [null, 0];

		const equipment = this.actor.equipments[0];
		return [
			equipment,
			Math.max(
				this.getLv(equipment.skillToUse) / 2,
				this.getLv(equipment.skillToUse) / 2,
				(this.getLv('Fencing') * 2) / 3,
				(this.getLv('Quarterstaff') * 2) / 3
			)
		];
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
		this.updateLifeBar();
		this.promptDamage(damage);
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
		if (!this.actor) return 0;

		return (this.totalEquipmentWeight + 100) / (this.actor.DX + this.actor.IQ);
	}
	getLv(skillName: string): number {
		const skill = this.actor?.skills.find((skill) => skill.name == skillName);
		return skill ? skill.level : 6;
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
				break;
		}
		this.state = state;
	}

	async moveToTile(path: path): Promise<void> {
		if (!path) {
			alert('undefined path');
			return;
		}
		this.position = path.position;

		await moveToTile(path, this.el);
		this.changeState('directing');
		STAGE.changeState('selectingDirection');
		this.tile = STAGE.tiles.find((tile) => tile.id == path.tileId) || null;
		const consumingTaskPoint = path.consumedPoints / this.speed;
		this.consumeTaskPoint(consumingTaskPoint);
		this.consumedMovementPoint += path.consumedPoints;
	}
	turnToDirection(yRotation: number, direction: direction): Promise<boolean> {
		return new Promise((resolve) => {
			this.direction = turnToDirection(yRotation, direction, this.el);

			setTimeout(() => {
				return resolve(true);
			}, systemConfig.moveAnimationSeconds);
		});
	}
	consumeTaskPoint(value: number) {
		this.currentTaskPoint -= value;
	}
	resetTaskPoint() {
		this.currentTaskPoint = this.taskPoint;
	}
	highlightAttackTarget() {
		this.el.setAttribute('color', 'red');
		this.el.querySelector('a-box')?.setAttribute('color', 'red');
		this.state = 'target';
	}
	unhighlightAttackTarget() {
		console.log('unhighlight attack target is called');
		this.el.querySelector('a-box')?.setAttribute('color', 'white');
		this.state = 'idle';
	}
	consumeWaitTurn(waitTurnToConsume: number): void {
		this.currentWaitTurn = this.currentWaitTurn - waitTurnToConsume;
		console.log(this.actor?.name, ' his current wait turn is ', this.currentWaitTurn);
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
	addStatus(status: string): void {
		this.actor?.statuses.push(status);
	}
	remove(): void {
		alert(this.actor?.name + ' is dead');
		this.el.parentElement?.removeChild(this.el);
	}
}
