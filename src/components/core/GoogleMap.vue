<template>
   <div :id="id" style="width:100%; height:100%">

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
      language: {
         type: String,
         default: ''
      },
      libraries: {
         type: Array,
         default: null
      },
      options: {
         type: Object,
         default: null
      },
      import_marker_cluster: {
         type: Boolean,
         default: false
      }
   },
   data() {
      return {
         map: null
      }
   },
   computed: {
      
   },
   beforeMount() {
      
   },
   mounted() {
      let params = {
         key: GOOGLE_MAP.key
      };
      if(this.language) params.language = this.language;

      if(this.libraries && this.libraries.length) {
         params.libraries = this.libraries.join();   
      }

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
         this.map = new google.maps.Map(document.getElementById(this.id), this.options);
         this.$emit('initialized', this.map);
      }
   }

}
</script>

<style>
   
</style>