// import { mount } from 'svelte'
import './app.css'
import PubCreate from './publisher/create.svelte'
import PubManage from './publisher/manage.svelte'
import PubDetails from './publisher/details.svelte'
import PubInfo from './publisher/info.svelte'

const pubCreateMount = document.getElementById('pub-create');
if (pubCreateMount) {
	const pubCreate = new PubCreate({
		target: pubCreateMount,
	})
}

const pubManageMount = document.getElementById('pub-manage');
if (pubManageMount) {
	const pubManage = new PubManage({
		target: pubManageMount
	})
}

const pubDetailsMount = document.getElementById('pub-details');
if (pubDetailsMount) {
	new PubDetails({
		target: pubDetailsMount
	})
}

const pubInfoMount = document.getElementById('pub-info');
if (pubInfoMount) {
	new PubInfo({
		target: pubInfoMount
	})
}


// export default pubCreate
