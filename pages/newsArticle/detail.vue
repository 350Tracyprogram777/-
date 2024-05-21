<template>
	<view>
		<newsOne @report="addClick" @share="newsShare" @zan="newsZan" @collect="newsCollect" detail :dataDic="dataDic"></newsOne>

		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools, msg, uniCopy } from '@/common/ss-superModules/superConfig.js';
import { newsCollect, newsZan } from '@/pages/newsArticle/news.js';

import { useUserStore } from '@/store';
const newsApi = uniCloud.importObject('news-article');
const reportCenterApi = uniCloud.importObject('report-center');
const userInfo = computed(() => userStore.userInfo);

const dataDic = ref({
	user_id: '',
	images: [],
	cover: '',
	sys_msg: '',
	content: '',
	category_id: '6322c30c4c9784000172402c',
	author: '', //作者
	view_count: 0, //阅读数量
	like_count: 0, //点赞量
	is_sticky: false, //是否置顶
	address: '',
	address_name: '',
	gps: '',
	state: 0,
	create_date: 0,
	mode: 1,
	zan: [],
	collect: []
});

const ssAlert = ref('');
onLoad(e => {
	if (e.newsId) {
		dataDic.value['_id'] = e.newsId;
		getDetail();
	}
});
function getDetail() {
	newsApi.doc(dataDic.value._id).then(res => {
		if (res.errCode == 0) {
			Object.assign(dataDic.value, res.data);
		} else {
			ssAlert.value.showModalDic({
				show: true,
				title: '未找到,可能已被删除',
				confirmText: '确定',
				showCancel: false,
				cancelText: '',
				content: '',
				success: e => {
					if (e.confirm) {
						uni.navigateBack();
					}
				}
			});
		}
	});
}
// 分享
const shareDic=ref('')
function newsShare(e) {
	console.log(e);
	shareDic.value = e.value;
}
onShareAppMessage(res => {
	console.log(res);
	if (res.from === 'button') {
		return {
			title: dataDic.value.content,
			path: '/pages/newsArticle/detail?newsId=' + dataDic.value._id,
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
			path: '/pages/newsArticle/detail?newsId=' + dataDic.value._id,
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
