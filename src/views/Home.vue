<template>
<v-container>
   <v-row>
      <v-col>
         <v-card height="80vh">
            <core-google-map ref="gMap" :id="settings.id"
            :libraries="settings.libraries" :options="options"
            @initialized="onMapInitialized"
            />
         </v-card>
      </v-col>
   </v-row>
   <div :id="info.id" v-show="false">
      <alert-info />
   </div>
   <div :id="er.id"  v-show="false">
      <er-info :model="er.model" />
   </div>
   <div :id="disasters.id"  v-show="false">
      <disaster-info :model="disasters.model" />
   </div>
   <div :id="rain.id"  v-show="false">
      <rain-info :model="rain.model" :date="rain.date" />
   </div>
   <div :id="debris.id"  v-show="false">
      <debris-info :model="debris.model" />
   </div>
   <div :id="debrisArea.id"  v-show="false">
      <debris-area-info :model="debrisArea.model" />
   </div>
</v-container>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import $Scriptjs from 'scriptjs';
import { uuid, tryParseInt } from '@/utils';
import { MAP_TYPES } from '@/consts';
import { SITE_URL, SWCB } from '@/config';
import { SWCB_GET_LOCATION, FETCH_TOWN_ALERT_INFO, FETCH_ER_LOCATIONS,
FETCH_DISASTERS, FETCH_DEBRIS, FETCH_DEBRIS_AREAS, FETCH_RAINS } from '@/store/actions.type';

