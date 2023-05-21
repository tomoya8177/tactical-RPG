export const dice3d6 = () => {
	return 5 * Math.random() + 5 * Math.random() + 5 * Math.random() + 3;
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
