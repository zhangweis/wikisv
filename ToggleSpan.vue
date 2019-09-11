<style>
.togglelink:before {
content: '['
}
.togglelink:after {
content: ']'
}

.togglelink {
}
</style>
<template>
			<span>
<a href='#' onclick='return false;' class='togglelink' @click='toggle'>{{shown?'Hide':'Show'}}</a>
</span>
</template>
<script>
export default {
  props: {
    shown: Boolean
  },
  data() {
    return {
    }
  },
  methods:{
    toggle() {
      this.$emit('toggled');
    }
  }
}
</script>
