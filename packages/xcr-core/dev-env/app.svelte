<div>
    {#each $components as { component, children, props }}
        <svelte:component this="{component.default}" components="{children}" { ...props }/>
    {/each}
</div>

<script>
    import { components } from "./service.js";
</script>
