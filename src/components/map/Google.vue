<template>
   <div :id="id" :style="style">

   </div>
</template>

<script>
import $Scriptjs from 'scriptjs';
import { GOOGLE_MAP } from '@/config';
import { tryParseInt, isValidLatitude, isValidLongitude,
uuid, buildQuery } from '@/utils';

export default {
   name: 'MapGoogle',
   props: {
      id: {
         type: String,
         default: 'map'
      },
      height: {
         type: Number,
         default: 420
      },
      type: {
         type: String,
         default: ''
      },
      language: {
         type: String,
         default: ''
      },
      import_marker_cluster: {
         type: Boolean,
         default: true
      },
      import_geometry: {
         type: Boolean,
         default: false
      },
      import_places: {
         type: Boolean,
         default: false
      },
      hide_business: {
         type: Boolean,
         default: false
      },
      center: {
         type: Array,
         default: null
      },
      zoom: {
         type: Number,
         default: 0
      }   
   },
   data() {
      return {
         map: null,

         settings: {
            center: {
               lat: 25.0,
               lng: 121.5
            },
            zoom: 12,
            mapTypeId: '',
            gestureHandling: 'greedy'
         },

         marker: null,
         lastLat: null,
         lastLng: null,

         geocoder: null,
         placesService: null,

         mapGoogleGeometryMultiPoly: null,
         mapNumGeometries: 0,

         styles: {
            default: null,
            hide: []
         }
      }
   },
   computed: {
      style() {
         return {
            width: '100%',
            height: `${this.height}px`
         }
      }
   },
   beforeMount() {
      if(this.hide_business) {
         this.styles.hide.push({
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
         });
      }
      if(this.center && this.center.length === 2) {
         let lat = tryParseInt(this.center[0]);
         let lng = tryParseInt(this.center[1]);
         if(isValidLatitude(lat) && isValidLongitude(lng)) {
            this.settings.center = new google.maps.LatLng(lat, lng);
         }
      }

      if(this.zoom) this.settings.zoom = this.zoom;

      if(this.type) this.settings.mapTypeId = this.type;
   },
   mounted() {
      let params = {
         key: GOOGLE_MAP.key
      };
      if(this.language) params.language = this.language;

      let libraries = [];
      if(this.import_geometry) libraries.push('geometry');
      if(this.import_places) libraries.push('places');
      if(libraries.length) params.libraries = libraries.join();

      if(this.import_marker_cluster) {
         $Scriptjs(GOOGLE_MAP.markerClustererPlus.src, () => {
            this.$emit('marker-clusterer-ready');
         })
      }

      $Scriptjs(buildQuery(GOOGLE_MAP.url, params), () => {
         this.initMap();
      });
   },
   methods:{
      initMap() {
         this.geocoder = new google.maps.Geocoder();

         let options = {
            center: this.settings.center,
            zoom: this.settings.zoom,
            gestureHandling: this.settings.gestureHandling
         };
         if(this.settings.mapTypeId) options.mapTypeId = this.settings.mapTypeId;

         this.map = new google.maps.Map(document.getElementById(this.id), options);

         if(this.styles.hide.length) {
            this.map.setOptions({
               styles: this.styles['hide']
            });
         }

         if(this.import_places) {
            this.placesService = new google.maps.places.PlacesService(this.map);
         }
         

         google.maps.event.addListener(this.map, 'click', (e) => {
            
            let latLng = e.latLng;
            this.lastLat = latLng.lat();
            this.lastLng = latLng.lng();
            
            this.updateMarker(latLng);

            this.geocoder.geocode({ 'location': latLng }, (results, status) => {
               if(results) this.$emit('address', results);
            });
         });

         this.$emit('initialized');
      },
      setMarkerCluster(markers) {
         let markerCluster = new MarkerClusterer(this.map, markers, {
            imagePath: GOOGLE_MAP.markerClustererPlus.imagePath
         });
      },
      setMarkers(positions) {
         let map = this.map;
         positions.forEach(position => {
            let marker = new google.maps.Marker({
               position, 
               map
            });
         });
      },
   }

}
</script>

<style>
   
</style>