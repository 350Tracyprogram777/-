<template>
	<view>
		<ss-topTabar styleSet="3" widthNum="w-25" :tabarArr="classArr" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		<!-- <uni-indexed-list></uni-indexed-list> -->
		<view class="grid-one p-all-10"><wxGroup class="" v-for="(item, index) in dataArr" :key="index" :dataDic="item"></wxGroup></view>

		<view class="p_f row-center-center bg-theme" style="bottom: 160rpx;right: 30rpx;width: 88rpx;height: 88rpx;border-radius: 44rpx;">
			<text class="text-white font-26">认证群</text>
			<button open-type="share" class="p_a p_a_all nbt"></button>
		</view>
		<uni-load-more v-if="dataArr.length > 0" :status="loadStatus"></uni-load-more>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';

const wxGroupkApi = uniCloud.importObject('wx-group', { customUI: true });
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
	wxGroupkApi.getClass().then(res => {
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
		where: { category_id: classId.value }
	};
	console.log('------', dic);
	wxGroupkApi.query(dic).then(res => {
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
		where: { category_id: classId.value }
	};
	loadStatus.value = 'loading';

	wxGroupkApi.query(dic).then(res => {
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
		title: '群认证',
		path: '/pageAdmin/wxGroup/add?timestmap=' + new Date().getTime(),
		imageUrl: '/static/share/share-main2.jpg'
	};
});
</script>

<style></style>
