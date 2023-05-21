export const rotation2Direction = (rotation: number) => {
	if (rotation < 0) {
		rotation = 360 + rotation;
	}
	rotation = rotation % 360;
	if (rotation === 0) {
		return 'S';
	} else if (rotation === 90) {
		return 'E';
	} else if (rotation === 180) {
		return 'N';
	} else if (rotation === 270) {
		return 'W';
	} else {
		throw new Error('rotation2Direction: rotation not valid');
	}
};
