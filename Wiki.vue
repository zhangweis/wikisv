<template>
  <div>
<div v-if='!content&&loaded'>
Not found<br/>
</div>
<div class='menu-bar'>
<router-link class='item' :to="{ name: 'home'}">Home</router-link> 
<create-link/>
<router-link class='item' :to="{ name: 'edit', params: { page: wiki.name }}"><span v-if='!content'>Create</span><span v-else>Edit</span> {{wiki.name}}</router-link>  
<router-link class='item' :to="{ name: 'history', params: { page: wiki.name }}">History</router-link>  
<a target="_blank" class='item' :href='"https://whatsonchain.com/tx/"+wiki.tx.tx.h'>View Tx</a>
<input type='checkbox' v-model='showMd'/>
<a href='#' @click='showMd=!showMd' onclick='return false'>Markdown Text</a>
</div> 

<hr/>
<textarea readonly='true' rows='30' cols='80' v-if='showMd'>
{{wiki.content}}
</textarea>
  <div v-if='content'>
<!--
    <div v-html="content"/>
        <v-runtime-template :template="content"></v-runtime-template>
-->
			<component v-bind:is="contentComponent"></component>  
  </div>
</div>
</template>
<script>
import wikiLoader from './wiki-loader'
import {Progress} from './loading';
import IndexTable from './IndexTable';

export default {
  components: {
		IndexTable
  },

watch: {
    '$route' (to, from) {
if (to.name=='page'&&from.name=='page'&&to.params.page==from.params.page) return this.toAnchor(to.params);
this.display(to.params);
      // react to route changes...
    }
  },  data() {
    return {
			contentComponent:{},
			router:{},
			showMd: false,
			wiki:{tx:{tx:{}}},
      content:'',
loaded: false
    }
  },
  methods: {
	@Progress
   async display(params) {
			var wiki = await wikiLoader.load(params);
			if (!wiki) wiki = {tx:{tx:{}},blk:{},content:'',name:params.page};
			var content=wiki?wiki.content:``;
			this.loaded = true;
			console.log(wiki);
			this.wiki = wiki;
			var markedContent = await wikiLoader.marked(content,this);
console.log(markedContent);
			this.content = markedContent.html;
			this.contentComponent = {
				template: markedContent.html,
				components:{
					IndexTable
				},
			 data: ()=>{
					return {
						headings:markedContent.headings,
						tocInitShown:true,
						page: wiki.name,
					}
				}
			};
			await this.$nextTick();
			this.toAnchor(params);
	},
	toAnchor(params) {
		if (params.type&&params.type!='tx') {
			var el = document.getElementById(params.type);
			el&&el.scrollIntoView();
		}
  }
  },
    async mounted() {
			this.router = this.$router;
this.display(this.$route.params);
    }
}
</script>
