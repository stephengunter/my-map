<template>
   <v-navigation-drawer v-model="drawer" id="app-drawer" app>
      <div class="text-center mt-2">
         <v-avatar>
            <img :src="require('@/assets/logo.png')">
         </v-avatar>
      </div>
      <v-list v-if="ready" subheader flat>
         <v-subheader>防災資訊</v-subheader>
         <v-list-item-group v-model="selectedInfoes" multiple>
            <v-list-item v-for="item in info.items" :key="item.id">
               <template v-slot:default="{ active }">
                  <v-list-item-action>
                  <v-checkbox :input-value="active" color="primary"
                  />
                  </v-list-item-action>

                  <v-list-item-content>
                     <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
               </template>
            </v-list-item>
         </v-list-item-group>
         <v-subheader>土石流災害潛勢資料</v-subheader>
         <v-list-item-group v-model="selectedSoils" multiple>
            <v-list-item v-for="item in soil.items" :key="item.id">
               <template v-slot:default="{ active }">
                  <v-list-item-action>
                  <v-checkbox :input-value="active" color="primary"
                  />
                  </v-list-item-action>

                  <v-list-item-content>
                     <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
               </template>
            </v-list-item>
         </v-list-item-group>
         <v-subheader>氣象資訊</v-subheader>
         <v-list-item-group v-model="selectedWeathers" multiple>
            <v-list-item v-for="item in weather.items" :key="item.id">
               <template v-slot:default="{ active }">
                  <v-list-item-action>
                  <v-checkbox :input-value="active" color="primary"
                  />
                  </v-list-item-action>

                  <v-list-item-content>
                     <v-list-item-title>{{ item.text }}</v-list-item-title>
                  </v-list-item-content>
               </template>
            </v-list-item>
         </v-list-item-group>
      </v-list>
   </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_ER_LOCATIONS, FETCH_DISASTERS,
FETCH_DEBRIS, FETCH_DEBRIS_AREAS, FETCH_RAINS } from '@/store/actions.type';
import { SET_DRAWER, TOGGLE_DRAWER } from '@/store/mutations.type';

export default {
   name: 'TheDrawer',
   data(){
		return {
         ready: false,

         info: {
            items: []
         },

         soil: {
            items: []
         },

         weather: {
            items: []
         },

         selectedInfoes: [],
         selectedSoils: [],
         selectedWeathers: [],
         
		}
   },
   computed: {
		...mapGetters(['isAuthenticated', 'responsive', 'menus']),
    	drawer: {
         get() {
            return this.$store.state.app.drawer
         },
         set(val) {
            this.setDrawer(val)
         }
		}
   },
   watch: {
      'selectedInfoes' : 'checkSelectedInfoes',
      'selectedSoils' : 'checkSelectedSoils',
      'selectedWeathers' : 'checkSelectedWeathers'
   },
   created(){
		Bus.$on('map-ready', () => {
         this.ready = true;
      });
	},
   beforeMount() {
      let items = [{
         category: 'INFO', value: FETCH_ER_LOCATIONS, text: '避難處所'
      },{
         category: 'INFO', value: FETCH_DISASTERS, text: '重大災例'
      },{
         category: 'SOIL', value: FETCH_DEBRIS, text: '潛勢溪流'
      },{
         category: 'SOIL', value: FETCH_DEBRIS_AREAS, text: '影響範圍'
      },{
         category: 'WEATHER', value: FETCH_RAINS, text: '累積雨量'
      }];

      let id = 1;
      items.forEach(item => {
         item.id = id;
         let listItem = {
            id, value: item.value, text: item.text
         };
         if(item.category === 'INFO') this.info.items.push(listItem);
         else if(item.category === 'SOIL') this.soil.items.push(listItem);
         else if(item.category === 'WEATHER') this.weather.items.push(listItem);

         id += 1;
      })
      
   },
   methods:{
      setDrawer(val) {
         this.$store.commit(SET_DRAWER, val);
      },
      checkSelectedInfoes() {

         console.log(this.selectedInfoes);
      },
      checkSelectedInfoes(newVals, oldVals) {
         let difference = [];
         if(newVals.length > oldVals.length) {
            difference = newVals.filter(x => !oldVals.includes(x));
            let newItem = this.info.items[difference[0]];
            this.onNewFeatureSelected(newItem);
         }else if (newVals.length < oldVals.length){
            difference = oldVals.filter(x => !newVals.includes(x));
            let removedItem = this.info.items[difference[0]];
            this.onFeatureRemoved(removedItem);
         }
         
      },
      checkSelectedSoils(newVals, oldVals) {
         let difference = [];
         if(newVals.length > oldVals.length) {
            difference = newVals.filter(x => !oldVals.includes(x));
            let newItem = this.soil.items[difference[0]];
            this.onNewFeatureSelected(newItem);
         }else if (newVals.length < oldVals.length){
            difference = oldVals.filter(x => !newVals.includes(x));
            let removedItem = this.soil.items[difference[0]];
            this.onFeatureRemoved(removedItem);
         }
         
      },
      checkSelectedWeathers(newVals, oldVals) {
         let difference = [];
         if(newVals.length > oldVals.length) {
            difference = newVals.filter(x => !oldVals.includes(x));
            let newItem = this.weather.items[difference[0]];
            this.onNewFeatureSelected(newItem);
         }else if (newVals.length < oldVals.length){
            difference = oldVals.filter(x => !newVals.includes(x));
            let removedItem = this.weather.items[difference[0]];
            this.onFeatureRemoved(removedItem);
         }
         
      },
      onNewFeatureSelected(item) {
         Bus.$emit('add-feature', item.value);
      },
      onFeatureRemoved(item) {
         Bus.$emit('remove-feature', item.value);
      }
	}
}
</script>

<style>

</style>