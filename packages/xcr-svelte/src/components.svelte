{#each components as { component, props, children }}
	<svelte:component this={component.default || component} components={children} {...props} />
{/each}

<script>
export let components;
export let props;
</script>