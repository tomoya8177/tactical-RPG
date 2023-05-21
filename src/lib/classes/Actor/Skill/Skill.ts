export class Skill {
	name: string;
	level: number;
	type: 'physical' | 'mental';
	constructor(data: Skill) {
		this.name = data.name;
		this.level = data.level;
		this.type = data.type;
	}
}
