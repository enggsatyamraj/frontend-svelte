<script>
	export let headers = [];
	export let rows = [];
	
	// Default cell renderer function if none is provided
	function defaultRenderer(value, row) {
		return value;
	}
</script>

<div class="table-responsive">
	<table class="table align-middle table-edge table-hover table-nowrap mb-0">
		<thead class="thead-light">
			<tr>
				{#each headers as header}
					{#if !header.hide}
					<th class={header.headerClass || ''}>
						<a href="javascript: void(0);" class="text-body-secondary">
							{header.title}
						</a>
					</th>
					{/if}
				{/each}
			</tr>
		</thead>

		<tbody class="list">
			{#each rows as row}
			<tr>
				{#each headers as header}
					{#if !header.hide}
					<td class={header.cellClass || ''}>
						{#if header.renderer}
							{@html header.renderer(row[header.key], row)}
						{:else if header.component}
							<svelte:component this={header.component} value={row[header.key]} row={row} />
						{:else}
							{row[header.key]}
						{/if}
					</td>
					{/if}
				{/each}
			</tr>
			{/each}
		</tbody>
	</table>
</div> <!-- / .table-responsive -->
