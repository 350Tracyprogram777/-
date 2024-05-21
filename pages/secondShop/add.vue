<template>
	<view class="">
		<view v-if="dataDic.state == 30" class="row-center-center p-tb-8">
			<text class=" iconfont icon-weiguitongzhi color-wain"></text>
			<text class="text-pricen m-l-5 font-26">{{ dataDic.sys_msg }}</text>
		</view>
		<view class="grid-one grid-gap-1 p-all-10" style="background-color: #fafafa;">
			<textarea
				v-model="dataDic.content"
				placeholder="品牌型号,新旧程度,入手渠道,转手原因../求购需求."
				style="width: 100%;min-height: 400rpx;"
				class=" font-30"
				maxlength="-1"
			></textarea>

			<ss-upimage
				:canFile="false"
				:canVideo="false"
				class="flex-grow"
				@remove="deleteImg"
				type="二手市场"
				maxCount="9"
				fixH="40"
				v-model:mediaArr="dataDic.images"
				v-model:cover="dataDic.cover"
			></ss-upimage>

			<view class="row-start-center itemView ">
				<text class="label">发布类型</text>
				<uni-data-checkbox v-model="dataDic.model" mode="button" :localdata="[{ text: '出售', value: 0 }, { text: '求购', value: 1 }]"></uni-data-checkbox>
			</view>
			<view class="row-start-center itemView m-t-10" v-if="dataDic.model == 0">
				<text class="label">一口价</text>
				<input v-model="dataDic.price" type="digit" class="content_input flex-grow p-lr-10" placeholder-class="inpu_p" style="text-align: left;" placeholder="¥0 0为赠送" />
				<view class="row-end-center" @click="switchVoid" >
					<text class="color-666 font-26">置换</text>
					<uni-icons v-if="!dataDic.replacement.open" type="circle" color="#999" size="20"></uni-icons>
					<uni-icons v-else class="" type="checkbox-filled" color="#00755C" size="20"></uni-icons>
				</view>
			</view>
			<view class="row-start-center itemView m-t-10" v-if="dataDic.model == 1">
				<text class="label">求购价</text>
				<input v-model="dataDic.price" type="digit" class="content_input flex-grow p-lr-10" placeholder-class="inpu_p" style="text-align: left;" placeholder="¥0 0为商议" />
			</view>
			<view v-if="dataDic.replacement.open" class="row-start-center itemView ">
				<text class="label">置换</text>
				<input
					v-model="dataDic.replacement.content"
					placeholder-class="inpu_p"
					class="content_input flex-grow p-lr-10 "
					style="text-align: left;"
					placeholder="输入你想置换的物品"
				/>
			</view>
			<view v-if="dataDic.model == 0" class="row-start-center itemView ">
				<text class="label">发货方式</text>
				<uni-data-checkbox v-model="dataDic.trade_type" mode="button" :localdata="[{ text: '包邮', value: 0 }, { text: '自提', value: 1 }]"></uni-data-checkbox>
			</view>

			<view class="row-start-center itemView " @click="chooseMap">
				<text class="label">所在位置</text>
				<input
					disabled
					v-model="dataDic.address_name"
					placeholder-class="inpu_p"
					class="content_input flex-grow p-lr-10"
					style="text-align: left;"
					placeholder="选择位置"
				/>
				<uni-icons type="location-filled" class="m-t-3 m-r-4" size="20" color="#00755C"></uni-icons>
			</view>
			<view class="row-start-center itemView ">
				<text class="label">物品标签</text>
				<ss-superSelectView value="text" :localdata="contantStore.secondClassArr" class="flex-grow" v-model:selectArr="dataDic.tags"></ss-superSelectView>
			</view>
			<view class="row-start-center itemView">
				<text class="label ">联系方式</text>
				<text v-if="!selectPhone" class="flex-grow inpu_p" @click="navToAddress()">请选择联系方式</text>
				<view v-else class="row-start-center flex-grow">
					<text class="flex-grow text-maxline-one" @click="navToAddress()">{{ selectPhone.name }}</text>
					<text class="iconfont icon-shanchu color-666 font-36" @click="clearPhone"></text>
				</view>
				<uni-icons type="right"></uni-icons>
			</view>

			<view v-if="dataDic._id" class="row-start-center itemView ">
				<text class="label">当前状态</text>
				<!-- <ss-picker v-model:selectValue="dataDic.state" class="content_input content" :localdata="sallStateArr"></ss-picker> -->

				<uni-data-select :clear="false" class="flex-grow" :localdata="sallStateArr" v-model="dataDic.state"></uni-data-select>
			</view>
		</view>
		<view style="height: 30rpx;"></view>
		<view class="row-end-center p-lr-15"><text class="text-pricen font-30" @click="deleteVoid">删除</text></view>
		<view class=" p-all-15">
			<view class="commit_bt " @click="commitVoid()"><text>发布</text></view>
		</view>
		<view class="row-center-center"><text class="color-999">记录生活</text></view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useSystemStore,useContantStore } from '@/store';
