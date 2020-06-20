<template>
   <v-card v-if="model" style="width:320px">
      <v-card-title>
         <span v-text="model.id"></span>
         <span class="ml-1" v-text="model.full"></span>
      </v-card-title>
      <v-card-text>
         <p>
           Potential：<span v-text="model.potential"></span>
         </p>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'DebrisInfo',
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