function probability(num: number) {
	let count = 0;
	for (let i = 1; i <= 60; i++) {
		for (let j = 1; j <= 60; j++) {
			for (let k = 1; k <= 60; k++) {
				if (i + j + k <= num * 10) {
					count++;
				}
			}
		}
	}
	return count / 216000;
}

export const possibility = (number: number) => {
	return probability(number);
};
