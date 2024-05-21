<template>
	<view>
		<view class="border-radius-12 bg-white" style="overflow: hidden;" @click="navToDetail">
			<ss-image :src="dataDic.cover" width="345" height="345" style="border-radius: 0rpx;"></ss-image>
			<view class="p-lr-10 p-t-5 bg-white grid-one grid-gap-10">
				<!-- 出售 -->
				<view class="" v-if="!dataDic.model">
					<view class="row-wrap">
						<text class=" text-maxline-two">
							<text v-if="dataDic.replacement.open" class="zh">置换</text>
							<text v-if="dataDic.price == 0 && !dataDic.replacement.open" class="zs">赠送</text>
							<text v-if="dataDic.price > 0 && !dataDic.replacement.open" class="ykj">一口价</text>
							{{ dataDic.content }}
						</text>
					</view>
					<view class="row-start-end m-t-6">
						<text v-if="dataDic.price == 0" class="text-pricen  font-bold">免费</text>
						<text v-else class="text-pricem font-30">{{ dataDic.price }}</text>
						<text class="font-20 color-999 m-l-10">{{ dataDic.like_count }}人想要</text>
					</view>
				</view>
				<!-- 求购 -->
				<view v-if="dataDic.model == 1">
					<view class="row-wrap">
						<text class=" text-maxline-two">
							<text class="qg">求购</text>
							{{ dataDic.content }}
						</text>
					</view>
					<view class="row-start-end m-t-6">
						<text class="text-pricen  font-bold">商议</text>
						<text class="font-20 color-999 m-l-10">{{ dataDic.like_count }}人同求</text>
					</view>
				</view>

				<view v-if="dataDic.author_user" class="row-between-center">
					<ss-image style="border-radius: 20rpx;" :src="dataDic.author_user.avatar" width="40" height="40" size="30" class="flex-shrink bg-color"></ss-image>
					<text class="font-20 flex-grow m-lr-10 color-999">{{ dataDic.author_user.nickname }}</text>
				</view>
			</view>
		</view>
		<view v-if="admin" class="grid-two border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<text v-if="dataDic.state == 0" class="text-center font-26 color-666 p-tb-10" @click="moreClick('reject')">下架</text>
			<text v-else class="text-center font-26 color-666 p-tb-10" @click="moreClick('resolve')">上架</text>
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { formOptions } from '@/pages/houseRent/contant.js';
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const emit = defineEmits(['delete', 'change', 'edit', 'err', 'clear', 'reject', 'resolve']);

const props = defineProps({
	dataDic: {
		type: Object,
		default: () => {}
	},
	edit: {
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false
	}
});
const dataDic = toRef(props, 'dataDic');

// 跳转详情
function navToDetail() {
	if (props.edit) {
		uni.navigateTo({
			url: '/pages/secondShop/add?productId=' + dataDic.value._id
		});
	} else {
		uni.navigateTo({
			url: '/pages/secondShop/detail?productId=' + dataDic.value._id
		});
	}
}

const prewImg = e => {
	let arr = [];
	for (let item of dataDic.value.images) {
		arr.push(item.url);
	}
	uni.previewImage({
		current: e,
		urls: arr
	});
};
function moreClick(e) {
	emit(e, dataDic);
}
</script>

<style>
.contentClass {
	font-size: 28rpx;
	line-height: 50rpx;
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
