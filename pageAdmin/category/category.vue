<template>
	<view>
		<view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
			<ss-topTabar style="z-index: 10;" styleSet="3" widthNum="w-33" :tabarArr="tabarList" :topSelectIndex="topIndex" @tabSelect="changeTabIndex"></ss-topTabar>
		</view>
		<view class="grid-one grid-gap-1 m-t-10">
			<view @click="showAddPop(item)" class="grid-three p-all-15 bg-white align-items-center" style="justify-items: center;" v-for="(item, index) in dataArr" :key="item._id">
				<text>{{ item.name }}</text>
				<text>{{ item.sort }}</text>
				<text v-if="item.state == 0">在线</text>
				<text v-else>下线</text>
			</view>
		</view>

		<uni-fab :popMenu="false" horizontal="right" @fabClick="showAddPop"></uni-fab>
		<uni-popup ref="addPop">
			<view class="bg-white p-all-15 border-radius-15" style="width: 690rpx;">
				<view class="row-between-start">
					<text v-if="addDic._id" class="font-bold font-30">修改{{ tabarList[topIndex]['text'] }}</text>
					<text v-else class="font-bold font-30">新增{{ tabarList[topIndex]['text'] }}</text>
					<uni-icons @click="hideVoid" type="close" size="24" color="#999"></uni-icons>
				</view>
				<view class="grid-one grid-gap-1 m-t-10" style="background-color: #eee;">
					<view class="row-start-center bg-white p-tb-6 ">
						<text class="label">分类名称</text>
						<input class="inputclass" type="text" v-model="addDic.name" />
					</view>
					<view class="row-start-center bg-white p-tb-6">
						<text class="label">排序号</text>
						<input placeholder="越小越靠前" class="inputclass" type="number" v-model="addDic.sort" />
					</view>

					<view class="row-start-center bg-white p-tb-15">
						<text class="label">状态</text>
						<uni-data-checkbox v-model="addDic.state" :localdata="[{ text: '上线', value: 0 }, { text: '下线', value: 1 }]"></uni-data-checkbox>
					</view>
					<view class="row-start-center bg-white p-tb-15">
						<text class="label">权限</text>
						<uni-data-checkbox v-model="addDic.role" multiple :localdata="[{ text: '用户', value: 'user' }, { text: '物业', value: 'wuye' }]"></uni-data-checkbox>
					</view>
					<view v-if="curState == 4" @click="selectWxGroup" class="row-start-center bg-white p-tb-15">
						<text class="label">查看权</text>
						<view v-if="selectGroupArr.length>0" class="grid-three grid-gap-2 flex-grow">
							<!-- <text v-for="(item, index) in selectGroupArr" :key="index">{{ item.name }}</text> -->
							<uni-tag type="primary" v-for="(item,index) in selectGroupArr" :key="index" :text="item.name"></uni-tag>
						</view>
						<text v-else class="flex-grow color-999">设置后,只有通过微信群内的分享才能查看</text>
						<!-- <uni-data-checkbox v-model="addDic.role" multiple :localdata="[{ text: '用户', value: 'user' }, { text: '物业', value: 'wuye' }]"></uni-data-checkbox> -->

						<!-- <uni-data-checkbox :localdata="selectGroupArr" :map="{ text: 'name', value: '_id' }"></uni-data-checkbox> -->
					</view>
					<view class="commit_bt m-t-10" @click="commitVoid"><text>确定</text></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore,useSystemStore } from '@/store';


const adminApi = uniCloud.importObject('admin');
const dataArr = ref([]);
const tabarList = [
	{
		value: 1,
		text: '通讯录'
	},
	{
		value: 2,
		text: '社区圈'
	},
	{
		value: 3,
		text: '二手市场'
	},
	{
		value: 4,
		text: '资料库'
	},
	{
		value: 100,
		text: '微信群'
	}
];
const topIndex = ref(0);
const userStore = useUserStore();
const systemStore= useSystemStore()
const curState = computed(e => tabarList[topIndex.value]['value']);
const selectGroupArr = computed(e => systemStore.selectGroupArr);
function changeTabIndex(e) {
	topIndex.value = e.index;
	uni.startPullDownRefresh({});
}
onLoad(() => {
	setTimeout(function() {
		uni.startPullDownRefresh({});
	}, 200);
});
console.log('---', selectGroupArr.value);

onPullDownRefresh(() => {
	let dic = {};
	if (topIndex.value == 0) {
		dic = { pageIndex: 0, type: curState.value };
	} else {
		dic = { pageIndex: 0, type: curState.value };
	}
	adminApi.queryClass(dic).then(res => {
		dataArr.value = res.data;
		console.log(dataArr.value);
		uni.stopPullDownRefresh();
	});
});
onReachBottom(() => {
	let dic = {};
	if (topIndex.value == 0) {
		dic = { pageIndex: dataArr.value.length, type: curState.value };
	} else {
		dic = { pageIndex: dataArr.value.length, type: curState.value };
	}
	adminApi.queryClass(dic).then(res => {
		dataArr.value = dataArr.value.concat(res.data);
		uni.stopPullDownRefresh();
	});
});

// 新增
const addPop = ref();
const addDic = ref({
	type: curState.value,
	name: '',
	sort: 1000,
	state: 0,
	role: ['user']
});
function showAddPop(e) {
	if (e) {
		addDic.value = {
			type: curState.value,
			name: e.name,
			sort: e.sort,
			state: e.state,
			_id: e._id,
			role: e.role,
			wx_group: []
		};
	} else {
		addDic.value = {
			type: curState.value,
			name: '',
			sort: 1000,
			state: 0,
			role: ['user']
		};
	}
	console.log(addDic.value);
	// 清空微信圈选择的''
	if(curState.value==4)
	{
		systemStore.selectGroupArr=e?e.wx_group||[]:[]
		
		
	}

	addPop.value.open();
}
function commitVoid() {
	addDic.value.wx_group=selectGroupArr.value
	if (addDic.value._id) {
		adminApi.editClass(addDic.value).then(res => {
			uni.startPullDownRefresh({});
			hideVoid();
		});
	} else {
		adminApi.addClass(addDic.value).then(res => {
			uni.startPullDownRefresh({});
			hideVoid();
		});
	}
}
function hideVoid() {
	addPop.value.close();
}
// 选择微信权
function selectWxGroup() {
	uni.navigateTo({
		url: '/pageAdmin/category/selectWxGroup'
	});
}
</script>

<style>
.label {
	width: 160rpx;
}
.inputclass {
	height: 78rpx;
	border: 1rpx solid #eee;
	border-radius: 10rpx;
	padding: 0rpx 20rpx;
	flex-grow: 1;
}
</style>
