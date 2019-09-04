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
    <div v-html="content"/>
  
  </div>
</div>
</template>
<script>
import wikiLoader from './wiki-loader'
import {Progress} from './loading';

export default {
watch: {
    '$route' (to, from) {
console.log(to, from);
this.display(to.params);
      // react to route changes...
    }
  },  data() {
    return {
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
this.content = wikiLoader.marked(content);
  }
  },
    async mounted() {
this.display(this.$route.params);
    }
}
</script>
