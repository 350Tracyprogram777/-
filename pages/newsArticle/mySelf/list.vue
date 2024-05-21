<template>
	<view>
		<!-- <view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
			<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-50" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		</view> -->
		<view class="grid-one p-all-10">
			<newsOne
				class="bg-white border-radius-6"
				edit
				@delete="remove"
				@change="changeState"
				@err="showErr"
				@edit="navToEdit"
				@share="newsShare"
				:dataDic="item"
				v-for="(item, index) in dataArr"
				:key="index"
			></newsOne>
		</view>
		<bottomMore :dataList="dataArr" :loadMore="loadStatus"></bottomMore>
		<view class="" style="height: 160rpx;"></view>
		<view class="fixed-bottom p-all-15">
			<view class="commit_bt" @click="navToAdd()"><text>我要发布</text></view>
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const newsApi = uniCloud.importObject('news-article');
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const dataArr = ref([]);
const shareDic = ref({});

const tabarList = [{ text: '正常', value: 0 }, { text: '已拒绝', value: 1 }];
const topIndex = ref(0);
const curState = computed(e => tabarList[topIndex.value]['value']);
const loadStatus = ref('more');

onLoad(e => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 100);
});
onPullDownRefresh(() => {
	let dic = {};

	dic = { pageIndex: 0, where: { mode: 1 } };

	newsApi.querySelf(dic).then(res => {
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
	let dic = {};
	dic = { pageIndex: dataArr.value.length, where: { mode: 1 } };

	newsApi.querySelf(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
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
		url: '/pages/newsArticle/add'
	});
};

// 删除
const ssAlert = ref();
function remove(item) {
	ssAlert.value.showModalDic({
		show: true,
		title: '确定删除',
		confirmText: '确定',
		showCancel: true,
		content: '',
		success: e => {
			if (e.confirm) {
				newsApi.remove(item.value._id).then(res => {
					uni.startPullDownRefresh({});
					msg('已删除');
				});
			}
		}
	});
}
// 改变状态

// 修改
function navToEdit(e) {
	uni.navigateTo({
		url: '/pages/newsArticle/add?newsId=' + e.value._id
	});
}
function showErr(e) {
	ssAlert.value.showModalDic({
		show: true,
		title: '请整改',
		confirmText: '去修改',
		showCancel: true,
		cancelText: '取消',
		content: e.sys_msg,
		success: e => {
			if (e.confirm) {
				navToEdit(e);
			}
		}
	});
}
// 分享
function newsShare(e) {
	console.log(e);
	shareDic.value = e.value;
}
onShareAppMessage(res => {
	console.log(res);
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pages/newsArticle/detail?newsId=' + shareDic.value._id,
			imageUrl: shareDic.value.cover
		};
	} else {
		return {
			title: '家在龙兴嘉苑2号院',
			path: '/pages/tabar/main',
			imageUrl: '/static/share/share-main2.jpg'
		};
	}
});
onShareTimeline(res => {
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pages/newsArticle/detail?newsId=' + shareDic.value._id,
			imageUrl: shareDic.value.cover
		};
	} else {
		return {
			title: '家在龙兴嘉苑2号院',
			path: '/pages/tabar/main',
			imageUrl: '/static/share/share-main2.jpg'
		};
	}
});
function changeTabIndex(e) {
	topIndex.value = e.index;
	uni.startPullDownRefresh({});
}
</script>

<style>
page {
	background-color: #f5f5f5;
}
</style>
