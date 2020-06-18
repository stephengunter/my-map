import GeosService from '@/services/geos.service';
import { FETCH_CITY_GEO } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';


const initialState = {
    
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_CITY_GEO](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         GeosService.fetch(params)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
};


const mutations = {
   
};

export default {
   state,
   actions,
   mutations,
   getters
};
 