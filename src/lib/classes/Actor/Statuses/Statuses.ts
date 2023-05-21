import { getUnitStatusObejct } from '$lib/presets/unitStatus';
import type { unitStatusSlugs } from '$lib/types/unitStatus';

export class Statuses extends Array {
	constructor() {
		super();
	}
	has(statusSlug: unitStatusSlugs): boolean {
		return this.some((status) => status.slug == statusSlug);
	}
	remove(statusSlug: unitStatusSlugs): void {
		this.forEach((status, index) => {
			if (status.slug == statusSlug) this.splice(index, 1);
		});
	}
	add(statusSlug: unitStatusSlugs): void {
		this.push(getUnitStatusObejct(statusSlug));
	}
}
