// import { mount } from 'svelte'
import './app.css'
import Dashboard from './reports/dashboard.svelte'

const dashboardWidgets = new Dashboard({
	target: document.getElementById('admin-dashboard'),
})

export default dashboardWidgets
