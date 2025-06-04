<script>
  import _ from "lodash";
  import { localize } from "../lib/localize";
  import { isAdmin, onlyAdmin, hasFeature } from "../lib/auth";
  import { minPattern } from "../lib/validation";

  import CountryList from "../components/country.svelte";
  import Options from "../components/select.svelte";

  let org = window.org,
    pref = window.pref,
    user = window.user;
  let categories = [],
    verticals = [],
    payoutTypes = [];
  let finalData = {};

  const validateForm = () => {
    // Add any form validation logic here
    console.log("Validating campaign form...");
  };
</script>

<div class="d-flex align-items-baseline justify-content-between mb-4">
  <h1 class="h2">Add New Campaign</h1>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
      <li class="breadcrumb-item"><a href="/campaigns/all">Campaigns</a></li>
      <li class="breadcrumb-item active" aria-current="page">Add New</li>
    </ol>
  </nav>
</div>

<div class="card">
  <div class="card-body">
    <form
      method="post"
      action="/campaign/add"
      enctype="multipart/form-data"
      on:submit={validateForm}
    >
      <div class="modal-header">
        <div>
          <h4 class="mb-0 font-18">{localize.t("Add New Campaign")}</h4>
          <small class="text-muted"
            >Create a new campaign offer for your affiliates.</small
          >
        </div>
      </div>

      <h4 class="card-title text-primary mt-4" style="font-size: 18px;">
        {localize.t("Basic Details")}
      </h4>

      <div class="form-group row">
        <label class="col-12 col-form-label"
          >{localize.t("Campaign Name")}</label
        >
        <div class="col-12">
          <input
            type="text"
            name="name"
            class="form-control"
            placeholder="Enter campaign name"
            required=""
            pattern={minPattern(3)}
            title="3 characters minimum"
          />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label">{localize.t("Campaign URL")}</label
        >
        <div class="col-12">
          <input
            type="url"
            name="url"
            class="form-control"
            placeholder="https://example.com/offer"
            required=""
          />
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label">{localize.t("Status")}</label>
        <div class="col-12">
          <select class="form-control selectpicker" name="status" required="">
            <option value="active">{localize.t("Active")}</option>
            <option value="pending">{localize.t("Pending")}</option>
            <option value="paused">{localize.t("Paused")}</option>
            <option value="disabled">{localize.t("Disabled")}</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label">{localize.t("Category")}</label>
        <div class="col-12">
          <select class="form-control selectpicker" name="category" required="">
            <option value="">Select Category</option>
            <option value="dating">Dating</option>
            <option value="finance">Finance</option>
            <option value="health">Health & Beauty</option>
            <option value="gaming">Gaming</option>
            <option value="ecommerce">E-commerce</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label">{localize.t("Offer Type")}</label>
        <div class="col-12">
          <select
            class="form-control selectpicker"
            name="offer_type"
            required=""
          >
            <option value="">Select Offer Type</option>
            <option value="cpa">CPA (Cost Per Action)</option>
            <option value="cpl">CPL (Cost Per Lead)</option>
            <option value="cpc">CPC (Cost Per Click)</option>
            <option value="cpm">CPM (Cost Per Mile)</option>
            <option value="revshare">Revenue Share</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label"
          >{localize.t("Payout Amount")}</label
        >
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input
              type="number"
              name="payout"
              class="form-control"
              placeholder="0.00"
              step="0.01"
              min="0"
              required=""
            />
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label">{localize.t("Countries")}</label>
        <div class="col-12">
          <select
            name="countries[]"
            class="form-control selectpicker"
            multiple
            data-live-search="true"
          >
            <CountryList />
          </select>
          <small class="text-muted">Leave empty for worldwide targeting</small>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-12 col-form-label">{localize.t("Description")}</label>
        <div class="col-12">
          <textarea
            class="form-control"
            name="description"
            rows="4"
            placeholder="Campaign description and requirements..."
          ></textarea>
        </div>
      </div>

      <!-- Advanced Options Toggle -->
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex align-items-center">
            <label class="switch mb-0 switch-xs">
              <input
                type="checkbox"
                class="dynamic_hide_show"
                data-show-target="#advancedOption"
              />
              <span class="slider slider-xs round"></span>
            </label>
            <h4 class="ml-2 mb-0 text-primary" style="font-size: 18px;">
              {localize.t("Advanced Settings")}
            </h4>
          </div>
        </div>
      </div>

      <div class="hidden mt-3" id="advancedOption">
        <div class="form-group row">
          <label class="col-12 col-form-label">{localize.t("Daily Cap")}</label>
          <div class="col-12">
            <input
              type="number"
              name="daily_cap"
              class="form-control"
              placeholder="0 = No limit"
              min="0"
            />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-12 col-form-label">{localize.t("Total Cap")}</label>
          <div class="col-12">
            <input
              type="number"
              name="total_cap"
              class="form-control"
              placeholder="0 = No limit"
              min="0"
            />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-12 col-form-label">{localize.t("Start Date")}</label
          >
          <div class="col-12">
            <input type="date" name="start_date" class="form-control" />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-12 col-form-label">{localize.t("End Date")}</label>
          <div class="col-12">
            <input type="date" name="end_date" class="form-control" />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-12 col-form-label"
            >{localize.t("Preview URL")}</label
          >
          <div class="col-12">
            <input
              type="url"
              name="preview_url"
              class="form-control"
              placeholder="https://example.com/preview"
            />
          </div>
        </div>
      </div>

      <input type="hidden" name="action" value="addCampaign" />

      <div class="modal-footer">
        <button type="submit" class="btn btn-primary btn-rounded border-0">
          <i class="fa fa-check-circle mr-2"></i>
          {localize.t("Save Campaign")}
        </button>
        <a
          href="/campaigns/all"
          class="btn btn-rounded"
          style="border-color: black; background-color: white;"
        >
          Cancel
        </a>
      </div>
    </form>
  </div>
</div>
