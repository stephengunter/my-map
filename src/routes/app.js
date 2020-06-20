import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';

const applinks = [{
   name: 'home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'main', show: FOR_ALL, order: 0
      }],
      icon: 'mdi-home',
      title: '首頁'
   } 
}];

const userLinks = [{
   name: 'rain',
   path: '/rain',
   view: 'Rain',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Rain'
   } 
}];

const guestLinks = [{
   name: 'test',
   path: '/test',
   view: 'Test',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Test'
   } 
},{
   name: 'marker',
   path: '/marker',
   view: 'Marker',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Marker'
   } 
},{
   name: 'import',
   path: '/import',
   view: 'Import',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Import'
   } 
},{
   name: 'visualizing',
   path: '/visualizing',
   view: 'Visualizing',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Visualizing'
   } 
},{
   name: 'heat',
   path: '/heat',
   view: 'Heat',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Heat'
   } 
},{
   name: 'combining',
   path: '/combining',
   view: 'Combining',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Combining'
   } 
},{
   name: 'geolocation',
   path: '/geolocation',
   view: 'Geolocation',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Geolocation'
   } 
},{
   name: 'info',
   path: '/info',
   view: 'Info',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Info'
   } 
},{
   name: 'counties',
   path: '/counties',
   view: 'Counties',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Counties'
   } 
},{
   name: 'rain-heat',
   path: '/rain-heat',
   view: 'rain/Heat',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [],
      icon: '',
      title: 'Rain Heat'
   } 
}];



let appRoutes = applinks.concat(userLinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;