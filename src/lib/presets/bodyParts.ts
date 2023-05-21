export type bodyPartsSlug = keyof typeof bodyParts;
import type { equipmentTypes } from '$lib/classes/Equipment/Equipment';

type bodyPartType = {
	title: string;
	equipmentCapacity: number;
	acceptedEquipmetnTypes: equipmentTypes[];
};

export const bodyParts: Record<string, bodyPartType> = {
	head: {
		title: 'Head',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['helmet', 'mask', 'accessory']
	},
	torso: {
		title: 'Torso',
		equipmentCapacity: 2,
		acceptedEquipmetnTypes: ['armor', 'accessory']
	},
	leftArm: {
		title: 'Left Arm',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['gloves', 'accessory']
	},
	leftHand: {
		title: 'Left Hand',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['gloves', 'accessory']
	},
	rightArm: {
		title: 'Right Arm',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['shield', 'weapon', 'accessory']
	},
	rightHand: {
		title: 'Right Hand',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['shield', 'weapon', 'accessory']
	},
	leftLeg: {
		title: 'Left Leg',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['boots', 'accessory']
	},
	rightLeg: {
		title: 'Right Leg',
		equipmentCapacity: 1,
		acceptedEquipmetnTypes: ['boots', 'accessory']
	},
	waist: {
		title: 'Waist',
		equipmentCapacity: 3,
		acceptedEquipmetnTypes: ['weapon', 'accessory', 'bandage']
	},

	back: {
		title: 'Back',
		equipmentCapacity: 3,
		acceptedEquipmetnTypes: ['weapon', 'accessory', 'bandage']
	},
	heart: {
		title: 'Heart',
		equipmentCapacity: 0,
		acceptedEquipmetnTypes: []
	}
};
