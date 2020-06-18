import Vue from 'vue';
window.Bus = new Vue({});

import App from './App.vue';
import router from './routes';
import store from './store';

import vuetify from './plugins/vuetify';
import '@/components';

import { INIT, FETCH_ACTIONS } from '@/store/actions.type';
import Menu from '@/common/menu';
import { SET_CURRENT_PAGE, SET_MENUS } from '@/store/mutations.type';


router.beforeEach((to, from, next) => {
	return authDone(next, to);
});

router.afterEach((to, from) => {
	store.commit(SET_CURRENT_PAGE, to);
})

const redirect = (next, route) => next(route);

const authDone = (next, to) => {

	let mainMenus = Menu.getMainMenus(router.options.routes, to);
	store.commit(SET_MENUS, mainMenus);

	store.dispatch(INIT);
	store.dispatch(FETCH_ACTIONS, to);
	return next();
}


Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
