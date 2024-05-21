<template>
	<view>
		<view class="grid-one p-all-10">
			<addressBook @edit="navToEdit" @delete="remove" @err="showErr" edit class="" v-for="(item, index) in dataArr" :key="index" :dataDic="item"></addressBook>
		</view>
		<bottomMore :dataList="dataArr" :loadMore="loadStatus"></bottomMore>

		<uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd"></uni-fab>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const addressBookApi = uniCloud.importObject('address-book');
const loadStatus = ref('more');

onLoad(() => {});
const dataArr = ref([]);

onLoad(() => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 100);
});

function changeTabIndex(e) {
	topIndex.value = e.index;
	uni.startPullDownRefresh({});
}
onPullDownRefresh(() => {
	const dic = {
		pageIndex: 0
	};
	addressBookApi.querySelf(dic).then(res => {
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
	const dic = {
		pageIndex: dataArr.value.length
	};
	addressBookApi.querySelf(dic).then(res => {
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
		url: '/pages/addressBook/add'
	});
};
// 去编辑
function navToEdit(e) {
	
	uni.navigateTo({
		url: '/pages/addressBook/add?addressId=' + e._id
	});
}
// 删除
const ssAlert = ref();
function remove(e) {
	console.log('shanchu ', e);
	ssAlert.value.showModalDic({
		show: true,
		title: '确定删除',
		confirmText: '确定',
		showCancel: true,
		content: '',
		success: re => {
			if (re.confirm) {
				addressBookApi.remove(e._id).then(res => {
					uni.startPullDownRefresh({});
					msg('已删除');
				});
			}
		}
	});
}
// 展示系统审核信息
function showErr(e) {
	ssAlert.value.showModalDic({
		show: true,
		title: '请整改',
		confirmText: '去修改',
		showCancel: true,
		cancelText: '取消',
		content: e.sys_msg,
		success: res => {
			if (res.confirm) {
				navToEdit(e);
			}
		}
	});
}
</script>

<style>
page {
	background-color: #fafafa;
}
</style>
