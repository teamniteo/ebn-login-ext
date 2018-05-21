<template>
    <div class="container-fluid">
			<div v-if="linked" style="padding-bottom: .7rem;">
				<br/>
				<form>
					<div class="form-group">
						<input type="search" class="form-control" v-model="search" placeholder="Search for blog">
					</div>
				</form>

				<p v-if="!domains.length" class="text-center"><font-awesome-icon :icon="spin" pulse /> <span class="text-muted">Loading blogs</span></p>
				<p v-if="domains.length && search.length && filteredItems.length == 0" class="text-center"><span class="text-muted">No blog found</span></p>

				<ul class="list-group list-group-flush" v-if="domains.length">
					<li class="list-group-item list-group-item-action" v-for="blog in filteredItems.slice(0, 5)">
						<div class="row">
							<div class="col-11 text-truncate"><a :href="'https://app.easyblognetworks.com/blog/' + blog.id + '/'" target="_blank">{{ blog.domain }}</a></div>
							<div class="scol-2" v-if="active == blog.id">
								<font-awesome-icon :icon="spin" pulse />
							</div>
							<div class="scol-2" v-if="active != blog.id">
								<a href="#" v-on:click="loginClick(blog.id)"><font-awesome-icon :icon="login" /></a>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div v-else>
				<div class="row" style="padding-bottom: .7rem;">
					<div class="col-3">
						<img src="big.png" class="logo">
					</div>
					<div class="col-9">
						<p class="text-muted" style="padding-top: 1rem;">Please visit the app to link this extension to your account.</p>
					</div>
					<div class="col-12">
						<a href="https://app.easyblognetworks.com/settings/" target="_blank" class="btn btn-success col-12">Log In</a>
					</div>
				</div>
			</div>
	</div>
</template>
<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { faExternalLinkAlt, faSignInAlt, faSpinner } from "@fortawesome/fontawesome-free-solid";
import OptionsSync from 'webext-options-sync';
const port = chrome.runtime.connect({name: "popup"});

export default {
  data: () => ({
		search: '',
		domains:[],
		active:null,
		linked:false
	}),
  computed: {
    external() {
      return faExternalLinkAlt;
		},
    login() {
      return faSignInAlt;
		},
    spin() {
      return faSpinner;
		},
		filteredItems() {
      return this.domains.filter(item => {
         return item.domain.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    }
  },
  mounted: async function () {
		var self = this;

		const options = await new OptionsSync().getAll();
		this.linked = Object.keys(options).length>1;

		port.postMessage({list: true});
		port.onMessage.addListener(res => {
			self.domains = res.blogs.reverse();
		});

		chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
		}, function(tabs) {
				var tab = tabs[0];
				if (tab) {
					var host = new URL(tab.url).host.replace("www.", "");
					for (const skip of ['newtab', ,'extensions', 'app.easyblognetworks.com']) {
						if (host.indexOf(skip) > -1) {
							return;
						}
					}
					self.search = host;
				}
		});
	},
  methods: {
    loginClick(id) {
			port.postMessage({loginInline: id});
			this.active = id;
    }
  },
  components: {
    FontAwesomeIcon
  }
};
</script>
<style>
@import "~bootstrap/dist/css/bootstrap.css";
body {
  width: 340px;
}
.list-group-item{
	padding: 0.25rem 0.5rem;
	border: none;
}
.scol-2{
	font-size: 1.1rem;
	visibility: hidden;
}
.row:hover .scol-2{
	visibility: visible;
}
.logo{
	    max-width: 5rem;
}
</style>
