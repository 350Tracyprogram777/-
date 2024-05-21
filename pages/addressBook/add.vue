<template>
	<view class="">
		<view v-if="dataDic.state == 30 && dataDic.sys_msg" class="row-center-center p-tb-8">
			<text class=" iconfont icon-weiguitongzhi color-wain"></text>
			<text class="text-pricen m-l-5 font-26">{{ dataDic.sys_msg }}</text>
		</view>
		<view class="grid-one grid-gap-1" style="background-color: #f5f5f5;">
			<view class="row-start-center itemView">
				<text class="label  ">图片</text>
				<ss-upimage
					class="flex-grow"
					@remove="deleteImg"
					type="通讯录"
					maxCount="9"
					fixH="140"
					:canFile="false"
					:canVideo="false"
					wxType="image"
					v-model:mediaArr="dataDic.images"
					v-model:cover="dataDic.cover"
				></ss-upimage>
			</view>

			<view class="row-start-center itemView">
				<text class="label must">姓名</text>
				<input placeholder-class="inpu_p" v-model="dataDic.name" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="姓名/组织机构名" />
			</view>
			<view class="row-start-center itemView">
				<text class="label must">电话</text>
				<view class="row-between-center content_input flex-grow p-r-10">
					<input placeholder-class="inpu_p" v-model="dataDic.phone" class=" flex-grow p-lr-10" style="text-align: left;" placeholder="手机号/固话" />
					<uni-icons type="plus" size="22" color="#999" @click="addOtherPhone"></uni-icons>
				</view>
			</view>
			<view class="row-start-center itemView" v-for="(item, index) in dataDic.other" :key="index">
				<text class="label ">电话{{ index + 2 }}</text>
				<input placeholder-class="inpu_p" v-model="item.phone" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="手机号/固话" />
			</view>
			<view class="row-start-center itemView">
				<text class="label ">微信</text>
				<input placeholder-class="inpu_p" v-model="dataDic.wx" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="微信号" />
			</view>
			<view class="row-start-center itemView">
				<text class="label">备注</text>
				<input placeholder-class="inpu_p" v-model="dataDic.remark" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="备注" />
			</view>

			<view class="row-start-center itemView" @click="chooseMap">
				<text class="label">位置</text>
				<input
					placeholder-class="inpu_p"
					disabled
					v-model="dataDic.address_name"
					class="content_input flex-grow p-lr-10"
					style="text-align: left;"
					placeholder="选择位置"
				/>
				<uni-icons type="location-filled" class="m-t-3" color="#999"></uni-icons>
			</view>

			<view class="row-start-center itemView">
				<text class="label">公开</text>
				<!-- <ss-picker class="content_input content" :localdata="[{ text: '是', value: true }, { text: '否', value: false }]" v-model:selectValue="dataDic.open"></ss-picker> -->

				<uni-data-checkbox :localdata="[{ text: '是', value: true }, { text: '否', value: false }]" v-model="dataDic.open"></uni-data-checkbox>
			</view>

			<view class="row-start-center itemView">
				<text class="label must">分类</text>
				<uni-data-picker :clearIcon="false" :border="false"  class="flex-grow" :localdata="classArr"  v-model="dataDic.category_id"></uni-data-picker>
				<!-- <ss-picker v-model:selectValue="dataDic.category_id" class="content_input content" :localdata="classArr"></ss-picker> -->
			</view>
			<view v-if="dataDic._id" class="row-start-center itemView">
				<text class="label must">状态</text>
				<uni-data-checkbox :localdata="[{ text: '正常', value: 0 }, { text: '下架', value: 1 }]" v-model="dataDic.state"></uni-data-checkbox>
				
				<!-- <ss-picker class="content_input content" :localdata="[{ text: '正常', value: 0 }, { text: '下架', value: 1 }]" v-model:selectValue="dataDic.state"></ss-picker> -->
			</view>
		</view>
		<view style="height: 30rpx;"></view>
		<view class="row-center-center"><ss-yingsi ref="xieyi" :titleArr="['《用户服务协议和隐私政策》']"></ss-yingsi></view>
		<view class=" p-all-15">
			<view class="commit_bt " @click="commitVoid()"><text>确定</text></view>
		</view>
		<view class="row-center-center"><text class="themecolor">共同完善通讯录,让社区生活更方便</text></view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
import formOptions from '@/pages/addressBook/contant.js';
const userStore = useUserStore();
const addressBookApi = uniCloud.importObject('address-book');
const mediaApi = uniCloud.importObject('media');
const moreBt = ref(false);
const classArr = ref([]);
const userInfo = computed(() => userStore.userInfo);
const dataDic = ref({
	community_id: '',
	user_id: '',
	images: [],
	cover: '',
	sys_msg: '',
	name: '',
	phone: '',
	wx: '',
	other: [],
	remark: '',
	address: '',
	address_name: '',
	gps: { latitude: 0, longitude: 0 },
	state: 0,
	category_id: 0,
	create_date: '',
	open: true
});
onLoad(e => {
	getBaseData();
	if (e.addressId) {
		dataDic.value['_id'] = e.addressId;
		addressBookApi.doc(e.addressId).then(res => {
			if (res.errCode == 0) {
				Object.assign(dataDic.value, res.data);
			}
		});
	}
});

function getBaseData() {
	addressBookApi.getClass({ role: userInfo.value.role }).then(res => {
		classArr.value = res.data;
	});
}

// 提交
const ssAlert = ref();
const xieyi = ref();
function commitVoid() {
	if (!dataDic.value.name) {
		return msg('请输入姓名');
	}
	if (dataDic.value.phone.lenght == 11 || dataDic.value.phone.lenght >= 6) {
		return msg('请输入有效的电话');
	}
	if (!dataDic.value.category_id) {
		return msg('请选择分类');
	}
	if (!dataDic.value.state == 30) {
		return msg('严重违规,请联系客服');
	}
	if (!xieyi.value.isAgree) {
		return msg('请阅读并同意用户隐私服务协议');
	}

	dataDic.value.other = dataDic.value.other.filter(function(a, b) {
		if (a.phone.lenght == 11 || a.phone >= 6) {
			return true;
		}
	});

	if (dataDic.value._id) {
		addressBookApi.edit(dataDic.value).then(res => {
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
		addressBookApi.add(dataDic.value).then(res => {
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
	addressBookApi.edit(dic);
	mediaApi.remove([item]);
}
</script>

<style>
page {
	background-color: #f5f5f5;
}
.itemView {
	background-color: #fff;
	padding: 15rpx 30rpx;
}
.label {
	width: 160rpx;
	flex-shrink: 0;
}
.label::before {
	content: '*';
	color: #fff;
	/* // margin-right: 10rpx; */
}
.must {
	display: flex;
	/* // justify-content: center; */
	align-items: center;
}
.must::before {
	content: '*';
	color: red;
	/* // margin-right: 10rpx; */
}
.content {
	flex-grow: 1;
}
.content_input:hover {
	/* // border: 1px solid #007aff; */
}
.content_input {
	text-align: center;
	/* // border: 1px solid #eee; */
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
</style>
