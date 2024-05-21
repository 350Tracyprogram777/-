<template>
	<view>
		<!-- <swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
			<swiper-item class="w-100 " v-for="(item, index) in bannerArr" :key="index">
				<image :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
			</swiper-item>
		</swiper> -->
		<!-- <view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
			<ss-topTabar style="z-index: 0;" styleSet="3" widthNum="w-25" :tabarArr="classArr" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		</view> -->

		<view class="grid-one p-all-10">
			<docFile
				edit
				class="bg-white border-radius-6"
				@share="docShare"
				@zan="docZan"
				@collect="docCollect"
				@delete="remove"
				@change="changeState"
				@err="showErr"
				@edit="navToEdit"
				:dataDic="item"
				v-for="(item, index) in dataArr"
				:key="index"
			></docFile>
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>

		<bottomMore :dataList="dataArr" :loadMore="loadMore"></bottomMore>
		<uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd"></uni-fab>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { docCollect, docZan } from '@/pageDoc/doc.js';
import { useUserStore } from '@/store';
const docApi = uniCloud.importObject('user-doc');
const bigDic = ref({});
const bannerArr = ref([]);
const classArr = ref([]);
const topIndex = ref(0);
const classId = computed(e => (classArr.value.length > 0 ? classArr.value[topIndex.value]['value'] : ''));
// const dataArr = computed(e => bigDic.value[classId.value] || []);
const dataArr = ref([]);
const shareDic = ref('');
const loadMore = ref('more');

onLoad(e => {
	// 加载页面基本数据
	// loadBaseData();
	loadData();
});
onShow(e => {
	// loadBaseData();
});
function loadBaseData() {
	docApi.getBanner().then(res => {
		bannerArr.value = res.data;
	});
	docApi.getClass().then(res => {
		classArr.value = res.data;
		if (res.data.length > 0) {
			setTimeout(function() {
				uni.startPullDownRefresh({});
			}, 200);
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
	console.log('-----2');
});
onPullDownRefresh(() => {
	loadData();
});
function loadData() {
	const dic = {
		pageIndex: 0,
		// where: { category_id: classId.value }
		where: {}
	};
	docApi.querySelf(dic).then(res => {
		// bigDic.value[classId.value] = res.data;
		dataArr.value = res.data;
		uni.stopPullDownRefresh({});
		if (dataArr.value.length % 10 == 0) {
			loadMore.value = 'more';
		} else {
			loadMore.value = 'noMore';
		}
	});
}
onReachBottom(() => {
	const dic = {
		pageIndex: dataArr.value.length,
		// where: { category_id: classId.value }
		where: {}
	};
	loadMore.value = 'loading';

	docApi.querySelf(dic).then(res => {
		// bigDic.value[classId.value] = bigDic.value[classId.value].concat(res.data);
		dataArr.value = dataArr.value.concat(res.data);
		if (dataArr.value.length % 10 == 0) {
			loadMore.value = 'more';
		} else {
			loadMore.value = 'noMore';
		}
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
const navToAdd = () => {
	uni.navigateTo({
		url: '/pageDoc/add'
	});
};
// 分享
function docShare(e) {
	shareDic.value = e.value;
	console.log(shareDic.value.content);

}
onShareAppMessage(res => {
	console.log(res);
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pageDoc/detail?docId=' + shareDic.value._id+'&classId='+shareDic.value.category_id+'&timestmap=' + new Date().getTime(),
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
			path: '/pageDoc/detail?docId=' + shareDic.value._id+'&classId='+shareDic.value.category_id+'&timestmap=' + new Date().getTime(),
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
				docApi.remove(item.value._id).then(res => {
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
		url: '/pageDoc/add?docId=' + e.value._id
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
