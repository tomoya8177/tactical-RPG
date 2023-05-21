import type { bodyPartsSlug } from '$lib/presets/bodyParts';
import type { unitStatusType } from './unitStatus';

export interface attackResult {
	result: string;
	foeIsDead: boolean;
	givenState: Array<unitStatusType>;
	bodyPart?: bodyPartsSlug;
	damage: number;
}
