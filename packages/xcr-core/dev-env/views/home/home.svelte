<h1>HOME</h1>

<button on:click={() => service.send("TAB1")}>
    Tab 1
</button>

<button on:click={() => service.send("TAB2")}>
    Tab 2
</button>

{#each components as { component }}
    <svelte:component this={component.default} />
{/each}

<script>
import service from "../../service.js";

export let components;
</script>