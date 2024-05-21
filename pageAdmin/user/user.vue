<template>
	<view>
		<view class="bg-white p-all-10">
			<view class="row-start-center p-all-6 border-radius-10" style="background-color: #f5f5f5;">
				<input type="text" class="flex-grow p-lr-5" v-model="keyWord" placeholder="输入昵称搜索" />
				<view @click="searchVoid" class="commit_bt" style="width: 80rpx;height: 48rpx;"><text class="font-24" style="font-size: 26rpx;">搜索</text></view>
			</view>
		</view>
		<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-33" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>

		<view class="grid-one">
			<view class="row-start-center bg-white p-all-10" v-for="(item, index) in dataArr" :key="item._id">
				<image :src="item.avatar" style="width: 88rpx;height: 88rpx;border-radius: 44rpx;"></image>
				<view class="column-between-start align-self-stretch m-lr-5 flex-grow">
					<text class="font-bold font-32">{{ item.nickname }}</text>
					<text class="font-26 color-999">{{ item.mobile }}</text>
				</view>
				<button class="flex-shrink" v-if="!item.role.includes('communityAdmin')" @click="roleSetVoid(item)">权限设置</button>
				<text class="themecolor" v-else>社区管理员</text>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore } from '@/store';
const adminApi = uniCloud.importObject('admin');
const tabarList = [{ text: '用户', value: 'user' }, { text: '物业', value: 'wuye' }, { text: '管理员', value: 'communityAdmin' }];
const topIndex = ref(0);
const userStore = useUserStore();
const systemStore = useSystemStore();
const userInfo = computed(() => userStore.userInfo);
const curState = computed(e => tabarList[topIndex.value]['value']);
const dataArr = ref([]);
onLoad(e => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 200);
});
function roleSetVoid(e) {
	systemStore.pageDic = e;
	uni.navigateTo({
		url: '/pageAdmin/user/setUser'
	});
}
function searchVoid() {
	uni.startPullDownRefresh({});

}
const keyWord = ref('');
onPullDownRefresh(() => {
	let dic = {};
	if (topIndex.value == 0) {
		dic = { pageIndex: 0, role: curState.value, keyWord: keyWord.value };
	} else {
		dic = { pageIndex: 0, role: curState.value, keyWord: keyWord.value };
	}
	adminApi.queryUser(dic).then(res => {
		dataArr.value = res.data;
		// console.log(res.data)
		uni.stopPullDownRefresh();
	});
});
onReachBottom(() => {
	let dic = {};
	if (topIndex.value == 0) {
		dic = { pageIndex: dataArr.value.length, role: curState.value, keyWord: keyWord.value };
	} else {
		dic = { pageIndex: dataArr.value.length, role: curState.value, keyWord: keyWord.value };
	}
	adminApi.queryUser(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
	});
});
function changeTabIndex(e) {
	topIndex.value = e.index;
	uni.startPullDownRefresh({});
}
</script>

<style>
.label {
	width: 160rpx;
}
.inputclass {
	height: 78rpx;
	border: 1rpx solid #eee;
	border-radius: 10rpx;
	padding: 0rpx 20rpx;
	flex-grow: 1;
}
</style>
