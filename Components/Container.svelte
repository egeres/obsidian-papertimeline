<script>
    // You can add script logic here if needed
    import Timeline from './Timeline.svelte';
</script>

<style>
.container {
    width: 100%;
    height: 100%;
    /* Add more styling if needed */
    background-color: rgb(52, 19, 19);
}
</style>

<div class="container">
<!-- <slot></slot> This is where child components will be rendered -->
<Timeline/>
</div>
