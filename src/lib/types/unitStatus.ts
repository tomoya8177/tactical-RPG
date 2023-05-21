export type unitStatusType = {
	slug: unitStatusSlugs;
	name: string;
};
export type unitStatusSlugs =
	| 'dead'
	| 'down'
	| 'unconscious'
	| 'bleeding'
	| 'burning'
	| 'stunned'
	| 'blinded';
