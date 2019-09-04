<style>
.item {
padding: 5px
}
</style>
<template>
  <div>
        <loading :active.sync="loading" 
        :is-full-page="true"></loading>
				<div v-if='loadingFailMessage'>Loading failed ({{loadingFailMessage}}). Please <button onclick='location.reload();'>refresh</button></div>
  <router-view></router-view>
</div>
</template>
<script>
import Loading from 'vue-loading-overlay'; 
import {loading$,failMessage$} from './loading';
export default {
components:{
	Loading
},
  subscriptions: {
    loading: loading$,
    loadingFailMessage:failMessage$
  },
  data() {
    return {
    }
  }
}
</script>