const sallStateArr = [{ text: '出售/求购中', value: 0 }, { text: '暂停出售/求购', value: 1 }, { text: '已卖出/求购', value: 2 }];
const systemStore = useSystemStore();
const selectPhone = computed(() => systemStore.pageDic);
const contantStore=useContantStore()
const secondApi = uniCloud.importObject('second-shop');
const mediaApi = uniCloud.importObject('media');
const moreBt = ref(false);
const classArr = ref([]);
const dataDic = ref({
	user_id: '',
	images: [],
	tags: [],
	cover: '',
	sys_msg: '',
	price: '',
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
	model: 0,
	replacement: {
		open: false,
		content: ''
	},
	trade_type: 0, //0包邮 自提
	address_book_id: ''
});
onLoad(e => {
	// getBaseData();
	if (e.productId) {
		dataDic.value['_id'] = e.productId;
		getDetail();
	} else {
		systemStore.pageDic = '';
	}

	// getLocation()
});

function getDetail() {
	secondApi.doc(dataDic.value._id).then(res => {
		if (res.errCode == 0) {
			Object.assign(dataDic.value, res.data);
			if (dataDic.value.address_book_id) {
				systemStore.pageDic = res.data.phoneDic;
			}
		}
	});
}
function getBaseData() {
	secondApi.getClass({ role: true }).then(res => {
		classArr.value = res.data;
	});
}
function switchVoid() {
	dataDic.value.replacement.open = !dataDic.value.replacement.open;
}

// 提交
const ssAlert = ref();

function commitVoid() {
	if (dataDic.value.state == 30) {
		return msg('严重违规,请联系客服');
	}
	if (!dataDic.value.content) {
		return msg('请输入物品的描述');
	}
	if (dataDic.value.images.length == 0) {
		return msg('请上传物品图片');
	}
	if (dataDic.value.trade_type == 1 && !dataDic.value.address_name) {
		return msg('请选择物品所在的地址');
	}
	if (!selectPhone.value) {
		return msg('请选择联系方式');
	}
	if (selectPhone.value) {
		dataDic.value.address_book_id = selectPhone.value._id;
	}

	if (dataDic.value.tags.length == 0) {
		return msg('请选择标签');
	}

	
	if (!isNaN(dataDic.value.price) && dataDic.value.price>0) {
		dataDic.value.price = parseFloat(dataDic.value.price);
	} else {
		dataDic.value.price = 0;
	}
	
	if (dataDic.value._id) {
		secondApi.edit(dataDic.value).then(res => {
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
		secondApi.add(dataDic.value).then(res => {
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
	secondApi.edit(dic);
	mediaApi.remove([item]);
}
// 选择地址
function navToAddress() {
	uni.navigateTo({
		url: '/pages/newsArticle/selectAddressBook/selectAddressBook'
	});
}
// 删除电话
function clearPhone() {
	console.log('ppp');

	systemStore.pageDic = '';
}
// 获取位置信息
function getLocation() {
	if (!dataDic.value._id) {
		uni.getLocation({
			type: 'wgs84',
			success: function(res) {
				console.log('当前位置的经度：' + res);
				console.log('当前位置的经度：' + res.longitude);
				console.log('当前位置的纬度：' + res.latitude);
			}
		});
	}
}
// 删除
function deleteVoid() {
	ssAlert.value.showModalDic({
		show: true,
		title: '确定删除',
		confirmText: '删除',
		showCancel: true,
		content: '',
		success: e => {
			if (e.confirm) {
				secondApi.remove(dataDic.value._id).then(res => {
					uni.navigateBack();
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
