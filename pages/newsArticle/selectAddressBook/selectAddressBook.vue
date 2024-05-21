<template>
	<view>
		<view class="bg-white p-all-10" style="position: sticky;top: 0rpx;left: 0rpx;right: 0rpx;">
			<view class="row-start-center p-lr-10" style="background-color: #f5f5f5;border-radius: 20rpx;">
				<uni-icons type="search" size="18" color="#999"></uni-icons>
				<input v-model="keyWord" class="flex-grow m-lr-5" type="text" placeholder="请输入名称或者手机号" style="height: 78rpx;" />
				<uni-icons type="clear" size="15" color="#999"></uni-icons>
				<text class="themecolor m-l-10 font-bold" @click="loadData">搜索</text>
			</view>
		</view>

		<view class="grid-one p-all-10">
			<addressBook v-model:selectItem="selectPhone" :select="true" class="" v-for="(item, index) in dataArr" :key="index" :dataDic="item"></addressBook>
		</view>
		<bottomMore :dataList="dataArr"></bottomMore>
		<view class="" style="height: 160rpx;"></view>
		<view v-if="selectPhone._id == 0" class="fixed-bottom p-all-15" @click="navToAdd">
			<view class="commit_bt"><text>新增联系方式</text></view>
		</view>
		<view v-else class="fixed-bottom p-all-15" @click="sureVoid">
			<view class="commit_bt"><text>确定</text></view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore } from '@/store';

const addressBookApi = uniCloud.importObject('address-book');
onLoad(() => {});
const dataArr = ref([]);
const keyWord = ref('');
const selectPhone = ref({ _id: 0 });
const userStore = useUserStore();
const systemStore = useSystemStore();

onLoad(() => {
	loadData();
});

onPullDownRefresh(() => {
	loadData();
});
function loadData() {
	const dic = {
		pageIndex: 0,
		keyWord: keyWord.value,
		mySelf:true
		
	};
	addressBookApi.query(dic).then(res => {
		dataArr.value = res.data;
		uni.stopPullDownRefresh({});
	});
}
onReachBottom(() => {
	const dic = {
		pageIndex: dataArr.value.length,
		keyWord: keyWord.value
	};
	addressBookApi.query(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
	});
});

function search(e) {
	console.log(e);
}
const navToAdd = () => {
	
	uni.navigateTo({
		url: '/pages/addressBook/add'
	});
};
// 确定选择
function sureVoid() {
	if (selectPhone.value._id != 0) {
		systemStore.pageDic = selectPhone.value;
		uni.navigateBack();
	}
}
</script>

<style></style>
