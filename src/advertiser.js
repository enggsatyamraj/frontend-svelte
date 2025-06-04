// import { mount } from 'svelte'
import './app.css'
import AdvCreate from './advertiser/create.svelte'
import AdvDetails from './publisher/details.svelte'

const avMount = document.getElementById('av-create');
if (avMount) {
	new AdvCreate({
		target: avMount,
	})
}
// const advCreate = 

const pubDetailsMount = document.getElementById('av-details');
if (pubDetailsMount) {
	new AdvDetails({
		target: pubDetailsMount
	})
}

// export default advCreate
