<script>
	let pixelsPerYear = 300;
	let zoomLevel = 1;
	let isDragging = false;
	let startX;
	let targetScrollLeft = 0;
	let currentScrollLeft = 0;

	function startDrag(event) {
		isDragging = true;
		startX = event.clientX;
		event.preventDefault();
	}

	function endDrag(event) {
		isDragging = false;
	}

	function handleMouseMove(event) {
		if (isDragging) {
			const timeline = document.querySelector(".timeline");
			const dx = event.clientX - startX;
			timeline.scrollLeft -= dx;
			startX = event.clientX;
		}
	}

	function handleScroll(event) {
		const timeline = document.querySelector(".timeline");
		targetScrollLeft += event.deltaY;

		targetScrollLeft = Math.min(
			Math.max(0, targetScrollLeft),
			timeline.scrollWidth - timeline.clientWidth
		);
		smoothScroll();
		event.preventDefault();
	}

	function smoothScroll() {
		// Linear interpolation
		currentScrollLeft += (targetScrollLeft - currentScrollLeft) * 0.05;
		const timeline = document.querySelector(".timeline");
		timeline.scrollLeft = currentScrollLeft;

		if (Math.abs(targetScrollLeft - currentScrollLeft) > 1) {
			requestAnimationFrame(smoothScroll);
		}
	}

	function handleZoom(event) {
		if (event.ctrlKey) {
			// zoomLevel += event.deltaY * -0.01;
			// zoomLevel = Math.min(Math.max(.125, zoomLevel), 4);
			// pixelsPerYear = 300 * zoomLevel;

			pixelsPerYear += 20 * Math.sign(event.deltaY);
			pixelsPerYear = Math.min(Math.max(200, pixelsPerYear), 400);
		} else {
			handleScroll(event);
		}
		event.preventDefault();
	}
</script>

<div
	class="timeline"
	role="presentation"
	on:wheel={handleZoom}
	on:mousedown={startDrag}
	on:mouseup={endDrag}
	on:mouseleave={endDrag}
	on:mousemove={handleMouseMove}
>
	{#each Array(10) as _, index (index)}
		<!-- 5 years for demo, adjust as needed -->
		<div class="tick-mark" style="left: {pixelsPerYear * index}px;">
			{#if index === 7}
				<!-- Assuming the current year is in the middle -->
				<div class="current-date">
					{new Date().toISOString().slice(0, 10)}
				</div>
			{/if}
			<div class="year-label">
				{new Date().getFullYear() - 7 + index}
			</div>
		</div>
	{/each}
</div>

<style>
	.timeline {
		width: 100%;
		height: 300px;
		position: relative;
		overflow-x: auto;
		white-space: nowrap;
	}

	.timeline::-webkit-scrollbar {
		display: none;
	}

	.tick-mark {
		position: absolute;
		bottom: 0;
		height: 50px;
		width: 2px;
		background-color: white;
	}

	.current-date {
		writing-mode: vertical-rl;
		transform-origin: bottom;
		position: absolute;
		transform: translateX(0%) translateY(-100%);
	}

	.year-label {
		writing-mode: vertical-rl;
		transform-origin: bottom;
		position: absolute;
		bottom: 0;
	}
</style>
