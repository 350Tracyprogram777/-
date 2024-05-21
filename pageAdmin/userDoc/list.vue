<template>
	
	<view>
		<view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
		
		<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-50" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		</view>
		<view class="grid-one p-all-10">
			<docFile
				class="bg-white border-radius-6"
				admin
				@resolve="resolveVoid"
				@reject="rejectVoid"
				@delete="remove"
				@err="showErr"
				:dataDic="item"
				v-for="(item, index) in dataArr"
				:key="index"
			></docFile>
		</view>
		<bottomMore :dataList="dataArr"></bottomMore>
		<view class="" style="height: 160rpx;"></view>

		<uni-popup ref="rejectPop">
			<view class="grid-one  bg-white p-all-10 border-radius-10" style="width: 690rpx;">
				<view class="row-between-center">
					<text class="font-30 font-bold">下架原因</text>
					<uni-icons type="close" size="20" @click="hideReject"></uni-icons>
				</view>
				<textarea placeholder="请说明下架的原因,方便用户整改" v-model="rejectContent" style="height: 200rpx;background-color: #f5f5f5;" class="w-100 p-all-5"></textarea>
				<view class="grid-two">
					<view class="commit_bt bg-red" @click="commitReject(30)"><text>永久下架</text></view>
					<view class="commit_bt" @click="commitReject(1)"><text>可整改下架</text></view>
				</view>
			</view>
		</uni-popup>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const tabarList = [{ text: '正常', value: 0 }, { text: '已拒绝', value: 1 }];
const topIndex = ref(0);
const curState = computed(e => tabarList[topIndex.value]['value']);
const docApi = uniCloud.importObject('user-doc');
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const dataArr = ref([]);
const shareDic = ref({});

onLoad(e => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 100);
});
onPullDownRefresh(() => {
	let dic = {};

	dic = { pageIndex: 0, state: curState.value };

	docApi.adminQuery(dic).then(res => {
		dataArr.value = res.data;
		uni.stopPullDownRefresh();
	});
});
onReachBottom(() => {
	let dic = {};
	dic = { pageIndex: dataArr.value.length, state: curState.value };

	docApi.adminQuery(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
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
// 审核拒绝
const rejectPop = ref();
const rejectContent = ref('');
let selectItem = '';
function rejectVoid(e) {
	selectItem = e.value;
	console.log(selectItem);
	rejectPop.value.open();
}
function hideReject() {
	rejectPop.value.close();
}
function commitReject(e) {
	if (!rejectContent.value) {
		msg('请说明下架的原因,方便用户整改');
		return;
	}

	const dic = {
		state: e,
		sys_msg: rejectContent.value,
		_id: selectItem._id
	};

	docApi.adminEdit(dic).then(res => {
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
					_id:  e.value._id
				};
				docApi.adminEdit(dic).then(res => {
					const inx = dataArr.value.findIndex(function(a, b) {
						return a._id ==  e.value._id;
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
		confirmText: '删除',
		showCancel: true,
		content: '如非必要,不建议删除',
		success: e => {
			if (e.confirm) {
				docApi.adminRemove(item.value._id).then(res => {
					uni.startPullDownRefresh({});
					msg('已删除');
				});
			}
		}
	});
}
// 改变状态

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
