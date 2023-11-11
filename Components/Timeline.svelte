<script>
    // Script logic can go here if needed
  </script>
  
  <style>
    .timeline {
      width: 100%;
      height: 300px;
      position: relative;
      /* Add more styling for the timeline here */
    }
  
    .tick-mark {
        position: absolute;
        bottom: 0;
        height: 50px;
        width: 0;
        border-left: none;
        background-color: transparent;
        box-shadow: 0px 0px 0px 0.5px white;
    }
  </style>
  
  <div class="timeline">
    <!-- Generate tick marks for each month -->
    {#each Array(12) as _, index}
      <div class="tick-mark" style="left: {index * 100 / 11}%;">{index + 1}</div>
    {/each}
  </div>
  