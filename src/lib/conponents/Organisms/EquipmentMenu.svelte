<script lang="ts">
	import EquipmentsByBodyParts from '../Molecules/EquipmentsByBodyParts.svelte';

	import { cancelButtonController } from '$lib/cancelButtonController';
	import { Equipment, bodyParts } from '$lib/classes/Equipment/Equipment';
	import type { Unit } from '$lib/classes/Unit/Unit';
	import { onDestroy, onMount } from 'svelte';
	export let unit: Unit;
	type TempEquipment = Equipment & { tempId: number };
	type dummyEquipment = { name: string; equippedOn: string };
	let equipments: TempEquipment[] = [];
	onMount(() => {
		if (!unit?.actor) throw new Error('unit.actor is null');
		unit.actor.equipments.forEach((equipment, i) => {
			equipments.push({ ...equipment, tempId: i });
		});
		equipments = equipments;
	});
	onDestroy(() => {
		console.log('onDestroy');
		equipments = [];
	});

	let selectedEquipment: TempEquipment | dummyEquipment | null = null;
	const onEquipmentClicked = (equipment: TempEquipment | dummyEquipment) => {
		if (!selectedEquipment) {
			selectedEquipment = equipment;
			return;
		}
		const eq1 = equipment.equippedOn;
		const eq2 = selectedEquipment.equippedOn;
		equipment.equippedOn = eq2;
		selectedEquipment.equippedOn = eq1;
		//equipments = equipments;
		selectedEquipment = null;
	};
	const onTakeSpotClicked = (equippedOn: string) => {
		const dummyEquipment = {
			name: 'dummy',
			equippedOn
		};
		onEquipmentClicked(dummyEquipment);
	};
	const onOKClicked = () => {
		if (!unit || !unit?.actor) throw new Error('unit.actor is null');
		equipments.forEach((equipment, i) => {
			if (!unit || !unit?.actor) throw new Error('unit.actor is null');
			unit.actor.equipments[i].equippedOn = equipment.equippedOn;
		});
		unit.actor.equipments = unit.actor.equipments.filter(
			(equipment) => equipment.equippedOn != null
		);
		//unit.actor.equipments = [...equipments];
		unit.consumeTaskPoint(0.5);
		cancelButtonController();
	};
	const onAbortClicked = () => {
		cancelButtonController();
	};
	const onThrowAwayClicked = () => {
		if (!selectedEquipment) return;
		selectedEquipment.equippedOn = null;
	};
</script>

<div class="equipment-menu">
	<EquipmentsByBodyParts {equipments} {onEquipmentClicked} {onTakeSpotClicked} {unit} />
	<button on:click={() => onThrowAwayClicked()}>Throw away</button>
	<button on:click={() => onOKClicked()}>OK</button>
	<button on:click={() => onAbortClicked()}>Abort</button>
</div>

<style>
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
