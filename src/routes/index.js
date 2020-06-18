import Vue from 'vue';
import Router from 'vue-router';
import appRoutes from './app';

const mapRoute = (item) => {
	return { 
		...item,  
		component: (resolve) => import(
			`@/views/${item.view}.vue`
		).then(resolve)
	}
}


const originalPush = Router.prototype.push;

Router.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function repalce(location, onResolve, onReject) {
	if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
	return originalReplace.call(this, location).catch(err => err)
}

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: appRoutes.map(item => mapRoute(item)).concat([{
		path: '*', redirect: '/',
		meta: {}      
	}]),
	
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
		  return savedPosition
		}
		if (to.hash) {
		  return { selector: to.hash }
		}
		return { x: 0, y: 0 }
	}
});
