<script lang="ts">
	import { showDecimal } from '$lib/Maths/showDecimal';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { TURN } from '$lib/classes/Turn/Turn';
	import { fade } from 'svelte/transition';
	import Life from '../Atoms/Life.svelte';
	import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
	export let unit: Unit;
</script>

<div class="actor-data" transition:fade>
	Actor Data
	<div style="display:flex;gap:1rem">
		<div style="flex:initial">
			ID:
			{unit.id}
		</div>
		<div style="flex:auto">
			Name:
			{unit.actor.name}
			{unit.team}
		</div>
	</div>
	<div style="display:flex;gap:1rem">
		<div style="flex:initial">
			ST:
			{unit.actor.ST.toFixed(0)}
			({unit.ST.toFixed(0)})
		</div>
		<div style="flex:auto">
			DX:
			{unit.actor.DX.toFixed(0)}
			({unit.DX.toFixed(0)})
		</div>
		<div style="flex:auto">
			IQ:
			{unit.actor.IQ.toFixed(0)}
		</div>
		<div style="flex:auto">
			HT:
			{unit.actor.HT.toFixed(0)}
		</div>

		<div style="flex:auto">
			Speed:
			{unit.navigation.speed.toFixed(1)}
		</div>
		<div>
			WT:
			{#if unit.id == TURN.unit?.id}
				0
			{:else}
				{Math.round(showDecimal(unit.WT.current, 2) * 100)}
			{/if}
			/ {Math.round(showDecimal(unit.WT.get(), 2) * 100)}
		</div>
	</div>
	<div style="display:flex;gap:1rem">
		<div style="flex:initial">
			Life:
			<Life {unit} />
		</div>
		<div style="flex:initial">
			Task Point:
			{showDecimal(unit.TP.current, 2)}
		</div>
		<div style="flex:initial">
			Movement:
			{showDecimal(unit.navigation.movement, 1)}
		</div>
	</div>
	<div style="display:flex;gap:1rem">
		Status
		<div style="flex:initial">
			{#each unit.actor.statuses as status}
				{status.name}
			{/each}
		</div>
	</div>
	<div style="display:flex;gap:1rem">
		Tile
		<div style="flex:initial">
			{unit.tile?.material.name}
			(Step:{unit.tile?.y.toFixed(2)})
		</div>
	</div>
</div>

<style>
	.actor-data {
		z-index: 1000;
		padding: 10px;
		margin: 0px;
		border-radius: 10px;
		position: absolute;
		bottom: 10px;
		height: 100px;
		max-width: 100%;
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
