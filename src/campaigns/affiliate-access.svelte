<script>
  import _ from "lodash";
  import { localize } from "../lib/localize";
  import { isAdmin, onlyAdmin, hasFeature } from "../lib/auth";

  import DynamicTable_C from "../components/dynamicTable.svelte";
  import StatusComp from "../components/status.svelte";
  import Options from "../components/select.svelte";

  let selectedCampaign = "";
  let campaigns = [];
  let accessType = "granted"; // granted, denied, pending

  const customHeaders = [
    {
      key: "publisher_name",
      renderer: (value, row) => {
        return `<a target="_blank" href="/publisher/info/${row.publisher_id}" class="fw-bold text-primary">${value}</a>`;
      },
    },
    {
      key: "campaign_name",
      renderer: (value, row) => {
        return `<span class="fw-bold">${value}</span>`;
      },
    },
    {
      key: "access_status",
      renderer: (value, row) => {
        const statusClass = {
          granted: "bg-success",
          denied: "bg-danger",
          pending: "bg-warning",
          requested: "bg-info",
        };
        return `<span class="badge ${statusClass[value] || "bg-secondary"}">${value.toUpperCase()}</span>`;
      },
    },
    {
      key: "requested_date",
      renderer: (value, row) => {
        return localize.date(value);
      },
    },
    {
      key: "actions",
      renderer: (_, row) => {
        if (
          row.access_status === "pending" ||
          row.access_status === "requested"
        ) {
          return `
						<div class="d-flex justify-content-end">
							<button class="btn btn-sm btn-success me-2" onclick="updateAccess('${row.id}', 'granted')">Approve</button>
							<button class="btn btn-sm btn-danger" onclick="updateAccess('${row.id}', 'denied')">Deny</button>
						</div>
					`;
        } else {
          return `
						<div class="d-flex justify-content-end">
							<button class="btn btn-sm btn-outline-secondary me-2" onclick="updateAccess('${row.id}', 'pending')">Reset</button>
							<button class="btn btn-sm btn-outline-danger" onclick="removeAccess('${row.id}')">Remove</button>
						</div>
					`;
        }
      },
    },
  ];

  const handleCampaignChange = (event) => {
    selectedCampaign = event.target.value;
    // Reload table data for selected campaign
    console.log("Selected campaign:", selectedCampaign);
  };

  const handleAccessTypeChange = (event) => {
    accessType = event.target.value;
    // Filter table data by access type
    console.log("Selected access type:", accessType);
  };
</script>

<div class="d-flex align-items-baseline justify-content-between mb-4">
  <h1 class="h2">Campaign Affiliate Access</h1>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
      <li class="breadcrumb-item"><a href="/campaigns/all">Campaigns</a></li>
      <li class="breadcrumb-item active" aria-current="page">
        Affiliate Access
      </li>
    </ol>
  </nav>
</div>

<!-- Filters -->
<div class="card mb-4">
  <div class="card-body">
    <div class="row">
      <div class="col-md-4">
        <label class="form-label">Select Campaign</label>
        <select
          class="form-control selectpicker"
          on:change={handleCampaignChange}
          bind:value={selectedCampaign}
        >
          <option value="">All Campaigns</option>
          <option value="1">Campaign 1</option>
          <option value="2">Campaign 2</option>
          <option value="3">Campaign 3</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Access Status</label>
        <select
          class="form-control selectpicker"
          on:change={handleAccessTypeChange}
          bind:value={accessType}
        >
          <option value="">All Status</option>
          <option value="granted">Granted</option>
          <option value="denied">Denied</option>
          <option value="pending">Pending</option>
          <option value="requested">Requested</option>
        </select>
      </div>
      <div class="col-md-4 d-flex align-items-end">
        <button class="btn btn-primary me-2">
          <i class="fa fa-filter me-2"></i>Apply Filters
        </button>
        <button class="btn btn-outline-secondary">
          <i class="fa fa-refresh me-2"></i>Reset
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Bulk Actions -->
<div class="card mb-4">
  <div class="card-body">
    <div class="row">
      <div class="col-md-8">
        <h5 class="mb-3">Bulk Actions</h5>
        <div class="d-flex">
          <button class="btn btn-success me-2">
            <i class="fa fa-check me-2"></i>Grant Access to Selected
          </button>
          <button class="btn btn-danger me-2">
            <i class="fa fa-times me-2"></i>Deny Access to Selected
          </button>
          <button class="btn btn-warning me-2">
            <i class="fa fa-clock me-2"></i>Set as Pending
          </button>
        </div>
      </div>
      <div class="col-md-4 text-end">
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-outline-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#addAccessModal"
          >
            <i class="fa fa-plus me-2"></i>Grant Access
          </button>
          <button class="btn btn-outline-info">
            <i class="fa fa-download me-2"></i>Export
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Access Requests Table -->
<div class="card">
  <div class="card-header">
    <h5 class="card-title mb-0">Access Requests & Permissions</h5>
  </div>
  <DynamicTable_C
    endpoint={"/campaign/affiliate-access.json"}
    rowsKey="access_requests"
    headersKey="headers"
    {customHeaders}
    showCheckbox={true}
  ></DynamicTable_C>
</div>

<!-- Add Access Modal -->
<div class="modal fade" id="addAccessModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Grant Campaign Access</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        ></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label class="form-label">Select Campaign</label>
            <select class="form-control selectpicker" required>
              <option value="">Choose Campaign</option>
              <option value="1">Campaign 1</option>
              <option value="2">Campaign 2</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Select Affiliates</label>
            <select
              class="form-control selectpicker"
              multiple
              data-live-search="true"
              required
            >
              <option value="1">Publisher 1</option>
              <option value="2">Publisher 2</option>
              <option value="3">Publisher 3</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Access Type</label>
            <select class="form-control selectpicker" required>
              <option value="granted">Grant Immediate Access</option>
              <option value="pending">Set as Pending Review</option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cancel</button
        >
        <button type="button" class="btn btn-primary">Grant Access</button>
      </div>
    </div>
  </div>
</div>
