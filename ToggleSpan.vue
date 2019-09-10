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
  data() {
    return {
      shown: true
    }
  },
  methods:{
    toggle() {
      this.shown = !this.shown;
      this.$emit('toggled', this.shown);
    }
  }
}
</script>
