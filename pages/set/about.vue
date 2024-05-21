<template>
	<view>
		<view class="" style="height: 100rpx;"></view>
		<view class="column-center-center">
			<image src="/static/logo.png" style="width: 80px;height: 80px;border-radius: 50%;"></image>
			<text class="font-30  m-t-15 color-999">家在龙兴嘉苑2号院</text>
			<view class="column-center-center " style="margin-top: 50rpx;">
				<!-- <image @click="prewImg" src="/static/public/gzh.jpg" style="width: 300rpx;height: 300rpx;"></image> -->
				<!-- <text class="color-666">招募社区管理员,共建美好社区 </text> -->
			</view>
			<!-- <image src="/static/public/gzh2.png" mode="widthFix" style="width: 690rpx;height: 300rpx;"></image> -->
		</view>
		<view class="fixed-bottom p-all-15 ">
			<view class="column-center-center">
				<view class="p_r m-b-10">
					<button class="p_a p_a_all nbt" open-type="contact" bindcontact="handleContact"></button>
					<text class="themecolor">联系客服</text>
				</view>
				<text class="font-26 color-666">©2023 招募社区管理员,共建美好社区</text>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		methods: {
			prewImg: function() {
				uni.previewImage({
					current: 0,
					urls: ['/static/public/gzh.jpg']
				});
			}
		}
	};

</script>
<style></style>
