<template>
   <v-card v-if="model" style="width:320px">
      <v-card-title>
         <span v-text="model.name"></span>
         <span class="ml-1" v-show="city" v-text="city"></span>
      </v-card-title>
      <v-card-text>
         <p>
           當日累積雨量：<span v-text="model.qty"></span>
         </p>
         <p v-if="date">
           資料日期：<span v-text="date"></span>
         </p>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'RainInfo',
   props: {
      model: {
         type: Object,
         default: null
      },
      date: {
         type: String,
         default: ''
      }
   },
   computed: {
      city() {
         if(this.model) {
            return `(${this.model.county}${this.model.town})`;
         }else return '';
      }
   }
   

}
</script>

<style>

</style>