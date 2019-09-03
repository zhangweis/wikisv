<style>
.item{
padding:5px
}
</style>
<template>
  <div>
        <loading :active.sync="isLoading" 
        :is-full-page="true"></loading>
				<div v-if='loadingFailMessage'>Loading failed ({{loadingFailMessage}}). Please <button onclick='location.reload();'>refresh</button></div>
<h1>Recent Changes</h1>
<hr/>
<div v-for='change in recentChanges'>
<router-link class='item' :to="{ name: 'page', params: { type:'tx',page: change.tx.tx.h }}">{{change.tx.tx.h}} @ {{(change.tx.blk||{}).t  | moment("from", "now")}}</router-link>
<router-link class='item' :to="{ name: 'edit', params: { type:'tx',page: change.tx.tx.h }}">Resume</router-link>
 
</div>
</div>
</div>
</template>
<script>
    import Loading from 'vue-loading-overlay';
import wikiLoader from './wiki-loader'

export default {
components:{
	Loading
},
watch: {
    '$route' (to, from) {
this.display(to.params);
    }
  },  data() {
    return {
			recentChanges:[],
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
var changes = await wikiLoader.recentChanges({name:params.page});
this.loaded = true;
this.recentChanges = changes;
console.log(changes);
  }
  },
    async mounted() {
this.display(this.$route.params);
    }
}
</script>
