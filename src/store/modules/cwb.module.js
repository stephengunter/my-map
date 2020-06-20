import CWBService from '@/services/cwb.service';
import { FETCH_CWB } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';


const initialState = {
    
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_CWB](context, { category, params }) {
      context.commit(SET_LOADING, { value: true, text: '' });
      return new Promise((resolve, reject) => {
         CWBService.fetch(category, params)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, { value: false });
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
 