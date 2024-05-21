<template>
	<view class="" style="border-radius: inherit;"><image style="background-color: #fafafa;border-radius: inherit;" :src="src_path" :style="{ width: props.width + 'rpx', height: props.height + 'rpx' }"></image></view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const props = defineProps({
	src: {
		type: String,
		default: ''
	},
	width: {
		type: String,
		default: ''
	},
	height: {
		type: [String, Number],
		default: ''
	},
	size: {
		type: String,
		default: '200'
	}
});
const src_path = computed(() => {
	if (props.src.indexOf('http') >= 0) {
		console.log(props.src)
		return props.src+ `?x-oss-process=image/resize,h_${props.size},m_lfit`;
	} else {
		return props.src
	}
});
</script>

<style></style>
