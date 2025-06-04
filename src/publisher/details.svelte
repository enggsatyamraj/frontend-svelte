<script>
	import { onMount } from 'svelte';
	import { localize } from '../lib/localize'
	import { isAdmin, onlyAdmin, hasFeature } from '../lib/auth'
	import { PUBLISHER_GROUPING } from '../lib/features'
	import CountryList from '../components/country.svelte'
	
	let publisher = {};
	// let message = null;
	let errors = {};
	let canAddTags = [];
	let assignedTags = [];
	let pubTags = [];
	let canChangeStatus = false;
	let user = {};
	let org = {};
	let publishers = [];
	let managers = [];
	let bdmManagers = [];
	let billingCompanies = [];
	let p_fields = [];
	let pref = {};
	
	// let country = [];
	// let assignedManagers = [];
	// let assignedManagerIds = [];
	// let refById = null;

	
	

	const t = localize.t;

	// const message = (msg) => {
	// 	// Dummy implementation for messages
	// 	console.log('Message:', msg);
	// 	return null;
	// };

	const errorsFunc = (errs, field) => {
		// Dummy implementation for errors
		if (errs && errs[field]) {
			console.error('Error in field', field, ':', errs[field]);
			return errs[field];
		}
		return null;
	};


	const admin = {
		verifyEmail:(email,email_msg,publisher)=>{
			console.log('verifyEmail',email,email_msg,publisher);
		}
	};

	let finalPassword = '';
	const validateForm = () => {
		finalPassword = btoa(finalPassword);
	}

	let country = (publisher.region?.country || 'XX');
	let countryJsonString = JSON.stringify([country]);

	let assignedManagers = publisher.getManagers ? publisher.getManagers(false) : {};
	let assignedManagerIds = Object.keys(assignedManagers);
	let assignedManagerIdsJsonString = JSON.stringify(assignedManagerIds);

	let refById = publisher.ref_by ?? null;
	refById = refById ? refById : null;
	let refByIdJsonString = JSON.stringify(refById || []);

	let prtId = null;
	let ringbaInt = undefined;
</script>


