<template>
   <v-card v-if="model" style="width:320px">
      <v-card-title>
         {{ model.name }}
      </v-card-title>
      <v-card-text>
         <p>
            <ul>
               <li v-if="model.type" v-text="model.type">
               </li>
               <li v-if="model.road" v-text="model.road">
               </li>
            </ul>
         </p>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'DisasterInfo',
   props: {
      model: {
         type: Object,
         default: null
      }
   }
   

}
</script>

<style>

</style>