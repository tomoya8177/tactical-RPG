<script lang="ts">
	import { showDecimal } from '$lib/Maths/showDecimal';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { TURN } from '$lib/classes/Turn/Turn';
	import type { Unit } from '$lib/classes/Unit/Unit';
	import { fade } from 'svelte/transition';
	export let unit: Unit;
</script>

{#if unit && unit.actor}
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
			</div>
		</div>
		<div style="display:flex;gap:1rem">
			<div style="flex:initial">
				ST:
				{unit.actor.ST}
			</div>
			<div style="flex:auto">
				DX:
				{unit.actor.DX}
			</div>
			<div style="flex:auto">
				IQ:
				{unit.actor.IQ}
			</div>
			<div style="flex:auto">
				HT:
				{unit.actor.HT}
			</div>
			<div style="flex:auto">
				Damage:
				{unit.actor.damage}
			</div>
			<div style="flex:auto">
				Speed:
				{showDecimal(unit.speed, 1)}
			</div>
			<div>
				WT:
				{#if unit.id == TURN.unit?.id}
					0
				{:else}
					{showDecimal(unit.currentWaitTurn, 2) * 100}
				{/if}
				/ {showDecimal(unit.waitTurn, 2) * 100}
			</div>
		</div>
		<div style="display:flex;gap:1rem">
			<div style="flex:initial">
				Life:
				{showDecimal(unit.life, 1) * 10} / {(unit.maxLife || 0) * 10}
			</div>
			<div style="flex:initial">
				Task Point:
				{showDecimal(unit.currentTaskPoint, 2)}
			</div>
			<div style="flex:initial">
				Movement:
				{showDecimal(unit.movement, 1)}
			</div>
		</div>
	</div>
{/if}

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
