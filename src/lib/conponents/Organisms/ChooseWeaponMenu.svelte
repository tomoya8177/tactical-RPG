<script lang="ts">
	import { ATTACK } from '$lib/classes/Attack/Attack';
	import type { Equipment } from '$lib/classes/Equipment/Equipment';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import WeaponTag from '../Atoms/WeaponTag.svelte';
	import { TURN } from '$lib/classes/Turn/Turn';
	export let unit: Unit;
	onMount(() => {
		console.log({ unit });
	});
	const onWeaponClicked = async (weapon: Equipment, i: number) => {
		uiController.hide('chooseWeaponMenu');
		if (STAGE.state == 'selectingWeapon') {
			ATTACK.setWeapon(weapon);
			STAGE.changeState('attack');
		}
		if (STAGE.state == 'selectingWeaponForAmbush') {
			if (!TURN.unit) return console.error('TURN.unit is null');
			const AMBUSH = STAGE.ambushes.of(TURN.unit);
			AMBUSH.setWeapon(weapon);
			AMBUSH.highlightRange();
			STAGE.changeState('ambush');
		}
	};
</script>

<div class="choose-weapon-menu" transition:fade>
	<button>Punch</button>
	<button>Kick</button>
	{#each unit?.actor?.equipments.filter((equipment) => equipment.equippedOn == 'rightHand' || equipment.equippedOn == 'leftHand') || [] as weapon, i}
		<button
			on:click={() => onWeaponClicked(weapon, i)}
			disabled={unit.TP.current - 0.7 < weapon.attackCost}
		>
			<WeaponTag {weapon} level={unit.getLv(weapon.skillToUse)} />
		</button>
	{/each}
</div>

<style>
	.choose-weapon-menu {
		z-index: 1000;
		padding: 10px;
		border-radius: 10px;
		position: absolute;
		bottom: 50vh;
		left: 50vw;
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
