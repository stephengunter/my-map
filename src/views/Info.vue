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

export default {
   data() {
      return {
         map: null,
         settings: {
            id: `map_${uuid()}`,
            center: [-25.363, 131.044],
            type: MAP_TYPES.TERRAIN,
            zoom: 4
         },

         infoWindow: null,
         content: '',
         
         references: {}
      }
   },
   beforeMount() {
      this.content = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';
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
         this.infoWindow = new google.maps.InfoWindow({
            content: this.content
         });

         let marker = new google.maps.Marker({
            position: { lat: -25.363, lng: 131.044 },
            map: this.map,
            title: 'Uluru (Ayers Rock)'
         });
         marker.addListener('click', () => {
            this.infoWindow.open(this.map, marker);
         });
      }
   }
}
</script>

<style>

</style>