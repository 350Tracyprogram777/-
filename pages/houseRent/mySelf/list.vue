<template>
	<view>
		<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-33" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>

		<view class="grid-one p-all-10">
			<houseRent edit @delete="remove" @change="changeState" @err="showErr" @edit="navToEdit" :dataDic="item" v-for="(item, index) in dataArr" :key="index"></houseRent>
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
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
import { filterData } from '../contant.js';
const houseRentApi = uniCloud.importObject('house-rent');
const tabarList = [{ text: '租售中', value: 0 }, { text: '已租售', value: 1 }, { text: '暂停租售', value: 2 }];
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
	houseRentApi.querySelf(dic).then(res => {
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
	houseRentApi.querySelf(dic).then(res => {
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
		url: '/pages/houseRent/add'
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
				houseRentApi.remove(item.value._id).then(res => {
					uni.startPullDownRefresh({});
					msg('已删除');
				});
			}
		}
	});
}
// 改变状态
function changeState(e) {
	if (e.value.state == 30) {
		msg('严重违规,请联系客户处理');
		return;
	}
	const stateArr = ['出租', '已出租/售', '暂停租售'];
	stateArr.splice(e.value.state, 1);
	uni.showActionSheet({
		title: '发布状态',
		itemList: stateArr,
		success: function(res) {
			console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
			const tt = stateArr[res.tapIndex];
			const dic = {
				_id: e.value._id,
				state: res.tapIndex
			};
			if (tt == '出租') {
				dic.state = 0;
			}
			if (tt == '已出租/售') {
				dic.state = 1;
			}
			if (tt == '暂停租售') {
				dic.state = 2;
			}

			houseRentApi.edit(dic).then(res => {
				uni.startPullDownRefresh({});
			});
		},
		fail: function(res) {
			console.log(res.errMsg);
		}
	});
}
// 修改
function navToEdit(e) {
	uni.navigateTo({
		url: '/pages/houseRent/add?houseId=' + e.value._id
	});
}
function showErr(e) {
	ssAlert.value.showModalDic({
		show: true,
		title: '请整改',
		confirmText: '去修改',
		showCancel: true,
		cancelText: '取消',
		content: e.value.sys_msg,
		success: res => {
			if (res.confirm) {
				navToEdit(e);
			}
		}
	});
}
</script>

<style></style>
