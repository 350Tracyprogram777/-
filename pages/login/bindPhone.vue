<template>
	<view>
		<view class="grid-one grid-gap-0" style="justify-items: center;">
			<image src="/static/logo.png" style="width: 200rpx;height: 200rpx;border-radius: 10rpx;margin-top: 140rpx;"></image>
			<text class=" m-b-10 font-26 color-666" style="margin-top: 100rpx;">家在社区需要您的授权使用您的手机号</text>
			<button @getphonenumber="getPhone" open-type="getPhoneNumber" class="bg-theme text-white w-90 " style="border-radius: 50rpx;">获取手机号</button>

			<!-- <view class="commit_bt align-self-stretch">
				<text>立即授权</text>
			</view> -->
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const loginBackPage = computed(() => userStore.loginBackPage);
const wxApi = uniCloud.importObject('wxapi');
const userApi = uniCloud.importObject('user-info');
onLoad(() => {
	uniCloud.onRefreshToken(function(event) {
		// event格式见下方说明
		console.log('token 刷新了-=-=--==-');
	});
});

function getPhone(e) {
	if (e.detail.errMsg == 'getPhoneNumber:ok') {
		wxApi.getWxPhone(e.detail.code).then(res => {
			console.log(res);
			if (res.errCode == 0) {
				userApi.bindPhone(res.data).then(res => {
					if (res.errCode == 0) {
						uni.setStorageSync('uni_id_token', res.data.token);
						uni.setStorageSync('uni_id_token_expired', res.data.tokenExpired);
					}
					userStore.getUserInfo.then(sures => {
						if (loginBackPage.value) {
							uni.redirectTo({
								url: loginBackPage.value
							});
							userStore.loginBackPage = '';
							msg('绑定成功');
						} else {
							uni.navigateBack();
						}
					});
				});
			} else {
				msg('请重试');
			}
		});
	}
	// console.log(e)
}
</script>

<style>
page {
	background-color: #fff;
	padding: 30rpx 60rpx;
}
</style>
