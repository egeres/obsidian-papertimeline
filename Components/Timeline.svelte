<script>
	import { onMount } from "svelte";

	let events = [
		// { date: new Date(2022, 6, 15), title: "Longus titlus Event 1" },
		{ date: new Date(2015, 0, 1), title: "Event 2" },
		{ date: new Date(2015, 11, 31), title: "Event 2" },
		{ date: new Date(2020, 6, 15), title: "This paper was actually important" },
		// { date: new Date(2023, 1, 1), title: "Event 2" },
		// ... other events
	];

	let pixelsPerYear = 100;
	let zoomLevel = 1;
	let isDragging = false;
	let startX;
	let targetScrollLeft = 0;
	let currentScrollLeft = 0;

    // Start and End Date of the Timeline
    const startDate = new Date(2015, 0, 1); // Example start date
    const endDate = new Date(2025, 0, 1);   // Example end date

    // Calculate the number of years between startDate and endDate
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const numberOfYears = endYear - startYear;

    const calculatePosition = (date, pixelsPerYear) => {
        // Calculate the difference in days

        console.log("A:" + date);
        console.log("B:" + startDate);
        const diffTime = Math.abs(new Date(date) - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Convert days to years, then to pixels
        const years = diffDays / 365.25; // Average including leap years

        console.log(years * pixelsPerYear + "        " + diffDays);
        return years * pixelsPerYear;
    };

	onMount(() => {});

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
	{#each events as event}
		<div class="event" style="left: {calculatePosition(event.date, pixelsPerYear)}px; writing-mode: vertical-rl">
            {event.title}
            <!-- <div class="event-line"></div>
			<div class="event-label" style="writing-mode: vertical-rl;">
                {event.title}
			</div> -->
		</div>
	{/each}
    {#each Array(numberOfYears + 1) as _, index (index)}
        <div class="tick-mark" style="left: {pixelsPerYear * index}px;">
            <div class="year-label">
                {startYear + index}
            </div>
        </div>
    {/each}
</div>

<style>

    .event {
		position: absolute;
		bottom: 0;
		background-color:red;
		/* width:20px; */
		border-left: 2px solid white;
	}

	.timeline {
		width: 100%;
		height: 300px;
		position: relative;
		overflow-x: auto;
		white-space: nowrap;
		border-bottom: 2px solid white;
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

	.year-label {
		writing-mode: vertical-rl;
		transform-origin: bottom;
		position: absolute;
		bottom: 0;
	}
</style>
