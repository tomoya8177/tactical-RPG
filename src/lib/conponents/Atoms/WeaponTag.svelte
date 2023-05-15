<script lang="ts">
	import type { Equipment } from '$lib/classes/Equipment/Equipment';

	export let weapon: Equipment;
	export let level: number;
</script>

{weapon.name}
(Lv: {level})
