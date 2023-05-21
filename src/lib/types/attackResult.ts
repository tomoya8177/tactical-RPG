import type { unitStatusType } from './unitStatus';

export interface attackResult {
	result: string;
	foeIsDead: boolean;
	givenState: Array<unitStatusType>;
	damage: number;
}
