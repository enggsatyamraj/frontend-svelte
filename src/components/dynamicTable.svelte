<script>
	export let endpoint;
	export let rowsKey;
	export let headersKey;
	export let customHeaders = []; // Allow for header customization

	import { onMount } from 'svelte';
	import Table_C from './table.svelte'

	let rows = [], headers = [];
	let page = 1;
	let limit = 25;
	let total = 0;
	let search = '';

	// Debounce timer for search
	let debounceTimeout;

	// Fetch data from backend
	async function fetchData() {
		const params = new URLSearchParams({
			page,
			limit,
			search,
			'fetch_data': 1
		});

		const res = await fetch(`${endpoint}?${params.toString()}`);
		const data = await res.json();

		rows = data[rowsKey];
		
		// Merge backend headers with custom formatting options
		headers = data[headersKey].map(header => {
			const customHeader = customHeaders.find(ch => ch.key === header.key);
			return customHeader ? { ...header, ...customHeader } : header;
		});
		
		page = data.page;
		limit = data.limit;
		total = data.total;
	}

	// Load initial data
	onMount(fetchData);

	// Reactively fetch when search or page changes
	$: if (page || search) {
		fetchData();
	}

	function handleSearch(event) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			page = 1; // reset to first page on new search
			search = event.target.value;
		}, 300); // debounce search
	}
</script>

<div class="mb-4">
	<input 
		type="text" 
		class="form-control" 
		placeholder="Search..." 
		on:input={handleSearch} 
	/>
</div>

<Table_C {rows} {headers} />

<div class="d-flex justify-content-between align-items-center mt-3">
	<div>
		Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries
	</div>
	<div class="pagination">
		<button 
			class="btn btn-sm btn-outline-secondary me-2" 
			disabled={page === 1} 
			on:click={() => page--}
		>
			Previous
		</button>
		<button 
			class="btn btn-sm btn-outline-secondary" 
			disabled={page * limit >= total} 
			on:click={() => page++}
		>
			Next
		</button>
	</div>
</div>
