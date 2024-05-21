<template>
	<view>
		<ss-topTabar styleSet="3" widthNum="w-25" :tabarArr="classArr" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		<!-- <uni-indexed-list></uni-indexed-list> -->
		<view class="grid-one p-all-10"><wxGroup :select="true" class="" v-for="(item, index) in dataArr" :key="index" :dataDic="item"></wxGroup></view>

		<uni-load-more v-if="dataArr.length > 0" :status="loadStatus"></uni-load-more>

		<view class="fixed-bottom p-all-15">
			<view class="commit_bt" @click="sureVoid">
				<text>确定({{ selectArr.length }})</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, watchEffect } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useSystemStore } from '@/store';
const systemStore=useSystemStore()

const wxGroupkApi = uniCloud.importObject('wx-group', { customUI: true });
onLoad(() => {});
const bigDic = ref({});
const classArr = ref([]);
const topIndex = ref(0);
const classId = computed(e => (classArr.value.length > 0 ? classArr.value[topIndex.value]['value'] : ''));
const dataArr = computed(e =>  bigDic.value[classId.value] || []);
const selectGroupArr = computed(e => systemStore.selectGroupArr);

let keyWork = '';
const loadStatus = ref('more');

const selectArr = computed(() => {
	const arr = dataArr.value.filter(function(a, b) {
		return a['select'];
	});
	return arr;
});

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
		fixArrLoad(res.data)
		
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
		fixArrLoad(res.data)
		
		bigDic.value[classId.value] = bigDic.value[classId.value].concat(res.data);
		
		if (res.data.length % 10 == 0 && res.data.length > 0) {
			loadStatus.value = 'more';
		} else {
			loadStatus.value = 'noMore';
		}
	});
});
function fixArrLoad(arr){
	
	for (let item of arr) {
		const findItem = selectGroupArr.value.find(function(a, b) {
			return a._id == item._id;
		});
		console.log('---0-0-11',findItem)
		
		if (findItem) {
			item['select'] = true;
		}
	}
	
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
function sureVoid() {
	systemStore.selectGroupArr=selectArr.value	
	uni.navigateBack();
}
</script>

<style></style>
