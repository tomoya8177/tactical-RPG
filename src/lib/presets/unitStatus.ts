import type { unitStatusSlugs, unitStatusType } from '$lib/types/unitStatus';

export const unitStatus = [
	{
		slug: 'dead',
		name: 'Dead'
	},
	{
		slug: 'unconscious',
		name: 'Unconscious'
	},
	{
		slug: 'down',
		name: 'Down'
	},
	{
		slug: 'bleeding',
		name: 'Bleeding'
	},
	{
		slug: 'burning',
		name: 'Burning'
	},
	{
		slug: 'stunned',
		name: 'Stunned'
	},
	{
		slug: 'blinded',
		name: 'Blinded'
	}
];

export const getUnitStatusObejct = (slug: unitStatusSlugs): unitStatusType => {
	const status = unitStatus.find((status) => status.slug == slug);
	if (!status) throw new Error('no status found');
	return status;
};
