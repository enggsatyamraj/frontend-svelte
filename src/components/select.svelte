<script>
	export let options = [];
	export let valKey;
	export let textKey;
</script>

{#if options}
	{#if _.isArray(options)}
		{#each options as option}
		<option value='{option}'>{option}</option>
		{/each}
	{:else}
		{#each options as option}
		<option value='{valKey ? option[valKey] : option.val}'>{textKey ? option[textKey] : option.text}</option>
		{/each}
	{/if}
{/if}
