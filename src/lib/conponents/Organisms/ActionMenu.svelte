<script lang="ts">
	import { ATTACK } from '$lib/classes/Attack/Attack';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { TURN } from '$lib/classes/Turn/Turn';
	import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { fade } from 'svelte/transition';
	import { Ambush } from '$lib/classes/Stage/Ambushes/Ambush/Ambush';
	import { onMount } from 'svelte';

	export let unit: Unit | null = null;
	const onEndTurnClicked = () => {
		TURN.end();
	};
	const onMoveClicked = () => {
		if (!TURN.unit) return;
		STAGE.changeState('moving');
		STAGE.findPath(TURN.unit);
		uiController.hide('actionMenu');
		//unit.startMove();
	};
	const onAttackClicked = () => {
		//hide highlighted tiles
		if (!TURN.unit) return;
		ATTACK.init(TURN.unit);
		STAGE.state = 'selectingWeapon';

		//unit.startAttack();
	};
	const onAmbushClicked = () => {
		//hide highlighted tiles
		if (!TURN.unit) return;
		STAGE.ambushes.push(new Ambush().init(TURN.unit));
		STAGE.changeState('selectingWeaponForAmbush');
		//unit.startAttack();
	};
	const onEquipmentClicked = () => {
		//hide highlighted tiles
		if (!TURN.unit) return;
		STAGE.changeState('equipment');
		uiController.show('equipmentMenu');
		uiController.hide('actionMenu');
		uiController.hide('actorData');
		//unit.startAttack();
	};
	let onAmbush = false;
	onMount(() => {
		if (STAGE.ambushes.some((ambush) => ambush.attacker == unit && ambush.state == 'confirmed')) {
			onAmbush = true;
		}
	});
</script>

{#if unit}
	<div class="action-menu" transition:fade>
		<button on:click={onMoveClicked} disabled={STAGE.findPath(unit).length == 0 || onAmbush}
			>Move</button
		>

		<button on:click={onAttackClicked} disabled={unit.currentTaskPoint < 2 || onAmbush}
			>Attack</button
		>
		<button on:click={onAmbushClicked} disabled={unit.currentTaskPoint < 2 || onAmbush}
			>Ambush</button
		>
		<button on:click={onEquipmentClicked} disabled={unit.currentTaskPoint < 1.5 || onAmbush}
			>Equipment</button
		>
		<button on:click={onEndTurnClicked}>End Turn</button>
	</div>
{/if}

<style>
	.action-menu {
		z-index: 1000;
		padding: 10px;
		border-radius: 10px;
		position: absolute;
		bottom: 50vh;
		left: 50vw;
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
