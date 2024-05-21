<template>
	<view>
		<view class="grid-two">
			<view @click="navToList(item)" class="p_r classView" :style="{ width: docWidth, height: docWidth }" v-for="(item, index) in classArr" :key="index">
				<image src="/static/public/doc.png" class="bgImg" :style="{ width: docWidth, height: docWidth }"></image>
				<text class="classText">{{ item.text }}</text>
				<view v-if="item.wx_group.length == 0" class="row-start-center bottomView"><text class="font-bold color-555 font-26">资料库</text></view>
				<view v-if="item.wx_group.length > 0" class="row-start-center bottomView"><text class="font-bold color-555 font-26">群资料</text></view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { docCollect, docZan } from '@/pageDoc/doc.js';
import { useUserStore } from '@/store';
const docWidth = (uni.getSystemInfoSync().screenWidth - 30 - 10) / 2 + 'px';
const docApi = uniCloud.importObject('user-doc');
const wxApi = uniCloud.importObject('wxapi');
const classArr = ref([]);

onLoad(() => {
	loadBaseData();
});

// 列表
function navToList(item) {
	console.log(item);
	uni.navigateTo({
		url: '/pageDoc/list?classId=' + item.value
	});
}

function loadBaseData() {
	docApi.getClass().then(res => {
		classArr.value = res.data;
		console.log(classArr.value);
		uni.stopPullDownRefresh()
	});
}
</script>

<style>
page {
	padding: 15px;
}
.classView {
	position: relative;
	width: 300rpx;
	height: 300rpx;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
}
.classText {
	color: #000;
	font-size: 40rpx;
	font-weight: bold;
	position: relative;
	margin-top: 55rpx;
}
.bgImg {
	position: absolute;
	left: 0rpx;
	right: 0rpx;
	top: 0rpx;
	bottom: 0rpx;
	width: 300rpx;
	height: 300rpx;
}
.bottomView {
	position: absolute;
	right: 0rpx;
	bottom: 0rpx;
	border-top-left-radius: 30rpx;
	border-bottom-right-radius: 25rpx;
	background-color: orange;
	padding: 4px 40rpx;
	font-weight: bold;
}
</style>
