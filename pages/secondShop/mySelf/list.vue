<template>
	<view>
		<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-33" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>

		<view class="grid-two p-all-10">
			<secondShop
				edit
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
		<view class="" style="height: 160rpx;"></view>
		<view class="fixed-bottom p-all-15">
			<view class="commit_bt" @click="navToAdd()"><text>发布闲置</text></view>
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const secondApi = uniCloud.importObject('second-shop');
const tabarList  = [{ text: '出售/求购中', value: 0 }, { text: '暂停出售/求购', value: 1 }, { text: '已卖出/求购', value: 2 }];
const topIndex = ref(0);
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const dataArr = ref([]);
const loadStatus = ref('more');

onLoad(e => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 200);
});
const curState = computed(e => tabarList[topIndex.value]['value']);
onPullDownRefresh(() => {
	let dic = {};
	if (topIndex.value == 0) {
		dic = { pageIndex: 0, where: { state: curState.value, user_id: userInfo.value._id } };
	} else {
		dic = { pageIndex: 0, where: { state: curState.value, user_id: userInfo.value._id } };
	}
	secondApi.querySelf(dic).then(res => {
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
	if (topIndex.value == 0) {
		dic = { pageIndex: dataArr.value.length, where: { state: curState.value, user_id: userInfo.value._id } };
	} else {
		dic = { pageIndex: dataArr.value.length, where: { state: curState.value, user_id: userInfo.value._id } };
	}
	secondApi.querySelf(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
		if (res.data.length % 10 == 0 && res.data.length > 0) {
			loadStatus.value = 'more';
		} else {
			loadStatus.value = 'noMore';
		}
	});
});
function changeTabIndex(e) {
	topIndex.value = e.index;
	uni.startPullDownRefresh({});
}
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
</script>

<style></style>
