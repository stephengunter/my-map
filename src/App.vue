<template>
   <v-app id="app-container">
		
		<layout-drawer />
		<layout-header />
		<layout-container />
		
		<layout-loading />

		<v-snackbar :timeout="success.timeout" top right dark
			:color="success.color" v-model="success.show"
		>
			<v-icon color="white" class="mr-3">
			{{ success.icon }}
			</v-icon>
			<span class="successText cn">
				{{ success.msg  }}
			</span>
		</v-snackbar>

		<v-dialog v-model="confirm.active" :max-width="confirm.maxWidth" :persistent="!confirmNoAction">
			<core-confirmation :type="confirm.type"
			:title="confirm.title" :text="confirm.text"
			:ok_text="confirm.ok_text"  :cancel_text="confirm.cancel_text"
			:on_cancel="confirm.on_cancel"  :on_ok="confirm.on_ok"
			@ok="hideConfirm" @cancel="hideConfirm"
			/>
		</v-dialog>
		
	</v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_WINDOW_WIDTH, SET_RESPONSIVE, TOGGLE_DRAWER } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'App',
	data(){
		return {
			title: '',
			success: {
				color: 'info',
				show: false,
				timeout: 1500,
				msg: '存檔成功'
			},

			confirm: {
            type: false,
            title: '',
            text: '',
            active: false,
            action: '',
            maxWidth: DIALOG_MAX_WIDTH,
            ok_text: '確定',
            cancel_text: '取消',
            on_ok: null,
            on_cancel: null
			}			
			
		}
	},
	computed:{
		...mapGetters(['responsive','contentMaxWidth']),
		confirmNoAction() {
			return !this.confirm.on_ok && !this.confirm.on_cancel
		}
	},
	created(){
		Bus.$on('errors', this.onError);
		Bus.$on('success', this.onSuccess);
		Bus.$on('warning', this.onWarning);
		Bus.$on('show-confirm', this.showConfirm);
	},
	mounted(){
		if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);

      this.onResponsiveInverted();
		window.addEventListener('resize', this.onResponsiveInverted);
	},
	beforeDestroy(){
		window.removeEventListener('resize', this.onResponsiveInverted);
	},
	methods:{
		onError(error) {
			let confirm = {
				type: 'error',
				title: '伺服器暫時無回應，請稍候再試.',
				text: ''
			};
			if(error) {
				confirm.title = error.title ? error.title : '伺服器暫時無回應，請稍候再試.';
				confirm.text = error.text ? error.text : '';
				
				this.showConfirm(confirm);
			}else {
				// no error data
				this.showConfirm(confirm);
			}
		},
		onSuccess(msg) {
			this.success.icon = 'mdi-check-circle';
			this.success.color = 'success';
			this.success.msg = msg ? msg : '存檔成功';
			this.success.show = true;
		},
		onWarning(msg){
			if(msg) {
				this.success.icon = 'mdi-alert-circle';
				this.success.color = 'warning';
				this.success.msg = msg;
				this.success.show = true;
			}
		},
		showConfirm({type, title, text, ok ='確定', cancel = '取消', onOk = null, onCancel = null, maxWidth = 0 }) {
			
			this.confirm = {
            type,
            title,
				text,
				maxWidth: maxWidth ? maxWidth : DIALOG_MAX_WIDTH,
            ok_text: ok,
            cancel_text: cancel,
            active: true,
            on_ok: onOk,
            on_cancel: onCancel
			};
			
      },
      hideConfirm() {
         this.confirm = {
            type: '',
            title: '',
            text: '',
            ok_text: '確定',
            cancel_text: '取消',
            maxWidth: DIALOG_MAX_WIDTH,
            active: false,
            on_ok: null,
            on_cancel: null
         };
      },
		onResponsiveInverted () {
			if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);
			
         if(window.innerWidth < 991) {
            this.$store.commit(SET_RESPONSIVE, true);
         }else {
            this.$store.commit(SET_RESPONSIVE, false);
         }
      },
	}
};
</script>


<style lang="scss">
* :not(.v-icon) {
  font-family: "微軟正黑體",sans-serif!important;
}
html {
  scroll-behavior: smooth;
}

article {
	font-size: 16px;
	font-weight: normal;
	line-height: 1.6;
	color: rgba(0,0,0,.87);
}
article img{
	margin-top: .5em;
	display: block;
	max-width:  100%;
	height: auto;
}
.inline-emoji {
	float: left;
	margin-right: .5em;
	width: 22px;
	height: 22px;
}
.article-imgDesc {
	color: darkorange;
	margin-top: 1em;
}
.article-imgDesc > li {
	margin-bottom : 3px;
}

.errText{
	color: #fff;
}
.successText{
	font-size: 1.2rem;
	color: #fff;
}
.center-helper {
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}
.img-center {
	display: block;
	margin: auto;
}

.a-btn {
  text-decoration: none;
}

.cn {
	font-family: "微軟正黑體"
}
</style>
