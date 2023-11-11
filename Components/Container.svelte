<script>
	import Timeline from "./Timeline.svelte";
	export let data;
</script>

<div class="container">
	<Timeline {data} />
</div>

<style>
	.container {
		position: absolute;
		top: 300;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
