<script lang="ts">
	import type { Ambush } from '$lib/classes/Stage/Ambushes/Ambush/Ambush';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { TURN } from '$lib/classes/Turn/Turn';
	import WeaponTag from '../Atoms/WeaponTag.svelte';
	export let ambush: Ambush;
	const onOKClicked = () => {
		console.log('ok clicked');
		ambush.confirm();
		STAGE.changeState('idle');
		TURN.end();
	};
	const onCancelClicked = () => {
		console.log('cancel clicked');
		ambush.cancel();
		STAGE.changeState('selectingWeaponForAmbush');
	};
</script>

<div class="menu">
	{#if ambush.weapon && ambush.attacker}
		<WeaponTag level={ambush.attacker.getLv(ambush.weapon.skillToUse)} weapon={ambush.weapon} />
	{/if}
	<button on:click={onOKClicked}>OK</button>
	<button on:click={onCancelClicked}>Cancel</button>
</div>

<style>
	.menu {
		z-index: 1000;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
