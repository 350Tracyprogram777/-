<template>
	<view>
		<view class="grid-one grid-gap-0" style="justify-items: center;">
			<image src="/static/logo.png" style="width: 200rpx;height: 200rpx;border-radius: 10rpx;margin-top: 140rpx;"></image>
			<text class=" m-b-10 font-26 color-666" style="margin-top: 100rpx;">家在社区需要使用您的头像与昵称</text>
			<button open-type="getUserInfo" @click="getUserInfo" class="bg-theme text-white w-90 " style="border-radius: 50rpx;">立即授权</button>

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

const db = uniCloud.database();
const usersTable = db.collection('uni-id-users');
const back = ref(false);
onLoad(e => {
	if (e.back == 1) {
		back.value = true;
	}
	// getLogin();
});
// let code = '';
// function getLogin() {
// 	uni.login({
// 		provider: 'weixin',
// 		complete: function(loginRes) {
// 			if (loginRes.errMsg == 'login:ok') {
// 				code = loginRes.code;
// 			}
// 		}
// 	});
// }

function getUserInfo() {
	wx.getUserProfile({
		desc: '用于完善会员资料',
		success: function(wxres) {
			console.log('用户表', wxres);
			let dic = {
				avatar: wxres.userInfo.avatarUrl,
				wxnickname: wxres.userInfo.nickName
			};
			if (!userInfo.value.nickname) {
				dic = {
					nickname: wxres.userInfo.nickName,
					avatar: wxres.userInfo.avatarUrl,
					wxnickname: wxres.userInfo.nickName
				};
			}

			usersTable
				.where('_id==$env.uid')
				.update(dic)
				.then(e => {
					Object.assign(userInfo.value,dic)
					userStore.loginBackPage=''
					if (loginBackPage.value) {
						uni.redirectTo({
							url: loginBackPage.value
						});
					} else {
						uni.navigateBack();
					}
				});
		},
		fail: function(err) {
			console.log(err);
			// getLogin();
		}
	});
}
</script>

<style>
page {
	background-color: #fff;
	padding: 30rpx 60rpx;
}
</style>
