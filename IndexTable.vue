<style>
.toctitle h2 {
display:inline
}
.toc .toctitle {
	text-align: center
}
.toc ul {
margin-left:0;
margin: 2px 0;
padding:0;
}
.toc {
display: table;
border: 1px solid #a2a9b1;
background-color: #f8f9fa;
padding: 7px;
}
</style>
<template>
  <div class='toc' v-if='headings.length'>
		<div class='toctitle'>
			<h2>TOC</h2>
			<toggle-span @toggled='toggled' :shown='shown'/>
		</div>
    <ul v-if='shown'>
    <li v-for="heading in headings" :style='{"padding-left": (heading.level*10-10)+"px"}' class='heading-link'>
<router-link :to="{ name: 'page', params: { page: page,type:heading.slugId }}">{{heading.text}}</router-link>
<br/>
    </li>
    </ul>
  </div>
</template>
<script>
import ToggleSpan from './ToggleSpan';
export default {
  components:{
    ToggleSpan
  },
	data() {
		return {
			shown: true
		}
	},
  props:{
  headings: Array,
	page: String,
	initShown: {
		type: Boolean,
		default: true,
	}
  },
	mounted() {
		this.shown = this.initShown;
	},
  methods:{
		toggled($event) {
			this.shown=!this.shown;
		},
  }
}
</script>
