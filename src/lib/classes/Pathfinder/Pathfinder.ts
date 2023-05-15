import type { path, step } from '$lib/types/path';
import type { xyz } from '$lib/types/xyz';
import { findNextTile } from './findNextTile';
import { checkIfUnitCanMoveToTile } from './checkIfUnitCanMovetoTile';
import type { Tile } from '../Stage/Tiles/Tile/Tile';
import type { direction } from '$lib/types/direction';

export interface step {
	tileId: number | '';
	movement: string;
	startPosition: xyz | null;
	endPosition: xyz | null;
	startYRotation: number | null;
	endYRotation: number | null;
}

export interface path {
	steps: Array<step>;
	tileId: number | '';
	position: xyz;
	consumedPoints: number;
}

export class Pathfinder {
	paths: Array<path>;
	tiles: Array<Tile>;
	constructor() {
		this.paths = [];
		this.tiles = [];
	}

	init(tiles: Array<Tile>): void {
		this.paths = [];
		this.tiles = tiles;
	}
	requiredPoints(nextTile: Tile, position: xyz) {
		const diff = nextTile.position.y - position.y;
		let consumedPoints = 1;
		if (diff > 0.6) {
			consumedPoints = 99999;
		} else if (diff > 0.3) {
			consumedPoints = 2;
		} else if (diff > 0.1) {
			consumedPoints = 1.5;
		} else if (diff > -0.1) {
			//pass through
		} else if (diff > -0.3) {
			consumedPoints = 1.5;
		} else if (diff > -1) {
			consumedPoints = 2;
		} else if (diff <= -1) {
			consumedPoints = 99999;
		}
		return consumedPoints;
	}
	moveForward(previousSteps: Array<step>, nextTile: Tile, position: xyz, consumedPoints: number) {
		const updatedPreviousSteps: Array<step> = [
			...previousSteps,
			{
				tileId: nextTile.id,
				movement: 'MF',
				startPosition: position,
				endPosition: nextTile.position,
				startYRotation: null,
				endYRotation: null
			}
		];
		const newPath: path = {
			tileId: nextTile.id,
			position: nextTile.position,
			consumedPoints: consumedPoints,
			steps: [...updatedPreviousSteps]
		};
		this.paths = [...this.paths, newPath];
		return updatedPreviousSteps;
	}
	findPath(
		position: xyz,
		direction: direction,
		points: number,
		consumedPointsTotal = 0,
		previousSteps: Array<step> = []
	) {
		const nextTile = findNextTile(this.tiles, direction, position);
		let consumedPoints = 0;
		if (nextTile !== false) {
			consumedPoints = this.requiredPoints(nextTile, position);
		}
		if (!!nextTile && points >= consumedPoints && checkIfUnitCanMoveToTile(nextTile)) {
			const duplicatePath = this.paths.find((path) => path.tileId == nextTile.id);
			if (duplicatePath) {
				if (duplicatePath.consumedPoints > consumedPointsTotal + consumedPoints) {
					this.paths = this.paths.filter((path) => path.tileId != nextTile.id);
					const updatedPreviousSteps = this.moveForward(
						previousSteps,
						nextTile,
						position,
						consumedPointsTotal + consumedPoints
					);
					this.findPath(
						nextTile.position,
						direction,
						points - consumedPoints,
						consumedPointsTotal + consumedPoints,
						updatedPreviousSteps
					);
				}
			} else {
				const updatedPreviousSteps = this.moveForward(
					previousSteps,
					nextTile,
					position,
					consumedPointsTotal + consumedPoints
				);

				this.findPath(
					nextTile.position,
					direction,
					points - consumedPoints,
					consumedPointsTotal + consumedPoints,
					updatedPreviousSteps
				);
			}
		}
		let newDirection: direction;
		let startYRotation = null;
		let endYRotation = null;
		if (points >= 2) {
			//make left turn
			switch (direction) {
				case 'S':
					startYRotation = 0;
					endYRotation = 90;
					newDirection = 'E';
					break;
				case 'N':
					startYRotation = 180;
					endYRotation = 270;
					newDirection = 'W';
					break;
				case 'W':
					startYRotation = 270;
					endYRotation = 360;

					newDirection = 'S';
					break;
				case 'E':
					startYRotation = 90;
					endYRotation = 180;
					newDirection = 'N';
					break;
			}
			const updatedPreviousSteps: Array<step> = [
				...previousSteps,
				{
					tileId: '',
					startPosition: position,
					endPosition: position,
					movement: 'TL',
					startYRotation,
					endYRotation
				}
			];
			const consumedPoints = 2;

			this.findPath(
				position,
				newDirection,
				points - consumedPoints,
				consumedPointsTotal + consumedPoints,
				updatedPreviousSteps
			);
		}

		if (points >= 2) {
			//make right turn

			switch (direction) {
				case 'S':
					startYRotation = 0;
					endYRotation = -90;

					newDirection = 'W';
					break;
				case 'N':
					startYRotation = 180;
					endYRotation = 90;

					newDirection = 'E';
					break;
				case 'W':
					startYRotation = 270;
					endYRotation = 180;

					newDirection = 'N';
					break;
				case 'E':
					startYRotation = 90;
					endYRotation = 0;

					newDirection = 'S';
					break;
			}
			const updatedPreviousSteps: Array<step> = [
				...previousSteps,
				{
					movement: 'TR',
					tileId: '',
					startPosition: position,
					endPosition: position,
					startYRotation,
					endYRotation
				}
			];
			const consumedPoints = 2;

			this.findPath(
				position,
				newDirection,
				points - consumedPoints,
				consumedPointsTotal + consumedPoints,
				updatedPreviousSteps
			);
		}
		return this.paths;
	}
}
