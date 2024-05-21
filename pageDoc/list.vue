<template>
	<view>
		<view v-if="classDic.wx_group.length > 0" class="row-center-center p-all-13 p_f " style="z-index: -1;top: 0rpx;left: 0rpx;right: 0rpx;">
			<text class="color-999 font-26">微信群内部资料,仅可通过群分享进入查看</text>
		</view>
		<view class="grid-one p-all-10 p_r">
			<docFile class="bg-white border-radius-6" @share="docShare" @zan="docZan" @collect="docCollect" :dataDic="item" v-for="(item, index) in dataArr" :key="index"></docFile>
		</view>
		<bottomMore :dataList="dataArr" :loadMore="loadMore"></bottomMore>
		<uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd"></uni-fab>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { docCollect, docZan } from '@/pageDoc/doc.js';
import { useUserStore, useSystemStore } from '@/store';
const docApi = uniCloud.importObject('user-doc');
const dataArr = ref([]);
const shareDic = ref('');
const loadMore = ref('more');
const classDic = ref({ wx_group: [] });
const userStore = useUserStore();
const systemStore = useSystemStore();
const wxStartEnv = computed(() => systemStore.wxStartEnv);

onLoad(e => {
	if (e.classId) {
		classDic.value._id = e.classId;
		loadBaseData();
	}
	// 加载页面基本数据
	// loadBaseData();
	uni.$on('docUpdate', function(e) {
		const item = dataArr.value.find(function(a, b) {
			return a._id == e._id;
		});
		Object.assign(item, e);
	});
});

function loadBaseData() {
	docApi.getClassDetail(classDic.value._id).then(res => {
		if (res.errCode == 0) {
			Object.assign(classDic.value, res.data);
			if (classDic.value.wx_group.length > 0) {
				systemStore
					.getWxGroup()
					.then(res => {
						const findItem = classDic.value.wx_group.find(function(a, b) {
							return a.opengid == res;
						});
						console.log('qunid', findItem);
						if (findItem) {
							loadData();
						} else {
							uni.showModal({
								title: '群资料仅能通过群内分享查看',
								content: `如果您不是该群的成员,可联系群主进群`,
								showCancel: true,
								confirmText: '详情',
								success: function(e) {
									if (e.confirm) {
										console.log('lllll', classDic.value.wx_group);
										systemStore.pageDic = classDic.value.wx_group;
										uni.redirectTo({
											url: '/pageDoc/wxGroupDetail'
										});
									} else {
										uni.switchTab({
											url: '/pages/tabar/main'
										});
									}
								}
							});
						}
					})
					.catch(err => {
						uni.showModal({
							title: '群资料仅能通过群内分享查看',
							content: `如果您不是该群的成员,可联系群主进群`,
							showCancel: true,
							confirmText: '详情',
							success: function(e) {
								if (e.confirm) {
									console.log('lllll', classDic.value.wx_group);
									systemStore.pageDic = classDic.value.wx_group;
									uni.redirectTo({
										url: '/pageDoc/wxGroupDetail'
									});
								} else {
									uni.switchTab({
										url: '/pages/tabar/main'
									});
								}
							}
						});
					});
			} else {
				loadData();
			}
		}
	});
}

onPullDownRefresh(() => {
	loadData();
});
function loadData() {
	const dic = {
		pageIndex: 0,
		where: { category_id: classDic.value._id }
		// where: {}
	};
	docApi.query(dic).then(res => {
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
		where: { category_id: classDic.value._id }
		// where: {}
	};
	loadMore.value = 'loading';

	docApi.query(dic).then(res => {
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
	console.log(e);
	shareDic.value = e.value;
}
onShareAppMessage(res => {
	console.log(res);
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pageDoc/detail?docId=' + shareDic.value._id + '&classId=' + shareDic.value.category_id + '&timestmap=' + new Date().getTime(),
			imageUrl: shareDic.value.cover
		};
	} else {
		return {
			title: '群文件,群内成员可查看',
			path: '/pageDoc/list?classId=' + classDic.value._id
		};
	}
});
onShareTimeline(res => {
	if (res.from === 'button') {
		return {
			title: shareDic.value.content,
			path: '/pageDoc/detail?docId=' + shareDic.value._id + '&classId=' + shareDic.value.category_id + '&timestmap=' + new Date().getTime(),
			imageUrl: shareDic.value.cover
		};
	} else {
		return {
			title: '群文件,群内成员可查看',
			path: '/pageDoc/list?classId=' + classDic.value._id
		};
	}
});
</script>

<style></style>
