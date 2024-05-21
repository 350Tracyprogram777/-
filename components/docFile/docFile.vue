<template>
	<view>
		<!-- 微头条 -->
		<view class="grid-one  p-lr-10 p-t-10 grid-gap-5 border-radius-5">
			<view v-if="dataDic.author_user && !dataDic.hider" class="row-start-center">
				<image :src="dataDic.author_user.avatar" style="width: 66rpx;height: 66rpx;border-radius: 33rpx;" class="flex-shrink bg-color"></image>
				<view class="column-between-start m-lr-10 align-self-stretch flex-grow">
					<text class="font-26 flex-grow color-555 ">{{ dataDic.author_user.nickname }}</text>
					<uni-dateformat :date="dataDic.create_date" :threshold="[0, 24 * 3600 * 1000 * 3]" format="yyyy/MM/dd" style="color: #999;font-size: 22rpx;"></uni-dateformat>
				</view>
				<text v-if="dataDic.address_book_id" @click.stop="navToAddressBook()" class="iconfont icon-dianhua themecolor flex-shrink" style="font-size: 36rpx;"></text>
			</view>
			<!-- 	<view class="row-between-center p-b-10" style="border-bottom:1px solid #eee;">
				<text class="font-26 color-666">文件数量:{{ dataDic.images.length }}</text>
				<uni-dateformat class="flex-shrink m-l-10" :date="dataDic.create_date" format="yyyy/MM/dd" style="color: #999;font-size: 24rpx;"></uni-dateformat>
			</view> -->

			<!-- @click="navToDetail()" -->
			<view class="row-between-start" @click.stop="navToDetail">
				<text :class="['contentClass', detail ? 'text-autoline' : 'text-maxline-three']">{{ dataDic.content }}</text>
			</view>
			<ss-sub-meida
				:maxShowNum="3"
				:fileShowAll="detail"
				:showDocStyle="true"
				:mediaArr="dataDic.images"
				:password="dataDic.password"
				:password_msg="dataDic.password_msg"
			></ss-sub-meida>

			<!-- 点赞与分享 收藏 -->
			<view v-if="!edit && !admin && dataDic._id" class="grid-four ">
				<view class="row-center-center p-tb-8" @click="reportVoid()">
					<text class="iconfont icon-jubao " style="font-size: 18px;"></text>
					<text class="font-26 m-l-3 color-555">反馈</text>
				</view>
				<view class="row-center-center p-tb-8 p_r" @click="moreClick('share')">
					<text class="iconfont icon-fenxiang1 " style="font-size: 18px;"></text>
					<text class="font-26 m-l-3 color-555">分享</text>
					<button class="nbt p_a_all p_a" open-type="share"></button>
				</view>
				<view class="row-center-center p-tb-8" @click="moreClick('zan')">
					<text v-if="dataDic.zan.length == 0" class="iconfont icon-31dianzan font-40"></text>
					<text v-else class="iconfont icon-dianzan_kuai color-zan" style="font-size: 18px;"></text>
					<!-- <text class="font-26 m-l-3 color-555">点赞</text> -->
					<text class="font-26 m-l-3 color-555">{{ dataDic.like_count }}</text>
				</view>
				<view class="row-center-center p-tb-8" @click="moreClick('collect')">
					<text v-if="dataDic.collect.length == 0" class="iconfont icon-shoucang font-40"></text>
					<text v-else class="iconfont icon-shoucang1  color-zan" style="font-size: 18px;"></text>
					<text class="font-26 m-l-3 color-555">收藏</text>
				</view>
			</view>
		</view>

		<view v-if="edit" class="grid-three border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<view class="row-center-center p-tb-8" @click="moreClick('delete')">
				<uni-icons type="trash" color="#555" size="18"></uni-icons>
				<text class="font-26 m-l-3 color-555">删除</text>
			</view>
			<view class="row-center-center">
				<uni-icons type="compose" color="#555" size="18"></uni-icons>
				<text class="text-center m-l-3 font-26 color-666 p-tb-10" @click="moreClick('edit')">修改</text>
				<uni-icons v-if="dataDic.state == 30" type="info" color="red" size="19" @click="moreClick('err')"></uni-icons>
			</view>
			<view class="row-center-center p-tb-8 p_r" @click="moreClick('share')">
				<uni-icons type="redo" color="#555" size="18"></uni-icons>
				<text class="font-26 m-l-3 color-555">分享</text>
				<button open-type="share" class="nbt p_a_all p_a"></button>
			</view>
		</view>
		<view v-if="admin" class="grid-two border  " style="border-radius: 0rpx 0rpx 10rpx 10rpx;">
			<text class="text-center font-26 color-666 p-tb-10" @click="moreClick('delete')">删除</text>
			<text v-if="dataDic.state == 0" class="text-center font-26 color-666 p-tb-10" @click="moreClick('reject')">下架</text>
			<text v-else class="text-center font-26 color-666 p-tb-10" @click="moreClick('resolve')">上架</text>
		</view>

		<!-- 新增举报 -->
		<uni-popup ref="addPop">
			<view class="bg-white   border-radius-10 p-all-10" style="width: 690rpx;">
				<view class="row-between-center p-tb-10">
					<text class="font-bold">反馈</text>
					<uni-icons @click="hidePop" type="close" color="#999" size="20"></uni-icons>
				</view>
				<view class="row-start-center contentView ">
					<textarea
						v-model="reportDic.content"
						class=" flex-grow p-lr-10 p-tb-5 font-28"
						style="text-align: left;background-color: #fafafa;height: 140rpx;"
						placeholder="请输入要反馈的信息"
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
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
;
const reportCenterApi = uniCloud.importObject('report-center');

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
	},
	report: {
		type: Boolean,
		default: true
	},
	detail: {
		type: Boolean,
		default: false
	}
});
const emit = defineEmits(['share', 'zan', 'collect', 'err', 'report', 'clear', 'reject', 'resolve']);
const dataDic = toRef(props, 'dataDic');
const detail = toRef(props, 'detail');

// 跳转详情
function navToDetail() {
	if (!detail.value) {
		uni.navigateTo({
			url: '/pageDoc/detail?docId=' + dataDic.value._id + '&classId=' + dataDic.value.category_id + '&isEdit=1'
		});
	}
}
function moreClick(e) {
	emit(e, dataDic);
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
// 举报
const addPop = ref();
const reportDic = ref({ content: '' });
function reportVoid() {
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
		uni_data: dataDic.value,
		type: '文章',
		user_id: userInfo.value._id
	};
	reportCenterApi.add(dic);
}
// 去看通讯录
function navToAddressBook() {
	uni.navigateTo({
		url: '/pages/addressBook/detail?bookId=' + dataDic.value.address_book_id
	});
}
</script>

<style>
.contentClass {
	font-size: 28rpx;
	line-height: 50rpx;
	color: #222;
}
</style>
