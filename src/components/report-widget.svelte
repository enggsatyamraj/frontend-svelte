<script>
	export let title;
	export let currency;
	export let number;
	export let subTitle;
	export let icon;

	import * as Icons from 'svelte-feather-icons';
</script>

<div class="card border-0">
	<div class="card-body">
		<div class="row">
			<div class="col d-flex justify-content-between">

				<div>
					<!-- Title -->
					<h5 class="d-flex align-items-center text-uppercase text-body-secondary fw-semibold mb-2">
						<span class="legend-circle-sm bg-success"></span>
						{title}
					</h5>

					<!-- Subtitle -->
					<h2 class="mb-0">
						{currency ? window.$.Components.currencySymbol(currency) : undefined} {number}
					</h2>

					<!-- Comment -->
					{#if subTitle}
					<p class="fs-6 text-body-secondary mb-0">
						{subTitle}
					</p>
					{/if}
				</div>

				<span class="text-primary">
					{#if icon && Icons[icon]}
					  <svelte:component this={Icons[icon]} size="24" class="text-primary" />
					{/if}
				</span>
			</div>
		</div> <!-- / .row -->
	</div>
</div>
