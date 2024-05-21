<template>
	<view class="">
		<view class="grid-one grid-gap-1" style="background-color: #f5f5f5;">
			<view class="row-start-center itemView">
				<text class="label  ">图片</text>
				<ss-upimage
					class="flex-grow"
					@remove="deleteImg"
					type="微信群"
					maxCount="1"
					fixH="140"
					:canFile="false"
					:canVideo="false"
					wxType="image"
					v-model:mediaArr="dataDic.images"
					v-model:cover="dataDic.cover"
				></ss-upimage>
			</view>

			<view class="row-start-center itemView">
				<text class="label">群ID</text>
				<input disabled v-model="dataDic.opengid" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="群id,自动获取" />
			</view>
			<view class="row-start-center itemView">
				<text class="label must">群名称</text>
				<input v-model="dataDic.name" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="姓名/组织机构名" />
			</view>

			<view class="row-start-center itemView">
				<text class="label">群介绍</text>
				<input v-model="dataDic.remark" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="群介绍" />
			</view>
			<view class="row-start-center itemView">
				<text class="label must">群主微信</text>
				<input v-model="dataDic.group_owner_wx" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="群主微信/方便他人进群" />
			</view>

			<view class="row-start-center itemView">
				<text class="label must">分类</text>
				<uni-data-picker mode="tag" v-model="dataDic.category_id" class="content" :localdata="classArr"></uni-data-picker>
			</view>
		</view>
		<view class=" p-all-15">
			<view class="row-end-center m-tb-5"><text @click="delectVoid" class="font-bold" style="color: red;">删除</text></view>
			<view class="commit_bt " @click="commitVoid()"><text>确定</text></view>
		</view>
		<view class="row-center-center"><text class="themecolor">微信群认证,让信息有边界</text></view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore } from '@/store';
const userStore = useUserStore();
const systemStore = useSystemStore();

const wxGroupkApi = uniCloud.importObject('wx-group');
const wxApi = uniCloud.importObject('wxapi');
const mediaApi = uniCloud.importObject('media');
const classArr = ref([]);
const userInfo = computed(() => userStore.userInfo);
const dataDic = ref({
	community_id: '',
	user_id: '',
	images: [],
	cover: '',
	sys_msg: '',
	name: '',
	remark: '',
	state: 0,
	category_id: 0,
	create_date: '',
	opengid: '',
	group_owner_wx: '' //群主微信
});
onLoad(e => {
	console.log('-------', userInfo.value._id, userInfo.value.role.includes('communityAdmin'));
	if (userInfo.value._id && userInfo.value.role.includes('communityAdmin')) {
		if (e.groupId) {
			dataDic.value['_id'] = e.groupId;
			getDetail();
		} else {
			getWxGroup();
		}

		getBaseData();
	} else {
		uni.switchTab({
			url: '/pages/tabar/main'
		});
	}
});

function getBaseData() {
	wxGroupkApi.getClass({ role: userInfo.value.role }).then(res => {
		classArr.value = res.data;
	});
}
function getDetail() {
	wxGroupkApi.doc(dataDic.value._id).then(res => {
		Object.assign(dataDic.value, res.data);
	});
}
// 获取群标识
function getWxGroup() {
	systemStore.getWxGroup().then(res => {
		console.log('微信圈', res);
		dataDic.value.opengid = res;
	});
}

// 提交
const ssAlert = ref();
const xieyi = ref();
function commitVoid() {
	if (!dataDic.value.name) {
		return msg('请输入群名称');
	}
	if (!dataDic.value.remark) {
		return msg('请输入群说明');
	}
	if (!dataDic.value.group_owner_wx) {
		return msg('请输入群主微信');
	}
	if (!dataDic.value.category_id) {
		return msg('请选择分类');
	}

	if (dataDic.value._id) {
		wxGroupkApi.edit(dataDic.value).then(res => {
			ssAlert.value.showModalDic({
				show: true,
				title: '修改成功',
				confirmText: '确定',
				showCancel: false,
				content: '',
				success: e => {
					if (e.confirm) {
						uni.redirectTo({
							url: '/pageAdmin/wxGroup/list'
						});
					}
				}
			});
		});
	} else {
		wxGroupkApi.add(dataDic.value).then(res => {
			ssAlert.value.showModalDic({
				show: true,
				title: '提交成功',
				confirmText: '确定',
				showCancel: false,
				content: '',
				success: e => {
					if (e.confirm) {
						uni.redirectTo({
							url: '/pageAdmin/wxGroup/list'
						});
					}
				}
			});
		});
	}
}

// 删除图片
function deleteImg(e) {
	const item = dataDic.value.images[e];
	dataDic.value.images.splice(e, 1);
	if (dataDic.value.cover == item.url) {
		msg('封面图也被删除了');
	}
	const dic = {
		cover: dataDic.value.cover,
		images: dataDic.value.images,
		_id: dataDic.value._id
	};
	wxGroupkApi.edit(dic);
	mediaApi.remove([item]);
}
// 删除
function delectVoid() {
	ssAlert.value.showModalDic({
		show: true,
		title: '删除',
		confirmText: '确定',
		showCancel: true,
		cancelText: '取消',
		content: '',
		success: res => {
			if (res.confirm) {
				wxGroupkApi.remove(dataDic.value._id).then(res => {
					msg('删除成功');
					setTimeout(function() {
						uni.navigateBack();
					}, 300);
				});
			}
		}
	});
}
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
	// padding: 20rpx;
}
.itemView {
	background-color: #fff;
	padding: 15rpx 30rpx;
}
.label {
	width: 160rpx;
	flex-shrink: 0;
	// text-align: center;
}
.label::before {
	content: '*';
	color: #fff;
	// margin-right: 10rpx;
}
.must {
	display: flex;
	// justify-content: center;
	align-items: center;
}
.must::before {
	content: '*';
	color: red;
	// margin-right: 10rpx;
}
.content {
	flex-grow: 1;
}
.content_input:hover {
	// border: 1px solid #007aff;
}
.content_input {
	text-align: center;
	// border: 1px solid #eee;
	height: 76rpx;
	border-radius: 10rpx;
	font-weight: 400;
}

.twoText {
	width: 66rpx;
	text-align: center;
	font-size: 26rpx;
}
.uni-data-checklist .checklist-group {
	flex-wrap: nowrap !important;
}
.set_s {
	border: 2rpx solid #007aff;
	border-radius: 10rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column nowrap;
	padding: 12rpx;
	text {
		font-size: 20rpx;
		margin-top: 8rpx;
		color: #666;
	}
}
.set_n {
	border: 2rpx solid #ccc;
	border-radius: 10rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column nowrap;
	padding: 12rpx;

	text {
		font-size: 20rpx;
		margin-top: 8rpx;
		color: #666;
	}
}
</style>
