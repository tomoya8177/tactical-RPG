function probability(num) {
	let count = 0;
	for (let i = 1; i <= 6; i++) {
		for (let j = 1; j <= 6; j++) {
			for (let k = 1; k <= 6; k++) {
				if (i + j + k <= num) {
					count++;
				}
			}
		}
	}
	return count / 216;
}
export const possibilityTable = {};
for (let i = 3; i <= 18; i++) {
	possibilityTable[i] = probability(i);
}
console.log(possibilityTable);
export const possibility = (number: number) => {
	return possibilityTable[Math.floor(number)];
};
