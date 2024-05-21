<template>
	<uni-popup ref="alertPop"  :maskClick="false" class=" column-center-center" style="z-index: 900;">
		<view class="bg-white   column-center-center" style="padding: 48rpx 30rpx 38rpx 30rpx;border-radius: 40rpx;width: 600rpx;">
			<text class="font-32" style="color: #000;font-weight: bold;">{{ showAlertInfo.title }}</text>
			<text @click="contentFuc"  class=" m-t-10" style="color: #444;" :style="showAlertInfo.contentStyle">{{ showAlertInfo.content }}</text>
			<view class="row-between-center align-self-stretch" style="margin-top: 56rpx;">
				<text v-if="showAlertInfo.showCancel" class="twobt-cancle" @click="twoClick(false)">{{ showAlertInfo.cancelText }}</text>
				<text class="twobt-sure bg-theme" @click="twoClick(true)">{{ showAlertInfo.confirmText }}</text>
			</view>
		</view>
	</uni-popup>
</template>

<script>
export default {
	data() {
		return {
			showAlertInfo: {
				show: false,
				title: '',
				contentVoid:e=>{},
				contentStyle:{color:'#444'},
				content: '',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: e => {}
			}
		};
	},
	methods: {
		showModalDic: function(e) {
			// console.log(e)
			if(e.show){
				this.$refs.alertPop.open()
			}else{
				this.$refs.alertPop.close()
				
			}
			Object.assign(this.showAlertInfo, e);
		},
		contentFuc: function(e) {
			this.$refs.alertPop.close()
			
			this.showAlertInfo.contentVoid();
		},
		
		twoClick: function(e) {
			this.$refs.alertPop.close()
			
			this.showAlertInfo.success({ confirm: e });
		}
	}
};
</script>

<style>
.twobt-cancle {
	flex-grow: 1;
	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	color: #fff;
	line-height: 80rpx;
	background: #bbbbbb;
	border-radius: 40rpx;
	margin-right: 10rpx;
}

.twobt-sure {
	flex-grow: 1;
	margin-left: 10rpx;
	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	color: #fff;
	line-height: 80rpx;
	/* 		background: #04A75D;
 */
	border-radius: 40rpx;
}
</style>