<!-- {include campaign/modals/trackingValue.html} -->
<!-- {include layouts/opts/tagsinput.html} -->
<!-- {include tpl/methods/footer.html} -->
<div class="content">
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-12">
				<form method="post" action="" enctype="multipart/form-data" id="pub-detail-form" on:submit="{validateForm}">
					<div class="card card-body primary-shadow m-b-20">
						<h4 class="card-title">{t('Details')}</h4>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Username')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="username" class="form-control" value="{publisher.username}">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Name')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" class="form-control" name="name" value="{publisher.name}" required="">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Email')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="email" id="email" class="form-control" name="email" value="{publisher.email}" required="">
							</div>
						</div>
						<script>
							let canAddTags = pref.publishers["add_pub_tags"] ?? [];
						</script>
						{#if !canAddTags || canAddTags.includes(user._id)}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Tags')}</label>
							<div class="col-sm-9 col-md-6">
								<select name="tags[]" multiple="true" class="form-control selectVal" data-value='{JSON.stringify(assignedTags)}'>
									{#each pubTags as tg}
									<option value="{tg._id}">{tg.name}</option>
									{/each}
								</select>
							</div>
						</div>
						{/if}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Phone')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="tel" class="form-control" name="phone" value="{publisher.phone ?? ''}">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Skype')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="tel" class="form-control" name="skype" value="{publisher.skype ?? ''}">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Company')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="company" class="form-control" value="{publisher.company}" placeholder="Company/Organization name">

							</div>
						</div>
						{#if canChangeStatus}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Status')}</label>
							<div class="col-sm-9 col-md-6">
								<select name="status" class="form-control" data-placeholder="Choose a publisher status" value="{publisher.status}">
									<option value="active">{t('Active')}</option>
									<option value="pending">{t('Pending')}</option>
									<option value="disabled">{t('Disabled')}</option>
									<option value="rejected">{t('Rejected')}</option>
									<option value="deleted">{t('Deleted')}</option>
									<option value="banned">{t('Banned')}</option>
								</select>
								<span class="help-block text-danger">{errorsFunc(errors, "status")}</span>
							</div>
						</div>
						{/if}

						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Address')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="region[address]" class="form-control" value="{publisher.region?.address}">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Country')}</label>
							<div class="col-sm-9 col-md-6">
								<select name="region[country]" data-value='{countryJsonString}' class="selectVal form-control selectpicker">
									<CountryList/>
								</select>
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('State')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="region[state]" class="form-control" value="{publisher.region?.state}">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('City')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="region[city]" class="form-control" value="{publisher.region?.city}">
							</div>
						</div>
						<div class="form-group row" mb-4>
							<label class="col-sm-3 col-form-label">{t('Zipcode')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="region[zipcode]" class="form-control" value="{publisher.region?.zipcode}">
							</div>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Tax ID')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="tax_id" class="form-control" value="{publisher.tax_id}">
							</div>
							<small class="help-block"><i>VAT / GST / PAN</i></small>
						</div>
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Account Manager (Optional)')}</label>
							<div class="col-sm-9 col-md-6">
								<select class="form-control selectVal" name="manager_id[]" data-value='{assignedManagerIdsJsonString}' multiple="">
									{#each managers as a}
									<option value="{a._id}">{a.name} - ({a.type})</option>
									{/each}
								</select>
							</div>
						</div>
						<!-- {include report/common/comparison.html} -->
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Referred by')}</label>
							<div class="col-sm-9 col-md-6">
								<select data-show-pubname='1' data-pub-count='{publishers.length}' class="form-control selectVal publisherSearch" name="ref_by" data-value='{refByIdJsonString}'>
									<option value="">--</option>
									
								</select>
							</div>
						</div>
						{#if hasFeature(PUBLISHER_GROUPING) && isAdmin()}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Parent Publisher')}</label>
							<div class="col-sm-9 col-md-6">
								<script>
								let prtId = publisher.prtid ?? null;
								prtId = prtId ? prtId : null;
								let prtIdJsonString = JSON.stringify((prtId ?? "-"));
								</script>
								<select data-show-pubname='1' data-pub-count='{publishers.length}' class="form-control selectVal publisherSearch" name="prtid" data-value='{prtIdJsonString}'>
									<option value="">--</option>
									
								</select>
							</div>
						</div>
						{/if}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Reference ID')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="text" name="rfid" maxlength="50" class="form-control" value="{publisher.rfid}" pattern="([0-9a-zA-Z-_]{1,50})">
								<small class="text-muted"><i>The reference id for the publisher</i></small>
							</div>
						</div>
						{#if onlyAdmin() && bdmManagers}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Sales Manager')}</label>
							<div class="col-sm-9 col-md-6">
								<select class="form-control selectVal" name="bdm" data-value='{JSON.stringify((publisher.bdm ?? ""))}'>
									<option value="">--</option>
									{#each bdmManagers as bdm}
									<option value="{bdm._id}">{bdm.name} - ({bdm.type})</option>
									{/each}
								</select>
							</div>
						</div>
						{/if}
						{#if ringbaInt && (ringbaInt.pub_ids ?? []).length > 0}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Ringba Publisher')}</label>
							<div class="col-sm-9 col-md-6">
								<label class="switch mb-0 switch-xs">
									<input type="checkbox" class="dynamic_hide_show ringba-switch" data-show-target=".assing_ringba_pubs" checked={publisher.rbpub ? 'true' : undefined}> 
									<span class="slider slider-xs round"></span>
								</label>
							</div>
						</div>
						<div class="assing_ringba_pubs {!publisher.rbpub ? 'hidden' : ''}">
							<div class="form-group row">
								<label class="col-sm-3 col-form-label">{t('Select Ringba Publisher')}</label>
								<div class="col-sm-9 col-md-6">
									<select class="form-control selectVal" name="rbpub" value="{publisher.rbpub}">
										<option value="">--</option>
										{#each ringbaInt.pub_ids as pub, i}
										<option value="{i}">{pub}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>
						{/if}
						{#if billingCompanies}
						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Billing Company')}</label>
							<div class="col-sm-9 col-md-6">
								<select class="selectVal form-control selectpicker" name="blc" data-value='{JSON.stringify([publisher.blc || ""])}'>
									<option value="">--</option>
									{#each billingCompanies as blc}
									<option value="{blc._id}">{blc.company} - ({blc.country})</option>
									{/each}
								</select>
							</div>
						</div>
						{/if}
						<hr class="row col-sm-12">

						<div class="form-group row mb-4">
							<label class="col-sm-3 col-form-label">{t('Change Password')}</label>
							<div class="col-sm-9 col-md-6">
								<input type="password" class="form-control" name="npassword" id="npassword" placeholder="" autocomplete="new-password">
								<span class="help-block text-danger">{errorsFunc(errors, "password")}</span>
								<small class="help-block">{t('Should be atleast 8 characters')}</small>
							</div>
						</div>
						<input type="hidden" name="action" value="details">
					</div>
					{#if p_fields}
					<div class="card m-b-20 card-body">
						<h4 class="card-title">
							<span class="float-right">
								<a href="publisher/info/{publisher._id}?action=afields" data-message="Are you sure you want to remove the custom data??" class="delete btn btn-rounded card-title btn-outline-danger"><i class="fa fa-trash"></i> Delete Signup Questions</a>
								<a href="/customize/customFieldPub.html" class="btn btn-rounded card-title btn-outline-primary" target="_blank">Modify Signup Questions <i class="fa fa-external-link"></i></a>
							</span>
							Signup Questions
						</h4>
						{#each p_fields as f}
						<script>
							let fields = publisher.meta["afields"] ?? [];
							let val = fields[f["name"]] ?? null;
						</script>
						<div class="form-group row">
							<label class="col-sm-3 col-form-label {user.type != 'admin' && f['required'] ? 'required_field' : ''}">{f["label"]}</label>
							<div class="col-sm-9 col-md-6">
							{#if f["type"] == "file"}
								<input type="{f['type']}" name="{f['name']}" class="form-control">
								<a href="https://static.trackog.com/images/{val}" target="_blank">{val}</a>
							{:else if f["type"] == 'select'}
								<select name="cfield[{f['name']}]" class="form-control" value="{val}" required={user.type != 'admin' && f['required'] ? 'true' : undefined}>
									<option value="">Select</option>
									{#each f['options'] as o}
										<option value="{o}">{o}</option>
									{/each}
								</select>
							{:else if f["type"] == 'multi-select'}
								<select name="cfield[{f['name']}][]" class="form-control selectpicker selectVal" data-value='{JSON.stringify((Array.isArray(val)?val:[val]))}' multiple="" required={user.type != 'admin' && f['required'] ? 'true' : undefined}>
									{#each f['options'] as o}
										<option value="{o}">{o}</option>
									{/each}
								</select>
							{:else}
								<input type="{f['type']}" name="cfield[{f['name']}]" class="form-control" value="{val}" placeholder="{f['label']}" required={user.type != 'admin' && f['required'] ? 'true' : undefined}>
							{/if}
							</div>
						</div>
						{/each}
						<input type="hidden" name="action" value="signupDetails">
					</div>
					{/if}
				</form>
			</div>
		</div>
	</div>
</div>
