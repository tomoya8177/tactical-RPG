<script lang="ts">
	import 'aframe';
	import 'aframe-environment-component';
	import 'aframe-extras';
	import '$lib/aframeComponents';
	import { STAGE } from '$lib/classes/Stage/Stage';
	import { Unit } from '$lib/classes/Stage/Units/Unit/Unit';
	import { Actor } from '$lib/classes/Actor/Actor';
	import { uiController } from '$lib/stores/uiControllerStore';
	import { onMount } from 'svelte';
	import { CAMERA } from '$lib/classes/Camera/Camera';
	import { TURN } from '$lib/classes/Turn/Turn';
	import ActionMenu from '$lib/conponents/Organisms/ActionMenu.svelte';
	import ActorData from '$lib/conponents/Organisms/ActorData.svelte';
	import ChooseWeaponMenu from '$lib/conponents/Organisms/ChooseWeaponMenu.svelte';
	import AttackSimulation from '$lib/conponents/Organisms/AttackSimulation.svelte';
	import EquipmentMenu from '$lib/conponents/Organisms/EquipmentMenu.svelte';
	import AmbushConfirmationMenu from '$lib/conponents/Organisms/AmbushConfirmationMenu.svelte';
	let cameraDistance: number = 5;

	onMount(() => {
		if (!document) return;
		const scene = document.querySelector('a-scene');
		if (!scene) return;
		scene.addEventListener('loaded', (e) => {
			STAGE.init();
			CAMERA.init();
			for (let i = 0; i < 8; i++) {
				let actor: Actor = new Actor();
				console.log({ actor });
				let initialTile = STAGE.tiles.getRandomWalkableTile();
				const team = i % 2;
				let unit = new Unit(i, team, 'actor', actor, initialTile);
				unit.updateLifeBar();
				//add([unit]);
				STAGE.units.push(unit);
			}
			TURN.start();
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
{#if $uiController.equipmentMenu && TURN.unit}
	<EquipmentMenu unit={TURN.unit} />
{/if}
{#if $uiController.attackSimulation}
	<AttackSimulation />
{/if}
{#if $uiController.ambushConfirmationMenu && TURN.unit && STAGE.ambushes.of(TURN.unit)}
	<AmbushConfirmationMenu ambush={STAGE.ambushes.of(TURN.unit)} />
{/if}
<a-scene
	id="scene"
	cursor="rayOrigin: mouse;
	"
	raycaster="objects: :not(.unclickable)"
	renderer="antialias: true;
				colorManagement: true;
				sortObjects: true;
				physicallyCorrectLights: false;
				maxCanvasWidth: 1920;
				maxCanvasHeight: 1920;"
>
	<a-assets>
		<img src="assets/water.jpg" id="water" />
	</a-assets>
	<a-sky color="#bbe" />
	<!-- show me css for lightorange -->

	<a-entity
		light="type:directional;
		 castShadow:true;
		 intensity: 1;
	shadowCameraTop: 5;
	shadowCameraBottom: -20;
	shadowCameraLeft: -15;
	shadowCameraRight: 15;
	color:#fdd9b5;
	shadowMapHeight:1024;
	shadowMapWidth:1024;
	"
		position="100 100 100"
	/>
	<a-entity
		light="type: hemisphere; intensity: 0.5;
	color:lightblue;
	groundColor:grey"
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
	<a-entity id="tilesContainer" />
</a-scene>
