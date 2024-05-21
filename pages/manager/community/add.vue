<template>
	<view>
		<view class="grid-one grid-gap-1">
			<view class="row-between-center p-all-12 ">
				<text style="width: 150rpx;">姓名</text>
				<input class="flex-grow" type="text" v-model="serverDic.contacts" placeholder="请输入姓名" />
			</view>
			<view class="row-between-center p-all-12">
				<text style="width: 150rpx;">手机号</text>
				<input class="flex-grow" type="text" v-model="serverDic.phone" placeholder="请输入手机号" />
			</view>
			<textarea v-model="serverDic.remark" class="p-all-10 w-100 font-28" style="background-color: #f5f5f5;" placeholder="说些什么吧"></textarea>
			<view class="row-start-center p-all-12">
				<text class="">选择小区</text>
				<view class="column-center-end flex-grow m-lr-10  align-self-stretch" @click="chooseMap">
					<text class="font-bold">{{serverDic.address_name}}</text>
					<text class="font-24 color-999">{{serverDic.address}}</text>
				</view>
				<uni-icons type="right" size="20"></uni-icons>
			</view>
			<view class="commit_bt m-all-15" @click="commitVoid"><text>提交</text></view>
		</view>
		<view class="p-all-12 grid-one grid-gap-5">
			<text>1.认领成功后,您将成为该小区的管理员,负责该小区所有信息的审核</text>
			<text>2.您可指定5人与您共同管理该小区</text>
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const community_cloud = uniCloud.importObject('community');

const serverDic = ref({
	remark: '',
	address_name: '',
	address: '',
	phone: '',
	contacts: '',
	members: [],
	state: 0,
	sys_msg: '',
	cover: '',
	images: [],
	gps: {
		latitude: '',
		longitude: ''
	}
});
// 提交
const ssAlert = ref();
function commitVoid() {
	console.log(serverDic.value);
	if (!serverDic.value.contacts) {
		return msg('请输入姓名');
	}
	if (serverDic.value.phone.length != 11) {
		return msg('请输入手机号');
	}
	if (!serverDic.value.remark) {
		return msg('请输入认领的理由');
	}
	if (!serverDic.value.address_name) {
		return msg('请选择要认领的小区');
	}
	community_cloud.add(serverDic.value).then(res => {
		ssAlert.value.showModalDic({
			show: true,
			title: '提交成功',
			confirmText: '确定',
			showCancel: false,
			content: '请耐心等待系统审核',
			success: e => {
				if (e.confirm) {
					uni.navigateBack();
				}
			}
		});
	});
}
// 选择位置
function chooseMap() {
	console.log(333)
	uni.chooseLocation({
		success: function(e) {
			console.log(e);
			serverDic.value.address = e.address;
			serverDic.value.address_name = e.name;
			serverDic.value.gps['latitude'] = e.latitude;
			serverDic.value.gps['longitude'] = e.longitude;
		},
		fail:function(err){
			console.log(err)
			
		}
	});
}
</script>

<style>
page {
	background-color: #fff;
}
</style>