export default {
   data() {
      return {
         ready: false,
         map: null,
         options: {
            center: { lat: 23.6960645, lng: 120.5318546 },
            mapTypeId: MAP_TYPES.TERRAIN,
            zoom: 12,
            gestureHandling: 'greedy'
         },
         settings: {
            id: `map_${uuid()}`,
            libraries: ['drawing', 'places'],
         },
         location: {
            icon: `${SITE_URL}/images/map_lbsPeople.png`,
            marker: null
         },

         er: {
            icon: `${SITE_URL}/images/layerBox2-1.png`,
            markers: [],
            id: `er_${uuid()}`,
            model: null,
            infoWindow: null
         },

         disasters: {
            icon: `${SITE_URL}/images/layerBox2-2.png`,
            markers: [],
            id: `disaster_${uuid()}`,
            model: null,
            infoWindow: null
         },

         rain: {
            icons: [`${SITE_URL}/images/map_marker_sun.png`,
            `${SITE_URL}/images/map_marker_rainfall.png`,
            ],
            markers: [],
            id: `rain_${uuid()}`,
            date: '2020-06-20',
            model: null,
            infoWindow: null
         },

         debris: {
            mapData: null,
            id: `debris_${uuid()}`,
            model: null,
            infoWindow: null
         },

         debrisArea: {
            mapData: null,
            id: `debris_area_${uuid()}`,
            model: null,
            infoWindow: null
         },

         info: {
            id: `info_${uuid()}`,
            window: null
         },
         
         references: {}
      }
   },
   created(){
		Bus.$on('add-feature', this.onAddFeature);
		Bus.$on('remove-feature', this.onRemoveFeature);
	},
   beforeMount() {
      if(navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            this.options.center = { lat, lng };
            this.ready = true;
         }, () => {
            this.ready = true;
         });
      }else {
         this.ready = true;
      }
   },
   mounted() {
		this.references = { ...this.$refs };
   },
   computed: {
      ...mapState({
         county: state => state.swcb.county,
         town: state => state.swcb.town,
         redAlert: state => state.swcb.redAlert,
         yellowAlert: state => state.swcb.yellowAlert,
         erLocations: state => state.swcb.erLocations,
         disasterList: state => state.swcb.disasterList,
         rainList: state => state.swcb.rainList,
         debrisGeoJson: state => state.swcb.debrisGeoJson,
         debrisAreasGeoJson: state => state.swcb.debrisAreasGeoJson
		}),
		gMap() {
			if(this.$refs.gMap) return this.$refs.gMap;
			else if (this.references.gMap) return this.references.gMap;
			return null;
      },
      currentPosition() {
         if(!this.location.marker) return null;
         return this.location.marker.getPosition();
      }
   },
   methods: {
      onMapInitialized(map) {
         this.map = map;
         Bus.$emit('map-ready');

         this.info.window = new google.maps.InfoWindow();

         let position = new google.maps.LatLng(this.options.center.lat, this.options.center.lng);
         let icon = this.location.icon;
         let marker = new google.maps.Marker({
            position,
            icon,
            draggable: true,
         });
         marker.addListener('dragend', (e) => {
            this.onPositionChanged();
         });

         marker.addListener('click', (e) => {
            this.openInfoWindow();
         });

         marker.setMap(this.map);
         this.location.marker = marker;

         this.fetchLocationInfo();
         

         google.maps.event.addListener(this.map, 'click', (e) => {
            if(this.location.marker !== undefined) {
               this.location.marker.setPosition(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
               this.onPositionChanged();
            }
         });

         
      },
      onPositionChanged() {
         this.fetchLocationInfo();
      },
      fetchLocationInfo() {
         if(!this.currentPosition) return;

         let lat = this.currentPosition.lat();
         let lng = this.currentPosition.lng();
         this.$store.dispatch(SWCB_GET_LOCATION, { lat, lng })
         .then(data => {
            let county = data.County;
            let town = data.Town;

            this.fetchTownAlertInfo({ county, town });
            
         })
         .catch(err => {
            console.error(err);
         })
      },
      fetchTownAlertInfo(location) {
         if(!location) location = { county: this.county, town: this.town };

         this.$store.dispatch(FETCH_TOWN_ALERT_INFO, location)
         .then(data => {
            this.$nextTick(() => {
               this.openInfoWindow();
            });
         })
         .catch(err => {
            console.error(err);
         })
      },
      openInfoWindow(position) {
         if(!position) position = { lat: this.currentPosition.lat(), lng: this.currentPosition.lng() };

         let content = document.getElementById(this.info.id).innerHTML;
         this.info.window.setPosition(position);
         this.info.window.setContent(content);
         this.info.window.open(this.map);
      },
      onAddFeature(name) {
         if(name === FETCH_ER_LOCATIONS) {
            if(this.erLocations.length) this.showERLocations();
            else {
               this.$store.dispatch(FETCH_ER_LOCATIONS)
               .then(() => {
                  this.$nextTick(() => {
                     this.showERLocations();
                  });
               })   
            }
         }else if(name === FETCH_DISASTERS) {
            if(this.disasterList.length) this.showDisasters();
            else {
               this.$store.dispatch(FETCH_DISASTERS)
               .then(() => {
                  this.$nextTick(() => {
                     this.showDisasters();
                  });
               })   
            }
         }else if(name === FETCH_DEBRIS) {

            if(this.debrisGeoJson) this.showDebris();
            else {
               this.$store.dispatch(FETCH_DEBRIS)
               .then(() => {
                  this.$nextTick(() => {
                     this.showDebris();
                  });
               })   
            }
         }else if(name === FETCH_DEBRIS_AREAS) {
            if(this.debrisAreasGeoJson) this.showDebrisAreas();
            else {
               this.$store.dispatch(FETCH_DEBRIS_AREAS)
               .then(() => {
                  this.$nextTick(() => {
                     this.showDebrisAreas();
                  });
               })   
            }
         }else if(name === FETCH_RAINS) {
            if(this.rainList.length) this.showRains();
            else {
               this.$store.dispatch(FETCH_RAINS)
               .then(() => {
                  this.$nextTick(() => {
                     this.showRains();
                  });
               })   
            }
         }
      },
      onRemoveFeature(name) {
         if(name === FETCH_ER_LOCATIONS) {
            for(let i = 0; i < this.er.markers.length; i++){
               this.er.markers[i].setMap(null);
            }
            this.er.markers = [];
            if(this.er.infoWindow) {
               this.er.infoWindow.close();
               this.er.infoWindow = null;
            }

         }else if(name === FETCH_DISASTERS) {
            for(let i = 0; i < this.disasters.markers.length; i++){
               this.disasters.markers[i].setMap(null);
            }
            this.disasters.markers = [];
            if(this.disasters.infoWindow) {
               this.disasters.infoWindow.close();
               this.disasters.infoWindow = null;
            }

         }else if(name === FETCH_DEBRIS) {
            if(this.debris.mapData) {
               this.debris.mapData.setMap(null);
               this.debris.mapData = null;
            }

            if(this.debris.infoWindow) {
               this.debris.infoWindow.close();
               this.debris.infoWindow = null;
            }
            
         }else if(name === FETCH_DEBRIS_AREAS) {
            if(this.debrisArea.mapData) {
               this.debrisArea.mapData.setMap(null);
               this.debrisArea.mapData = null;
            }
            if(this.debrisArea.infoWindow) {
               this.debrisArea.infoWindow.close();
               this.debrisArea.infoWindow = null;
            }

         }else if(name === FETCH_RAINS) {
            for(let i = 0; i < this.rain.markers.length; i++){
               this.rain.markers[i].setMap(null);
            }
            this.rain.markers = [];

            if(this.rain.infoWindow) {
               this.rain.infoWindow.close();
               this.rain.infoWindow = null;
            }

         }
      },
      showERLocations() {
         if(this.er.markers.length) return;
         
         let map = this.map;
         let icon = this.er.icon;

         this.erLocations.forEach(data => {
            let latLng = new google.maps.LatLng(data.properties.y, data.properties.x);
            let marker = new google.maps.Marker({
               position: latLng,
               title: data.properties.ERNAME,
               icon
            });

            marker.addListener('click', (e) => {
               this.er.model = {
                  name: data.properties.ERName,
                  county: data.properties.County,
                  town: data.properties.Town,
                  vill: data.properties.Vill,
                  address: data.properties.Addr
               };

               
               
               if(this.er.infoWindow != undefined) this.er.infoWindow.close();

               setTimeout(() => {
                  let content = document.getElementById(this.er.id).innerHTML;
                  this.er.infoWindow = new google.maps.InfoWindow({
                     content,
                     position: latLng
                  });
                  this.er.infoWindow.open(map, marker);
               }, 250);
               
            });

            marker.setMap(map);
            this.er.markers.push(marker);
         })
      },
      showDisasters() {
         if(this.disasters.markers.length) return;
         
         let map = this.map;
         let icon = this.disasters.icon;

         this.disasterList.forEach(data => {
            let latLng = new google.maps.LatLng(parseFloat(data.wgs84_x), parseFloat(data.wgs84_y));
            let marker = new google.maps.Marker({
               position: latLng,
               title: data.Disaster,
               icon
            });

            marker.addListener('click', (e) => {
              
               this.disasters.model = {
                  name: data.Disaster,
                  road: data.DisasterRoad,
                  type: data.DisasterType
               };
               
               if(this.disasters.infoWindow != undefined) this.disasters.infoWindow.close();

               setTimeout(() => {
                  let content = document.getElementById(this.disasters.id).innerHTML;
                  this.disasters.infoWindow = new google.maps.InfoWindow({
                     content,
                     position: latLng
                  });
                  this.disasters.infoWindow.open(map, marker);
               }, 250);
               
            });

            marker.setMap(map);
            this.disasters.markers.push(marker);
         })
      },
      showRains() {
         if(this.rain.markers.length) return;

         let map = this.map;
         this.rainList.forEach(data => {
            let latLng = new google.maps.LatLng(data.LAT, data.LON);
            let marker = new google.maps.Marker({
               position: latLng,
               title: data.STNAME,
               icon: tryParseInt(data.RAIN) === 0 ? this.rain.icons[0] : this.rain.icons[1]
            });

            marker.addListener('click', (e) => {
              
               this.rain.model = {
                  name: data.STNAME,
                  county: data.COUNTY,
                  town: data.TOWN,
                  qty: data.NOW
               };
               
               if(this.rain.infoWindow != undefined) this.rain.infoWindow.close();

               setTimeout(() => {
                  let content = document.getElementById(this.rain.id).innerHTML;
                  this.rain.infoWindow = new google.maps.InfoWindow({
                     content,
                     position: latLng
                  });
                  this.rain.infoWindow.open(map, marker);
               }, 250);
               
            });

            marker.setMap(map);
            this.rain.markers.push(marker);

         });
      },
      showDebris() {
         let map = this.map;

         let data = new google.maps.Data();
         data.addGeoJson(this.debrisGeoJson);

        
         data.setStyle(feature => {
            let color = {
               fillColor: 'blue',
               fillOpacity: 0.5,
               strokeWeight: 2,
               strokeColor: 'blue',
               zIndex: 99
            };

            return color;
         });

         data.addListener('click', e => {
            
            this.debris.model = {
               id: e.feature.getProperty('Debrisno'),
               full: e.feature.getProperty('Full'),
               potential: e.feature.getProperty('Potential')
            };
           
            if(this.debris.infoWindow != undefined) this.debris.infoWindow.close();
            let latLng = e.latLng;
            setTimeout(() => {
               let content = document.getElementById(this.debris.id).innerHTML;
               this.debris.infoWindow = new google.maps.InfoWindow({
                  content,
                  position: latLng
               });
               this.debris.infoWindow.open(map);
            }, 250);
         });

         data.setMap(map);
         this.debris.mapData = data;
      },
      showDebrisAreas() {
         let map = this.map;

         let data = new google.maps.Data();
         data.addGeoJson(this.debrisAreasGeoJson);
         data.setStyle(feature => {
            let color = {
               fillColor: '#FF8888',
               fillOpacity: 0.5,
               strokeWeight: 3,
               strokeColor: '#FF0000',
            };
            return color;
         });

         data.addListener('click', e => {
            
            this.debrisArea.model = {
               id: e.feature.getProperty('Debrisno'),
               county: e.feature.getProperty('County'),
               town: e.feature.getProperty('Town'),
               vill: e.feature.getProperty('Vill'),
               potential: e.feature.getProperty('Potential')
            };
           
            if(this.debrisArea.infoWindow != undefined) this.debrisArea.infoWindow.close();
            let latLng = e.latLng;
            setTimeout(() => {
               let content = document.getElementById(this.debrisArea.id).innerHTML;
               this.debrisArea.infoWindow = new google.maps.InfoWindow({
                  content,
                  position: latLng
               });
               this.debrisArea.infoWindow.open(map);
            }, 250);
         });

         data.setMap(map);
         this.debrisArea.mapData = data;
      }
   }
}
</script>

<style>

</style>