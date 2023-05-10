export const getAngleForRangedAttack = (
	x: number,
	y: number,
	v0: number
): [number, number] | string => {
	const g = 9.8;
	let v02 = Math.pow(v0, 2);
	let expr = Math.pow(v02, 2) - g * (g * Math.pow(x, 2) + 2 * y * v02);
	if (expr < 0) {
		return 'The projectile cannot reach the target with the given initial speed and gravity.';
	}
	let root = Math.sqrt(expr);
	let angle1 = Math.atan((v02 + root) / (g * x));
	let angle2 = Math.atan((v02 - root) / (g * x));
	return [angle1, angle2];
};
