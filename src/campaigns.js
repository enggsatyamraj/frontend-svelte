// import { mount } from 'svelte'
import './app.css'
import CampaignAll from './campaigns/all.svelte'
import CampaignNew from './campaigns/new.svelte'
import CampaignAffiliateAccess from './campaigns/affiliate-access.svelte'
import CampaignCreatives from './campaigns/creatives.svelte'

const campaignAllMount = document.getElementById('campaign-all');
if (campaignAllMount) {
	const campaignAll = new CampaignAll({
		target: campaignAllMount,
	})
}

const campaignNewMount = document.getElementById('campaign-new');
if (campaignNewMount) {
	const campaignNew = new CampaignNew({
		target: campaignNewMount
	})
}

const campaignAffiliateAccessMount = document.getElementById('campaign-affiliate-access');
if (campaignAffiliateAccessMount) {
	new CampaignAffiliateAccess({
		target: campaignAffiliateAccessMount
	})
}

const campaignCreativesMount = document.getElementById('campaign-creatives');
if (campaignCreativesMount) {
	new CampaignCreatives({
		target: campaignCreativesMount
	})
}

// export default campaignAll