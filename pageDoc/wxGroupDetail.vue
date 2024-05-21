<template>
	<view>
		<ss-topTabar v-if="tabarList.length>1" style="z-index: 10;" styleSet="3" widthNum="w-33" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		
		<swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
			<swiper-item class="w-100 " v-for="(item, index) in dataDic.images" :key="index">
				<image mode="aspectFit" :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
			</swiper-item>
		</swiper>

		<view class="grid-one p-all-15">
			<text class="font-bold " style="font-size: 60rpx;">{{ dataDic.name }}</text>
			<text class="color-666 font-30">{{ dataDic.remark }}</text>
		</view>

		<view class="" style="height: 150rpx;"></view>
		<view class="p-lr-15 p-tb-10 fixed-bottom row-start-center bg-white" style="border-top: 1rpx solid #eee;">
			<view class="commit_bt flex-grow m-t-3" @click="copyWxGroup()"><text>我要进群</text></view>
		</view>

		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools, msg, uniCopy } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore } from '@/store';
const wxGroupApi = uniCloud.importObject('wx-group');
const systemStore = useSystemStore();
const wxGroupList = computed(() => systemStore.pageDic);
const tabarList=computed(()=>systemStore.pageDic.map(function(a,b){
	return {text:a.name,value:a._id}
}))
const topIndex=ref(0)
const dataArr = ref([]);
const dataDic = ref({
	community_id: '',
	user_id: '',
	images: [],
	cover: '',
	sys_msg: '',
	name: '',
	remark: '',
	state: 0,
	category_id: 0,
	create_date: '',
	opengid: '',
	group_owner_wx: '' //群主微信
});
const ssAlert = ref('');
onLoad(e => {
	dataDic.value = wxGroupList.value[0];
});

function getWxDetail() {
	for (let groudId in wxGroupList.value) {
		wxGroupApi.doc(groudId).then(res => {
			dataArr.value.push(res);
			console.log('获取群信息', res);
		});
	}
}
function changeTabIndex(e) {
	topIndex.value = e.index;
	dataDic.value=wxGroupList.value[topIndex.value]
}

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
// 联系房东
function copyWxGroup() {
	uniCopy({
		content: dataDic.value.group_owner_wx,
		success: function() {
			ssAlert.value.showModalDic({
				show: true,
				title: '已复制群主微信',
				confirmText: '确定',
				showCancel: false,
				cancelText: '取消',
				content: '',
				success: e => {
					if (e.confirm) {
					}
				}
			});
		}
	});
}
</script>

<style>
page {
	background-color: #f5f5f5;
}
.itemView {
	border: 1rpx solid #ddd;
	border-radius: 10rpx;
	overflow: hidden;
}
.contentView {
	background-color: #fff;
	padding: 15rpx;
}
.label {
	width: 160rpx;
	flex-shrink: 0;
}
.content {
	flex-grow: 1;
}
.content_input:hover {
	border: 1px solid #007aff;
}
.content_input {
	text-align: center;
	border: 1px solid #eee;
	height: 56rpx;
	border-radius: 10rpx;
	font-weight: 400;
}
</style>
