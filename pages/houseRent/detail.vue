<template>
	<view class="">
		<view v-if="dataDic.price">
			<swiper :autoplay="!playState" class=" " circular="true" duration="400" autoplay style="height: 750rpx;background-color: #f5f5f5;">
				<swiper-item class="w-100 " v-for="(item, index) in dataDic.images" :key="index">
					<image v-if="item.fileType == 'image'" :src="switchImageSize(item.url)" class="w-100" style="width: 750rpx;height: 750rpx;" @click="prewImg(index)"></image>
					<view class="p_r column-center-center" v-if="item.fileType == 'video'" @click="playVideo(item.url)">
						<image :src="switchVideoSize(item.url)" :style="{ width: width, height: height }" class="bg-color border-radius-4"></image>
						<text class="p_a iconfont icon-icon_video color-666" style="font-size: 30px;"></text>
					</view>
				</swiper-item>
			</swiper>
			<!-- 租售信息 -->
			<view class="p-lr-15 p-tb-12 bg-white">
				<view class="row-start-center">
					<text v-if="dataDic.sall_rent_type == 1" class="font-bold flex-shrink font-32">出售&ensp;·&ensp;</text>
					<view v-if="dataDic.sall_rent_type == 0" class="flex-shrink">
						<text v-if="dataDic.rent_type == 0" class="font-bold font-32">整租&ensp;·&ensp;</text>
						<text v-if="dataDic.rent_type == 1" class="font-bold font-32">合租&ensp;·&ensp;</text>
					</view>
					<text class="text-maxline-one font-bold font-32">{{ dataDic.address_name }}</text>
				</view>

				<view class="row-start-end m-t-5">
					<view v-if="dataDic.sall_rent_type == 0" class="row-start-end">
						<text class="text-pricem font-bold font-32" style="font-weight: bold;">{{ dataDic.price }}</text>
						<text class="text-pricen">/月</text>
					</view>
					<text v-if="dataDic.sall_rent_type == 1" class="text-pricen">{{ dataDic.price }}万</text>
				</view>
			</view>

			<!-- 租售信息 -->
			<!-- 租售信息 -->
			<view class="grid-one bg-white p-all-10 m-tb-10">
				<text class=" color-333 font-bold">租售信息</text>
				<view class="grid-three " style="justify-items: center;grid-gap:1rpx;background-color: #eee;">
					<view class="column-center-center itemView">
						<text class="text_one">{{ dataDic.price }}</text>
						<text v-if="dataDic.sall_rent_type == 0" class="text_two">月租金(元)</text>
						<text v-if="dataDic.sall_rent_type == 1" class="text_two">售价(万)</text>
					</view>

					<view v-if="dataDic.sall_rent_type == 0" class="column-center-center itemView">
						<text class="text_one" v-if="dataDic.rent_duration_type == 1">长期</text>
						<text class="text_one" v-if="dataDic.rent_duration_type == 0">{{ dataDic.rent_duration }}</text>
						<text class="text_two">可租时长(月)</text>
					</view>

					<view v-if="dataDic.sall_rent_type == 0" class="column-center-center itemView">
						<text class="text_one">{{ dataDic.rent_pay_cycle }}</text>
						<text class="text_two">付款周期</text>
					</view>
					<view v-if="dataDic.sall_rent_type == 1" class="column-center-center itemView">
						<text class="text_one">{{ dataDic.sall_pay_cycle }}</text>
						<text class="text_two">结算方式</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ dataDic.strata_fee }}</text>
						<text class="text_two">物业费(¥/m²)</text>
					</view>
					<view class="column-center-center itemView">
						<text v-if="dataDic.have_car == 0" class="text_one">无车位</text>
						<text v-else class="text_one">无车位</text>
						<text class="text_two">车位(元/月)</text>
					</view>
					<view class="column-center-center itemView">
						<uni-dateformat class="text_one" style="font-size:24rpx;" :date="dataDic.create_date" format="yyyy/MM/dd"></uni-dateformat>
						<text class="text_two">发布时间</text>
					</view>
				</view>
			</view>

			<!-- 租售信息 -->
			<view class="grid-one bg-white p-all-10 m-tb-10">
				<text class=" color-333 font-bold">房屋信息</text>
				<view class="grid-three " style="justify-items: center;grid-gap:1rpx;background-color: #eee;">
					<view class="column-center-center itemView">
						<text class="text_one">{{ dataDic.house_room + '室' + dataDic.house_play + '厅' + dataDic.house_toilet + '卫' }}</text>
						<text class="text_two">户型</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ dataDic.area }}m²</text>
						<text class="text_two">面积</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ formOptions['toward_localdata'][dataDic.toward]['text'] }}</text>
						<text class="text_two">朝向</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ dataDic.floor }}/{{ dataDic.total_floor }}</text>
						<text class="text_two">层高</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ dataDic.elevator }}梯{{ dataDic.family }}户</text>
						<text class="text_two">电梯配置</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ formOptions['repair_mode_localdata'][dataDic.repair_mode]['text'] }}</text>
						<text class="text_two">装修程度</text>
					</view>
					<view class="column-center-center itemView">
						<text class="text_one">{{ formOptions['life_type_localdata'][dataDic.life_type]['text'] }}</text>
						<text class="text_two">水电煤</text>
					</view>
					<!-- 占位 -->
					<view class="column-center-center itemView">
						<!-- <text class="text_one">{{ dataDic.strata_fee }}</text>
					<text class="text_two">物业费(¥/m²)</text> -->
					</view>
					<!-- 占位 -->
					<view class="column-center-center itemView">
						<!-- <text class="text_one">{{ dataDic.strata_fee }}</text>
					<text class="text_two">物业费(¥/m²)</text> -->
					</view>
				</view>
			</view>
			<view class="grid-one bg-white p-all-10 m-tb-10">
				<text class=" color-333 font-bold">房屋配置</text>
				<view v-if="dataDic.house_set.length >= 0" class="grid-five grid-gap-10 m-t-10">
					<view @click="selectSetItem(item)" class="column-center-center" v-for="(item, index) in dataDic.house_set" :key="index">
						<text :class="['iconfont', item.value]" style="font-size: 50rpx;color: #666;"></text>

						<text class=" color-333 m-t-5">{{ item.text }}</text>
					</view>
				</view>
				<view v-if="dataDic.house_set.length == 0" class="grid-five grid-gap-8"><text class="color-999">无</text></view>
			</view>
			<view class="grid-one bg-white p-all-10 m-tb-10">
				<text class=" color-333 font-bold">房东留言</text>
				<view class=" ">
					<text class="color-333">{{ dataDic.remark || '无' }}</text>
				</view>
			</view>
			<view class="grid-one bg-white p-all-10 m-tb-10">
				<view class="row-between-center">
					<text class=" color-333 font-bold">位置信息</text>
					<uni-icons @click="openMap()" type="paperplane" size="22" color="#00755C"></uni-icons>
				</view>
				<map
					@callouttap="openMap()"
					@markertap="openMap()"
					style="width: 100%; height: 400rpx;"
					:latitude="dataDic.gps.latitude"
					:longitude="dataDic.gps.longitude"
					:markers="getHouseMarker()"
				></map>
			</view>

			<!-- 联系房东 -->
			<view class="" style="height: 150rpx;"></view>
			<view class="p-lr-15 p-tb-10 fixed-bottom row-start-center bg-white" style="border-top: 1rpx solid #eee;">
				<view class="column-center-center" @click="reportClick()">
					<text class="iconfont icon-jubao color-666" style="font-size: 42rpx;"></text>
					<text class="font-24 color-666 m-t-3">举报</text>
				</view>
				<view class="column-center-center m-lr-15 p_r">
					<text class="iconfont icon-fenxiang color-666" style="font-size: 42rpx;"></text>

					<text class="font-24 color-666">分享</text>
					<button open-type="share" class="coverBg nbt"></button>
				</view>
				<view class="column-center-center m-r-15 " @click="collect()">
					<uni-icons v-if="!dataDic.collect" type="star" size="21" color="#666"></uni-icons>
					<uni-icons v-if="dataDic.collect" type="star-filled" size="21" color="#00755C"></uni-icons>
					<text class="font-24 color-666">收藏</text>
				</view>
				<view class="commit_bt flex-grow m-t-3" @click="makePhone"><text>联系房东</text></view>
			</view>
			<!-- 举报 -->
			<!-- 举报 -->
			<uni-popup ref="addPop">
				<view class="bg-white   border-radius-10 p-all-10" style="width: 690rpx;">
					<view class="row-between-center p-tb-10">
						<text class="font-bold">反馈</text>
						<uni-icons @click="hidePop" type="close" color="#999"></uni-icons>
					</view>
					<view class="row-start-center contentView ">
						<textarea
							v-model="reportDic.content"
							class=" flex-grow p-lr-10 p-tb-5 font-28"
							style="text-align: left;background-color: #fafafa;height: 140rpx;"
							placeholder="不是房东/电话不通"
						/>
					</view>

					<view class="commit_bt m-tb-15" @click="commit()"><text>确定</text></view>
				</view>
			</uni-popup>
			<view v-if="playUrl" class="fixed-all column-center-center" style="width: 750rpx;z-index: 1000;position: fixed;top: 0rpx;left: 0rpx;bottom: 0rpx;">
				<video :src="playUrl" autoplay style="width: 100%;"></video>
				<uni-icons type="close" size="30" color="#eee" @click="playVideo('')" click="m-t-10"></uni-icons>
			</view>
		</view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { superData, superTools } from '@/common/ss-superModules/superConfig.js';
