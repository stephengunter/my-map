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
            this.settings.center= { lat, lng };
         }
      }

      if(this.zoom) this.settings.zoom = this.zoom;
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
            console.log('markerClustererPlus ready');
         })
      }

      $Scriptjs(buildQuery(GOOGLE_MAP.url, params), () => {
         this.initMap();
      });
   },
   methods:{
      initMap() {
         this.geocoder = new google.maps.Geocoder();

         this.map = new google.maps.Map(document.getElementById(this.id), {
            center: this.settings.center,
            zoom: this.settings.zoom,
            gestureHandling: this.settings.gestureHandling
         });

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
      setMarkerCluster() {

      },
      updateMarker(lastLng) {
         if(!this.marker) {
            this.marker = new google.maps.Marker({
               map: this.map
            });
         }

         this.marker.setPosition(lastLng);
      },
      setCityData({ coordinates, multiPoly, numGeometries}) {
         this.renderCityMap(coordinates);
         this.setDataLayer(multiPoly, numGeometries);
      },
      updateFromAddress(place) {
         let location = place.geometry.location;
         this.map.setCenter(location);
         this.updateMarker(location);
         this.lastLat = location.lat();
         this.lastLng = location.lng();
      },
      renderCityMap(cityData) {
         cityData.setMap(this.map);

         // and pass clicks on to the underlying map
         cityData.addListener('click', (e) => {
            google.maps.event.trigger(this.map, 'click', e);
         });
      },
      setDataLayer(googleGeometryMultiPoly, numGeometries) {
         this.mapGoogleGeometryMultiPoly = googleGeometryMultiPoly;
         this.mapNumGeometries = numGeometries;
      },
      searchPlacesByKeyword(keyword, radius = 1000) {
         if (!keyword) return;
         let params = {
            location: new google.maps.LatLng(this.lastLat, this.lastLng),
            radius: radius,
            keyword: keyword
         };

         let _this = this;
         // see https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
         this.placesService.nearbySearch(params, (results, status) => {
            if(status !== google.maps.places.PlacesServiceStatus.OK) return;
            // if we have not pulled in City Boundaries, this is our default
            let filteredresults = results;
            if(_this.mapNumGeometries > 0 && _this.mapGoogleGeometryMultiPoly) {
               filteredresults = [];

               results.map((curPlace) => {          
                  for (let i = 0; i < _this.mapNumGeometries; i++) {
                     let inLocation = google.maps.geometry.poly.containsLocation(curPlace.geometry.location, _this.mapGoogleGeometryMultiPoly[i]);
                     if(inLocation) filteredresults.push(curPlace);
                  }
               });
            }

            filteredresults.map((place) => {
               let image = {
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 0),
                  scaledSize: new google.maps.Size(15, 15)
               };
         
               let marker = new google.maps.Marker({
                  map: _this.map,
                  icon: image,
                  title: place.name,
                  position: place.geometry.location
               })
            });

            console.log('filteredresults', filteredresults);
         });

         
      },
      doSearch(params) {
      // yeah, I know, using _this ...
      // I really dont like how Google sets up pagination for this (compared to Yelp and others)
      // I should write this as a var pointing to a function definition etc...
      let _this = this;

      // see https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
      this.placesService.nearbySearch(params,
        async function (results, PlacesServiceStatus, PlaceSearchPagination) {

          if (PlacesServiceStatus !== 'OK') return;

          _this.searchResultMarkers(results);

          if (PlaceSearchPagination.hasNextPage) {
            // slight pause...
            await _this.wait(100); 
            _this.getNextPage = PlaceSearchPagination.hasNextPage && function() {
              PlaceSearchPagination.nextPage();
            }
          } else {  // null this so that we dont double up on api calls
            _this.getNextPage = null;
          }

          // invoke...
          if (_this.getNextPage) {
            _this.getNextPage();
          }
        }
      );
    },
   }

}
</script>

<style>
   
</style>