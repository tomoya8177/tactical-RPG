<script lang="ts">
	import Tile from '../../AframeEntityComponents/Molecules/Tile.svelte';

	import 'aframe';
	import 'aframe-environment-component';
	import 'aframe-extras';
	import '$lib/aframeComponents';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { Unit } from '$lib/classes/Unit/Unit';
	import { units } from '$lib/stores/unitStore';
	import { Actor } from '$lib/classes/Actor/Actor';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { CAMERA } from '$lib/classes/Camera/Camera';
	import { TURN } from '$lib/classes/Turn/Turn';
	import ActionMenu from '$lib/conponents/Organisms/ActionMenu.svelte';
	import ActorData from '$lib/conponents/Organisms/ActorData.svelte';
	import ChooseWeaponMenu from '$lib/conponents/Organisms/ChooseWeaponMenu.svelte';
	import AttackSimulation from '$lib/conponents/Organisms/AttackSimulation.svelte';
	let cameraDistance: number = 5;

	let initialTile = STAGE.findTiles()[0];
	console.log({ initialTile });

	setTimeout(() => {
		STAGE.setCamera();
		TURN.start();
		//		STAGE.startWaitTurn();
	}, 500);
	onMount(() => {
		if (!document) return;
		const scene = document.querySelector('a-scene');
		if (!scene) return;
		scene.addEventListener('loaded', (e) => {
			CAMERA.init();
			for (let i = 0; i < 8; i++) {
				let actor: Actor = new Actor();
				console.log({ actor });
				let initialTile = STAGE.findTiles()[0];
				let unit = new Unit(i, 'actor', actor, initialTile);
				units.add([unit]);
			}
			console.log({ e });
		});
	});
</script>

{#if $uiController.actorData && STAGE.unitOnFocus}
	<ActorData unit={STAGE.unitOnFocus} />
{/if}
{#if $uiController.actionMenu && TURN.unit}
	<ActionMenu unit={TURN.unit} />
{/if}
{#if $uiController.chooseWeaponMenu && TURN.unit}
	<ChooseWeaponMenu unit={TURN.unit} />
{/if}
{#if $uiController.attackSimulation}
	<AttackSimulation />
{/if}
<a-scene
	id="scene"
	outline
	cursor="rayOrigin: mouse;
	"
	renderer="antialias: true;
				colorManagement: true;
				sortObjects: true;
				physicallyCorrectLights: false;
				maxCanvasWidth: 1920;
				maxCanvasHeight: 1920;"
>
	<a-assets />
	<a-entity
		environment="
		preset: contact;
	skyType: gradient;
	skyColor: skyblue;
	ground:flat;
	grid:1x1
  "
	/>
	<a-entity tactics-navigation id="rig" position="0 0 0">
		<a-entity class="offsetter" rotation="0 -45 0">
			<a-camera
				id="camera"
				fov="50"
				position="0 {cameraDistance} {cameraDistance}"
				rotation="-45 0 0"
				wasd-controls-enabled="false"
				look-controls-enabled="false"
			/>
		</a-entity>
	</a-entity>
	<a-entity>
		{#each STAGE.tiles as tile}
			<Tile {tile} />
		{/each}
	</a-entity>
</a-scene>
