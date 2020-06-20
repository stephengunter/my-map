<template>
   <v-row>
      <v-col>
         <v-card>
            <map-google ref="gMap" :id="settings.id" :center="settings.center"
            :type="settings.type" :zoom="settings.zoom"
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
import { FETCH_ER_LOCATIONS } from '@/store/actions.type';

export default {
   data() {
      return {
         map: null,
         settings: {
            id: `map_${uuid()}`,
            center: [-34.397, 151.196123],
            type: MAP_TYPES.TERRAIN,
            zoom: 6
         },

         infoWindow: null,
         
         references: {},

         redAlert: 6
      }
   },
   beforeMount() {
      let t = '2020/06/2019:10';
      console.log(t.split(':'));
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
      fetchAlerts() {
         console.log('sss');
      },
      onMapInitialized(map) {
         this.map = map;
         this.infoWindow = new google.maps.InfoWindow;

         // Try HTML5 geolocation.
         if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
               let pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
               };
               this.infoWindow.setPosition(pos);
               this.infoWindow.setContent('Location found.');
               this.infoWindow.open(this.map);

               this.map.setCenter(pos);
               
            }, () => {
               this.handleLocationError(true, this.infoWindow, this.map.getCenter());
            });
         }else {
          // Browser doesn't support Geolocation
            this.handleLocationError(false, this.infoWindow, this.map.getCenter());
         }
      },
      handleLocationError(browserHasGeolocation, infoWindow, pos) {
         infoWindow.setPosition(pos);
         infoWindow.setContent(browserHasGeolocation ?
                                 'Error: The Geolocation service failed.' :
                                 'Error: Your browser doesn\'t support geolocation.');
         infoWindow.open(map);
      }
   }
}
</script>

<style>

</style>