import { rotation2Direction } from '$lib/Maths/rotation2direction';
import type { path, step } from '$lib/classes/Pathfinder/Pathfinder';
import type { Ambush } from '$lib/classes/Stage/Ambushes/Ambush/Ambush';
import { STAGE } from '$lib/classes/Stage/Stage';
import { systemConfig } from '$lib/systemConfig';
import type { attackResult } from '$lib/types/attackResult';
import type { direction } from '$lib/types/direction';
import type { Unit } from '../Unit';
import { moveToTile } from './moveToTile';
import { turnToDirection } from './turnToDirection';

export class Navigation {
	unit: Unit;
	consumedMovementPoint: number;
	constructor(unit: Unit) {
		this.unit = unit;
		this.consumedMovementPoint = 0;
	}
	async moveToTile(path: path): Promise<void> {
		if (!path || !this.unit.tile) throw new Error('undefined path');
		const stepsToBeAmbushed: Array<{
			step: step;
			ambush: Ambush;
		}> = [];
		for (let i = 0; i < path.steps.length; i++) {
			let step = path.steps[i];
			const tile = STAGE.tiles.find((tile) => tile.id == step.tileId);
			console.log({ step });
			this.unit.position = step.endPosition;
			this.unit.direction = rotation2Direction(step.endYRotation);
			STAGE.ambushes
				.filter((ambush: Ambush) => {
					if (!path || !this.unit.tile) throw new Error('undefined path');
					return ambush.isActiveAndTileInRader(tile) && !ambush.ifTileInRader(this.unit.tile);
				})
				.forEach((ambush: Ambush) => {
					console.log('second time', { ambush });
					this.unit.tile = STAGE.tiles.find((tile) => step.tileId == tile.id);
					const attackResult = ambush.attackTarget(this.unit);
					step.ambushes.push({
						ambush,
						attackResult
					});
					console.log({ attackResult });
					if (
						step.ambushes.length > 0 &&
						step.ambushes.some(
							(ambushInstance: { ambush: Ambush; attackResult: attackResult }) =>
								ambushInstance.attackResult.givenState.some((status) => status.slug == 'dead') ||
								ambushInstance.attackResult.givenState.some(
									(status) => status.slug == 'unconscious'
								) ||
								ambushInstance.attackResult.givenState.some((status) => status.slug == 'down')
						)
					) {
						path.steps = path.steps.slice(0, i + 1);
						i = path.steps.length;
					}
				});
		}

		//this.position = path.position;

		await moveToTile(path, this.unit.el);
		this.unit.changeState('directing');
		STAGE.changeState('selectingDirection');
		this.unit.tile = STAGE.tiles.find((tile) => tile.id == path.tileId) || null;
		this.unit.TP.consume(path.consumedPoints / this.speed);
		this.consumedMovementPoint += path.consumedPoints;
	}

	turnToDirection(yRotation: number, direction: direction): Promise<boolean> {
		console.log(yRotation, direction);
		return new Promise((resolve) => {
			this.unit.direction = turnToDirection(yRotation, direction, this.unit.el);
			console.log('end direction', this.unit.direction);
			setTimeout(() => {
				return resolve(true);
			}, systemConfig.moveAnimationSeconds);
		});
	}
	get speed(): number {
		// if actor's HT - damage is less than 3, then your speed is half.
		let movement =
			(this.unit.actor.DX + this.unit.actor.HT - this.unit.actor.damage / 3) / 2 -
			(this.unit.actor.equipments.totalWeight - 10) / this.unit.actor.ST;
		return Math.max(0, movement);
	}

	get movement(): number {
		return this.speed - this.consumedMovementPoint;
	}
}
