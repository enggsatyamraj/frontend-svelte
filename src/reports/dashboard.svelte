<script>
	import Widget from '../components/report-widget.svelte'
	let currency = window.user?.region?.currency || 'USD';
</script>
<h1 class="h2">Dashboard</h1>
<div class="row">
	<div class="col-xxl-6">
		<div class="row">
			<div class="col-md-6">

				<!-- Card -->
				<Widget title={'Clicks'} number=0 icon={'MousePointerIcon'} currency={currency}></Widget>
			</div>

			<div class="col-md-6">
				<!-- Card -->
				<Widget title={'Conversions'} number=0 icon={'TargetIcon'} currency={currency}></Widget>
			</div>        
		</div> <!-- / .row -->
	</div>

	<div class="col-xxl-6">
		<div class="row">
			<div class="col-md-6">
				<!-- Card -->
				<Widget title={'Payout'} number=0 icon={'DollarSignIcon'} currency={currency}></Widget>
			</div>

			<div class="col-md-6">
				<!-- Card -->
				<Widget title={'Revenue'} number=0 icon={'ZapIcon'} currency={currency}></Widget>
			</div>
		</div> <!-- / .row -->
	</div>
</div> <!-- / .row -->
