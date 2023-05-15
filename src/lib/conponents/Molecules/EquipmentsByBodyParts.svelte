<script lang="ts">
	import { Equipment, bodyParts } from '$lib/classes/Equipment/Equipment';
	import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
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
		<div class="body-part">
			<div>{bodyPart.title}</div>
			<ul>
				{#each equipments.filter((equipment) => equipment.equippedOn == key) as equipment}
					<li>
						<button
							class:selected={selectedEquipment == equipment}
							on:click={() => onEquipmentClicked(equipment)}
						>
							<WeaponTag weapon={equipment} level={unit.getLv(equipment.skillToUse)} />
						</button>
					</li>
				{/each}
				{#if selectedEquipment && selectedEquipment.equippedOn != key}
					<button on:click={() => onTakeSpotClicked(key)}>Take this spot</button>
				{/if}
			</ul>
		</div>
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
