<template>
	<view>
		<view class="row-start-center bg-white p-all-10 border-radius-6" @click="navToDetail">
			<image class="flex-shrink border-radius-6" :src="switchImageSize()" style="width: 240rpx;height: 180rpx;background-color: #f5f5f5;"></image>
			<view class="column-between-start flex-grow align-self-stretch m-l-10   ">
				<view class="row-start-center">
					<text v-if="dataDic.sall_rent_type == 1" class="font-bold flex-shrink">出售&ensp;·&ensp;</text>
					<view v-if="dataDic.sall_rent_type == 0" class="flex-shrink">
						<text v-if="dataDic.rent_type == 0" class="font-bold ">整租&ensp;·&ensp;</text>
						<text v-if="dataDic.rent_type == 1" class="font-bold ">合租&ensp;·&ensp;</text>
					</view>
					<text class="text-maxline-one font-bold">{{ dataDic.address_name }}</text>
				</view>
				<view class="row-start-center">
					<text class="color-666 font-24">{{ dataDic.area }}㎡</text>
					<text class="m-lr-10 color-666 font-24">{{ dataDic.house_room + '室' + dataDic.house_play + '厅' + dataDic.house_toilet + '卫' }}</text>
					<text class="color-666 font-24">朝{{ formOptions['toward_localdata'][dataDic.toward]['text'] }}</text>
					<text class="color-666 font-24 m-lr-10">{{ formOptions['repair_mode_localdata'][dataDic.repair_mode]['text'] }}</text>
				</view>
				<view class="row-between-end align-self-stretch ">
					<view v-if="dataDic.sall_rent_type == 0" class="row-start-end">
						<text class="text-pricem">{{ dataDic.price }}</text>
						<!-- <text v-if="dataDic.strata_fee != 0" class="text-pricen m-lr-5">( 含物业费 )</text> -->
						<text class="text-pricen">/月</text>
					</view>
					<text v-if="dataDic.sall_rent_type == 1" class="text-pricen">{{ dataDic.price }}万</text>
					<uni-dateformat :date="dataDic.create_date" style="color: #999!important;font-size: 24rpx;" class="color-999 font-24" format="yyyy/MM/dd"></uni-dateformat>
				</view>
			</view>
		</view>
		<view v-if="edit" class="grid-three border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('change')">租售状态</text>
			<view class="row-center-center">
				<text v-if="dataDic.state == 30" class="text-center font-26 color-666 p-tb-10">违规</text>
				<text v-if="dataDic.state != 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('edit')">修改</text>
				<uni-icons type="info" color="red" size="19" @click="moreClick('err')"></uni-icons>
			</view>
		</view>
		<view v-if="admin" class="grid-two border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<text v-if="dataDic.state != 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('reject')">下架</text>
			<text v-if="dataDic.state == 30" class="text-center font-26 color-666 p-tb-10" @click="moreClick('resolve')">上架</text>
		</view>
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
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false
	}
});
const emit = defineEmits(['delete', 'change', 'edit', 'err', 'clear', 'reject','resolve']);
const dataDic = toRef(props, 'dataDic');
function switchImageSize(size = 300) {
	// 等比缩放
	if (dataDic.cover) {
		return dataDic.cover + `?x-oss-process=image/resize,h_${size},m_lfit`;
	} else {
		if (dataDic.value.images.length > 0) {
			return dataDic.value.images[0]['url'] + `?x-oss-process=image/resize,h_${size},m_lfit`;
		}
		return '/static/logo.png';
	}
}
// 跳转详情
function navToDetail() {
	if (dataDic.value.is_clear) {
		emit('clear', dataDic);
		return;
	}
	uni.navigateTo({
		url: '/pages/houseRent/detail?houseId=' + dataDic.value._id
	});
}
function moreClick(e) {
	emit(e, dataDic);
}
</script>

<style></style>
