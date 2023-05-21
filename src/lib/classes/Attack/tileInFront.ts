import { Vector3 } from 'three';
import type { Tile } from '../Stage/Tiles/Tile/Tile';
import { radians2degrees } from '$lib/Maths/radian2degrees';
import type { Unit } from '../Stage/Units/Unit/Unit';

export const tileInFront = (unit: Unit, tile: Tile): boolean => {
	const tileVector = new Vector3(tile.position.x, 0, tile.position.z).sub(unit.vector3);

	const angle = radians2degrees(unit.directionVector.angleTo(tileVector));
	if (angle >= 135) {
		return false;
	} else {
		return true;
	}
};
