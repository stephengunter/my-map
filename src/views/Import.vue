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
            center: [2.8, -187.3],
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
         
         window.eqfeed_callback = (results) => {
            let positions = [];
            for (let i = 0; i < results.features.length; i++) {
               let coords = results.features[i].geometry.coordinates;
               positions.push(new google.maps.LatLng(coords[1],coords[0]));
            }
             
            this.gMap.setMarkers(positions);
         }
			$Scriptjs('https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js');

         
		},
   }
}
</script>

<style>

</style>