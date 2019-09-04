<style>
.item{
padding:5px
}
</style>
<template>
  <div style='display:flex'>
<div>
<router-link class='item' :to="{ name: 'home'}">Home</router-link> 
<hr/>
<h1>Recent Changes</h1>
<hr/>
<div v-for='change in recentChanges'>
<a href='#' onclick='return false;' @click='show(change.tx.tx.h)'>
<span :title='change.tx.tx.h'>{{change.tx.tx.h  | truncate(6,'..')}}</span> @ {{(change.tx.blk||{}).t  | moment("from", "now")}}
</a>
<router-link class='item' :to="{ name: 'page', params: { type:'tx',page: change.tx.tx.h }}">View</router-link>
<router-link class='item' :to="{ name: 'edit', params: { type:'tx',page: change.tx.tx.h }}">Restore</router-link>
 
</div>
</div>
<div v-if='preview'>
<h1>Verion Preview</h1>
<hr/>
<div v-html='preview'/>
</div>
</div>
</template>
<script>
import wikiLoader from './wiki-loader'
import {Progress} from './loading';

export default {
watch: {
    '$route' (to, from) {
this.display(to.params);
    }
  },  data() {
    return {
      preview: '',
			recentChanges:[],
    }
  },
  methods: {
  @Progress
   async display(params) {
var changes = await wikiLoader.recentChanges({name:params.page});
this.recentChanges = changes;
console.log(changes);
  },
  @Progress
  async show(txid) {
    var wiki = await wikiLoader.load({page:txid,type:'tx'});
    this.preview = wikiLoader.marked(wiki.content);
  }
  },
    async mounted() {
this.display(this.$route.params);
    }
}
</script>
