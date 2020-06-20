<template>
   <v-row>
      <v-col>
         <v-card>
            <map-google ref="gMap" :id="settings.id" :center="settings.center"
            :type="settings.type" :libraries="settings.libraries" :zoom="settings.zoom"
            @initialized="onMapInitialized"
            />
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
import $Scriptjs from 'scriptjs';
import { SITE_URL }  from '@/config';
import { uuid, getRandomInt } from '@/utils';
import { MAP_TYPES } from '@/consts';
import { FETCH_CWB } from '@/store/actions.type';

export default {
   data() {
      return {
         map: null,
         settings: {
            id: `map_${uuid()}`,
            libraries: [],
            center: [24, 120.2],
            type: '',
            zoom: 7,
            styles: [{
               'stylers': [{'visibility': 'off'}]
            },{
               'featureType': 'landscape',
               'elementType': 'geometry',
               'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
            },{
               'featureType': 'water',
               'elementType': 'geometry',
               'stylers': [{'visibility': 'on'}, {'color': '#bfd4ff'}]
            }]
         },
         
         references: {}
      }
   },
   beforeMount() {

   },
   mounted() {
		this.references = { ...this.$refs };
   },
   computed: {
		gMap() {
			if(this.$refs.gMap) return this.$refs.gMap;
			else if (this.references.gMap) return this.references.gMap;
			return null;
		}
   },
   methods: {
      onMapInitialized(map) {
         this.map = map;

         this.map.data.setStyle(this.styleFeature);

         this.loadMapShapes();
      },
      loadMapShapes() {
         let sourceUrl = `${SITE_URL}/data/roc_cities.json`;
         this.map.data.loadGeoJson(sourceUrl, { idPropertyName: 'COUNTYID' });

         // wait for the request to complete by listening for the first feature to be added
         google.maps.event.addListenerOnce(this.map.data, 'addfeature', () => {
            console.log('addfeature');           
         });
      },
      styleFeature(feature) {
         console.log('feature', feature);

         // determine whether to show this shape or not
         let showRow = true;
         if (feature.getProperty('census_variable') == null || isNaN(feature.getProperty('census_variable'))) {
            showRow = false;
         }

         let outlineWeight = 0.5;
         let zIndex = 1;
         if (feature.getProperty('state') === 'hover') {
            outlineWeight = zIndex = 2;
         }

         return {
             strokeWeight: 1,
               strokeOpacity: .5,
               strokeColor: '#000',
               fillColor: '#f00',
               fillOpacity: .3
         }

         // return {
         //    strokeWeight: outlineWeight,
         //    strokeColor: '#fff',
         //    zIndex: zIndex,
         //    //fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
         //    fillOpacity: 0.75,
         //    visible: showRow
         // };
      }
   }
}
</script>

<style>

</style>