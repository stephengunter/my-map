import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import geos from './modules/geos.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      geos 
   }
});
