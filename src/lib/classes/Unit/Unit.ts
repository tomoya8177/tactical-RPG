import { systemConfig } from '$lib/systemConfig';
import type { actor } from '$lib/types/actor';
import type { path } from '$lib/types/path';
import type { xyz } from '$lib/types/xyz';
import type { Entity } from 'aframe';
import type { Actor } from '../Actor/Actor';
import { moveToTile } from './moveToTile';
import { turnToDirection } from './turnToDirection';
import type { direction } from '$lib/types/direction';
import { showDecimal } from '$lib/Maths/showDecimal';
import { createAframeEntity } from '$lib/createAframeEntity';
import { lifeBar, updateLifeBar } from './lifeBar';
import { triangles } from './triangles';
export type unitState = 'idle' | 'target' | 'focused' | 'directing';
export class Unit {
	id: number;
	state: unitState;
	type: 'actor' | null;
	actor: Actor | null;
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
	};
	el: Entity;
	constructor(id: number, type: 'actor' | null = null, actor: Actor | null = null, position: xyz) {
		this.id = id;
		this.state = 'idle';
		this.type = type == null ? 'actor' : type;
		this.actor = type == null ? null : actor;
		this.position = position;
		this.direction = type == null ? 'S' : 'S';
		this.currentWaitTurn = this.waitTurn;
		this.taskPoint = systemConfig.defaultTaskPoint;
		this.currentTaskPoint = systemConfig.defaultTaskPoint;
		this.consumedMovementPoint = 0;
		this.el = createAframeEntity('a-entity', {
			'unit-component': '',
			position: this.position
		});
		this.el.id = this.id.toString();
		const model = createAframeEntity('a-gltf-model', {
			src: 'assets/medieval_soldier.glb',
			scale: '0.5 0.5 0.5',
			color: '#ff0000',
			material: `color:#ff0000;
			shader:flat;`
		});
		this.el.appendChild(model);
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
		if (!this.actor) return 0;

		return Math.max((this.actor?.DX + this.actor?.HT) / 4, this.actor?.DX / 2);
	}
	parry(): number {
		if (!this.actor) return 0;

		const equipment = this.actor.equipments[0];
		return Math.max(
			this.getLv(equipment.skillToUse) / 2,
			this.getLv(equipment.skillToUse) / 2,
			(this.getLv('Fencing') * 2) / 3,
			(this.getLv('Quarterstaff') * 2) / 3
		);
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
			value: message
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
	changeState(state: unitState) {
		switch (state) {
			case 'idle':
				{
					const triangles = this.el.querySelector('.triangles');
					if (triangles && triangles.parentNode) {
						triangles.parentNode.removeChild(triangles);
					}
				}
				break;
			case 'directing':
				this.el.appendChild(triangles());
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
