<script>
  import _ from "lodash";
  import { localize } from "../lib/localize";
  import { isAdmin, onlyAdmin, hasFeature } from "../lib/auth";

  import DynamicTable_C from "../components/dynamicTable.svelte";
  import StatusComp from "../components/status.svelte";

  const customHeaders = [
    {
      key: "name",
      renderer: (value, row) => {
        return `<a target="_blank" href="/campaign/info/${row.display_id}" class="fw-bold text-primary">${value}</a>`;
      },
    },
    {
      key: "status",
      component: StatusComp,
    },
    {
      key: "offer_type",
      renderer: (value, row) => {
        return `<span class="badge bg-info">${value}</span>`;
      },
    },
    {
      key: "payout",
      renderer: (value, row) => {
        return `<span class="fw-bold text-success">$${value}</span>`;
      },
    },
    {
      key: "created",
      renderer: (value, row) => {
        return localize.date(value);
      },
    },
    {
      key: "actions",
      renderer: (_, row) => {
        return `
					<div class="d-flex justify-content-end">
						<a class="btn btn-sm btn-outline-primary me-2" href="/campaigns/edit/${row.display_id}">Edit</a>
						<a class="btn btn-sm btn-outline-info me-2" href="/campaigns/affiliate-access?campaign=${row.display_id}">Access</a>
						<a class="btn btn-sm btn-outline-secondary me-2" href="/campaigns/creatives?campaign=${row.display_id}">Creatives</a>
						<a class="btn btn-sm btn-outline-danger" data-id="${row.display_id}">Delete</a>
					</div>
				`;
      },
    },
  ];
</script>

<div class="d-flex align-items-baseline justify-content-between mb-4">
  <h1 class="h2">Campaigns</h1>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
      <li class="breadcrumb-item active" aria-current="page">Campaigns</li>
    </ol>
  </nav>
</div>

<div class="row mb-4">
  <div class="col-auto">
    <a href="/campaign/new.html" class="btn btn-primary">
      <i class="fa fa-plus me-2"></i>Add New Campaign
    </a>
  </div>
  <div class="col-auto">
    <a href="/campaign/affiliate-access.html" class="btn btn-outline-secondary">
      <i class="fa fa-users me-2"></i>Affiliate Access
    </a>
  </div>
  <div class="col-auto">
    <a href="/campaign/creatives.html" class="btn btn-outline-info">
      <i class="fa fa-image me-2"></i>Creatives
    </a>
  </div>
</div>

<div class="card">
  <DynamicTable_C
    endpoint={"/campaign/manage.json"}
    rowsKey="campaigns"
    headersKey="headers"
    {customHeaders}
  ></DynamicTable_C>
</div>
