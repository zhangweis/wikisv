<template>
  <div>
        <loading :active.sync="isLoading" 
        :is-full-page="true"></loading>
				<div v-if='loadingFailMessage'>Loading failed ({{loadingFailMessage}}). Please <button onclick='location.reload();'>refresh</button></div>
<router-link class='item' :to="{ name: 'page', params: { page: 'index' }}">Index Page</router-link> 
<create-link/>

<br/>
<h1>Recent Pages</h1>
<hr/>
<div v-for='page in recentPages'>
<router-link :to="{ name: 'page', params: { page: page.name }}">{{page.name}}</router-link> 
 @ {{(page.tx.blk||{}).t  | moment("from", "now")}}
</div>
</div>
</template>
<script>
import wikiLoader from './wiki-loader'
import Loading from 'vue-loading-overlay'; 
export default {
components:{
	Loading
},
  data() {
    return {
      recentPages:[],
loadingFailMessage:'',
isLoading: false,
loaded: false
    }
  },
  methods: {
	 async display(params) {
		this.loadingFailMessage = '';
		this.isLoading = true;
		try {
			return await this.display1(params);
		} catch (e) {
			this.loadingFailMessage = ''+e;
			throw e;
		} finally {
			this.isLoading = false;
		}
	},
   async display1(params) {
var pages = await wikiLoader.recentPages(params);
this.recentPages = pages;
  }
  },
    async mounted() {
this.display(this.$route.params);
    }
}
</script>
