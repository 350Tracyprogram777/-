<template>
	<view><web-view :src="dataDic.url" style="width: 750rpx;height: auto;"></web-view></view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const newsApi = uniCloud.importObject('news-article');
const dataDic = ref({ _id: '' });
onLoad(e => {
	if (e.newsId) {
		dataDic.value._id = e.newsId;
		getDetail();
	}
});
function getDetail() {
	newsApi.doc(dataDic.value._id).then(res => {
		uni.setNavigationBarTitle({
			title: res.data.title
		});
		console.log(res);
		Object.assign(dataDic.value, res.data);
	});
}
onShareAppMessage(res => {
	return {
		title: dataDic.value.title,
		path: '/pages/newsArticle/webUrl?newsId=' + dataDic.value._id,
		imageUrl: dataDic.value.cover
	};
});
onShareTimeline(res => {
	return {
		title: dataDic.value.content,
		path: '/pages/newsArticle/webUrl?newsId=' + dataDic.value._id,
		imageUrl: dataDic.value.cover
	};
});
</script>

<style></style>
