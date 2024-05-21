<template>
	<view class="bg-white">
		<view v-if="dataDic.author_user" class="row-start-center bg-white p-all-10">
			<ss-image style="border-radius: 40rpx;" :src="dataDic.author_user.avatar" width="80" height="80" size="60" class="flex-shrink bg-color"></ss-image>
			<text class="font-28 flex-grow  m-lr-10 font-bold">{{ dataDic.author_user.nickname }}</text>
			<uni-dateformat :date="dataDic.create_date" format="yyyy/MM/dd" style="font-size: 22rpx;color: #999;"></uni-dateformat>
		</view>

		<view v-if="!dataDic.model" class=" p-t-10 bg-white row-between-center grid-gap-6">
			<view class="row-start-end">
				<text v-if="dataDic.price == 0" class="text-pricen  font-bold font-36">免费</text>
				<text v-else class="text-pricem font-36">{{ dataDic.price }}</text>
				<text class="font-20 color-999 m-l-10">{{ dataDic.like_count }}人想要</text>
			</view>
			<view class="row-wrap">
				<text v-if="dataDic.replacement.open" class="zh">置换</text>
				<view class="" v-else>
					<text v-if="dataDic.price == 0" class="zs">赠送</text>
					<text v-if="dataDic.price > 0" class="ykj">一口价</text>
				</view>
			</view>
		</view>

		<view v-else class=" p-t-10 bg-white row-between-center grid-gap-6">
			<view class="row-start-end">
				<text class="text-pricen font-36">商议</text>
				<text class="font-20 color-999 m-l-10">{{ dataDic.like_count }}人同求</text>
			</view>
			<text class="qg">求购</text>
		</view>

		<text class=" text-maxline-more m-t-10 font-32" style="line-height: 44rpx;">{{ dataDic.content }}</text>

		<view v-if="!dataDic.mode" class="grid-one p-t-10" style="border-top: 1px solid #eee;">
			<text v-if="dataDic.replacement.content" class=" text-maxline-more  font-30" style="line-height: 44rpx;">想要置换:{{ dataDic.replacement.content }}</text>
			<text v-else class=" text-maxline-more  font-30" style="line-height: 44rpx;">想要置换:等价物品</text>
		</view>

		<view class="grid-one grid-gap-1 m-t-10">
			<!-- <image :src="item.url" v-for="(item, index) in dataDic.images" mode="widthFix" style="width: 100%;"></image> -->

			<media-one :mediaArr="dataDic.images"></media-one>
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
			<view class="column-center-center m-r-15 " @click="secondZan()">
				<uni-icons v-if="dataDic.zan.length == 0" type="heart" size="21" color="#666"></uni-icons>
				<uni-icons v-else type="heart-filled" size="21" color="#00755C"></uni-icons>
				<text class="font-24 color-666">想要</text>
			</view>
			<view class="commit_bt flex-grow m-t-3" @click="navToAddressBook()"><text>立即联系</text></view>
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
						placeholder="输入要举报的原因"
					/>
				</view>

				<view class="commit_bt m-tb-15" @click="commitReport()"><text>确定</text></view>
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
const secondApi = uniCloud.importObject('second-shop');
const addressBookApi = uniCloud.importObject('address-book');
const userInfo = computed(() => userStore.userInfo);

const dataDic = ref({
	user_id: '',
	images: [],
	tags: [],
	cover: '',
	sys_msg: '',
	price: '',
	content: '',
	category_id: '',
	author: '', //作者
	view_count: 0, //阅读数量
	like_count: 0, //点赞量
	is_sticky: false, //是否置顶
	address: '',
	address_name: '',
	gps: { latitude: 0, longitude: 0 },
	state: 0,
	create_date: 0,
	mode: 2,
	replacement: {
		open: false,
		content: ''
	},
	trade_type: 0 //0包邮 自提
});

const ssAlert = ref('');
onLoad(e => {
	if (e.productId) {
		dataDic.value['_id'] = e.productId;
		getDetail();
	}
});
function getDetail() {
	secondApi.doc(dataDic.value._id).then(res => {
		console.log('获取商品详情', res);
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
onShareAppMessage(e => {
	let title = '';
	if (dataDic.value.model == 0) {
		if (dataDic.value.price > 0) {
			title = '¥' + dataDic.value.price + '出售' + dataDic.value.content;
		} else {
			title = '免费赠送:' + dataDic.value.content;
		}
	} else {
		if (dataDic.value.price > 0) {
			title = '¥' + dataDic.value.price + '求购' + dataDic.value.content;
		} else {
			title = '求购:' + dataDic.value.content;
		}
	}

	return {
		title: title,
		path: '/pages/secondShop/detail?productId=' + dataDic.value._id,
		imageUrl: dataDic.value.cover
	};
});
onShareTimeline(e => {
	let title = '';
	if (dataDic.value.model == 0) {
		if (dataDic.value.price > 0) {
			title = '¥' + dataDic.value.price + ' 出售' + dataDic.value.content;
		} else {
			title = '免费赠送:' + dataDic.value.content;
		}
	} else {
		if (dataDic.value.price > 0) {
			title = '¥' + dataDic.value.price + '求购' + dataDic.value.content;
		} else {
			title = '求购:' + dataDic.value.content;
		}
	}
	
	return {
		title: title,
		path: '/pages/secondShop/detail?productId=' + dataDic.value._id,
		imageUrl: dataDic.value.cover
	};
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
function commitReport() {
	if (!reportDic.value.content) {
		msg('请输入内容');
		return;
	}
	const dic = {
		uni_id: dataDic.value._id,
		content: reportDic.value.content,
		uni_data: dataDic.value
	};
	secondApi.report(dic).then(res => {
		reportDic.value.content = '';
		msg(res.data);
		hidePop();
	});
}
// 我想要
function secondZan() {
	secondApi.zan(dataDic.value._id).then(res => {
		if (res.data.length == 0) {
			dataDic.value.zan = [];
			dataDic.value.like_count--;
		} else {
			dataDic.value.zan = res.data;
			dataDic.value.like_count++;
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
// 去看通讯录
function navToAddressBook() {
	uni.navigateTo({
		url: '/pages/addressBook/detail?bookId=' + dataDic.value.address_book_id
	});
}
</script>

<style>
page {
	background: #fff !important;
	padding: 30rpx;
}
.qg {
	background-color: orchid;
	color: #fff;
	border-radius: 0rpx 12rpx 0rpx 12rpx;
	padding: 4rpx 10rpx;
	font-size: 12px;
}
.zh {
	background-color: #fec041;
	color: #fff;
	border-radius: 0rpx 12rpx 0rpx 12rpx;
	padding: 4rpx 10rpx;
	font-size: 12px;
}

.zs {
	background-color: #30c648;
	color: #fff;
	border-radius: 0rpx 12rpx 0rpx 12rpx;
	padding: 4rpx 10rpx;
	font-size: 12px;
}
.ykj {
	background-color: #e85f4b;
	color: #fff;
	border-radius: 0rpx 12rpx 0rpx 12rpx;
	padding: 4rpx 10rpx;
	font-size: 12px;
}
</style>
