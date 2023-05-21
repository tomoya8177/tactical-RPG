<script lang="ts">
	import type { Unit } from '$lib/classes/Stage/Units/Unit/Unit';

	export let unit: Unit;
</script>

{Number(unit.life * 10).toFixed(0)} / {Number((unit.maxLife || 0) * 10).toFixed(0)}
