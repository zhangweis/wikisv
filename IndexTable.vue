<template>
  <div v-if='router.history.current.name=="page"'>
    <ul>
    <li v-for="heading in headings" :style='{"padding-left": (heading.level*10-10)+"px"}'>
      <a :path="hrefFromSlug(heading.slugId).path" :href="hrefFromSlug(heading.slugId).href" :onclick='scrollToViewJs(heading.slugId)+"return false;"'>{{heading.text}}</a>
<br/>
    </li>
    </ul>
  </div>
</template>
<script>
export default {
  props:{
  headings: Array
  },
  computed:{
    router() {
      return this.$options.router;
    }
  },
  methods:{
    hrefFromSlug(slugId) {
      var {href, route, location}=this.router.resolve({ name: 'page', params: { page: this.router.history.current.params.page,type:slugId }});
      return {href, path:route.path};
    },
    scrollToViewJs(id) {
      return `router.push({ path:this.getAttribute('path')});document.getElementById("${id}").scrollIntoView();`
    }
  }
}
</script>
