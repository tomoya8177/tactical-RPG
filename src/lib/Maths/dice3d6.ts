export const dice3d6 = () => {
	return (
		Math.round(6 * Math.random()) + Math.round(6 * Math.random()) + Math.round(6 * Math.random())
	);
};
export const roll3d6 = (value: number) => {
	const roll = dice3d6();
	console.log({ roll });
	if (value >= roll) {
		return {
			result: true,
			roll: roll
		};
	} else {
		return {
			result: false,
			roll: roll
		};
	}
};
