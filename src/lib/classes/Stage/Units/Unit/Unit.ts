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
import { buildEntity } from './buildEntity';
import { TURN } from '../../../Turn/Turn';
import { inTurnIndicator } from './inTurnIndicator';
import { roll3d6 } from '$lib/Maths/dice3d6';
import type { unitStatusSlugs } from '$lib/types/unitStatus';
import { Navigation } from './Navigation/Navigation';
import { Prompt } from './Prompt/Prompt';
import { WT } from './WT/WT';
import { TP } from './TP/TP';
export type unitState = 'idle' | 'target' | 'focused' | 'directing' | 'inTurn';
export class Unit {
	id: number;
	state: unitState;
	type: 'actor' | null;
	actor: Actor;
	tile: Tile;
	position: xyz;
	direction: direction;
	team: number = 0;
	WT: WT;
	TP: TP;
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
	prompt: Prompt;

	el: Entity;
	constructor(id: number, team: number, type: 'actor' | null = null, actor: Actor, tile: Tile) {
		this.id = id;
		this.state = 'idle';
		this.type = type == null ? 'actor' : type;
		this.actor = actor;
		this.actor.setUnit(this);
		this.tile = tile;
		this.position = tile.position;
		this.direction = type == null ? 'S' : 'S';
		this.team = team;
		this.WT = new WT(this);
		this.TP = new TP(this);
		this.navigation = new Navigation(this);
		this.prompt = new Prompt(this);
		this.el = buildEntity(this);
		this.lifeBars = {
			main: null,
			life: null,
			grey: null
		};
		[this.lifeBars.main, this.lifeBars.life, this.lifeBars.grey] = lifeBar(this);
		this.el.appendChild(this.lifeBars.main);

		const scene = document.querySelector('a-scene');
		scene?.appendChild(this.el);
	}

	get dodge(): number {
		if (this.TP.current < systemConfig.taskPointDodge) return 0;
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
		return this.actor.ST + this.tile.material.ST;
	}
	get DX(): number {
		return this.actor.DX + this.tile.material.DX;
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

	updateLifeBar(): void {
		updateLifeBar(this);
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
