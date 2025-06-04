<script>
	import { onMount } from 'svelte';
	import Icon from '../components/icon.svelte';
	import Status from '../components/status.svelte';

	let publisher = {}, fullData = {}, profileImageUri = '', notes = [];
	// Fetch data from backend
	function handleCampaignChange(event) {
		console.log(event.target.value);
	}

	async function fetchData() {
		const id = window.location.href.match(/\/info\/(\d+)/);
		if (!id) {
			return;
		}
		let res = await fetch(`/publisher/info/${id[1]}.json`);
		const data = await res.json();
		publisher = data.publisher;
		notes = data.notes;
		fullData = data;

		res = await fetch(`/account/profileImage.json?email=${publisher.email}`);
		const imgData = await res.json();
		profileImageUri = imgData.uri;
	}

	// Load initial data
	onMount(fetchData);
</script>

<div class="d-flex align-items-baseline justify-content-between">
	<!-- Title -->
	<h1 class="h2">
		(ID: {publisher.display_id}) {publisher.name}
	</h1>
	<!-- Breadcrumb -->
	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Dashboard</a></li>
		<li class="breadcrumb-item"><a href="/publishers/all">Affiliates</a></li>
		<li class="breadcrumb-item active" aria-current="page">{publisher.name}</li>
		</ol>
	</nav>
</div>
<div class="row">
	<div class="col-xl-9 d-flex">
		<!-- Card -->
		<div class="card border-0 flex-fill w-100">
		<div class="card-body p-7">
			<div class="row align-items-center h-100">
				<div class="col-auto d-flex ms-auto ms-md-0">
					<div class="avatar avatar-circle avatar-xxl">
					<img src="{profileImageUri}" alt="..." class="avatar-img" width="112" height="112">
					</div>
				</div>
				<div class="col-auto me-auto d-flex flex-column">
					<h3 class="mb-0">{publisher.company || publisher.name}</h3>
					<span class="small text-secondary fw-bold d-block mb-4">ID: {publisher.display_id}</span>
					<div class="d-flex">
					<!-- Button -->
					<a href="/publisher/edit/{publisher.display_id}" class="btn btn-primary btn-sm me-2">Edit</a>
					<!-- Dropdown -->
					<div class="dropdown">
						<a href="javascript: void(0);" class="dropdown-toggle no-arrow d-flex align-items-center justify-content-center btn-light rounded-circle ms-2 text-body w-30px h-30px" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16" width="16">
								<g>
								<circle cx="3.25" cy="12" r="3.25" style="fill: currentColor"></circle>
								<circle cx="12" cy="12" r="3.25" style="fill: currentColor"></circle>
								<circle cx="20.75" cy="12" r="3.25" style="fill: currentColor"></circle>
								</g>
							</svg>
						</a>
					</div>
					</div>
				</div>
			</div>
			<!-- / .row -->
		</div>
		</div>
	</div>
</div>
<!-- / .row -->
<ul class="nav nav-tabs" id="userTab" role="tablist">
	<li class="nav-item" role="presentation">
		<a href="javascript: void(0);" class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" role="tab" aria-controls="profile" aria-selected="true">
		Profile
		</a>
	</li>
	<li class="nav-item" role="presentation">
		<a href="javascript: void(0);" class="nav-link" id="projects-tab" data-bs-toggle="tab" data-bs-target="#projects" role="tab" aria-controls="projects" aria-selected="false" tabindex="-1">
		Settings
		</a>
	</li>
	<li class="nav-item" role="presentation">
		<a href="javascript: void(0);" class="nav-link d-flex align-items-center" id="connections-tab" data-bs-toggle="tab" data-bs-target="#connections" role="tab" aria-controls="connections" aria-selected="false" tabindex="-1">
		API
		<span class="badge text-bg-dark-soft rounded-circle d-inline-flex align-items-center justify-content-center w-20px h-20px ms-1">4</span>
	</li>
</ul>
<div class="tab-content pt-6" id="userTabContent">
	<div class="tab-pane fade active show" id="profile" role="tabpanel" aria-labelledby="profile-tab">
		<div class="row">
		<div class="col-xl-4 col-xxl-3">
			<!-- Card -->
			<div class="card border-0">
				<div class="card-header border-0">
					<!-- Title -->
					<h2 class="card-header-title h4 text-uppercase mb-3">
					Details
					</h2>
				</div>
				<div class="card-body pt-0">
					<h3 class="h6 small text-secondary text-uppercase mb-3">About</h3>
					<ul class="list-unstyled mb-7">
						<li class="py-2">
							<Icon name="UserIcon" /> {publisher.name}
						</li>
						<li class="py-2">
							<Status value={publisher.status} />
						</li>
						<li class="py-2">
							<Icon name="MapPinIcon" /> {publisher.region?.country}
						</li>
						<li class="py-2">
							<Icon name="MapIcon" /> {publisher.region?.address} {publisher.region?.city} 
						</li>
						{#if publisher.skype}
							<li class="py-2">
								<Icon name="MessageCircleIcon" /> {publisher.skype}
							</li>
						{/if}
					</ul>
					<h3 class="h6 small text-secondary text-uppercase mb-3">Contacts</h3>
					<ul class="list-unstyled mb-7">
						{#if publisher.phone}
							<li class="py-2">
								<Icon name="PhoneIcon" /> {publisher.phone}
							</li>
						{/if}
						<li class="py-2">
							<Icon name="MailIcon" /> {publisher.email}
						</li>
						<li class="py-2">
							<Icon name="CalendarIcon" /> {publisher.created}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="col">
			<!-- Card -->
			<div class="card border-0">
				<div class="card-header border-0 card-header-space-between">
					<!-- Title -->
					<h2 class="card-header-title h4 text-uppercase">
					Tracking Link
					</h2>
				</div>
				<!-- Table -->
				<div class="table-responsive">
					<select class="form-select" onchange={handleCampaignChange}>
						<option value="1">Campaign 1</option>
						<option value="2">Campaign 2</option>
						<option value="3">Campaign 3</option>
					</select>
				</div>
				<!-- / .table-responsive -->
			</div>
			<div class="row">
				<div class="col-12 col-xl">
					<!-- Card -->
					<div class="card border-0 flex-fill w-100">
					<div class="card-header card-header-space-between">
						<!-- Title -->
						<h2 class="card-header-title h4 text-uppercase">
							Notes
						</h2>
						<div class="card-header-action">
							<button class="btn btn-sm btn-outline-primary">
								<Icon name="plus" /> Add Note
							</button>
						</div>
					</div>
					<!-- Table -->
					<div class="table-responsive">
						<table class="table table-sm table-borderless align-middle mb-3">
							<tbody>
								{#each notes as note}
									<tr>
										<td>{note.message}</td>
										<td>{note.created}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<!-- / .table-responsive -->
					</div>
				</div>
			</div>
			<!-- / .row -->
		</div>
		</div>
		<!-- / .row -->
	</div>
</div>
