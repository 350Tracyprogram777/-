<template>
	<view>
		<docFile @report="addClick" @share="docShare" @zan="docZan" @collect="docCollect" detail :dataDic="dataDic"></docFile>

		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools, msg, uniCopy } from '@/common/ss-superModules/superConfig.js';
import { docCollect, docZan } from '@/pageDoc/doc.js';

import { useUserStore, useSystemStore } from '@/store';
const docApi = uniCloud.importObject('user-doc', { customUI: true });
const reportCenterApi = uniCloud.importObject('report-center');
const userStore = useUserStore();
const systemStore = useSystemStore();

const userInfo = computed(() => userStore.userInfo);
const classDic = ref({ wx_group: [] });

const dataDic = ref({
	user_id: '',
	images: [],
	cover: '',
	sys_msg: '',
	content: '',
	category_id: '',
	author: '', //作者
	view_count: 0, //阅读数量
	like_count: 0, //点赞量
	is_sticky: false, //是否置顶
	address: '',
	address_name: '',
	gps: '',
	state: 0,
	create_date: 0,
	zan: [],
	collect: []
});

const ssAlert = ref('');
onLoad(e => {
	console.log('我有进来了', e);
	if (e.isEdit) {
		// 自己查看 则无需校验
		dataDic.value['_id'] = e.docId;
		getDetail();
		return;
	}
	if (e.docId && e.classId) {
		dataDic.value['_id'] = e.docId;
		classDic.value['_id'] = e.classId;
		loadBaseData();
	}
});

function loadBaseData() {
	docApi.getClassDetail(classDic.value._id).then(res => {
		if (res.errCode == 0) {
			Object.assign(classDic.value, res.data);
			if (classDic.value.wx_group.length > 0) {
				systemStore
					.getWxGroup(classDic.value)
					.then(res => {
						const findItem = classDic.value.wx_group.find(function(a, b) {
							return a.opengid == res;
						});
						if (findItem) {
							getDetail();
						} else {
							uni.showModal({
								title: '群资料,外部打开无效',
								content: `请从微信群:${classDic.value.name}内打开`,
								showCancel: false,
								success: function(e) {
									uni.switchTab({
										url: '/pages/tabar/main'
									});
								}
							});
						}
					})
					.catch(err => {
						{
							uni.showModal({
								title: '群资料,外部打开无效',
								content: `请从微信群:${classDic.value.name}内打开`,
								showCancel: false,
								success: function(e) {
									uni.switchTab({
										url: '/pages/tabar/main'
									});
								}
							});
						}
					});
			} else {
				getDetail();
			}
		}
	});
}

function getDetail() {
	docApi
		.doc(dataDic.value._id)
		.then(res => {
			if (res.errCode == 0) {
				Object.assign(dataDic.value, res.data);
			}
		})
		.catch(err => {
			ssAlert.value.showModalDic({
				show: true,
				title: '未找到,可能已被删除',
				confirmText: '确定',
				showCancel: false,
				cancelText: '',
				content: '',
				success: e => {
					if (e.confirm) {
						uni.redirectTo({
							url: '/pageDoc/class'
						});
					}
				}
			});
		});
}
// 分享
const shareDic = ref('');
function docShare(e) {
	console.log(e);
	shareDic.value = e.value;
}
onShareAppMessage(res => {
	console.log(res);
	if (res.from === 'button') {
		return {
			title: dataDic.value.content,
			path: '/pageDoc/detail?docId=' + dataDic.value._id + '&timestmap=' + new Date().getTime(),
			imageUrl: dataDic.value.cover
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
			title: dataDic.value.content,
			path: '/pageDoc/detail?docId=' + dataDic.value._id + '&timestmap=' + new Date().getTime(),
			imageUrl: dataDic.value.cover
		};
	} else {
		return {
			title: '家在龙兴嘉苑2号院',
			path: '/pages/tabar/main',
			imageUrl: '/static/share/share-main2.jpg'
		};
	}
});
// 预览
function prewImg(index) {
	let arr = [];
	for (let item of dataDic.value.images) {
		arr.push(item.url);
	}
	uni.previewImage({
		current: index,
		urls: arr
	});
}
</script>

<style>
page {
	background-color: #fff;
}
</style>
