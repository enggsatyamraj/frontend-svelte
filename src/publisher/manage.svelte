<script>
	import _ from 'lodash'
	import { localize } from '../lib/localize'
	// import { isAdmin, onlyAdmin, hasFeature } from '../lib/auth'
	import { BD_SALES_MANAGER } from '../lib/features'

	import DynamicTable_C from '../components/dynamicTable.svelte'
	import StatusComp from '../components/status.svelte'

	const customHeaders = [
		{
			key: 'name',
			renderer: (value, row) => {
				return `<a target="_blank" href="/publisher/info/${row.display_id}" class="fw-bold text-primary">${value}</a>`;
			}
		},
		{
			key: 'status',
			component: StatusComp
		},
		{
			key: 'created',
			renderer: (value, row) => {
				return localize.date(value);
			}
		},
		{
			key: 'actions',
			renderer: (_, row) => {
				return `
					<div class="d-flex justify-content-end">
						<a class="btn btn-sm btn-outline-primary me-2" href="/publisher/details/${row.display_id}">Edit</a>
						<a class="btn btn-sm btn-outline-danger" data-id="${row.display_id}">Delete</a>
					</div>
				`;
			}
		}
	];
</script>

<h1 class="h2">Affiliates</h1>
<div class="card">
	<DynamicTable_C 
		endpoint={'/publisher/manage2.json'}
		rowsKey='publishers'
		headersKey='headers'
		customHeaders={customHeaders}
	></DynamicTable_C>
</div>

