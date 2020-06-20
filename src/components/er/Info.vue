<template>
   <v-card v-if="model" style="width:320px">
      <v-card-title>
         {{ model.name }}
      </v-card-title>
      <v-card-text>
         <p>
            {{ model.address }}
         </p>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'ERInfo',
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