<template>
	<view>
		<view class="row-start-center bg-white p-all-12 border-radius-6" @click="navToDetail()">
			<image v-if="dataDic.cover || dataDic.images.length > 0" :src="switchImageSize()" style="width: 120rpx;height: 120rpx;border-radius: 60rpx;"></image>
			<view v-else class="row-center-center oneText">
				<text>{{ getFrist() }}</text>
			</view>

			<view class="column-between-start align-self-stretch flex-grow m-l-10">
				<view class="row-between-center align-self-stretch ">
					<text class="font-bold">{{ dataDic.name }}</text>
					<text v-if="!select" @click.stop="makePhone()" class="iconfont icon-dianhua themecolor flex-shrink" style="font-size: 50rpx;"></text>
					<view class="" v-else @click.stop="selectItemVoid">
						<uni-icons v-if="selectItem._id != dataDic._id" type="circle" size="22"></uni-icons>
						<uni-icons v-else type="checkbox-filled" size="22" color="#00755C"></uni-icons>
					</view>
				</view>
				<text class="text-maxline-one color-999 font-24">{{ dataDic.reamrk }}</text>
				<text>{{ dataDic.phone }}</text>
			</view>
		</view>

		<view v-if="edit" class="grid-two border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<!-- <text class="text-center font-26 color-666 p-tb-10" @click="moreClick('change')">租售状态</text> -->
			<view class="row-center-center">
				<text v-if="dataDic.state == 30" class="text-center font-26 color-666 p-tb-10">违规</text>
				<text v-if="dataDic.state != 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('edit')">修改</text>
				<uni-icons v-if="dataDic.state == 30" type="info" color="red" size="19" @click="moreClick('err')"></uni-icons>
			</view>
		</view>
		<view v-if="admin" class="grid-two border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<text v-if="dataDic.state != 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('reject')">下架</text>
			<text v-if="dataDic.state == 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('resolve')">上架</text>
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
;
const props = defineProps({
	dataDic: {
		type: Object,
		default: () => {}
	},
	edit: {
		//是不是自己可以编辑
		type: Boolean,
		default: false
	},
	admin: {
		//是不是管理员
		type: Boolean,
		default: false
	},
	select: {
		type: Boolean,
		default: false
	},
	selectItem: {
		type: Object,
		default: () => {}
	}
});
const emit = defineEmits(['delete', 'err', 'edit', 'clear', 'select', 'update:selectItem', 'reject', 'resolve']);

const dataDic = toRef(props, 'dataDic');
const selectItem = toRef(props, 'selectItem');
function switchImageSize(size = 100) {
	// 等比缩放
	if (dataDic.value.cover) {
		return dataDic.value.cover + `?x-oss-process=image/resize,h_${size},m_lfit`;
	} else {
		if (dataDic.value.images.length > 0) {
			console.log('---', dataDic.value.images[0]['url']);
			return dataDic.value.images[0]['url'] + `?x-oss-process=image/resize,h_${size},m_lfit`;
		}

		return '/static/logo.png';
	}
}
// 跳转详情
function navToDetail() {
	if (dataDic.value.is_clear) {
		emit('clear', dataDic.value);
		return;
	}

	uni.navigateTo({
		url: '/pages/addressBook/detail?bookId=' + dataDic.value._id
	});
}
const ssAlert=ref()
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

function moreClick(e) {
	emit(e, dataDic.value);
}
// 获取第一个字
function getFrist() {
	const a = dataDic.value.name.substr(0, 1);
	return a;
}
// 选择
function selectItemVoid() {
	if (dataDic.value._id != selectItem.value._id) {
		emit('update:selectItem', dataDic.value);
	} else {
		emit('update:selectItem', { _id: 0 });
	}
}
</script>

<style>
.oneText {
	width: 120rpx;
	height: 120rpx;
	background-color: #f5f5f5;
	border-radius: 60rpx;
}
.oneText text {
	font-size: 60rpx;
	color: #999;
}
</style>
