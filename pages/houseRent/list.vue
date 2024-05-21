<template>
	<view>
		<swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
			<swiper-item class="w-100 " v-for="(item, index) in bannerArr" :key="index">
				<image :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
			</swiper-item>
		</swiper>
		<!-- <dropDown class="m-t-1" style="z-index: 10" :menuArr="filterArr" @sure="confirm"></dropDown> -->
		<view class="grid-one p-all-10"><houseRent :dataDic="item" v-for="(item, index) in dataArr" :key="index"></houseRent></view>
		<!-- <bottomMore :dataList="dataArr"></bottomMore> -->
		<uni-load-more v-if="dataArr.length > 0" :status="loadStatus"></uni-load-more>

		<uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd"></uni-fab>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
import { filterData } from './contant.js';
const houseRentApi = uniCloud.importObject('house-rent', { customUI: true });
onLoad(() => {});
const dataArr = ref([]);
const filterArr = ref(filterData);
const loadStatus = ref('more');

let where = {};

const bannerArr = ref([]);
onLoad(() => {
	houseRentApi.getBanner().then(res => {
		bannerArr.value = res.data;
	});
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 300);
});

function confirm(e) {
	console.log(e);
	where = e;
}
onPullDownRefresh(() => {
	houseRentApi.query({ pageIndex: 0, where: where }).then(res => {
		dataArr.value = res.data;
		uni.stopPullDownRefresh();
		if (res.data.length % 10 == 0 && res.data.length > 0) {
			loadStatus.value = 'more';
		} else {
			loadStatus.value = 'noMore';
		}
	});
});
onReachBottom(() => {
	loadStatus.value = 'loading';
	houseRentApi.query({ pageIndex: dataArr.value.length, where: where }).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		if (res.data.length % 10 == 0 && res.data.length > 0) {
			loadStatus.value = 'more';
		} else {
			loadStatus.value = 'noMore';
		}
	});
});

const prewImg = e => {
	let arr = [];
	for (let item of bannerArr.value) {
		arr.push(item.url);
	}

	uni.previewImage({
		current: e.url,
		urls: arr
	});
};
const navToAdd = () => {
	uni.navigateTo({
		url: '/pages/houseRent/add'
	});
};
onShareAppMessage(res => {
	return {
		title: '龙兴嘉苑品质房源租售平台',
		path: '/pages/houseRent/list',
		imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/56f03e4b-cf24-43eb-a2ee-d05d8dde94c2.png'
	};
});
onShareTimeline(res => {
	return {
		title: '龙兴嘉苑品质房源租售平台',
		path: '/pages/houseRent/list',
		imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/56f03e4b-cf24-43eb-a2ee-d05d8dde94c2.png'
	};
});
</script>

<style></style>
