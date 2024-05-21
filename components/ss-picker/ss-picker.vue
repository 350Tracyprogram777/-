<template>
	<view class="row-start-center" style="width:100%;height: 100%;">
		<picker class="w-100" :range="localdata" range-key="text" @change="changeVoid">
			<view class="row-start-center">
				<text v-if="localdata.length > 0" class="flex-grow">{{ localdata[selectIndex]['text'] }}</text>
				<text v-else class="flex-grow input_p">{{ placeholder }}</text>
				<uni-icons type="right" color="#999" size="15"></uni-icons>
			</view>
		</picker>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef, toRefs, watch } from 'vue';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';

const emit = defineEmits(['update:selectValue']);
const props = defineProps({
	localdata: {
		type: Array,
		default: () => []
	},
	selectValue: {
		type: [String, Number],
		default: 0
	},
	placeholder: {
		type: String,
		default: ''
	}
});
const selectIndex = computed(() => {
	const inx = props.localdata.findIndex(function(a, b) {
		return a.value == props.selectValue;
	});
	if (inx >= 0) {
		return inx;
	} else {
		return 0;
	}
});
function changeVoid(e) {
	emit('update:selectValue', props.localdata[e.detail.value]['value']);
}
</script>
<style></style>
