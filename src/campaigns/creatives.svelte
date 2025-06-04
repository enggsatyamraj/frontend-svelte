<script>
  import _ from "lodash";
  import { localize } from "../lib/localize";
  import { isAdmin, onlyAdmin, hasFeature } from "../lib/auth";

  import DynamicTable_C from "../components/dynamicTable.svelte";
  import Options from "../components/select.svelte";

  let selectedCampaign = "";
  let selectedCreativeType = "";
  let campaigns = [];
  let creatives = [];

  const customHeaders = [
    {
      key: "preview",
      renderer: (value, row) => {
        if (row.type === "image") {
          return `<img src="${row.url}" alt="${row.name}" style="width: 60px; height: 40px; object-fit: cover;" class="rounded">`;
        } else if (row.type === "video") {
          return `<video src="${row.url}" style="width: 60px; height: 40px; object-fit: cover;" class="rounded" muted></video>`;
        } else {
          return `<div class="bg-light rounded d-flex align-items-center justify-content-center" style="width: 60px; height: 40px;"><i class="fa fa-file-text"></i></div>`;
        }
      },
    },
    {
      key: "name",
      renderer: (value, row) => {
        return `<div>
					<strong>${value}</strong>
					<br><small class="text-muted">${row.campaign_name}</small>
				</div>`;
      },
    },
    {
      key: "type",
      renderer: (value, row) => {
        const typeClass = {
          image: "bg-primary",
          video: "bg-success",
          text: "bg-info",
          html: "bg-warning",
        };
        return `<span class="badge ${typeClass[value] || "bg-secondary"}">${value.toUpperCase()}</span>`;
      },
    },
    {
      key: "dimensions",
      renderer: (value, row) => {
        return value ? `<small class="text-muted">${value}</small>` : "-";
      },
    },
    {
      key: "status",
      renderer: (value, row) => {
        const statusClass = value === "active" ? "bg-success" : "bg-danger";
        return `<span class="badge ${statusClass}">${value.toUpperCase()}</span>`;
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
						<button class="btn btn-sm btn-outline-primary me-2" onclick="editCreative('${row.id}')">Edit</button>
						<button class="btn btn-sm btn-outline-secondary me-2" onclick="copyCreative('${row.id}')">Copy</button>
						<button class="btn btn-sm btn-outline-danger" onclick="deleteCreative('${row.id}')">Delete</button>
					</div>
				`;
      },
    },
  ];

  const handleCampaignChange = (event) => {
    selectedCampaign = event.target.value;
    console.log("Selected campaign:", selectedCampaign);
  };

  const handleCreativeTypeChange = (event) => {
    selectedCreativeType = event.target.value;
    console.log("Selected creative type:", selectedCreativeType);
  };
</script>

<div class="d-flex align-items-baseline justify-content-between mb-4">
  <h1 class="h2">Campaign Creatives</h1>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
      <li class="breadcrumb-item"><a href="/campaigns/all">Campaigns</a></li>
      <li class="breadcrumb-item active" aria-current="page">Creatives</li>
    </ol>
  </nav>
</div>

<!-- Filters & Actions -->
<div class="card mb-4">
  <div class="card-body">
    <div class="row">
      <div class="col-md-3">
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
      <div class="col-md-3">
        <label class="form-label">Creative Type</label>
        <select
          class="form-control selectpicker"
          on:change={handleCreativeTypeChange}
          bind:value={selectedCreativeType}
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="text">Text Ads</option>
          <option value="html">HTML Banners</option>
        </select>
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <button class="btn btn-primary me-2">
          <i class="fa fa-filter me-2"></i>Apply Filters
        </button>
        <button class="btn btn-outline-secondary">
          <i class="fa fa-refresh me-2"></i>Reset
        </button>
      </div>
      <div class="col-md-3 d-flex align-items-end justify-content-end">
        <div class="dropdown">
          <button
            class="btn btn-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i class="fa fa-plus me-2"></i>Add Creative
          </button>
          <ul class="dropdown-menu">
            <li>
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#addImageModal"
              >
                <i class="fa fa-image me-2"></i>Image Banner</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#addVideoModal"
              >
                <i class="fa fa-video me-2"></i>Video Creative</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#addTextModal"
              >
                <i class="fa fa-font me-2"></i>Text Ad</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#addHtmlModal"
              >
                <i class="fa fa-code me-2"></i>HTML Banner</a
              >
            </li>
          </ul>
        </div>
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
            <i class="fa fa-check me-2"></i>Activate Selected
          </button>
          <button class="btn btn-warning me-2">
            <i class="fa fa-pause me-2"></i>Deactivate Selected
          </button>
          <button class="btn btn-danger me-2">
            <i class="fa fa-trash me-2"></i>Delete Selected
          </button>
        </div>
      </div>
      <div class="col-md-4 text-end">
        <button class="btn btn-outline-info">
          <i class="fa fa-download me-2"></i>Export Creatives
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Creatives Table -->
<div class="card">
  <div class="card-header">
    <h5 class="card-title mb-0">Campaign Creatives</h5>
  </div>
  <DynamicTable_C
    endpoint={"/campaign/creatives.json"}
    rowsKey="creatives"
    headersKey="headers"
    {customHeaders}
    showCheckbox={true}
  ></DynamicTable_C>
</div>

<!-- Add Image Creative Modal -->
<div class="modal fade" id="addImageModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Image Creative</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        ></button>
      </div>
      <div class="modal-body">
        <form enctype="multipart/form-data">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Creative Name</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Campaign</label>
                <select class="form-control selectpicker" required>
                  <option value="">Select Campaign</option>
                  <option value="1">Campaign 1</option>
                  <option value="2">Campaign 2</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Dimensions</label>
                <select class="form-control selectpicker">
                  <option value="">Auto Detect</option>
                  <option value="728x90">728x90 (Leaderboard)</option>
                  <option value="300x250">300x250 (Medium Rectangle)</option>
                  <option value="320x50">320x50 (Mobile Banner)</option>
                  <option value="160x600">160x600 (Wide Skyscraper)</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-control selectpicker">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Upload Image</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Alt Text</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Alternative text for image"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Landing URL (Optional)</label>
                <input
                  type="url"
                  class="form-control"
                  placeholder="Override campaign URL"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cancel</button
        >
        <button type="button" class="btn btn-primary">Save Creative</button>
      </div>
    </div>
  </div>
</div>

<!-- Add Video Creative Modal -->
<div class="modal fade" id="addVideoModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Video Creative</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        ></button>
      </div>
      <div class="modal-body">
        <form enctype="multipart/form-data">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Creative Name</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Campaign</label>
                <select class="form-control selectpicker" required>
                  <option value="">Select Campaign</option>
                  <option value="1">Campaign 1</option>
                  <option value="2">Campaign 2</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Video Format</label>
                <select class="form-control selectpicker">
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="avi">AVI</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Upload Video</label>
                <input
                  type="file"
                  class="form-control"
                  accept="video/*"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Thumbnail Image</label>
                <input type="file" class="form-control" accept="image/*" />
              </div>
              <div class="mb-3">
                <label class="form-label">Duration (seconds)</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Auto detect"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cancel</button
        >
        <button type="button" class="btn btn-primary">Save Creative</button>
      </div>
    </div>
  </div>
</div>

<!-- Add Text Creative Modal -->
<div class="modal fade" id="addTextModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Text Creative</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        ></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label class="form-label">Creative Name</label>
            <input type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Campaign</label>
            <select class="form-control selectpicker" required>
              <option value="">Select Campaign</option>
              <option value="1">Campaign 1</option>
              <option value="2">Campaign 2</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Headline</label>
            <input
              type="text"
              class="form-control"
              placeholder="Catchy headline"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea
              class="form-control"
              rows="3"
              placeholder="Ad description text"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Call to Action</label>
            <input
              type="text"
              class="form-control"
              placeholder="e.g., Click Here, Learn More"
            />
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cancel</button
        >
        <button type="button" class="btn btn-primary">Save Creative</button>
      </div>
    </div>
  </div>
</div>

<!-- Add HTML Creative Modal -->
<div class="modal fade" id="addHtmlModal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add HTML Creative</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"
        ></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Creative Name</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Campaign</label>
                <select class="form-control selectpicker" required>
                  <option value="">Select Campaign</option>
                  <option value="1">Campaign 1</option>
                  <option value="2">Campaign 2</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Dimensions</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="e.g., 300x250"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">HTML Code</label>
                <textarea
                  class="form-control"
                  rows="10"
                  placeholder="<div>Your HTML code here...</div>"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label class="form-label">Preview</label>
                <div class="border p-3 bg-light">
                  <small class="text-muted">HTML preview will appear here</small
                  >
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary me-2"
          >Preview</button
        >
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Cancel</button
        >
        <button type="button" class="btn btn-primary">Save Creative</button>
      </div>
    </div>
  </div>
</div>
