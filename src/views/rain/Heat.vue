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
import { uuid, getRandomInt } from '@/utils';
import { MAP_TYPES } from '@/consts';
import { FETCH_CWB } from '@/store/actions.type';

export default {
   data() {
      return {
         map: null,
         settings: {
            id: `map_${uuid()}`,
            libraries: ['visualization'],
            center: [23.717118, 120.9967659],
            type: MAP_TYPES.HYBRID,
            zoom: 8
         },
         content: '',
         
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
         this.fetchData();
      },
      fetchData() {
         let category = 'O-A0002-001';
         let params = {
            format: 'JSON',
            elementName: 'HOUR_12'
         };

         this.$store.dispatch(FETCH_CWB, { category, params })
         .then(data => {
            let features = data.cwbopendata.location;
            this.loadHeatmapData(features);
         })
         .catch(err => {
            console.error(err);
         });
      },
      loadHeatmapData(features) {
         let heatmapData = [];
         features.forEach(item => {
            let rainData = {
               location: new google.maps.LatLng(item.lat, item.lon),
               weight: this.getWeight(item)
            };
            heatmapData.push(rainData);
         });

         this.randerHeatmap(heatmapData);
      },
      getWeight(item) {
         // 1：60分鐘。 2：10分鐘。 3：3小時。 4：6小時。 5：12小時。 6：24小時。 7：今天。 8：2天內。 9：3天內。
         //let w = Number(item.weatherElement[6].elementValue.value.split('.')[0]);
         let w = getRandomInt(500);
         console.log(w);
         // 遇到 -998、-999 時，回傳 0
         if(w === -998 || w === -999) return 0;
         else return w ;
      },
      randerHeatmap(data) {
         // 生成 heat map
         let heatmap = new google.maps.visualization.HeatmapLayer({
            data: data,
            dissipating: true,
            // 客製顏色
            gradient:  [
               'rgba(255, 255, 255, 0)',
               '#B3E5FC',
               '#81D4FA',
               '#4FC3F7',
               '#29B6F6',
               '#03A9F4',
               '#039BE5',
               '#0288D1',
               '#0277BD',
               '#01579B'
            ],
            // 半徑
            radius: 20
         });

         heatmap.setMap(this.map);
      }
   }
}
</script>

<style>

</style>