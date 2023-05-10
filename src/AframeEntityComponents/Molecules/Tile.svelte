<script lang="ts">
	import '$lib/aframeComponents';
	import type { Tile } from '$lib/classes/Stage/Tile/Tile';

	export let tile: Tile;
</script>

<a-entity stage-tile-component id={tile.id} position={tile.position}>
	{#if tile.isGround}
		<a-box
			class="ground"
			width="1"
			height={tile.position.y}
			depth="1"
			position="0 -{tile.position.y / 2} 0"
			color={tile.type == 'walkable' ? '#7BC8A4' : 'blue'}
		/>
	{/if}
	<!-- <a-text value={`${tile.id}`} position="0 0.1 0" rotation="-90 0 0" align="center" /> -->
	<a-plane
		width="1"
		height="1"
		color={tile.type == 'walkable' ? '#7BC8A4' : 'blue'}
		rotation="-90 0 0"
	/>
	<a-plane
		class="highlight"
		visible="false"
		width="1"
		height="1"
		position="0 0.01 0"
		opacity="0.5"
		rotation="-90 0 0"
	/>
	<a-plane
		class="attack-target"
		visible="false"
		width="1"
		height="1"
		position="0 0.01 0"
		opacity="0.5"
		color="red"
		rotation="-90 0 0"
	/>
</a-entity>
