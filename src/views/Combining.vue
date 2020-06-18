<template>
<v-container>
   <v-row v-if="responsive">
      <v-col cols="12">
         <v-select :items="category.items" v-model="category.id"
         @change="onCategoryChanged"
         />
      </v-col>
      <v-col cols="12">
         <div id="legend">
            <div id="census-min">{{ censusMin === Number.MAX_VALUE ? '' : censusMin.toLocaleString() }}</div>
            <div class="color-key"><span id="data-caret">&#x25c6;</span></div>
            <div id="census-max">{{ censusMax === -Number.MAX_VALUE ? '' : censusMax.toLocaleString() }}</div>
         </div>
      </v-col>
      <v-col cols="12">
         <div id="data-box" class="nicebox">
            <label id="data-label" for="data-value">{{ data.text }}</label>
            <span id="data-value">{{ data.value }}</span>
         </div>
      </v-col>
   </v-row>
   <v-row v-else>
      <v-col cols="6">
         <v-select :items="category.items" v-model="category.id"
         @change="onCategoryChanged"
         />
      </v-col>
      <v-col cols="6">
         <div id="data-box" class="nicebox">
            <label id="data-label" for="data-value">{{ data.text }}</label>
            <span id="data-value">{{ data.value }}</span>
         </div>
      </v-col>
      <v-col cols="12">
         <div id="legend">
            <div id="census-min">{{ censusMin === Number.MAX_VALUE ? '' : censusMin.toLocaleString() }}</div>
            <div class="color-key"><span id="data-caret">&#x25c6;</span></div>
            <div id="census-max">{{ censusMax === -Number.MAX_VALUE ? '' : censusMax.toLocaleString() }}</div>
         </div>
      </v-col>
   </v-row>
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
</v-container>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import $Scriptjs from 'scriptjs';
import { SITE_URL } from '@/config';
import { uuid, buildQuery } from '@/utils';
import { MAP_TYPES } from '@/consts';

