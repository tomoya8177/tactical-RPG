<script lang="ts">
	import { showDecimal } from '$lib/Maths/showDecimal';
	import { ATTACK } from '$lib/classes/Attack/Attack';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { FogExp2 } from 'three';

	const onOKClicked = () => {
		ATTACK.execute();
	};
	const onCancelClicked = () => {
		ATTACK.changeState('selectingTarget');
	};
</script>

<div class="attack-simulation">
	attackSimulation
	<button on:click={() => onOKClicked()}>OK</button>
	<button on:click={() => onCancelClicked()}>Cancel</button>
	{#if ATTACK.simulation && ATTACK.simulation.result && ATTACK.weapon && ATTACK.foe}
		{@const result = ATTACK.simulation.result}
		<div class="results">
			<div>
				attacker:{ATTACK.attacker?.actor?.name}
			</div>
			<div>
				Weapon:{ATTACK.weapon?.name}
			</div>
			<div>
				Skill:{ATTACK.weapon?.skillToUse} (Lv:
				{ATTACK.attacker?.getLv(ATTACK.weapon?.skillToUse)}
				)
			</div>
			<div>
				hit:{Math.round(result.hit * 100)}%
			</div>
			<div>
				damage:{Math.round(result.damage * 10)}
			</div>
		</div>
		<hr />

		<div class="results">
			<div>
				target:{ATTACK.foe?.actor?.name}
			</div>
			<div>
				Life: {showDecimal(ATTACK.foe.life, 1) * 10} / {(ATTACK.foe.maxLife || 0) * 10}
			</div>

			<div>
				dodge:{Math.round(result.dodge * result.notice * 100)}%
			</div>
			<div>
				parry:
				{#each result.parry as parry}
					{parry.weapon.name}
					{parry.weapon.skillToUse} ( Lv: {ATTACK.foe.getLv(parry.weapon.skillToUse)} /
					{Math.round(parry.possibility * result.notice * 100)}% ),
				{/each}
			</div>
			<div>
				{ATTACK.foe.currentTaskPoint} / 3
			</div>
		</div>
	{/if}
</div>

<style>
	.results {
		display: flex;
		flex-direction: column;
	}
	.attack-simulation {
		z-index: 1000;
		padding: 1rem;
		border-radius: 1rem;
		position: absolute;
		top: 1rem;
		right: 1rem;
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
