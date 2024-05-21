<template>
	<view class="">
		<view class="row-start-center w-100" @click="showPop">
			<view class="grid-three flex-grow" v-if="selectArr.length > 0">
				<text class="selectItem-s" v-for="(item, index) in showTextArr" :key="index">{{ item }}</text>
			</view>
			<view class="row-start-center flex-grow" v-else>
				<text class="selectItem-n flex-grow" style="background-color: #fff;text-align: left;color: #aaa;font-size: 26rpx;">选择标签</text>
			</view>
			<uni-icons type="right" color="#999" size="15"></uni-icons>
		</view>

		<uni-popup ref="selectPop" type="bottom">
			<view class="w-100">
				<view class="row-between-center p-tb-15 p-lr-12" style="border-radius: 30rpx 30rpx 0rpx 0rpx;background-color: #eee;">
					<text class="color-999" @click="hidePop">取消</text>
					<text class="font-34 font-bold">选择标签({{ labelNum }})</text>
					<text class="themecolor" style="color: #6bda82;" @click="sureVoid">确定</text>
				</view>
				<view class="grid-four  bg-white" style="padding: 40rpx 30rpx;">
					<text @click="selectItem(item)" :class="item.isSelect ? 'selectItem-s' : 'selectItem-n'" v-for="(item, index) in dataList" :key="index">{{ item.text }}</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef, watch, watchEffect } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
import { array } from 'js-md5';
const props = defineProps({
	selectArr: {
		type: Array,
		default: () => []
	},
	maxNum: {
		type: Number,
		default: 3
	},
	localdata: {
		type: Array,
		default: () => []
	},
	value: {
		type: String,
		default: 'value'
	}
});
const emit = defineEmits(['update:selectArr']);
const dataList = ref([]);
const showTextArr = ref([]);

watch(() => {
	dataList.value = props.localdata;

	for (let item of dataList.value) {
		const isselect = props.selectArr.findIndex(function(a, b) {
			return a == item[props.value];
		});
		if (isselect >= 0) {
			if (!showTextArr.value.includes(item['text'])) {
				showTextArr.value.push(item['text']);
			}

			item.isSelect = true;
		} else {
			if (showTextArr.value.includes(item['text'])) {
				const inx = showTextArr.value.findIndex(function(a, b) {
					return a == item['text'];
				});
				showTextArr.value.splice(inx, 1);
			}
			item.isSelect = false;
		}
	}
});
const temSelectArr = computed(() => {
	return dataList.value.filter(function(a, b) {
		return a.isSelect;
	});
});
const labelNum = computed(() => {
	return temSelectArr.value.length + '/' + props.maxNum;
});

// const showArr = computed(() => {
// 	let arr = [];
// 	for (let item of dataList.value) {
// 		const isselect = props.selectArr.findIndex(function(a, b) {
// 			return a == item[props.value];
// 		});
// 		if (isselect >= 0) {
// 			console.log('ppppppppppp', item);
// 			item.isSelect = true;

// 			arr.push(item['text']);
// 		} else {
// 			item.isSelect = false;
// 		}
// 	}
// 	return arr;
// });

function selectItem(item) {
	if (temSelectArr.value.length < props.maxNum || item.isSelect) {
		item.isSelect = !item.isSelect;
	}
}
function sureVoid() {
	let arr = [];
	for (let item of dataList.value) {
		if (item.isSelect) {
			arr.push(item[props.value]);
		}
	}
	console.log(arr);
	emit('update:selectArr', arr);
	selectPop.value.close();
}
const selectPop = ref();
function showPop() {
	selectPop.value.open();
}
function hidePop() {
	selectPop.value.close();
}
</script>

<style>
.selectItem-s {
	background-color: #ebf9ea;
	padding: 20rpx 10rpx;
	border-radius: 5px;
	font-size: 15px;
	color: #6bda82;
	text-align: center;
}

.selectItem-n {
	background-color: #f7f7f7;
	padding: 20rpx 10rpx;
	border-radius: 5px;
	font-size: 15px;
	text-align: center;
	color: #333;
}
</style>
