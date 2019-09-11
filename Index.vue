<template>
  <div>
<router-link class='item' :to="{ name: 'page', params: { page: 'index' }}">Index Page</router-link> 
<create-link/>

<br/>
<h1>Recent Pages</h1>
<hr/>
<div v-for='page in recentPages'>
<router-link :to="{ name: 'page', params: { page: page.name }}">{{page.name}}</router-link> 
 @ {{(page.tx.blk||{}).t  | moment("from", "now")}}
</div>
<hr/>
			<component v-bind:is="contentComponent"></component>  
</div>
</template>
<script>
import wikiLoader from './wiki-loader'
import {Progress} from './loading';
import IndexTable from './IndexTable';
export default {
  data() {
    return {
			contentComponent:{template:'<div/>'},
			content:'',
      recentPages:[]
    }
  },
  methods: {
  @Progress
   async display(params) {
			await Promise.all([this.loadIndex(), this.loadRecentPages(params)]);
  },
	async loadIndex() {
		var content = await wikiLoader.load({page: 'index'});
		var {headings,html} = (await wikiLoader.marked(content.content));
		this.content = html;
			this.contentComponent = {
				template: html,
				components:{
					IndexTable
				},
			 data: ()=>{
					return {
						page: 'index',
						tocInitShown:false,
						headings
					}
				}
			};
	},
	async loadRecentPages(params) {
	var pages = await wikiLoader.recentPages(params);
this.recentPages = pages;
	}
  },
    async mounted() {
this.display(this.$route.params);
    }
}
</script>
