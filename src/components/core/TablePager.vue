<template>
   <v-row v-if="model">
      <v-col v-if="canPage" cols="12">
         <div v-if="responsive" class="text-xs-center pt-2">
            <v-select class="d-inline-flex" style="width:100px"
               label="Rows per page"
               :items="[10,25,50]" v-model="size" 
               @change="onPageSizeChanged"
            />
            
            <span class="ml-3 mr-3">
               {{ first }}-{{ last }} of {{model.totalItems}}
            </span>

            <v-btn @click.prevent="prev" flat icon color="indigo" :disabled="!model.hasPreviousPage">
               <v-icon style="color: #999;">mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn @click.prevent="next" flat icon :disabled="!model.hasNextPage" color="indigo">
               <v-icon style="color: #999;">mdi-chevron-right</v-icon>
            </v-btn>
         </div>
         <div v-else class="text-xs-center pt-2">
            <v-select class="d-inline-flex" style="width:100px"
               label="Rows per page"
               :items="[10,25,50]" v-model="size" 
               @change="onPageSizeChanged"
            />
            
            <span class="ml-3 mr-3">
               {{ first }}-{{ last }} of {{model.totalItems}}
            </span>
               
            <v-pagination
               v-model="page"
               :length="model.totalPages"
               :total-visible="7"
               @previous="onPageChanged" @next="onPageChanged"
            />
         </div>
      </v-col>
      <v-col v-else cols="12">
         <span class="ml-3 mr-3">
            {{ first }}-{{ last }} of {{model.totalItems}}
         </span>
      </v-col>
   </v-row>	
</template>

<script>
export default {
   name: 'TablePager',
   props: {
      model: {
         type: Object,
         default: null
      },
      canPage: {
         type: Boolean,
         default: true
      },
      responsive: {
         type: Boolean,
         default: false
      }
   },
   data () {
		return {
         page: 1,
         size: 10,
      }
   },
   watch: {
      model:{
         handler(){
            this.init();
         },
         deep: true
      },
      page(){
         this.onPageChanged();
      }
   },
   beforeMount(){
      this.init();
   },
   computed:{
		first(){
         if(!this.model) return 0;
         if(!this.model.totalItems) return 0;
			return this.model.pageSize * (this.model.pageNumber-1) + 1;			
		},
		last(){
         if(!this.model) return 0;
         if(!this.model.totalItems) return 0;
			return this.first + this.model.viewList.length - 1;
		}
	},   
   methods:{
      init(){
         this.page = this.model.pageNumber;
         this.size = this.model.pageSize;
      },
		next(){
         this.page ++;
      },
      prev(){
         this.page --;
      },
      onPageChanged(){
         this.$emit('pageChanged', this.page);
		},      
		onPageSizeChanged(){
			this.$emit('sizeChanged', this.size);
		}
	}
}
</script>

<style scoped>
.pager{
   color: #999;
}
</style>


