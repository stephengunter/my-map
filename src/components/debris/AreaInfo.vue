<template>
   <v-card v-if="model" style="width:320px">
      <v-card-title>
         <span v-text="model.id"></span>
         <span v-if="address" class="ml-1" v-text="address"></span>
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
   name: 'DebrisAreaInfo',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   computed: {
      address() {
         if(this.model) {
            let text = `${this.model.county}${this.model.town}`;
            if(this.model.vill) text += this.model.vill;
            return text;
         }else return '';
      }
   }

}
</script>

<style>

</style>