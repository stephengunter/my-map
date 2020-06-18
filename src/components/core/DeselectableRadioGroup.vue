<template>
   <v-item-group>
      <v-item v-for="(item, index) in options" :key="index" >
         <v-layout align-center>
            <v-icon  @click="onClick(index)" :color="selected_index === index ? 'primary' : ''" class="mr-2">
               {{ selected_index === index ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
            </v-icon>
            <a href="#" v-if="item.attachments.length" @click.prevent="showPhoto(item.attachments[0])">
               <img  style="vertical-align:middle" 
               :src="item.attachments[0].previewPath | photoNameUrl(120)"
               >
            </a>
            {{ getText(index) }} 
         </v-layout>
      </v-item>
   </v-item-group>
</template>

<script>
export default {
   name: 'CoreDeselectableRadioGroup',
   props: {
      options: {
         type: Array,
         default: null
		},
      selected_index: {
         type: Number,
         default: -1
      },
      text_field: {
         type: String,
         default: 'text'
      }
   },
   data() {
      return {
         html: '',
      }
   },
   methods: {
      getText(index) {
         let item = this.options[index];
         return  item[this.text_field];
      },
      onClick(index) {
         this.$emit('selected', index);
      },
      showPhoto(photo){
         this.$emit('show-photo', photo);
      },
   }
}
</script>