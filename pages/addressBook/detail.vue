<template>
	<view>
		<swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
			<swiper-item class="w-100 " v-for="(item, index) in dataDic.images" :key="index">
				<image mode="aspectFit" :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
			</swiper-item>
		</swiper>

		<view class="grid-one p-all-15">
			<text class="font-bold " style="font-size: 60rpx;">{{ dataDic.name }}</text>
			<text class="color-666 font-30">{{ dataDic.remark }}</text>

			<view class="row-between-center" style="padding-top: 40rpx;">
				<text class="font-40 font-bold flex-grow">{{ dataDic.phone }}</text>
				<!-- <text class="iconfont icon-dianhua themecolor " style="font-size: 26px;"></text> -->
				<text @click="copyPhone(dataDic.phone)" class="iconfont icon-fuzhi-13 themecolor m-l-15" style="font-size: 26px;"></text>
			</view>
			<view class="row-between-center" style="padding-top: 40rpx;" v-for="(item, index) in dataDic.other" :key="index">
				<text class="font-40 font-bold flex-grow">{{ item.phone }}</text>
				<text class="iconfont icon-dianhua themecolor " style="font-size: 26px;"></text>
				<text @click="copyPhone(item.phone)" class="iconfont icon-fuzhi-13 themecolor m-l-15" style="font-size: 26px;"></text>
			</view>
		</view>

		<view class="grid-one  m-all-10 m-tb-10 " v-if="dataDic.address_name">
			<view class="row-between-center p-all-10" @click="openMap()">
				<text class=" color-333 ">{{ dataDic.address_name }}{{ dataDic.address }}</text>
				<uni-icons @click="openMap()" type="paperplane" size="22" color="#999"></uni-icons>
			</view>
		</view>

		<view class="" style="height: 150rpx;"></view>
		<view class="p-lr-15 p-tb-10 fixed-bottom row-start-center bg-white" style="border-top: 1rpx solid #eee;">
			<view class="column-center-center" @click="reportClick()">
				<text class="iconfont icon-jubao color-666" style="font-size: 42rpx;"></text>
				<text class="font-24 color-666 m-t-3">反馈</text>
			</view>
			<view class="column-center-center m-lr-15 p_r">
				<text class="iconfont icon-fenxiang color-666" style="font-size: 42rpx;"></text>

				<text class="font-24 color-666">分享</text>
				<button open-type="share" class="coverBg nbt"></button>
			</view>
			<view class="column-center-center m-r-15 " @click="collect()">
				<uni-icons v-if="!dataDic.collect" type="star" size="21" color="#666"></uni-icons>
				<uni-icons v-if="dataDic.collect" type="star-filled" size="21" color="#00755C"></uni-icons>
				<text class="font-24 color-666">收藏</text>
			</view>
			<view class="commit_bt flex-grow m-t-3" @click="makePhone()"><text>拨打</text></view>
		</view>
		<!-- 举报 -->
		<uni-popup ref="addPop">
			<view class="bg-white   border-radius-10 p-all-10" style="width: 690rpx;">
				<view class="row-between-center p-tb-10">
					<text class="font-bold">反馈</text>
					<uni-icons @click="hidePop" type="close" color="#999"></uni-icons>
				</view>
				<view class="row-start-center contentView ">
					<textarea
						v-model="reportDic.content"
						class=" flex-grow p-all-10 font-28"
						style="text-align: left;background-color: #fafafa;height: 140rpx;"
						placeholder="空号/号码失效"
					/>
				</view>

				<view class="commit_bt m-tb-15" @click="commit()"><text>确定</text></view>
			</view>
		</uni-popup>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools, msg, uniCopy } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
import formOptions from '@/pages/addressBook/contant.js';
const addressBookApi = uniCloud.importObject('address-book');
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const moreBt = ref(false);
const dataDic = ref({
	community_id: '',
	user_id: '',
	images: [],
	cover: '',
	sys_msg: '',
	contacts: [],
	title: '',
	remark: '',
	address: '',
	address_name: '',
	gps: {
		latitude: 0,
		longitude: 0
	},
	state: 0,
	class: 0,
	create_date: null,
	collect: false
});
const ssAlert = ref('');
onLoad(e => {
	if (e.bookId) {
		addressBookApi.doc(e.bookId).then(res => {
			if (res.data.state == 0) {
				Object.assign(dataDic.value, res.data);
				uni.setNavigationBarTitle({
					title: res.data.name
				});
			} else {
				ssAlert.value.showModalDic({
					show: true,
					title: '内容可能被删除了',
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
});
onShareAppMessage(e => {
	return {
		title: dataDic.value.name + '-' + dataDic.value.phone,
		path: '/pages/addressBook/detail?bookId=' + dataDic.value._id,
		imageUrl: dataDic.value.cover || '/static/logo.png'
	};
});
onShareTimeline(e => {
	return {
		title: dataDic.value.name + '-' + dataDic.value.phone,
		path: '/pages/addressBook/detail?bookId=' + dataDic.value._id,
		imageUrl: dataDic.value.cover || '/static/logo.png'
	};
});

// 打开地图
function openMap() {
	console.log(dataDic.value);
	wx.openLocation({
		latitude: dataDic.value.gps.latitude,
		longitude: dataDic.value.gps.longitude,
		name: dataDic.value.address_name,
		scale: 20,
		complete: function(err) {
			console.log(err);
		}
	});
}
// 复制
function copyPhone(e) {
	console.log(e);

	ssAlert.value.showModalDic({
		show: true,
		title: '温馨提示',
		confirmText: '确定',
		showCancel: true,
		cancelText: '取消',
		content: '本程序只提供信息互通,如涉及商业行为,请自行斟酌',
		success: e => {
			if (e.confirm) {
				uniCopy({
					content: e,
					success: function() {
						msg('号码已复制');
					}
				});
			}
		}
	});
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
function makePhone() {
	ssAlert.value.showModalDic({
		show: true,
		title: '温馨提示',
		confirmText: '确定',
		showCancel: true,
		cancelText: '取消',
		content: '本程序只提供信息互通,如涉及商业行为,请自行斟酌',
		success: e => {
			if (e.confirm) {
				uni.makePhoneCall({
					phoneNumber: dataDic.value.phone
				});
			}
		}
	});
}
// 收藏
function collect() {
	const dic = {
		uni_id: dataDic.value._id,
		uni_data: dataDic.value
	};
	addressBookApi.favorite(dic).then(res => {
		if (res.errCode == 0) {
			dataDic.value.collect = !dataDic.value.collect;
			console.log(dataDic.value.collect);
		}
	});
}

// 举报
const addPop = ref();
const reportDic = ref({ content: '' });
function reportClick() {
	addPop.value.open();
}
function hidePop() {
	addPop.value.close();
}
function commit() {
	if (!reportDic.value.content) {
		msg('请输入内容');
		return;
	}
	const dic = {
		uni_id: dataDic.value._id,
		content: reportDic.value.content,
		uni_data: dataDic.value
	};
	addressBookApi.report(dic).then(res => {
		reportDic.value.content = '';
		msg(res.data);
		hidePop();
	});
}
</script>

<style>
page {
	background-color: #f5f5f5;
	/* padding-top: 100rpx; */
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