import { formOptions } from '@/pages/houseRent/contant.js';
import { useUserStore } from '@/store';
;
const dataDic = ref({ _id: '' });
const houseRentApi = uniCloud.importObject('house-rent');
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
// 获取详情
const ssAlert = ref();
onLoad(e => {
	console.log(e);
	dataDic.value._id = e.houseId;
	getDetail();
});

function getDetail() {
	houseRentApi.doc(dataDic.value._id).then(res => {
		console.log('详情', res);
		if (res.data.state == 0) {
			Object.assign(dataDic.value, res.data);
			let title = '';
			if (dataDic.value.sall_rent_type == 0) {
				title = '出租 · ' + dataDic.value.address_name;
			} else {
				title = '出售 · ' + dataDic.value.address_name;
			}
			uni.setNavigationBarTitle({
				title: title
			});
		} else {
			ssAlert.value.showModalDic({
				show: true,
				title: '未找到,可能已被删除',
				confirmText: '确定',
				showCancel: false,
				cancelText: '',
				content: '',
				success: e => {
					if (e.confirm) {
						uni.navigateBack();
					}
				}
			});
		}
	});
}
// 打开地图
function openMap() {
	wx.openLocation({
		latitude: dataDic.value.gps.latitude,
		longitude: dataDic.value.gps.longitude,
		name: dataDic.value.address_name,
		scale: 20,
		complete: function(err) {
			console.log(err);
		}
	});
}
// 获取地图点
function getHouseMarker() {
	let dic = {
		id: 1,
		latitude: dataDic.value.gps.latitude,
		longitude: dataDic.value.gps.longitude,
		title: dataDic.value.address,
		callout: {
			content: dataDic.value.address_name,
			bgColor: '#FD7904',
			display: 'ALWAYS',
			color: '#fff',
			borderRadius: 10,
			padding: 4
		}
	};
	return [dic];
}
// 预览
function prewImg(index) {
	let arr = [];
	for (let item of dataDic.value.images) {
		arr.push(switchImageSize(item.url, 1000));
	}
	uni.previewImage({
		current: index,
		urls: arr
	});
}
// 联系房东
function makePhone() {
	uni.makePhoneCall({
		phoneNumber: dataDic.value.phone
	});
}

