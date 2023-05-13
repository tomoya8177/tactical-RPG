<script lang="ts">
	import { ATTACK } from '$lib/classes/Attack/Attack';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { TURN } from '$lib/classes/Turn/Turn';
	import type { Unit } from '$lib/classes/Unit/Unit';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { fade } from 'svelte/transition';

	export let unit: Unit | null = null;
	const onEndTurnClicked = () => {
		TURN.end();
	};
	const onMoveClicked = () => {
		if (!TURN.unit) return;
		STAGE.findPath(TURN.unit);
		uiController.hide('actionMenu');
		//unit.startMove();
	};
	const onAttackClicked = () => {
		//hide highlighted tiles
		if (!TURN.unit) return;
		ATTACK.init(TURN.unit);
		STAGE.resetAllTiles();
		console.log('onAttackClicked');

		//unit.startAttack();
	};
</script>

{#if unit}
	<div class="action-menu" transition:fade>
		<button on:click={onMoveClicked} disabled={STAGE.findPath(unit).length == 0}>Move</button>

		<button on:click={onAttackClicked} disabled={unit.currentTaskPoint < 2}>Attack</button>
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
