<template>
	<uni-popup ref="pswedpop"  >
		
		<view v-if="showPayDic.havePswe" class=" bg-white  border-radius-15   column-center-center" style="overflow: hidden;padding: 64rpx 0rpx 0rpx 0rpx;width: 640rpx;">
			<view class="column-center-center align-self-stretch" style="padding:  0rpx 48rpx;">
				<text class="font-30 m-b-15 " style="color: #333;font-weight: 500;">请输入支付密码</text>
				<input v-model="pswedInput" class="p-lr-15 w-100" type="text" placeholder="请输入支付密码" style="height:96rpx;background: #FAFAFA;" />
			</view>
			<view class="" style="height: 64rpx;"></view>

			<view class="grid-two bg-red grid-gap-1  align-self-stretch " style="background: rgba(0, 0, 0, 0.1);border-top: 1rpx solid rgba(155, 155,155, 0.1);">
				<text @click="cancleVoid()" class="flex-grow text-center bg-white p-tb-15 font-bold font-34">取消</text>

				<text @click="sureVoid()" class="flex-grow text-center themecolor bg-white font-bold p-tb-15 font-34">确定</text>
			</view>
		</view>

		<view v-if="!showPayDic.havePswe" class="bg-red    column-center-center" style="width: 640rpx;;padding: 48rpx 30rpx 38rpx 30rpx;border-radius: 0rpx;background-color: #FFFFFF;">
			<text class="font-30" style="color: #333;font-weight: 500;">暂未设置支付密码</text>
			<text class="font-30" style="color: #fff;font-weight: 500;"></text>
			<view class="row-between-center align-self-stretch" style="margin-top: 56rpx;">
				<text v-if="showcancle" class="twobt-cancle" @click="cancleVoid()">取消</text>
				<text class="twobt-sure bg-theme" @click="navToSet()">去设置</text>
			</view>
		</view>
	</uni-popup>
</template>

<script>
export default {
	data() {
		return {
			showPayDic: {
				show: false,
				havePswe: true,
				success: () => {}
			},
			pswedInput: ''
		};
	},

	methods: {
		show: function(e) {
			if(e.show)
			{
				this.$refs.pswedpop.open()
			}else{
				this.$refs.pswedpop.close()
				
			}
			Object.assign(this.showPayDic, e);
		},
		// 取消
		cancleVoid: function() {
			this.showPayDic.show = false;
			this.$refs.pswedpop.close()
			
		},
		sureVoid: function(e) {
			if (this.pswedInput.length < 6) {
				this.$api.msg('请输入正确的密码');
				return;
			}
			this.$refs.pswedpop.close()
			
			this.showPayDic.success(this.pswedInput);
		},
		// 区设置
		navToSet: function() {
			// uni.navigateTo({
			// 	url:""
			// })
		}
	}
};
</script>

<style>
.twobt-cancle {
	flex-grow: 1;
	height: 80rpx;
	text-align: center;
	color: #666;
	line-height: 80rpx;
	background-color: #eee;
	border-radius: 0rpx;
	margin-right: 10rpx;
}

.twobt-sure {
	flex-grow: 1;
	margin-left: 10rpx;

	height: 80rpx;
	text-align: center;
	color: #fff;
	line-height: 80rpx;
	border-radius: 0rpx;
}
</style>
