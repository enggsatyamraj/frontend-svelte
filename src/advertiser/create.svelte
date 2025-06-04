<script>
	let user = window.user;
	let hasSmtpConf = false;
	let minPattern = (length) => ".{" + length + ",}"

	import CountryList from '../components/country.svelte'
	import _ from 'lodash'

	let finalPassword = '';
	let rfields = undefined, a_fields = undefined, __token = undefined;

	const validateForm = () => {
		finalPassword = btoa(finalPassword);
	}
</script>

<form method="post" action="/advertiser/add" enctype="multipart/form-data" on:submit="{validateForm}">
	<div class="header">
		<div>
			<h4 class="mb-0 font-18">Add an Advertiser</h4>
			<small class="text-muted">To know more, <a href="https://help.trackog.com/en/articles/8107275-adding-an-advertiser" target="_blank">click here. <i class="fa fa-external-link"></i></a></small>
		</div>
	</div>
	<h4 class="card-title">Details</h4>
	<div class="form-group row">
		<label class="col-12 col-form-label">Full Name</label>
		<div class="col-12">
			<input type="text" name="name" class="form-control" required="" placeholder="" pattern="{minPattern(3)}" title="3 characters minimum">
		</div>
	</div>
	<div class="form-group row">
		<label class="col-12 col-form-label">Email</label>
		<div class="col-12">
			<input type="email" name="email" class="form-control" required="" placeholder="">
		</div>
	</div>
	<div class="form-group row">
		<label class="col-12 col-form-label required_field">Account Status</label>
		<div class="col-12">
			<select class="form-control selectpicker" name="status" required="">
				<option value="active">Active</option>
				<option value="pending">Pending</option>
				<option value="disabled">Disabled</option>
				<option value="rejected">Rejected</option>
			</select>
		</div>
	</div>
	<div class="form-group row">
		<label class="col-12 col-form-label">Company (Optional)</label>
		<div class="col-12">
			<input type="text" name="company" class="form-control" placeholder="Company/Organization name">
		</div>
	</div>
	<div class="form-group row">
		<label class="col-12 col-form-label">Reference ID</label>
		<div class="col-12">
			<input type="text" name="rfid" class="form-control" placeholder="Reference ID">
		</div>
	</div>
	<div class="form-group row">
		<label class="col-12 col-form-label">Password (Optional)</label>
		<div class="col-12">
			<input type="password" name="password" id="password" class="form-control" placeholder="8 characters minimum or leave empty to autogenerate" pattern="{minPattern(8)}" title="8 characters minimum" autocomplete="new-password" bind:value={finalPassword}>
		</div>
	</div>
	{#if rfields}
		<script>
			let regFields = _.keys(rfields)
		</script>
		{#each regFields as f}
			<script>
				let hidden = rfields[f].hidden || true;
				let required = rfields[f].required || false;
			</script>
			{#if !hidden}

				{#if f == 'country'}
					<div class="form-group row">
						<label class="col-12 col-form-label">{f}</label>
						<div class="col-12">
							<select name="country" class="form-control selectpicker" required={rfields[f].required ? 'true' : undefined}>
								<option value="">--</option>
								<CountryList hideEarth={true} />
							</select>
						</div>
					</div>
				{:else}
					<div class="form-group row">
						<label class="col-12 col-form-label">{_.upperFirst(f)}</label>
						<div class="col-12">
							<input type="text" name="{f}" class="form-control" required={required ? 'true' : undefined} placeholder="{_.upperFirst(f)}">
						</div>
					</div>
				{/if}
			{/if}
		{/each}
	{/if}

	{#if user.isAdmManager}
	<div class="form-group row">
		<label class="col-12 col-form-label">Account Manager (Optional)</label>
		<div class="col-12">
			<select class="form-control selectVal" name="manager_id[]" multiple="">
				{#if user.type == 'admin'}
				<option value="">--</option>
				{/if}
				{#each managers as a}
				<option value="{a._id}">(ID: {a.display_id}) {a.name}</option>
				{/each}
			</select>
		</div>
	</div>
	{/if}
	<div class="form-group row">
		<label class="col-12 col-form-label">Notes (Optional)</label>
		<div class="col-12">
			<textarea class="form-control" name="note" rows="3"></textarea>
			<small class="help-block">The content will not be displayed to advertiser or publisher</small>
		</div>
	</div>

	{#if a_fields}
	<h4 class="card-title">Signup Questions</h4>
	{#each a_fields as f}
	<div>
		<script>
			let hasRequiredClass = f.required ? required_field : undefined
		</script>
		<label class="col-form-label {hasRequiredClass}">{f['label']}</label>
		<div class="form-group">
		{#if (f["type"] == 'select')}
			<select name="{f['name']}" class="form-control">
				<option value="">Select</option>
				{#each f['options'] as o}
					<option value="{o}">{o}</option>
				{/each}
			</select>
		{:else if (f["type"] == 'multi-select')}
			<select name="{f.name}[]" class="form-control selectpicker selectVal" multiple="">
				{#each f['options'] as o}
					<option value="{o}">{o}</option>
				{/each}
			</select>
		{:else}
			<input class="form-control" type="{f['type']}" name="{f['name']}">
		{/if}
		</div>
	</div>
	{/each}
	{/if}
	<input type="hidden" name="action" value="addAdvertiser">
	<input type="hidden" name="token" id="avAddCsrfToken" value="{__token}">
	<div class="checkbox checkbox-primary">
		<input id="notifyUserEmail" name="notify" type="checkbox" value="yes" disabled={hasSmtpConf ? undefined : 'true'}>
		<label for="notifyUserEmail">Notify this user by email</label>
		{#if !hasSmtpConf}
		<br><small><i>Setup SMTP first by <a href="/customize/smtp.html" target="_blank">Clicking Here</a></i></small>
		{/if}
	</div>
	<div class="modal-footer">
		<button type="submit" class="btn btn-rounded  btn-primary"><i class="fa fa-check-circle"></i> Save</button>
		<button name="button" class="btn btn-rounded createModalClose" showModal=".addAdvModal" style="border: 1px solid #ccc;">Cancel</button>
	</div>
</form>
