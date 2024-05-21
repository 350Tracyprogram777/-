<template>
	<view>
		<swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
			<swiper-item class="w-100 " v-for="(item, index) in bannerArr" :key="index">
				<image :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
			</swiper-item>
		</swiper>

		<view class="grid-two p-all-10">
			<secondShop
				class=" border-radius-6"
				@share="newsShare"
				@zan="newsZan"
				@collect="newsCollect"
				:dataDic="item"
				v-for="(item, index) in dataArr"
				:key="index"
			></secondShop>
		</view>
		<bottomMore :dataList="dataArr" :loadMore="loadStatus"></bottomMore>
		<uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd"></uni-fab>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const secondApi = uniCloud.importObject('second-shop');
const bannerArr = ref([]);
const dataArr = ref([]);
const loadStatus = ref('more');

const shareDic = ref('');
onLoad(e => {
	// 加载页面基本数据
	loadBaseData();
	loadData()
});
onShow(e => {});
function loadBaseData() {
	secondApi.getBanner().then(res => {
		bannerArr.value = res.data;
	});
}

onPullDownRefresh(() => {
	loadData();
});
function loadData() {
	const dic = {
		pageIndex: 0,
		where: {}
	};
	secondApi.query(dic).then(res => {
		dataArr.value = res.data;
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
		where: {}
	};
	loadStatus.value = 'loading';

	secondApi.query(dic).then(res => {
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
		url: '/pages/secondShop/add'
	});
};
// 分享
function newsShare(e) {
	console.log(e);
	shareDic.value = e.value;
}
onShareAppMessage(res => {
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pages/secondShop/detail?productId=' + shareDic.value._id,
			imageUrl: shareDic.value.cover
		};
	} else {
		return {
			title: '家在龙兴嘉苑2号院-二手置换',
			path: '/pages/tabar/main',
			imageUrl: '/static/share/share-main2.jpg'
		};
	}
});
onShareTimeline(res => {
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pages/secondShop/detail?productId=' + shareDic.value._id,
			imageUrl: shareDic.value.cover
		};
	} else {
		return {
			title: '家在龙兴嘉苑2号院-二手置换',
			path: '/pages/tabar/main',
			imageUrl: '/static/share/share-main2.jpg'
		};
	}
});
</script>

<style></style>
