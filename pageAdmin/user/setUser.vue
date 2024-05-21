<template>
	<view>
		<view class="row-start-center bg-white p-all-10">
			<image :src="userInfo.avatar" style="width: 88rpx;height: 88rpx;border-radius: 44rpx;"></image>
			<view class="column-between-start align-self-stretch m-lr-5 flex-grow">
				<text class="font-bold font-32">{{ userInfo.nickname }}</text>
				<text class="font-26 color-999">{{ userInfo.mobile }}</text>
			</view>
		</view>
		<view class="grid-one  w-100 p-all-10">
			<text class="label">身份设置</text>
			<ss-superSelectView maxNum="10" class="flex-grow" v-model:selectArr="userInfo.role" :localdata="contantStore.userRole"></ss-superSelectView>
		</view>

		<view class="grid-one  w-100 p-all-10">
			<text class="label">禁止发布</text>
			<ss-superSelectView maxNum="10" class="flex-grow" v-model:selectArr="userInfo.stop_permissions" :localdata="contantStore.stopCanArr"></ss-superSelectView>
		</view>

		<view class="fixed-bottom p-all-12">
			<view class="commit_bt" @click="commitVoid"><text>确定</text></view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore, useContantStore } from '@/store';
const adminApi = uniCloud.importObject('admin');
const systemStore = useSystemStore();
const contantStore = useContantStore();
const userInfo = computed(() => systemStore.pageDic);
onLoad((e=>{
	console.log('-------------',userInfo.value)
}))
function commitVoid() {
	let dic = {
		_id: userInfo.value._id,
		stop_permissions: userInfo.value.stop_permissions,
		role: userInfo.value.role
	};
	adminApi.editUserStop(dic).then(res => {
		msg('设置成功')
		setTimeout(function(){
			uni.startPullDownRefresh({
				
			})
		},200)
	});
}
</script>

<style>
page {
	background-color: #fff;
}
.label {
	width: 160rpx;
	color: #666;
}
</style>