export default {
   data() {
      return {
         map: {
            entity: null,
            id: `map_${uuid()}`,
            center: [40, -100],
            type: '',
            zoom: 4,
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

         censusMin: Number.MAX_VALUE,
         censusMax: -Number.MAX_VALUE,

         data: {
            text: '',
            value: ''
         },

         category: {
            id: '',
            items: [{
               value: 'DP02_0066PE', text: 'Percent of population over 25 that completed high school'
            },{
               value: 'DP05_0017E', text: 'Median age'
            },{
               value: 'DP05_0001E', text: 'Total population'
            },{
               value: 'DP02_0016E', text: 'Average family size'
            },{
               value: 'DP03_0088E', text: 'Per-capita income'
            }],

         },
         
         references: {}
      }
   },
   beforeMount() {
      this.category.id = this.category.items[0].value;
   },
   mounted() {
		this.references = { ...this.$refs };
   },
   computed: {
      ...mapGetters(['responsive']),
		gMap() {
			if(this.$refs.gMap) return this.$refs.gMap;
			else if (this.references.gMap) return this.references.gMap;
			return null;
      }      
   },
   methods: {
      onCategoryChanged() {
         this.clearCensusData();
         this.loadCensusData();
      },
      onMapInitialized(entity) {
         this.map.entity = entity;

         this.map.entity.data.setStyle(this.styleFeature);
         this.map.entity.data.addListener('mouseover', this.mouseInToRegion);
         this.map.entity.data.addListener('mouseout', this.mouseOutOfRegion);

         // state polygons only need to be loaded once, do them now
         this.loadMapShapes();
      },
      /** Loads the state boundary polygons from a GeoJSON source. */
      loadMapShapes() {
        // load US state outline polygons from a GeoJson file
         let sourceUrl = 'https://storage.googleapis.com/mapsdevsite/json/states.js';
         this.map.entity.data.loadGeoJson(sourceUrl, { idPropertyName: 'STATE' });

         // wait for the request to complete by listening for the first feature to be added
         google.maps.event.addListenerOnce(this.map.entity.data, 'addfeature', () => {
            this.onCategoryChanged();              
         });
      },
      loadCensusData() {
         let id = this.category.id;
         let xhr = new XMLHttpRequest();
         xhr.open('GET', `${SITE_URL}/data/${id}.json`);
         xhr.onload = () => {
            let censusData = JSON.parse(xhr.responseText);
            censusData.shift(); // the first row contains column names
            censusData.forEach(row => {
               let censusVariable = parseFloat(row[0]);
               let stateId = row[1];
               // keep track of min and max values
               if(censusVariable < this.censusMin) {
                  this.censusMin = censusVariable;
               }
               if(censusVariable > this.censusMax) {
                  this.censusMax = censusVariable;
               }
               // update the existing row with the new data
              
               let feature = this.map.entity.data.getFeatureById(stateId);
               feature.setProperty('census_variable', censusVariable);
                  
            });

            // update and display the legend
            //document.getElementById('census-min').textContent = censusMin.toLocaleString();
            
            //document.getElementById('census-max').textContent = censusMax.toLocaleString();
              
         };
         xhr.send();
      },
      styleFeature(feature) {
         let low = [5, 69, 54];  // color of smallest datum
         let high = [151, 83, 34];   // color of largest datum

         // delta represents where the value sits between the min and max
         let delta = (feature.getProperty('census_variable') - this.censusMin) / (this.censusMax - this.censusMin);

         let color = [];
         for (let i = 0; i < 3; i++) {
            // calculate an integer color based on the delta
            color[i] = (high[i] - low[i]) * delta + low[i];
         }

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
            strokeWeight: outlineWeight,
            strokeColor: '#fff',
            zIndex: zIndex,
            fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
            fillOpacity: 0.75,
            visible: showRow
         };
      },
      mouseInToRegion(e) {
         // set the hover state so the setStyle function can change the border
         e.feature.setProperty('state', 'hover');

         let percent = (e.feature.getProperty('census_variable') - this.censusMin) / (this.censusMax - this.censusMin) * 100;
         
         // update the label
         this.data.text = e.feature.getProperty('NAME');
         this.data.value = e.feature.getProperty('census_variable').toLocaleString();

         document.getElementById('data-box').style.display = 'block';
         document.getElementById('data-caret').style.display = 'block';
         document.getElementById('data-caret').style.paddingLeft = percent + '%';
      },
      mouseOutOfRegion(e) {
         // reset the hover state, returning the border to normal
         e.feature.setProperty('state', 'normal');
      },
      clearCensusData() {
         /** Removes census data from each shape on the map and resets the UI. */
         this.censusMin = Number.MAX_VALUE;
         this.censusMax = -Number.MAX_VALUE;
         this.map.entity.data.forEach(row => {
            row.setProperty('census_variable', undefined);
         });
         document.getElementById('data-box').style.display = 'none';
         document.getElementById('data-caret').style.display = 'none';
      }
   }
}
</script>

<style scoped>
/*.nicebox {
    position: absolute;
   text-align: center;
   font-family: "Roboto", "Arial", sans-serif;
   font-size: 13px;
   z-index: 5;
   box-shadow: 0 4px 6px -4px #333;
   padding: 5px 10px;
   background: rgb(255,255,255);
   background: linear-gradient(to bottom,rgba(255,255,255,1) 0%,rgba(245,245,245,1) 100%);
   border: rgb(229, 229, 229) 1px solid;
} */
#data-box {
   top: 10px;
   left: 500px;
   height: 45px;
   line-height: 45px;
   display: none;
}
#legend { display: flex; display: -webkit-box; padding-top: 7px }
.color-key {
   background: linear-gradient(to right,
   hsl(5, 69%, 54%) 0%,
   hsl(29, 71%, 51%) 17%,
   hsl(54, 74%, 47%) 33%,
   hsl(78, 76%, 44%) 50%,
   hsl(102, 78%, 41%) 67%,
   hsl(127, 81%, 37%) 83%,
   hsl(151, 83%, 34%) 100%);
   flex: 1;
   -webkit-box-flex: 1;
   margin: 0 5px;
   text-align: left;
   font-size: 1.0em;
   line-height: 1.0em;
}
#data-value { font-size: 2.0em; font-weight: bold }
#data-label { font-size: 2.0em; font-weight: normal; padding-right: 10px; }
#data-label:after { content: ':' }
#data-caret { margin-left: -5px; display: none; font-size: 14px; width: 14px}
</style>