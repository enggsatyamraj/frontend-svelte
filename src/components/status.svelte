<script>
	import _ from 'lodash';
	export let value;	

	const successClass = 'bg-success';
	const warningClass = 'bg-warning';
	const dangerClass = 'bg-danger';

	const handleStatusColor = (val) => {
		switch (_.toLower(val)) {
			case 'active':
			case 'paid':
			case 'approved':
			case 'authenticated':
			case 'progress':
				return successClass;

			case 'paused':
			case 'halted':
			case 'disabled':
			case 'overdue':
			case 'payment_overdue':
			case 'failure':
			case 'banned':
			case 'needs_attention':
			case 'payment_due':
			case 'rejected':
			case 'suspended':
				return warningClass;

			case 'pending':
			case 'completed':
			case 'extended':
			case 'future':
				return 'bg-info';

			case 'deleted':
			case 'cancelled':
			case 'error':
			case 'inactive':
				return dangerClass;
		}

		return 'bg-info';
	}
</script>

<span class="legend-circle {handleStatusColor(value) || 'bg-secondary'}"></span>
{value}