// 收藏
function collect() {
	const dic = {
		uni_id: dataDic.value._id,
		uni_data: dataDic.value
	};
	houseRentApi.favorite(dic).then(res => {
		if (res.errCode == 0) {
			dataDic.value.collect = !dataDic.value.collect;
			console.log(dataDic.value.collect);
		}
	});
}

// 举报
const addPop = ref();
const reportDic = ref({ content: '' });
function reportClick() {
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
		uni_data: dataDic.value
	};
	houseRentApi.report(dic).then(res => {
		reportDic.value.content = '';
		msg(res.data);
		hidePop();
	});
}
//分享
onShareAppMessage(e => {
	let name = '';
	if (dataDic.value.sall_rent_type == 0) {
		name = '出租 · ' + dataDic.value.address_name;
	} else {
		name = '出售 · ' + dataDic.value.address_name;
	}
	return {
		title: name,
		imageUrl: dataDic.value.cover,
		path: 'pages/houseRent/detail?houseId=' + dataDic.value._id
	};
});

onShareTimeline(e => {
	let name = '';
	if (dataDic.value.sall_rent_type == 0) {
		name = '出租 · ' + dataDic.value.address_name;
	} else {
		name = '出售 · ' + dataDic.value.address_name;
	}

	return {
		title: name,
		path: 'pages/houseRent/detail?houseId=' + dataDic.value._id
	};
});
function switchImageSize(url, size = 500) {
	// 等比缩放
	return url + `?x-oss-process=image/resize,h_${size},m_lfit`;
}
// 等比缩水
function switchVideoSize(imageurl) {
	// 等比缩放
	return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
}
const playUrl = ref('');

function playVideo(url) {
	playUrl.value = url;
}
</script>

<style lang="scss">
.itemView {
	background-color: #fff;
	width: 100%;
	padding: 20rpx 0rpx;
}
.text_one {
	color: #222;
	font-size: 28rpx;
	margin-bottom: 10rpx;
}
.text_two {
	color: #555;
	font-weight: 400;
	font-size: 26rpx;
}
.set_s {
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
