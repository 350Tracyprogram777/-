<template>
	<view class="">
		<uni-popup ref="pushPop" class="superview" style="">
			<view class="bg-white align-self-stretch column-center-center" style="border-radius:40rpx;margin: 30rpx;padding:40rpx 30rpx 31rpx 30rpx;">
				<text class="align-self-stretch text-center" style="font-size: 30rpx;color: #222;font-weight:600;">发布说明</text>
				<view class="grid-one align-self-stretch overflow_scroll" style="height: 530rpx;margin-top:32rpx;">
					<!-- <text>隐私政策</text> -->
					<text class="">&emsp;如您需要发布信息,请仔细阅读本规则</text>
					<text class="font-bold color-333">关于广告</text>
					<text>您可以发布广告,但是请选择对应的类目</text>
					<text>您可以添加联系方式,但是请不要在内容中添加任何联系方式</text>
					<text>您可以发布广告,但是请不要刷屏</text>
					<text>您可以发布广告,但是请勿虚假宣传</text>
					<text class="font-bold color-333">通讯录</text>
					<text>添加通讯录请选择对应的类目</text>
					<text>请勿添加非公开的他人的联系方式</text>
				</view>
				<view class="row-between-center align-self-stretch" style="margin-top: 32rpx;"><text @click="tyclick(true)" class="twobt-sure bg-theme">确定</text></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		tyclick: function(e) {
			this.$refs.pushPop.close();
		},
		//展示协议
		show: function() {
			this.$refs.pushPop.open();
		}
	}
};
</script>

<style>
.superview {
	position: fixed;
	top: 0px;
	right: 0px;
	left: 0rpx;
	bottom: 0rpx;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
}

.twobt-cancle {
	flex-grow: 1;
	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	color: rgba(255, 255, 255, 1);
	line-height: 80rpx;
	background-color: #aaa;
	border-radius: 8rpx;
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
	border-radius: 8rpx;
}
</style>
