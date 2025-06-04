<script>
	import _ from 'lodash'
	import { localize } from '../lib/localize'
	import { isAdmin, onlyAdmin, hasFeature } from '../lib/auth'
	import { BD_SALES_MANAGER } from '../lib/features'
	import { minPattern } from '../lib/validation'
	
	import CountryList from '../components/country.svelte'
	import Options from '../components/select.svelte'

	let org = window.org, pref = window.pref, user = window.user;
	let ringbaInt = undefined, p_fields = undefined, __token = undefined, approvalRequest = undefined;
	let finalPassword = '', billingCompanies = undefined, managers = undefined, hasSmtpConf = undefined;

	let countryList = [user.region?.country || org.region?.country || 'IN'];

	let canAddTags = pref.publishers?.add_pub_tags || [];
	let tags = false ? (publisher.tags || []) : [];

	const validateForm = () => {
		finalPassword = btoa(finalPassword);
	}
</script>
<div class="card">
	<div class="card-body">
		<!-- <div class="modal-content"> -->
			<form method="post" action="/publisher/add" enctype="multipart/form-data" on:submit="{validateForm}">
				<div class="modal-header">
					<div>
						<h4 class="mb-0 font-18">{localize.t('Add ' + localize.displayPartnerText(org.type, 'Publisher'))}</h4>
						<small class="text-muted">To know more, <a href="#" target="_blank">click here. <i class="fa fa-external-link"></i></a></small>
					</div>
				</div>
				<h4 class="card-title text-primary" style="font-size: 18px;">{localize.t('Basic Details')}</h4>
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Full Name')}</label>
					<div class="col-12">
						<input type="text" name="name" class="form-control" placeholder="Full name of the {localize.displayPartnerText(org.type, 'publisher')}" required="" pattern="{minPattern(3)}" title="3 characters minimum">
					</div>
				</div>
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Email')}</label>
					<div class="col-12">
						<input type="email" name="email" class="form-control" placeholder="{localize.replace('Unique Publisher Email', org.type)}" required="">
					</div>
				</div>
				<script type="text/javascript">
					let approvalRequest = pref.publishers?.approval_request || [];
				</script>
				{#if _.size(approvalRequest) == 0 || (isAdmin() && _.includes(approvalRequest, user._id))}
				<div class="form-group row">
					<label class="col-12 col-form-label required_field">{localize.t('Account Status')}</label>
					<div class="col-12">
						<select class="form-control selectpicker" name="status" required="">
							<option value="active">{localize.t('Active')}</option>
							<option value="pending">{localize.t('Pending')}</option>
							<option value="disabled">{localize.t('Disabled')}</option>
							<option value="rejected">{localize.t('Rejected')}</option>
						</select>
					</div>
				</div>
				{/if}
				{#if pref.getRegistrationField && pref.getRegistrationField('publisher')['phone']['required']}
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Phone')}</label>
						<div class="col-12">
							<input type="tel" class="form-control" name="phone" placeholder="Phone number" required="">
						</div>
					</div>
				{/if}
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Country')}</label>
					<div class="col-12">
						{#if pref.getRegistrationField && pref.getRegistrationField('publisher')['country']['required']}
							<select name="region[country]" data-value='{JSON.stringify(countryList)}' placeholder="Country" class="selectVal form-control selectpicker" required = "Please input Country">
								<CountryList/>
							</select>
						{:else}
							<select name="region[country]" data-value='{JSON.stringify(countryList)}' placeholder="Country" class="selectVal form-control selectpicker">
								<CountryList />
							</select>
						{/if}
					</div>
				</div>
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Company (Optional)')}</label>
					<div class="col-12">
						<input type="text" name="company" class="form-control" placeholder="Company/Organization name">
					</div>
				</div>
				{#if billingCompanies}
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Billing Company (Optional)')}</label>
					<div class="col-12">
						<select class="form-control selectVal" name="blc">
							<option value="">--</option>
							<Options options={billingCompanies} valKey={'_id'} textKey={'company'}></Options>
						</select>
					</div>
				</div>
				{/if}
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Reference ID')}</label>
					<div class="col-12">
						<input type="text" name="rfid" class="form-control" placeholder="Reference ID">
					</div>
				</div>
				<!-- \{script $ringbaInt = \Modules\Integrate\Ringba\Helper::checkRingbaInt($org)\} -->
				{#if false && ringbaInt && _.size(ringbaInt.pub_ids || []) > 0}
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Ringba Publisher')}</label>
					<div class="col-12">
						<label class="switch mb-0 switch-xs">
							<input type="checkbox" class="dynamic_hide_show" data-show-target=".assing_ringba_pubs"> 
							<span class="slider slider-xs round"></span>
						</label>
					</div>
				</div>
				<script>
					let ringbaPubs = ringbaInt ? ringbaInt.pub_ids : [];
				</script>
				<div class="assing_ringba_pubs hidden">
					<div class="form-group row">
						<div class="col-12">
							<select class="form-control selectVal" name="rbpub">
								<Options options={ringbaPubs} valKey={'_id'} textKey={'name'}></Options>
							</select>
						</div>
					</div>
				</div>
				{/if}
				{#if onlyAdmin() && managers && hasFeature(BD_SALES_MANAGER)}
				<div class="form-group row">
					<label class="col-12 col-form-label">{localize.t('Sales Manager (Optional)')}</label>
					<div class="col-12">
						<select class="form-control selectVal" name="bdm">
							<option value="">--</option>
							<Options options={managers} valKey={'_id'} textKey={'name'}></Options>
						</select>
					</div>
				</div>
				{/if}
				<div class="row">
					<div class="col-md-12">
						<div class="d-flex align-items-center">
							<label class="switch mb-0 switch-xs">
								<input type="checkbox" class="dynamic_hide_show" data-show-target="#advancedOption"> 
								<span class="slider slider-xs round"></span>
							</label>
							<h4 class="ml-2 mb-0 text-primary" style="font-size: 18px;">{localize.t('Advanced Setup')}</h4>
						</div>
					</div>
				</div>
				<div class="hidden mt-1" id="advancedOption">
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Password (Optional)')}</label>
						<div class="col-12">
							<input type="password" name="password" id="password" class="form-control" placeholder="Leave empty to Auto Generate" pattern="{minPattern(8)}" title="8 characters minimum" autocomplete="new-password" bind:value={finalPassword}>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Account Manager (Optional)')}</label>
						<div class="col-12">
						<select class="form-control selectVal" name="manager_id[]" multiple="">
							{#if isAdmin()}
							<option value="">--</option>
							{/if}
							<Options options={managers} valKey={'_id'} textKey={'name'}></Options>
						</select>
						</div>
					</div>
					{#if pref.getRegistrationField && !pref.getRegistrationField('publisher')['phone']['required']}
						<div class="form-group row">
							<label class="col-12 col-form-label">{localize.t('Phone (Optional)')}</label>
							<div class="col-12">
								<input type="tel" class="form-control" name="phone" placeholder="Phone number">
							</div>
						</div>
					{/if}
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Skype (Optional)')}</label>
						<div class="col-12">
							<input type="text" class="form-control" name="skype" placeholder="Skype">
						</div>
					</div>
					
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Address (Optional)')}</label>
						<div class="col-12">
							<input type="text" name="region[address]" class="form-control" placeholder="Address">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('City (Optional)')}</label>
						<div class="col-12">
							<input type="text" name="region[city]" class="form-control" placeholder="City">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('State (Optional)')}</label>
						<div class="col-12">
							<input type="text" name="region[state]" class="form-control" placeholder="State">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Zipcode (Optional)')}</label>
						<div class="col-12">
							<input type="text" name="region[zipcode]" class="form-control" placeholder="Zipcode">
						</div>
					</div>
					{#if _.size(canAddTags) == 0 || _.includes(canAddTags, user._id)}
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Tags (Optional)')}</label>
						<div class="col-12">
							<input type="text" class="form-control" data-role="tagsinput" placeholder="{localize.replace('Publisher tags', org.type)}"  name="tags" value="{_.join(tags, ',')}">
						</div>
					</div>
					{/if}
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Tax ID (Optional)')}</label>
						<div class="col-12">
							<input type="text" name="tax_id" class="form-control" placeholder="Tax ID">
							<small class="help-block"><i>VAT / GST</i></small>
						</div>
					</div>
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Country (Optional)')}</label>
						<div class="col-12">
							<select name="country" class="form-control selectpicker requiredFields">
								<option value="">--</option>
								<CountryList hideEarth={true} />
							</select>
						</div>
					</div>

					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Username (Optional)')}</label>
						<div class="col-12">
							<input type="text" name="username" class="form-control" placeholder="Username of the {localize.displayPartnerText(org.type, 'publisher')}" pattern="{minPattern(3)}" title="3 characters minimum">
						</div>
					</div>
					<div class="form-group row">
						<label class="col-12 col-form-label">{localize.t('Notes (Optional)')}</label>
						<div class="col-12">
							<textarea class="form-control" name="note" rows="3"></textarea>
							<small class="help-block">{localize.t('The content will not be displayed to '+ localize.displayPartnerText(org.type, 'publisher'))}</small>
						</div>
					</div>
				</div>
				<hr>
				{#if p_fields}
				<h4 class="card-title text-primary" style="font-size: 18px;">{localize.t(localize.replace('Signup Questions', org.type))}</h4>
				{#each p_fields as f}
				<div class="form-group row">
					<label class="col-12 col-form-label">{f['label']}</label>
					<div class="col-12">
						{#if (f["type"] == 'select')}
							<select name="{f['name']}" class="form-control">
								<option value="">Select</option>
								<Options options={f.options}></Options>
							</select>
						{:else if f["type"] == 'multi-select'}
							<select name="{f['name']}[]" class="form-control selectpicker selectVal" multiple="">
								<Options options={f.options}></Options>
							</select>
						{:else}
							{#if f['validation'] || false}
								<!-- {#if f['validation']['type'] != 'url'} pattern="{f['validation']['pattern']}" {/if} {#if f['validation']['type'] == 'number'} min="{f['validation']['minLen']}" max="{f['validation']['maxLen']}" {/if}  {else} minlength="{f['validation']['minLen']}" -->
								<input class="form-control" type="{f['validation']['type']}" name="{f['name']}"  maxlength="{f['validation']['maxLen']}">
							{:else}
								<input class="form-control" type="{f['type']}" name="{f['name']}">
							{/if}
						{/if}
					</div>
				</div>
				{/each}
				{/if}

				<input type="hidden" id="pubAddCsrfToken" name="token" value="{__token}">
				<input type="hidden" name="action" value="addPublisher">
				<div class="checkbox checkbox-primary">
					<input id="notifyUserEmail" name="notify" type="checkbox" value="yes" disabled={hasSmtpConf ? 'true' : undefined}>
					<label for="notifyUserEmail">{localize.t('Notify this user by email')}</label>
					{#if !hasSmtpConf}
					<br><small><i>{localize.t('Setup SMTP first by')} <a href="/customize/smtp.html" target="_blank">{localize.t('Clicking Here')}</a> {localize.t('to send email to the '+ localize.displayPartnerText(org.type, 'publisher'))}</i></small>
					{/if}
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn btn-primary btn-rounded border-0"><i class="fa fa-check-circle mr-2"></i> {localize.t('Save')}</button>
					<button type="button" class="btn btn-rounded createModalClose" showModal=".addPubModal" style="border-color: black; background-color: white;">Cancel</button>
				</div>
			</form>
		<!-- </div> -->
	</div>
</div>
