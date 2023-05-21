import type { Equipment } from '$lib/classes/Equipment/Equipment';
import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
import type { Entity } from 'aframe';
import { Box3, Vector3 } from 'three';
import { getAngleForRangedAttack } from './getAngleForRangedAttack';
import { ticksPerSecond } from '../Attack';
import { createAframeEntity } from '$lib/createAframeEntity';
import { systemConfig } from '$lib/systemConfig';
import { appendRangeCurveToScene } from './appendRangeCurveToScene';
import { STAGE } from '$lib/classes/Stage/Stage';
import { possibility } from '$lib/presets/rollPossibility';
import { noticePossibility } from '../noticePossibility';
import { getDamage, giveDamageBonus } from '../getDamage';
import type { rangeSimulationResult, simulationResult } from '$lib/types/simulationResult';
import { drawCurveForRangedAttack } from './drawCurveForRangedAttack';
import { get } from 'svelte/store';
import { getAttackTime } from '../getAttackTime';

export class Simulation {
	attacker: Unit;
	foe: Unit;
	weapon: Equipment;
	curve: Entity | null;
	result: simulationResult | null;
	constructor(attacker: Unit, foe: Unit, weapon: Equipment) {
		this.attacker = attacker;
		this.foe = foe;
		this.weapon = weapon;
		this.curve = null;
		this.result = null;
	}
	destroy = (): void => {
		this.removeCurves();
	};
	removeCurves = (): void => {
		if (!this.curve) return;
		this.curve.parentNode?.removeChild(this.curve);
		this.curve = null;
	};
	get attackTime(): number {
		return getAttackTime(this.attacker, this.foe, this.weapon);
	}
	simulate = async (): Promise<simulationResult> => {
		return new Promise(async (resolve) => {
			if (this.weapon.rangeType == 'ranged') {
				const rangeSimulationResult = await this.simulateRangeAttack();

				if (rangeSimulationResult.intercepted) {
					resolve({
						result: 'intercepted',
						hit: 0,
						notice: 0,
						dodge: 0,
						parry: [],
						damage: 0
					});
				}
			}
			const hit = possibility(this.attacker.getLv(this.weapon.skillToUse));
			const notice = noticePossibility(this.attacker, this.foe);

			this.result = {
				result: 'success',
				hit,
				notice,
				dodge: possibility(this.foe.dodge * this.attackTime),
				parry: this.foe.actor.equipments.getParryWeapons().map((parry) => {
					parry.level = parry.level * this.attackTime;
					return parry;
				}),
				damage: giveDamageBonus(
					getDamage(this.attacker, this.foe, this.weapon),
					this.weapon,
					'torso'
				)
			};

			resolve(this.result);
		});
	};
	simulateRangeAttack = (): Promise<rangeSimulationResult> => {
		const distance = this.attacker.vector3.distanceTo(this.foe.vector3);
		const yDiff = this.foe.y - this.attacker.y;
		const result = getAngleForRangedAttack(distance, yDiff, this.weapon.range);
		if (typeof result == 'string')
			return Promise.resolve({
				curve: null,
				intercepted: true,
				outOfRange: true
			});
		const angle = Math.min(result[0], result[1]);
		let curve = drawCurveForRangedAttack(distance, angle, this.weapon, ticksPerSecond);

		curve = appendRangeCurveToScene(curve, this.attacker, this.foe);
		this.curve = curve;

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!this.curve) return resolve({});
				let intercepted: boolean = false;
				for (let line of Array.from(this.curve.children)) {
					if (intercepted) {
						line.parentNode?.removeChild(line);
					} else {
						const testBox = new Box3().setFromObject(line.object3D);
						const intersectBox = STAGE.structures.find((box, i) => {
							return box.intersectsBox(testBox);
						});
						if (intersectBox) {
							intercepted = true;
							line.setAttribute('line', 'color: red');
						} else {
							line.setAttribute('line', 'color: lightgreen');
						}
					}
				}
				const result = {
					curve: this.curve,
					intercepted,
					outOfRange: false
				};

				this.curve.setAttribute('visible', 'true');
				resolve(result);
			}, 1);
		});
	};
}
