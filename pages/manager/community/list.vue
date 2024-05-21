<template>
	<view>
		<!-- 		<view class=" bg-white p-all-12" >
			<view class="row-between-center  p-lr-15" style="background-color: #f5f5f5;height: 88rpx;border-radius: 40rpx;">
				<input class="flex-grow p-all-10" type="text" placeholder="输入关键词搜索" style="height: 66rpx;">
				<view class="commit_bt font-26 " style="width: 120rpx;height: 62rpx;">
					<text>搜索</text>
				</view>
			</view>
			
		</view> -->
		<ss-topTabar styleSet="3" widthNum="w-33" :tabarArr="topTabarArr" :topSelectIndex="topInx" @tabSelect="topBarIndex"></ss-topTabar>
		<view class="grid-one grid-gap-1">
			<view class="grid-one bg-white p-all-12" v-for="(item, index) in dataArr" :key="index">
				<text class="font-bold font-32">{{ item.address_name }}</text>
				<view class="row-start-center ">
					<text class="flex-grow">{{ item.address }}</text>
					<uni-dateformat :date="new Date()" format="yyyy.mm.dd"></uni-dateformat>
				</view>
			</view>
		</view>
		<view class="fixed-bottom p-all-15" @click="navToAdd">
			<view class="commit_bt"><text>我要认领</text></view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const community_cloud = uniCloud.importObject('community');
onLoad(() => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	});
});
const topTabarArr = [{ text: '已认领', value: 1 }, { text: '审核中', value: 0 }, { text: '审核失败', value: 2 }];
const topInx = ref(0);
function topBarIndex(e) {
	topInx.value = e.index;
	uni.startPullDownRefresh({});
}
const dataArr = ref([]);

onPullDownRefresh(() => {
	const dic = {
		state: topTabarArr[topInx.value]['id']
	};
	community_cloud.query({ pageIndex: 0, where: dic }).then(res => {
		console.log('----', res);
		dataArr.value = res.data;
		uni.stopPullDownRefresh();
	});
});
onReachBottom(() => {
	const dic = {
		state: topTabarArr[topInx.value]['id']
	};
	community_cloud.query({ pageIndex: dataArr.value, where: dic }).then(res => {
		console.log('----', res);

		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
	});
});
function navToAdd() {
	uni.navigateTo({
		url: '/pages/manager/community/desc'
	});

}
</script>

<style></style>
