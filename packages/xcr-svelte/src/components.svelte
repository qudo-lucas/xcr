{#each components as { component, props, children } (component.default)}
	<svelte:component this={component.default} components={children} {...props} />
{/each}

<script>
export let components;
export let props;
</script>