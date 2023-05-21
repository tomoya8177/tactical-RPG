import { createAframeEntity } from '$lib/createAframeEntity';
import { systemConfig } from '$lib/systemConfig';
import type { Unit } from '../Unit';

export class Prompt {
	unit: Unit;
	constructor(unit: Unit) {
		this.unit = unit;
	}
	message(message: string): void {
		const resultText = createAframeEntity('a-text', {
			'look-at-camera': '',
			position: '0 2.2 0',
			align: 'center',
			value: message,
			font: systemConfig.popUpFont
		});
		this.unit.el.appendChild(resultText);
		setTimeout(() => {
			this.unit.el.removeChild(resultText);
		}, 2000);
	}
	result(message: string): void {
		this.message(message);
	}
	damage(damage: number): void {
		this.message((10 * Number(damage.toFixed(1))).toString());
	}
}
