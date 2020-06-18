<template>
   <v-app-bar app :color="theme.color" :dark="theme.dark">
      <v-app-bar-nav-icon @click.prevent="toggleDrawer" />
      <v-toolbar-title style="padding-left:1px" class="site-title">{{ title }}</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <menu-actions v-if="appActions.length" 
      :actions = "appActions"
      />
      
   </v-app-bar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ACTION_SELECTED } from '@/store/actions.type';
import { TOGGLE_DRAWER } from '@/store/mutations.type';
import { SITE_TITLE, THEME } from '@/config';
export default {
   name: 'TheHeader',
   data() {
      return {
         title: SITE_TITLE,
         theme: THEME
      }
   },
   computed:{
		...mapGetters(['appActions', 'userMenus'])
   },
   methods:{
      toggleDrawer(){
         this.$store.commit(TOGGLE_DRAWER);
      }
   }
};
</script>

<style scoped>
.site-title {
   font-size : 1.5rem!important;
}
</style>