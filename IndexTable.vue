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
			<toggle-span @toggled='toggled'/>
		</div>
    <ul v-if='shown'>
    <li v-for="heading in headings" :style='{"padding-left": (heading.level*10-10)+"px"}' class='heading-link'>
      <a :href='hrefFromSlug(heading.slugId).href' :slugid='heading.slugId' @click='scrollTo(heading)' onclick='return false;'>{{heading.text}}</a>
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
  },
  methods:{
		toggled($event) {
			this.shown=$event;
		},
		scrollTo(heading) {
			try {
			this.$router.push({name:'page',params:{page:this.$route.params.page,type:heading.slugId}});
			} finally {
			document.getElementById(heading.slugId).scrollIntoView();
			}
		},
    hrefFromSlug(slugId) {
      var {href, route, location}=this.$router.resolve({ name: 'page', params: { page: this.$route.params.page,type:slugId }});
      return {href, path:route.path};
    },
  }
}
</script>
