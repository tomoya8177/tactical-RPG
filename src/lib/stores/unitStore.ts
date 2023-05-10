import { writable } from 'svelte/store';
import type { Unit } from '../classes/Unit/Unit';
const unitsStore = writable([] as Array<Unit>);

let unitItems: Array<Unit> = [];
unitsStore.subscribe((array: Array<Unit>) => {
	unitItems = array;
});

export const units = {
	subscribe: unitsStore.subscribe,
	getOne: (id: number) => {
		return unitItems.find((item) => item.id == id) || null;
	},

	add: (addingUnits: Array<Unit>) => {
		unitsStore.update(() => {
			unitItems = [...unitItems, ...addingUnits];
			return unitItems;
		});
	},
	getAll: () => {
		return unitItems;
	},
	remove: (unit: Unit) => {
		unitsStore.update(() => {
			unitItems = unitItems.filter((item) => item.id != unit.id);
			return unitItems;
		});
	}
};
