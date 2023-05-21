export type tileMaterialSlug =
	| 'dirt'
	| 'waterSurface'
	| 'mud'
	| 'grass'
	| 'stone'
	| 'wood'
	| 'sand'
	| 'water'
	| 'underwaterSandShallow'
	| 'underwaterSandDeep'
	| 'air';
export type tileMaterial = {
	slug: tileMaterialSlug;
	name: string;
	color: string;
	walkable: boolean;
	swimmable: boolean;
	hoverable: boolean;
	skiiable: boolean;
	ST: number;
	DX: number;
	move: number;
};
export const tileMaterials: tileMaterial[] = [
	{
		slug: 'dirt',
		name: 'Dirt',
		color: '#f3bb94',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: 0,
		DX: 0,
		move: 0
	},
	{
		slug: 'waterSurface',
		name: 'Water Surface',
		color: '#2f4f4f',
		walkable: false,
		swimmable: false,
		hoverable: false,
		skiiable: true,
		ST: 0,
		DX: 0,
		move: 0 //because this is for jetski
	},
	{
		slug: 'mud',
		name: 'Mud',
		color: '#563f2f',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: -2,
		DX: -1,
		move: -1
	},
	{
		slug: 'grass',
		name: 'Grass',
		color: '#8ee474',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: 0,
		DX: 0,
		move: 0
	},
	{
		slug: 'stone',
		name: 'Stone',
		color: '#a0a0a0',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: 0,
		DX: 0,
		move: 0
	},
	{
		slug: 'wood',
		name: 'Wood',
		color: '#a05a2c',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: 0,
		DX: 0,
		move: 0
	},
	{
		slug: 'sand',
		name: 'Sand',
		color: '#e6d9a0',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: 0,
		DX: -1,
		move: -2
	},
	{
		slug: 'water',
		name: 'Water',
		color: '#2f4f4f',
		walkable: false,
		swimmable: true,
		hoverable: false,
		skiiable: false,
		ST: -2,
		DX: -1,
		move: 0 //because it is swimming
	},
	{
		slug: 'underwaterSandShallow',
		name: 'Underwater Sand Shallow',
		color: '#e6d9a0',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: 0,
		DX: -1,
		move: -3
	},
	{
		slug: 'underwaterSandDeep',
		name: 'Underwater Sand Deep',
		color: '#e6d9a0',
		walkable: true,
		swimmable: false,
		hoverable: false,
		skiiable: false,
		ST: -1,
		DX: -2,
		move: -4
	},
	{
		slug: 'air',
		name: 'Air',
		color: '#ffffff',
		walkable: false,
		swimmable: false,
		hoverable: true,
		skiiable: false,
		ST: 0,
		DX: 0,
		move: 0 //because it is flying
	}
];
