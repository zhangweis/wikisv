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
<div v-html='content'/>
</div>
</template>
<script>
import wikiLoader from './wiki-loader'
import {Progress} from './loading';
export default {
  data() {
    return {
			content:'',
      recentPages:[]
    }
  },
  methods: {
  @Progress
   async display(params) {
var content = await wikiLoader.load({page: 'index'});
this.content = wikiLoader.marked(content.content);
var pages = await wikiLoader.recentPages(params);
this.recentPages = pages;
  }
  },
    async mounted() {
this.display(this.$route.params);
    }
}
</script>
