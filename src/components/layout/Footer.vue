<template>
	<v-footer :color="theme.color" :dark="theme.dark" app>
		<div style="font-size:14px">
			<span class="white--text">&copy; 2020</span>
			<span class="white--text ml-1">{{ title }}</span>
		</div>
		<div class="ml-3">
			
		</div>
		
		
	</v-footer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SITE_TITLE, THEME } from '@/config';
export default {
	name: 'TheFooter',
	data() {
		return {
			title: SITE_TITLE,
			theme: THEME
		}
	},
	computed:{
		...mapGetters(['footerMenus'])
	},
	methods:{
      showMenu(key) {
         return this.footerMenus.findIndex(item => item.name === key) > -1;
		},
		linkTo(path) {
			let currentRoute = this.$router.currentRoute;
			if(currentRoute && currentRoute.path === path) {
				//do nothing
			} else this.$router.push({ path });  
		}
	}
}
</script>
