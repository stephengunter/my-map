<template>
   <v-row>
      <v-col>
         <v-card>
            <map-google ref="gMap" :id="map.id" :center="map.center"
            :libraries="map.libraries" :type="map.type" :zoom="map.zoom"
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
            libraries: ['visualization'],
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
         window.eqfeed_callback = (results) => {
            let heatmapData = [];
            for (let i = 0; i < results.features.length; i++) {
               let coords = results.features[i].geometry.coordinates;
               let latLng = new google.maps.LatLng(coords[1], coords[0]);
               heatmapData.push(latLng);
            }

            
            let heatmap = new google.maps.visualization.HeatmapLayer({
               data: heatmapData,
               dissipating: false,
               map: this.gMap.map
            });
         }



			$Scriptjs('https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js');

      }
   }
}
</script>

<style>

</style>