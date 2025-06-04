<script>
	export let name;
    import * as Icons from 'svelte-feather-icons';
</script>

{#if name && Icons[name]}
    <svelte:component this={Icons[name]} size="24" class="text-primary me-2" />
{/if}
