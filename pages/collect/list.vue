<template>
	<view>
		<view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
			<ss-topTabar
				style="z-index: 10"
				styleSet="3"
				widthNum="w-33"
				:tabarArr="tabarList"
				:topSelectIndex="topIndex"
				@tabSelect="changeTabIndex"
			></ss-topTabar>
		</view>

		<view v-if="topIndex == 0" class="grid-one p-all-10"><addressBook @clear="cancleAddress" :dataDic="item" v-for="(item, index) in dataArr" :key="index"></addressBook></view>
		<view v-if="topIndex == 1" class="grid-one p-all-10"><houseRent @clear="cancleHouse" :dataDic="item" v-for="(item, index) in dataArr" :key="index"></houseRent></view>
		<view v-if="topIndex == 2" class="grid-one p-all-10">
			<newsOne @share="newsShare" @zan="newsZan" @collect="newsCollect" class="bg-white" :dataDic="item" v-for="(item, index) in dataArr" :key="index"></newsOne>
		</view>

		<view v-if="topIndex == 3" class="grid-one p-all-10">
			<docFile class="bg-white border-radius-6" @share="docShare" @zan="docZan" @collect="docCollect" :dataDic="item" v-for="(item, index) in dataArr" :key="index"></docFile>
		</view>

		<bottomMore :dataList="dataArr" :loadMore="loadMore"></bottomMore>
		<!-- <view class="" style="height: 160rpx;"></view> -->
		<!-- <view class="fixed-bottom p-all-15">
			<view class="commit_bt" @click="navToAdd()"><text>我要发布</text></view>
		</view> -->
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { newsCollect, newsZan } from '@/pages/newsArticle/news.js';
import { docCollect, docZan } from './doc.js';
import { useUserStore } from '@/store';
const addressBookApi = uniCloud.importObject('address-book', { customUI: true });
const houseRentApi = uniCloud.importObject('house-rent', { customUI: true });
const newsApi = uniCloud.importObject('news-article', { customUI: true });
const docApi = uniCloud.importObject('user-doc', { customUI: true });
const tabarList = [
	{ text: '通讯录', value: 0, id: 'txl', api: addressBookApi },
	{ text: '房屋出租', value: 1, id: 'fwcz', api: houseRentApi },
	{ text: '帖子', value: 2, id: 'news', api: newsApi },
	{ text: '资料库', value: 4, id: 'doc', api: docApi }
];
const topIndex = ref(0);
const topItem = computed(() => tabarList[topIndex.value]);
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const bigDic = ref({});
const dataArr = computed(() => (bigDic.value[topItem.value.id] ? bigDic.value[topItem.value.id] : []));
const loadMore = ref('more');
const shareDic = ref('');
onLoad(e => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 200);
});

function changeTabIndex(e) {
	topIndex.value = e.index;
	uni.startPullDownRefresh({});
}
onPullDownRefresh(() => {
	let dic = { pageIndex: 0 };
	topItem.value.api.queyfavorite(dic).then(res => {
		console.log(res.data)
		bigDic.value[topItem.value['id']] = res.data;
		uni.stopPullDownRefresh();
		if (dataArr.value.length % 10 == 0) {
			loadMore.value = 'more';
		} else {
			loadMore.value = 'noMore';
		}
	});
});
onReachBottom(() => {
	let dic = { pageIndex: dataArr.value.length };
	loadMore.value = 'loading';

	topItem.value.api.queyfavorite(dic).then(res => {
		bigDic.value[topItem.value['id']] = bigDic.value[topItem.value['id']].concat(res.data);
		if (dataArr.value.length % 10 == 0 && res.data.length > 0) {
			loadMore.value = 'more';
		} else {
			loadMore.value = 'noMore';
		}
	});
});
const ssAlert = ref('');
function cancleAddress(_id) {
	ssAlert.value.showModalDic({
		show: true,
		title: '内容已被删除',
		confirmText: '取消收藏',
		showCancel: true,
		content: '',
		success: e => {
			if (e.confirm) {
				addressBookApi.favorite(e).then(res => {
					uni.startPullDownRefresh({});
				});
			}
		}
	});
}
function cancleHouse(_id) {
	ssAlert.value.showModalDic({
		show: true,
		title: '内容已被删除',
		confirmText: '取消收藏',
		showCancel: true,
		content: '',
		success: e => {
			if (e.confirm) {
				houseRentApi.favorite(e).then(res => {
					uni.startPullDownRefresh({});
				});
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
	}
});
onShareTimeline(res => {
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pages/newsArticle/detail?newsId=' + shareDic.value._id,
			imageUrl: shareDic.value.cover
		};
	}
});
</script>

<style></style>
