<template>
	<v-content>
		<div class="main-container">
			<router-view />
		</div>
		<layout-footer />
		
	</v-content>
</template>

<script>
export default {
	name: 'TheContainer'
}
</script>

<style>
.main-container {
   padding-bottom: 100px;
}
</style>
