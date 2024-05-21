<template>
	<view class="">
		<view v-if="dataDic.state == 30" class="row-center-center p-tb-8">
			<text class=" iconfont icon-weiguitongzhi color-wain"></text>
			<text class="text-pricen m-l-5 font-26">{{ dataDic.sys_msg }}</text>
		</view>
		<view class="grid-one grid-gap-1 p-all-10" style="background-color: #fafafa;">
			<textarea v-model="dataDic.content" placeholder="资料介绍/资料来源/查看密码如何获取" style="width: 100%;min-height: 400rpx;" class=" font-30" maxlength="-1"></textarea>

			<ss-upimage
				class="flex-grow"
				@remove="deleteImg"
				type="资料库"
				maxCount="18"
				fixH="40"
				:showDocStyle="true"
				v-model:mediaArr="dataDic.images"
				v-model:cover="dataDic.cover"
			></ss-upimage>
			<!-- <view class="row-start-center itemView m-t-10" @click="chooseMap">
				<text class="label">位置</text>
				<input disabled v-model="dataDic.address_name" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="选择位置" />
				<uni-icons type="location-filled" class="m-t-3 m-r-4" size="20" color="#00755C"></uni-icons>
			</view> -->

			<view class="row-start-center itemView">
				<text class="label must">资料分类</text>
				<uni-data-picker :clearIcon="false" :border="false" mode="tag" v-model="dataDic.category_id" class="content" :localdata="classArr"></uni-data-picker>
			</view>
			<view class="row-start-center itemView">
				<text class="label ">查看密码</text>
				<input v-model="dataDic.password" placeholder="设置后,查看详情与下载需要输入密码" class="font-28 flex-grow" />
			</view>
			<view v-if="dataDic.password.length > 6" class="row-start-center itemView">
				<text class="label ">密码提示</text>
				<input v-model="dataDic.password_msg" placeholder="请输入获取密码的途径" class="font-28 flex-grow" />
			</view>
			<view class="row-start-center itemView">
				<text class="label ">联系方式</text>
				<text v-if="!selectPhone" class="flex-grow color-999 font-28" @click="navToAddress()">请选择联系方式</text>
				<view v-else class="row-start-center flex-grow">
					<text class="flex-grow text-maxline-one" @click="navToAddress()">{{ selectPhone.name }}</text>
					<text class="iconfont icon-shanchu color-999 font-32" @click="clearPhone"></text>
				</view>
				<uni-icons type="right"></uni-icons>
			</view>
			<!-- <view  class="row-start-center itemView ">
				<view class="row-start-center flex-grow">
					<text class="">匿名发布</text>
					<uni-icons type="info" color="#999" size="14" @click="msg('匿名将不显示您的头像与昵称')"></uni-icons>
				</view>
				<switch style="scale: 0.7;" :checked="dataDic.hider" @change="hideChange"></switch>
			</view> -->
		</view>
		<view style="height: 30rpx;"></view>
		<view class=" p-all-15">
			<view class="commit_bt " @click="commitVoid()"><text>发布</text></view>
		</view>
		<view class="row-center-center"><text class="color-999">共建社区资料库</text></view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore } from '@/store';
const docApi = uniCloud.importObject('user-doc');
const mediaApi = uniCloud.importObject('media');
const moreBt = ref(false);
const classArr = ref([]);
const userStore = useUserStore();
const systemStore = useSystemStore();

const selectPhone = computed(() => systemStore.pageDic);
const dataDic = ref({
	user_id: '',
	hider: false,
	images: [],
	cover: '',
	sys_msg: '',
	content: '',
	category_id: '',
	author: '', //作者
	view_count: 0, //阅读数量
	like_count: 0, //点赞量
	is_sticky: false, //是否置顶
	address: '',
	address_name: '',
	gps: { latitude: 0, longitude: 0 },
	state: 0,
	create_date: 0,
	mode: 1,
	address_book_id: '',
	password: '',
	password_msg: ''
});
onLoad(e => {
	getBaseData();
	if (e.docId) {
		dataDic.value['_id'] = e.docId;
		getDetail();
	}
	systemStore.pageDic = '';
});

function getDetail() {
	docApi.doc(dataDic.value._id).then(res => {
		console.log(res);
		if (res.errCode == 0) {
			Object.assign(dataDic.value, res.data);
		}
	});
}
function getBaseData() {
	docApi.getClass().then(res => {
		classArr.value = res.data;
	});
}

// 提交
const ssAlert = ref();

function commitVoid() {
	if (!dataDic.value.content) {
		return msg('请输入资料的介绍');
	}
	if (!dataDic.value.category_id) {
		return msg('请选择分类');
	}
	dataDic.value.password = dataDic.value.password.trim();
	dataDic.value.password_msg = dataDic.value.password_msg.trim();

	if (dataDic.value.password && !dataDic.value.password_msg) {
		return msg('请输入获取密码的提示');
	}

	if (selectPhone.value) {
		dataDic.value.address_book_id = selectPhone.value._id;
	}

	if (dataDic.value._id) {
		docApi.edit(dataDic.value).then(res => {
			ssAlert.value.showModalDic({
				show: true,
				title: '修改成功',
				confirmText: '确定',
				showCancel: false,
				content: '',
				success: e => {
					if (e.confirm) {
						uni.navigateBack();
					}
				}
			});
		});
	} else {
		docApi.add(dataDic.value).then(res => {
			ssAlert.value.showModalDic({
				show: true,
				title: '提交成功',
				confirmText: '确定',
				showCancel: false,
				content: '',
				success: e => {
					if (e.confirm) {
						uni.navigateBack();
					}
				}
			});
		});
	}
}

// 选择位置
function chooseMap() {
	uni.chooseLocation({
		success: function(e) {
			console.log(e);
			dataDic.value.address = e.address;
			dataDic.value.address_name = e.name;
			dataDic.value.gps['latitude'] = e.latitude;
			dataDic.value.gps['longitude'] = e.longitude;
		}
	});
}
// 添加其他号码
function addOtherPhone() {
	dataDic.value.other.push({ phone: '', name: '' });
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
	docApi.edit(dic);
	mediaApi.remove([item]);
}
// 是否匿名发布
function hideChange(e) {
	dataDic.value.hider = e.detail.value;
}
// 选择地址
function navToAddress() {
	if (selectPhone.value) {
		uni.navigateTo({
			url: '/pages/newsArticle/selectAddressBook/selectAddressBook'
		});
		return;
	}
	ssAlert.value.showModalDic({
		show: true,
		title: '添加联系方式后,其他人将可以联系到您',
		confirmText: '确定',
		showCancel: true,
		content: '',
		success: e => {
			if (e.confirm) {
				uni.navigateTo({
					url: '/pages/newsArticle/selectAddressBook/selectAddressBook'
				});
			}
		}
	});
}
// 删除电话
function clearPhone() {
	console.log('ppp');
	systemStore.pageDic = '';
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
	border: none !important;
}
.content_input:hover {
	border: 0px solid #007aff;
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
