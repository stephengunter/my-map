<template>
   <v-row>
      <v-col>
         <v-card>
            <map-google ref="gMap" :id="map.id" :center="map.center"
            :type="map.type" :zoom="map.zoom"
            @initialized="onMapInitialized"
            />
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
import $Scriptjs from 'scriptjs';
import { uuid, buildQuery } from '@/utils';
import { MAP_TYPES } from '@/consts';

export default {
   data() {
      return {
         map: {
            id: `map_${uuid()}`,
            center: [33.865427, 151.196123],
            type: MAP_TYPES.TERRAIN,
            zoom: 2
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
      onMapInitialized() {
         this.gMap.map.data.setStyle(feature => {
            let magnitude = feature.getProperty('mag');
            return {
               icon: this.getCircle(magnitude)
            };
         });
         window.eqfeed_callback = (results) => {
            this.gMap.map.data.addGeoJson(results);
         }



			$Scriptjs('https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js');

      },
      getCircle(magnitude) {
         return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: .2,
            scale: Math.pow(2, magnitude) / 2,
            strokeColor: 'white',
            strokeWeight: .5
         };
      }
   }
}
</script>

<style>

</style>