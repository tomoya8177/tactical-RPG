import { writable } from 'svelte/store';
export type uiControllerType = {
	actorData: boolean;
	actionMenu: boolean;
	chooseWeaponMenu: boolean;
	attackSimulation: boolean;
};
export const uiControllerStore = writable({} as uiControllerType);

export const uiController = {
	subscribe: uiControllerStore.subscribe,
	update: (data: uiControllerType) => {
		uiControllerStore.update((dump) => {
			Object.entries(data).forEach(([key, value]) => {
				dump[key as keyof uiControllerType] = value;
			});
			return dump;
		});
	},
	show: (title: string) => {
		uiControllerStore.update((dump) => {
			title = title as keyof uiControllerType;
			dump[title as keyof uiControllerType] = true;
			return dump;
		});
	},
	hide: (title: string) => {
		uiControllerStore.update((dump) => {
			dump[title as keyof uiControllerType] = false;
			return dump;
		});
	}
};
