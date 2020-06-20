<template>
   <v-card style="width:320px">
      <v-card-title>
         {{ `${county}${town}` }}
      </v-card-title>
      <v-card-text>
         <v-alert border="right" colored-border type="error" elevation="2">
            <v-badge v-if="redAlert" color="red" :content="redAlert">
               紅色警戒
            </v-badge>
            <span v-else>紅色警戒 (無)</span>
         </v-alert>
         <v-alert border="right" colored-border type="warning" elevation="2">
            <v-badge v-if="yellowAlert" color="warning" :content="yellowAlert">
               黃色警戒
            </v-badge>
            <span v-else>黃色警戒 (無)</span>
         </v-alert>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'AlertInfo',
   computed: {
      ...mapState({
         county: state => state.swcb.county,
         town: state => state.swcb.town,
         redAlert: state => state.swcb.redAlert,
         yellowAlert: state => state.swcb.yellowAlert
		})
   },
   methods: {
      fetchAlerts() {
         console.log('sss');
      }
   }

}
</script>

<style>

</style>