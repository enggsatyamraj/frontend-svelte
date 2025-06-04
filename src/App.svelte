<script>
  import { Router, Route, Link } from "svelte-routing";
  import Dashboard from "./reports/dashboard.svelte";
  import PubCreate from "./publisher/create.svelte";
  import PubManage from "./publisher/manage.svelte";
  import PubDetails from "./publisher/details.svelte";
  import PubInfo from "./publisher/info.svelte";
  import { path } from "express/lib/application";
  import Campaigns from "./campaigns/all.svelte";

  // const routes = {
  // 	"/": Dashboard,
  // 	"/v2/publishers/new": PubCreate,
  // 	"/v2/publishers/all": PubManage,
  // 	"/v2/publishers/details": PubDetails,
  // 	"*": Dashboard // Catch-all route
  // };

  // Handle route changes
  const routeLoaded = (event) => {
    console.log("Route loaded:", event.detail.location);
  };
</script>

<div class="app-container">
  <Router on:routeLoaded={routeLoaded} basepath="">
    <Route path="/" component={Dashboard} />
    <Route path="/publishers/new" component={PubCreate} />
    <Route path="/publishers/all" component={PubManage} />
    <Route path="/publishers/details" component={PubDetails} />
    <Route path="/publishers/info/:id" component={PubInfo} />

    <!-- component routes -->
    <Route path="/campaigns/all" component={Campaigns} />
  </Router>
</div>

<style>
  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
