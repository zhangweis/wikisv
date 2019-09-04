<template>
  <div>
<router-link class='item' :to="{ name: 'home'}">Home</router-link> 
<a target='_blank' class='item' href='https://www.markdownguide.org/basic-syntax/'>Markdown Ref.</a>
<hr/>
<div style='display:flex'>
<div>
  Page
  Name:<br/>
  <input type='text' size='50' v-model='name' :disabled='loaded'/><br/>
  Markdown Content:<br/>
  <textarea rows='30' cols='80' v-model='content'/><br/>

      <MoneyButton
      label="Create/Update"
			:devMode="false"
			successMessage="update done."
			:outputs="outputs"
         />
</div>
	<div style='padding:10px'>
		<h1>Preview</h1>
		<div v-html='marked_content'/>
	</div>
</div>
</div>
</template>
<script>
import MoneyButton from 'vue-money-button'
import {Progress} from './loading';
import wikiLoader from './wiki-loader'
import bsv from 'bsv'
export default {
  components: {
    MoneyButton
  },
  data() {
    return {
			loaded: false,
      name: '',
      content: ''
    };
  },
watch: {
    '$route' (to, from) {
this.load(to.params);
    }
  },
computed: {
marked_content() {
return wikiLoader.marked(this.content);
},
outputs() {
	var opreturn = this.opReturn;
	return [{
      script: opreturn,
      amount: '0',
      currency: 'BSV'
    }]
},
opReturn() {
	var out = bsv.Script.buildSafeDataOut(['19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut',this.content,'text/markdown','utf8',this.name+'.md']);

	console.log(out.toASM());
return out.toASM();
}
},
	methods:{
    @Progress
		async load(params) {
		this.loaded = false;
		this.name = this.content = ''
    var wiki = await wikiLoader.load(params);
			if (wiki) {
				this.loaded = true;
				this.name = wiki.name;
				this.content = wiki.content;
			} else {
				this.name = params.page=='<new>'?'':params.page;
			}
		}
	},
  async mounted() {
		await this.load(this.$route.params);
  }
}
</script>
