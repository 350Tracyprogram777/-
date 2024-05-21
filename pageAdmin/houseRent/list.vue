<template>
	<view>
		<view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
			<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-50" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		</view>
		<view class="grid-one p-all-10">
			<houseRent
				@resolve="resolveVoid"
				@reject="rejectVoid"
				admin
				@delete="remove"
				@change="changeState"
				@err="showErr"
				@edit="navToEdit"
				:dataDic="item"
				v-for="(item, index) in dataArr"
				:key="index"
			></houseRent>
		</view>
		<bottomMore :dataList="dataArr" :loadMore="loadStatus"></bottomMore>
		<view class="" style="height: 160rpx;"></view>
		<uni-popup ref="rejectPop">
			<view class="grid-one  bg-white p-all-10 border-radius-10" style="width: 690rpx;">
				<view class="row-between-center">
					<text class="font-30 font-bold">下架原因</text>
					<uni-icons type="close" size="20" @click="hideReject"></uni-icons>
				</view>
				<textarea placeholder="请说明下架的原因,方便用户整改" v-model="rejectContent" style="height: 150rpx;background-color: #f5f5f5;" class="w-100"></textarea>
				<view class="grid-two">
					<view class="commit_bt bg-red" @click="commitReject(30)"><text>永久下架</text></view>
					<view class="commit_bt" @click="commitReject(2)"><text>可整改下架</text></view>
				</view>
			</view>
		</uni-popup>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const houseRentApi = uniCloud.importObject('house-rent');
const tabarList = [{ text: '正常', value: 0 }, { text: '已拒绝', value: 30 }];
const topIndex = ref(0);
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const curState = computed(e => tabarList[topIndex.value]['value']);
const loadStatus = ref('more');

const dataArr = ref([]);
onLoad(e => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 200);
});
onPullDownRefresh(() => {
	let dic = {};
	if (topIndex.value == 0) {
		dic = { pageIndex: 0, state: curState.value };
	} else {
		dic = { pageIndex: 0, state: curState.value };
	}
	houseRentApi.adminQuery(dic).then(res => {
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
		dic = { pageIndex: dataArr.value.length, state: curState.value };
	} else {
		dic = { pageIndex: dataArr.value.length, state: curState.value };
	}
	loadStatus.value = 'loading';

	houseRentApi.adminQuery(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
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

// 审核拒绝
const rejectPop = ref();
const rejectContent = ref('');
let selectItem = '';
function rejectVoid(e) {
	selectItem = e.value;
	rejectPop.value.open();
}
function hideReject() {
	rejectPop.value.close();
}
function commitReject(state) {
	if (!rejectContent.value) {
		msg('请说明下架的原因,方便用户整改');
		return;
	}
	const dic = {
		state: state,
		sys_msg: rejectContent.value,
		_id: selectItem._id
	};
	houseRentApi.adminEdit(dic).then(res => {
		const inx = dataArr.value.findIndex(function(a, b) {
			return a._id == selectItem._id;
		});
		dataArr.value.splice(inx, 1);
		hideReject();
	});
}
// 重新上架
function resolveVoid(e) {
	ssAlert.value.showModalDic({
		show: true,
		title: '重新上架',
		confirmText: '确定',
		showCancel: true,
		cancelText: '取消',
		content: '',
		success: res => {
			if (res.confirm) {
				const dic = {
					state: 0,
					sys_msg: '',
					_id: e.value._id
				};
				houseRentApi.adminEdit(dic).then(res => {
					const inx = dataArr.value.findIndex(function(a, b) {
						return a._id == e.value._id;
					});
					dataArr.value.splice(inx, 1);
				});
			}
		}
	});
}
// 删除
const ssAlert = ref();
function remove(item) {
	ssAlert.value.showModalDic({
		show: true,
		title: '确定删除',
		confirmText: '确定',
		showCancel: true,
		content: '如非必要,不建议删除',
		success: e => {
			if (e.confirm) {
				houseRentApi.adminRemove(item._id).then(res => {
					uni.startPullDownRefresh({});
					msg('已删除');
				});
			}
		}
	});
}
// 改变状态
function changeState(e) {
	const stateArr = ['出租', '已出租/售', '暂停租售'];
	stateArr.splice(e.state, 1);
	uni.showActionSheet({
		title: '发布状态',
		itemList: stateArr,
		success: function(res) {
			console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
			const tt = stateArr[res.tapIndex];
			const dic = {
				_id: e._id,
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
		url: '/pages/houseRent/add?houseId=' + e._id
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
</script>

<style></style>
