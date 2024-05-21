<template>
	<view>
		<swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
			<swiper-item class="w-100 " v-for="(item, index) in bannerArr" :key="index">
				<image :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
			</swiper-item>
		</swiper>
		<ss-topTabar styleSet="3" widthNum="w-25" :tabarArr="classArr" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		<!-- <uni-indexed-list></uni-indexed-list> -->
		<view class="grid-one p-all-10"><addressBook class="" v-for="(item, index) in dataArr" :key="index" :dataDic="item"></addressBook></view>
		<uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd"></uni-fab>
		<!-- <bottomMore :dataList="dataArr"></bottomMore> -->
		<uni-load-more v-if="dataArr.length > 0" :status="loadStatus"></uni-load-more>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const addressBookApi = uniCloud.importObject('address-book', { customUI: true });
onLoad(() => {});
const bigDic = ref({});
const classArr = ref([]);
const topIndex = ref(0);
const classId = computed(e => (classArr.value.length > 0 ? classArr.value[topIndex.value]['value'] : ''));
const dataArr = computed(e => bigDic.value[classId.value] || []);
let keyWork = '';
const loadStatus = ref('more');

const bannerArr = ref([]);
onLoad(() => {
	getBaseData();
});
function getBaseData() {
	addressBookApi.getBanner().then(res => {
		bannerArr.value = res.data;
	});
	addressBookApi.getClass().then(res => {
		classArr.value = res.data;
		if (res.data.length > 0) {
			uni.startPullDownRefresh({});
		}
	});
}

function changeTabIndex(e) {
	topIndex.value = e.index;
	if (dataArr.value.length == 0) {
		loadData();
	}
}
onPullDownRefresh(() => {
	loadData();
});
function loadData() {
	const dic = {
		pageIndex: 0,
		where: { category_id: classId.value, open: true }
	};
	addressBookApi.query(dic).then(res => {
		console.log(res.data);
		bigDic.value[classId.value] = res.data;
		uni.stopPullDownRefresh({});
		if (res.data.length % 10 == 0 && res.data.length > 0) {
			loadStatus.value = 'more';
		} else {
			loadStatus.value = 'noMore';
		}
	});
}
onReachBottom(() => {
	const dic = {
		pageIndex: dataArr.value.length,
		where: { category_id: classId.value, open: true }
	};
	loadStatus.value = 'loading';

	addressBookApi.query(dic).then(res => {
		bigDic.value[classId.value] = bigDic.value[classId.value].concat(res.data);
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
		url: '/pages/addressBook/add'
	});
};
onShareAppMessage(res => {
	return {
		title: '龙兴嘉苑社区通讯录',
		path: '/pages/addressBook/list',
		imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/4fda7a0d-6e87-4ae7-b89b-61f9e12e8c98.png'
	};
});
onShareTimeline(res => {
	return {
		title: '龙兴嘉苑社区通讯录',
		path: '/pages/addressBook/list',
		imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/4fda7a0d-6e87-4ae7-b89b-61f9e12e8c98.png'
	};
});
</script>

<style></style>
