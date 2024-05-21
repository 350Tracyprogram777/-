<template>
	<view>
		<view class="row-start-center bg-white p-all-12 border-radius-6" @click="navToDetail()">
			<image v-if="dataDic.cover || dataDic.images.length > 0" :src="switchImageSize()" style="width: 120rpx;height: 120rpx;border-radius: 60rpx;"></image>
			<view v-else class="row-center-center oneText">
				<text>{{ getFrist() }}</text>
			</view>

			<view class="column-between-start align-self-stretch flex-grow m-l-10">
				<view class="row-between-center align-self-stretch ">
					<text class="font-bold font-32">{{ dataDic.name }}</text>
					<uni-dateformat :date="dataDic.create_date" format="yyyy/MM/dd" style="font-size: 24rpx;color:#ccc"></uni-dateformat>
				</view>
				<text class="font-22 color-999">群Id:{{dataDic.opengid}}</text>
				<view class="row-between-center align-self-stretch">
					<text class="text-maxline-one color-999 font-24">{{ dataDic.remark }}</text>
					<view v-if="select" class="">
						<uni-icons  @click.stop="selectVoid()" v-if="!dataDic['select']" type="circle" size="25" color="#999"></uni-icons>
						<uni-icons  @click.stop="selectVoid()" v-else type="checkbox-filled" size="25" color="#00755C"></uni-icons>
					</view>
					
				</view>
			</view>
		</view>

		<view v-if="admin" class="grid-two border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<!-- <text v-if="dataDic.state != 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('reject')">下架</text> -->
			<!-- <text v-if="dataDic.state == 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('resolve')">上架</text> -->
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { formOptions } from '@/pages/houseRent/contant.js';
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore,useSystemStore } from '@/store';
const userStore = useUserStore();
const systemStore = useSystemStore();

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
	}
});
const emit = defineEmits(['delete', 'select', 'update:selectItem', 'reject', 'resolve']);

const dataDic = toRef(props, 'dataDic');
const selectModel = toRef(props, 'select');
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
	if (selectModel.value) {
		return;
	}
	systemStore.WxStartEnv={
		scene: 0,
		path: ''
	}
	uni.navigateTo({
		url: '/pageAdmin/wxGroup/add?groupId=' + dataDic.value._id
	});
}
function makePhone() {
	uni.makePhoneCall({
		phoneNumber: dataDic.value.phone
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

// 选中
function selectVoid() {
	dataDic.value['select'] = !dataDic.value['select'];
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
