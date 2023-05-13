<script lang="ts">
	import { cancelButtonController } from '$lib/cancelButtonController';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { TURN } from '$lib/classes/Turn/Turn';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('layout mounted');
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				console.log('escape pressed');
				cancelButtonController();
			}
		});
	});
</script>

<slot />
