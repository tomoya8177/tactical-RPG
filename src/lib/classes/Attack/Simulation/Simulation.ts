import type { Equipment } from '$lib/classes/Equipment/Equipment';
import type { Unit } from '$lib/classes/Unit/Unit';
import type { Entity } from 'aframe';
import { Box3, Vector3 } from 'three';
import { getAngleForRangedAttack } from './getAngleForRangedAttack';
import { ticksPerSecond } from '../Attack';
import { createAframeEntity } from '$lib/createAframeEntity';
import { systemConfig } from '$lib/systemConfig';
import { appendRangeCurveToScene } from './appendRangeCurveToScene';
import { STAGE } from '$lib/classes/Stage/Stage';
import { possibility, possibilityTable } from '$lib/presets/rollPossibility';
import { noticePossibility } from '../noticePossibility';
import { getDamage } from '../getDamage';
type rangeSimulationResult = {
	curve: Entity | null;
	intercepted: boolean;
	outOfRange: boolean;
};
type simulationResult = {
	result: string;
	hit: number;
	notice: number;
	dodge: number;
	parry: Array<{
		weapon: Equipment;
		possibility: number;
	}>;
	damage: number;
};
export class Simulation {
	attacker: Unit;
	foe: Unit;
	weapon: Equipment;
	curves: Array<Entity>;
	result: simulationResult | null;
	constructor(attacker: Unit, foe: Unit, weapon: Equipment) {
		this.attacker = attacker;
		this.foe = foe;
		this.weapon = weapon;
		this.curves = [];
		this.result = null;
	}
	destroy = (): void => {
		this.removeCurves();
	};
	removeCurves = (): void => {
		this.curves.forEach((curve) => {
			curve.parentNode?.removeChild(curve);
		});
		this.curves = [];
	};
	simulate = async (): Promise<simulationResult> => {
		return new Promise(async (resolve) => {
			if (this.weapon.rangeType == 'ranged') {
				const rangeSimulationResult = await this.simulateRangeAttack();

				if (rangeSimulationResult.intercepted) {
					resolve({
						result: 'intercepted'
					});
				}
				console.log({ rangeSimulationResult });
			}
			const hit = possibility(this.attacker.getLv(this.weapon.skillToUse));
			const notice = noticePossibility(this.attacker, this.foe);
			this.result = {
				result: 'success',
				hit,
				notice,
				dodge: possibility(this.foe.dodge),
				parry: [
					{
						weapon: this.foe.parry[0],
						possibility: possibility(this.foe.parry[1])
					}
				],
				damage: getDamage(this.attacker, this.foe, this.weapon)
			};
			console.log(this.result, this.attacker.getLv(this.weapon.skillToUse), this.weapon.skillToUse);
			resolve(this.result);
		});
	};
	simulateRangeAttack = (): Promise<rangeSimulationResult> => {
		const drawCurveForRangedAttack = (distance: number, angle: number): Entity => {
			const curve = createAframeEntity('a-entity', {
				visible: 'false'
			});

			const speedX = (this.weapon.range * Math.cos(angle)) / ticksPerSecond;
			let speedY = (this.weapon.range * Math.sin(angle)) / ticksPerSecond;
			let x = speedX;
			let y = speedY;
			let prevX = 0;
			let prevY = 0;
			while (y > -45 && y < 45 && distance > x) {
				const line = createAframeEntity('a-entity', {
					line: `
					start: ${prevX} ${prevY} 0;
					end: ${x} ${y} 0;
					color: #000;
					`
				});
				curve.appendChild(line);

				prevX = x;
				prevY = y;
				speedY -= systemConfig.gravity / (ticksPerSecond * ticksPerSecond);
				x += speedX;
				y += speedY;
			}

			return curve;
		};

		const distance = this.attacker.vector3.distanceTo(this.foe.vector3);
		const yDiff = this.foe.y - this.attacker.y;
		const result = getAngleForRangedAttack(distance, yDiff, this.weapon.range);
		if (typeof result == 'string')
			return Promise.resolve({
				curve: null,
				intercepted: true,
				outOfRange: true
			});
		const angles = result[0] > result[1] ? [result[1], result[0]] : [result[0], result[1]];
		for (let i = 0; i < 2; i++) {
			let curve = drawCurveForRangedAttack(distance, angles[i]);

			curve = appendRangeCurveToScene(curve, this.attacker, this.foe);
			this.curves.push(curve);
		}

		return new Promise((resolve) => {
			setTimeout(() => {
				const result: rangeSimulationResult[] = [];
				this.curves.forEach((curve) => {
					let intercepted: boolean = false;
					for (let line of Array.from(curve.children)) {
						const testBox = new Box3().setFromObject(line.object3D);

						if (intercepted) {
							line.parentNode?.removeChild(line);
						} else {
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
					result.push({
						curve: curve,
						intercepted,
						outOfRange: false
					});
				});

				if (result[0].intercepted && result[1].intercepted) {
					this.curves[1].setAttribute('visible', 'true');
					this.curves[0].parentNode?.removeChild(this.curves[0]);
					resolve(result[1]);
				} else if (result[0].intercepted) {
					this.curves[1].setAttribute('visible', 'true');
					this.curves[0].parentNode?.removeChild(this.curves[0]);
					resolve(result[1]);
				} else {
					this.curves[0].setAttribute('visible', 'true');
					this.curves[1].parentNode?.removeChild(this.curves[1]);
					resolve(result[0]);
				}
			}, 1);
		});
	};
}
