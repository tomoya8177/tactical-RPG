<script lang="ts">
	import type { Equipment } from '$lib/classes/Equipment/Equipment';
	import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
	import { bodyParts } from '$lib/presets/bodyParts';
	import WeaponTag from '../Atoms/WeaponTag.svelte';
	type TempEquipment = Equipment & { tempId: number };
	type dummyEquipment = { name: string; equippedOn: string };
	export let equipments: TempEquipment[] = [];

	export let selectedEquipment: TempEquipment | dummyEquipment | null = null;
	export let onEquipmentClicked = (equipment: TempEquipment): void => {};
	export let onTakeSpotClicked = (key: string): void => {};
	export let unit: Unit;
</script>

<div class="body-parts">
	{#each Object.entries(bodyParts) as [key, bodyPart]}
		{#if bodyPart.equipmentCapacity > 0}
			<div class="body-part">
				<div>{bodyPart.title}</div>
				<ul>
					{#each equipments.filter((equipment) => equipment.equippedOn == key) as equipment, i}
						<li>
							<button
								class:selected={selectedEquipment == equipment}
								on:click={() => onEquipmentClicked(equipment)}
							>
								<WeaponTag weapon={equipment} level={unit.getLv(equipment.skillToUse)} />
							</button>
						</li>
					{/each}
					{#if selectedEquipment && selectedEquipment.equippedOn != key && bodyPart.equipmentCapacity > equipments.filter((equipment) => equipment.equippedOn == key).length && bodyPart.acceptedEquipmetnTypes.includes(selectedEquipment.type)}
						<button on:click={() => onTakeSpotClicked(key)}>Take this spot</button>
					{/if}
				</ul>
			</div>
		{/if}
	{/each}
</div>

<style>
	ul {
		padding: 0;
	}
	li {
		list-style: none;
	}
	.selected {
		background-color: red;
	}
	.body-parts {
		display: flex;
	}
	.equipment-menu {
		z-index: 1000;
		padding: 10px;
		border-radius: 10px;
		position: absolute;
		bottom: 50vh;
		background-color: rgba(255, 255, 255, 0.5);
	}
	.body-part {
		border: solid 1px white;
	}
</style>
