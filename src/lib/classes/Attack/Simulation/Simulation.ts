import type { Equipment } from '$lib/classes/Equipment/Equipment';
import type { Unit } from '$lib/classes/Unit/Unit';
import type { Entity } from 'aframe';
import { Box3, Vector3 } from 'three';
import { getAngleForRangedAttack } from './getAngleForRangedAttack';
import { ticksPerSecond } from '../Attack';
import { createAframeEntity } from '$lib/createAframeEntity';
import { systemConfig } from '$lib/systemConfig';
import { appendRangeCurveToScene } from './appendRangeCurveToScene';

type rangeSimulationResult = {
	curve: Entity | null;
	intercepted: boolean;
	outOfRange: boolean;
};
type simulationResult = {
	result: string;
};
export class Simulation {
	attacker: Unit;
	foe: Unit;
	weapon: Equipment;
	curves: Array<Entity>;
	constructor(attacker: Unit, foe: Unit, weapon: Equipment) {
		console.log('Simulation constructor');
		this.attacker = attacker;
		this.foe = foe;
		this.weapon = weapon;
		this.curves = [];
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
			resolve({
				result: 'success'
			});
		});
	};
	simulateRangeAttack = (): Promise<rangeSimulationResult> => {
		const attackerVector = new Vector3(this.attacker.position.x, 0, this.attacker.position.z);
		const foeVector = new Vector3(this.foe.position.x, 0, this.foe.position.z);
		const distance = attackerVector.distanceTo(foeVector);
		const yDiff = this.foe.position.y - this.attacker.position.y;
		const result = getAngleForRangedAttack(distance, yDiff, this.weapon.range);
		if (typeof result == 'string')
			return Promise.resolve({
				curve: null,
				intercepted: true,
				outOfRange: true
			});
		const [angle1, angle2] =
			result[0] > result[1] ? [result[1], result[0]] : [result[0], result[1]];
		const grounds = Array.from(document.querySelectorAll('.ground')) as Array<Entity>;
		const boxes: Box3[] = [];
		grounds.forEach((ground) => {
			const box = new Box3().setFromObject(ground.object3D);
			boxes.push(box);
		});
		const curve1 = this.drawCurveForRangedAttack(distance, angle1);
		const curve2 = this.drawCurveForRangedAttack(distance, angle2);
		this.curves = [curve1, curve2];
		appendRangeCurveToScene(
			curve1,
			this.foe.position,
			new Vector3(this.attacker.position.x, 0, this.attacker.position.z),
			this.attacker.position.y
		);
		appendRangeCurveToScene(
			curve2,
			this.foe.position,
			new Vector3(this.attacker.position.x, 0, this.attacker.position.z),
			this.attacker.position.y
		);
		curve1.object3D.position.y += 1.5;
		curve2.object3D.position.y += 1.5;
		return new Promise((resolve) => {
			setTimeout(() => {
				const result: rangeSimulationResult[] = [];
				[curve1, curve2].forEach((curve) => {
					let intercepted: boolean = false;

					for (let line of Array.from(curve.children)) {
						const testBox = new Box3().setFromObject(line.object3D);
						if (intercepted) {
							line.parentNode?.removeChild(line);
						} else {
							const intersectBox = boxes.find((box, i) => box.intersectsBox(testBox));
							if (intersectBox) {
								intercepted = true;
								line.setAttribute('line', 'color: red');
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
					curve2.setAttribute('visible', 'true');
					resolve(result[1]);
				} else if (result[0].intercepted) {
					curve2.setAttribute('visible', 'true');
					curve1.parentNode?.removeChild(curve1);
					resolve(result[1]);
				} else {
					curve1.setAttribute('visible', 'true');
					curve2.parentNode?.removeChild(curve2);
					resolve(result[0]);
				}
			}, 1);
		});
	};
	drawCurveForRangedAttack = (distance: number, angle: number): Entity => {
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
			line.classList.add('simulation-curve');
			curve.appendChild(line);

			prevX = x;
			prevY = y;
			speedY -= systemConfig.gravity / (ticksPerSecond * ticksPerSecond);
			x += speedX;
			y += speedY;
		}

		return curve;
	};
}
