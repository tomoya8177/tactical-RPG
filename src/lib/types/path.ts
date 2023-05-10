import type { xyz } from './xyz';

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
