import SWCBService from '@/services/swcb.service';
import { SITE_URL } from '@/config';
import { SWCB_GET_LOCATION, FETCH_TOWN_ALERT_INFO, FETCH_ER_LOCATIONS,
FETCH_DISASTERS, FETCH_DEBRIS, FETCH_DEBRIS_AREAS, FETCH_RAINS } from '@/store/actions.type';
import { SET_LOADING, SET_COUNTY, SET_TOWN, 
SET_RED_ALERT, SET_YELLO_ALERT, SET_ER_LOCATIONS, SET_DISASTERS, 
SET_DEBRIS, SET_DEBRIS_AREAS, SET_RAINS }
from '@/store/mutations.type';


const initialState = {
   county: '',
   town: '',
   redAlert: 0,
   yellowAlert: 0,

   erLocations: [],
   disasterList: [],
   rainList: [],
   debrisGeoJson: null,
   debrisAreasGeoJson: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [SWCB_GET_LOCATION](context, { lat, lng }) {
      // context.commit(SET_LOADING, { value: true, text: '正在取得位置資訊'});
      return new Promise((resolve, reject) => {
         SWCBService.getLocation(lat, lng)
         .then(data => {
            let model = typeof data === 'object' ? data : JSON.parse(data);
            context.commit(SET_COUNTY, model.County);
            context.commit(SET_TOWN, model.Town);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         // .finally(() => {
         //    context.commit(SET_LOADING, { value: false });
         // });
      });
   },
   [FETCH_TOWN_ALERT_INFO](context, { county, town }) {
      context.commit(SET_LOADING, { value: true, text: ''});
      return new Promise((resolve, reject) => {
         SWCBService.getTownAlertInfo(county, town)
         .then(data => {
            let model = typeof data === 'object' ? data : JSON.parse(data);
            context.commit(SET_RED_ALERT, model.RedCount);
            context.commit(SET_YELLO_ALERT, model.YellowCount);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => {
            context.commit(SET_LOADING, { value: false });
         });
      });
   },
   [FETCH_ER_LOCATIONS](context) {
      return new Promise((resolve) => {
         let xhr = new XMLHttpRequest();
         xhr.open('GET', `${SITE_URL}/data/er_locations.json`);
         xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            context.commit(SET_ER_LOCATIONS, data.features);
            resolve(true);
         };
         xhr.send();
      });
   },
   [FETCH_DISASTERS](context) {
      return new Promise((resolve) => {
         let xhr = new XMLHttpRequest();
         xhr.open('GET', `${SITE_URL}/data/disasters.json`);
         xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            context.commit(SET_DISASTERS, data.DisasterExpress.Row);
            resolve(true);
         };
         xhr.send();
      });
   },
   [FETCH_DEBRIS](context) {
      return new Promise((resolve) => {
         let xhr = new XMLHttpRequest();
         xhr.open('GET', `${SITE_URL}/data/debris.json`);
         xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            context.commit(SET_DEBRIS, data);
            resolve(true);
         };
         xhr.send();
      });
   },
   [FETCH_DEBRIS_AREAS](context) {
      return new Promise((resolve) => {
         let xhr = new XMLHttpRequest();
         xhr.open('GET', `${SITE_URL}/data/debris_area.json`);
         xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            context.commit(SET_DEBRIS_AREAS, data);
            resolve(true);
         };
         xhr.send();
      });
   },
   [FETCH_RAINS](context) {
      return new Promise((resolve) => {
         let xhr = new XMLHttpRequest();
         xhr.open('GET', `${SITE_URL}/data/rain_stations.json`);
         xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            context.commit(SET_RAINS, data.RainStations.Data);
            resolve(true);
         };
         xhr.send();
      });
   },
};


const mutations = {
   [SET_COUNTY](state, val) {
      state.county = val;
   },
   [SET_TOWN](state, val) {
      state.town = val;
   },
   [SET_RED_ALERT](state, val) {
      state.redAlert = val;
   },
   [SET_YELLO_ALERT](state, val) {
      state.yellowAlert = val;
   },
   [SET_ER_LOCATIONS](state, locations) {
      state.erLocations = locations;
   },
   [SET_DISASTERS](state, list) {
      state.disasterList = list;
   },
   [SET_DEBRIS](state, data) {
      state.debrisGeoJson = data;
   },
   [SET_DEBRIS_AREAS](state, data) {
      state.debrisAreasGeoJson = data;
   },
   [SET_RAINS](state, list) {
      state.rainList = list;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 