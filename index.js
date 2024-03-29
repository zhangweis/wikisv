import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRx from 'vue-rx'
import * as VueTruncate from 'vue-truncate-filter'
import * as vueMoment from 'vue-moment';
Vue.use(VueTruncate)

Vue.use(VueRx)

Vue.use(VueRouter)
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
// Init plugin
Vue.use(Loading);
Vue.use(vueMoment);

//var element = document.createElement('div');
//document.body.appendChild(element);
import app from './App';
import Wiki from './Wiki';
import Index from './Index';
import History from './History';
import Edit from './Edit';
import CreateLink from './CreateLink';
Vue.component('create-link', CreateLink);
const routes = [
    { path: '/history/:page', name:'history', component:History },
    { path: '/edit/:page/:type?', name:'edit', component:Edit },
//    { path: '/tx/:txid', name:'tx',component:Wiki },
    { path: '/', name:'home', component:Index },
    { path: '/wiki/:page/:type?', name:'page', component:Wiki },

		{ path: '*', redirect: '/' }
];
const router = new VueRouter({
//		mode: 'history',
    routes // short for `routes: routes`
});
window.router = router;

//router.formatPath = 
app.router = router;
new Vue(app).$mount('#app');
