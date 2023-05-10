<script lang="ts">
	import { ATTACK } from '$lib/classes/Attack/Attack';
	import { uiController } from '$lib/stores/uiControllerStore';

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
</div>

<style>
	.attack-simulation {
		z-index: 1000;
		padding: 10px;
		border-radius: 10px;
		position: absolute;
		bottom: 50vh;
		left: 50vw;
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
