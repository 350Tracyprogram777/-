<template>
	<view class="uni-container">
		<view v-if="dataDic.state == 30" class="row-center-center p-tb-8">
			<text class=" iconfont icon-weiguitongzhi color-wain"></text>
			<text class="text-pricen m-l-5 font-26">{{ dataDic.sys_msg }}</text>
		</view>
		<view class="grid-one grid-gap-1">
			<text class="p-tb-10 color-999">租售信息</text>
			<view class="row-start-center itemView">
				<text class="label">租售</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.sall_rent_type" class="content" :localdata="formOptions.sall_rent_type_localdata"></uni-data-checkbox>
			</view>
			<view v-show="dataDic.sall_rent_type == 0" class="row-start-center itemView">
				<text class="label">出租类型</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.rent_type" class="content" :localdata="formOptions.rent_type_localdata"></uni-data-checkbox>
			</view>
			<view v-show="dataDic.rent_type == 1" class="row-start-center itemView">
				<text class="label">主/次卧</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.main_room_type" class="content" :localdata="formOptions.main_room_type_localdata"></uni-data-checkbox>
			</view>
			<view v-show="dataDic.sall_rent_type == 0" class="row-start-center itemView">
				<text class="label">可租时长</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.rent_duration_type" class="content" :localdata="formOptions.rent_duration_type_localdata"></uni-data-checkbox>

				<view class="row-start-center" v-show="dataDic.rent_duration_type == 1" style="max-width:40% ;">
					<input placeholder-class="inpu_p"  v-model="dataDic.rent_duration" class="content_input flex-grow" placeholder="可租时长" type="number" />
					<text class="flex-shrink  twoText">月</text>
				</view>
			</view>
			<view v-show="dataDic.sall_rent_type == 0" class="row-start-center itemView">
				<text class="label">付款周期</text>
				<uni-combox :border="false" v-model="dataDic.rent_pay_cycle" class="content" :candidates="formOptions.rent_pay_cycle_localdata"></uni-combox>
			</view>
			<view v-show="dataDic.sall_rent_type == 1" class="row-start-center itemView">
				<text class="label">结算方式</text>
				<uni-combox v-model="dataDic.sall_pay_cycle" class="content" :candidates="formOptions.sall_pay_cycle_localdata"></uni-combox>
			</view>

			<view class="grid-two itemView">
				<view class="row-start-center">
					<text class="label">房屋面积</text>
					<input placeholder-class="inpu_p" v-model="dataDic.area" class="content_input flex-grow" placeholder="0" type="digit" />
					<text class="flex-shrink  twoText">㎡</text>
				</view>

				<view class="row-end-center flex-grow" v-show="dataDic.sall_rent_type == 0">
					<text class="label m-l-5" style="width: 100rpx;">月租金</text>
					<input placeholder-class="inpu_p" v-model="dataDic.price" class="content_input flex-grow" placeholder="元" type="digit" />
					<text class="flex-shrink  twoText">/月</text>
				</view>
				<view v-show="dataDic.sall_rent_type == 1" class="row-end-center itemView">
					<text class="label m-l-5" style="width: 100rpx;">售价</text>
					<input placeholder-class="inpu_p" v-model="dataDic.price" class="content_input flex-grow" placeholder="万元" type="digit" />
					<text class="flex-shrink  twoText">万</text>
				</view>
			</view>

			<text class="p-tb-10 color-999">联系人</text>
			<view class="row-end-center flex-grow itemView">
				<text class="label m-l-5">房东姓名</text>
				<input placeholder-class="inpu_p" v-model="dataDic.contacts" class="content_input flex-grow p-lr-10" placeholder="姓名" style="text-align: left;" />
			</view>
			<view class="row-end-center flex-grow itemView">
				<text class="label m-l-5">手机</text>
				<view class="row-between-center content_input flex-grow ">
					<input placeholder-class="inpu_p" disabled v-model="dataDic.phone" class=" flex-grow p-lr-10" style="text-align: left;" />
					<button @getphonenumber="getPhone" open-type="getPhoneNumber" class="themecolor font-26 flex-shrink nbt " style="">获取手机号</button>
				</view>
				<!-- <input placeholder-class="inpu_p" v-model="dataDic.phone" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="手机号" /> -->
			</view>

			<text class="p-tb-10 color-999">位置信息</text>
			<view class="row-between-center itemView">
				<text class="label">位置信息</text>
				<view class="row-between-center content_input flex-grow " @click="chooseMap">
					<text v-if="!dataDic.address_name" class="font-26 color-999 p-lr-10 flex-grow">{{ '选择位置' }}</text>
					<text v-else class="font-26 color-555 p-lr-10 flex-grow">{{ dataDic.address_name }}</text>
					<uni-icons type="location-filled" class="m-t-3" color="#00755C" size="26"></uni-icons>
				</view>
			</view>

			<text class="p-tb-10 color-999">基本信息</text>
			<view class="row-start-center itemView">
				<text class="label">户型</text>
				<view class="content row-start-center">
					<input placeholder-class="inpu_p" v-model="dataDic.house_room" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink  twoText">室</text>
					<input placeholder-class="inpu_p" v-model="dataDic.house_play" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink  twoText">厅</text>
					<input placeholder-class="inpu_p" v-model="dataDic.house_toilet" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink  twoText">卫</text>
				</view>
			</view>
			<view class="row-start-center itemView">
				<text class="label">栋/单元</text>
				<view class="content row-start-center">
					<input placeholder-class="inpu_p" v-model="dataDic.build" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink  twoText">栋</text>
					<input placeholder-class="inpu_p" v-model="dataDic.unit" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink  twoText">单元</text>
					<!-- <input placeholder-class="inpu_p" v-model="dataDic.number" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink m-lr-10">号</text> -->
				</view>
			</view>
			<view class="row-start-center itemView">
				<text class="label">总层/层</text>
				<view class="content row-start-center">
					<input placeholder-class="inpu_p" v-model="dataDic.total_floor" class="content_input" placeholder="共几层" type="number" />
					<text class="flex-shrink  twoText">层</text>
					<input placeholder-class="inpu_p" v-model="dataDic.floor" class="content_input" placeholder="所在层" type="number" />
					<text class="flex-shrink  twoText">层</text>
					<!-- <input placeholder-class="inpu_p" v-model="dataDic.number" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink m-lr-10">号</text> -->
				</view>
			</view>
			<view class="row-start-center itemView">
				<text class="label">装修程度</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.repair_mode" class="content" :localdata="formOptions.repair_mode_localdata"></uni-data-checkbox>
			</view>
			<view class="row-start-center itemView">
				<text class="label">房屋朝向</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.toward" class="content" :localdata="formOptions.toward_localdata"></uni-data-checkbox>
			</view>
			<text class="p-tb-10 color-999">配套信息</text>

			<view class="row-start-center itemView">
				<text class="label">电梯配置</text>
				<view class="content row-start-center">
					<input placeholder-class="inpu_p" v-model="dataDic.elevator" class="content_input" placeholder="几梯" type="number" />
					<text class="flex-shrink  twoText">梯</text>
					<input placeholder-class="inpu_p" v-model="dataDic.family" class="content_input" placeholder="几户" type="number" />
					<text class="flex-shrink  twoText">户</text>
					<!-- <input placeholder-class="inpu_p" v-model="dataDic.number" class="content_input" placeholder="几" type="number" />
					<text class="flex-shrink m-lr-10">号</text> -->
				</view>
			</view>

			<view class="row-start-center itemView">
				<text class="label">水电煤</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.life_type" class="content" :localdata="formOptions.life_type_localdata"></uni-data-checkbox>
			</view>
			<view class="row-start-center itemView">
				<text class="label">车位</text>
				<uni-data-checkbox mode="tag" v-model="dataDic.have_car" class="  flex-shrink" :localdata="formOptions.have_car_localdata"></uni-data-checkbox>
				<view v-show="dataDic.have_car == 1 && dataDic.sall_rent_type == 0" class="row-start-center " style="max-width: 40%;">
					<input placeholder-class="inpu_p" v-model="dataDic.price" class="content_input flex-grow" placeholder="元" type="digit" />
					<text class="flex-shrink  twoText">/月</text>
				</view>
			</view>
			<view class="row-start-center itemView">
				<text class="label">物业费</text>
				<input placeholder-class="inpu_p" v-model="dataDic.strata_fee" class="content_input flex-grow" placeholder="¥/m²" type="digit" />
				<text class="flex-shrink  twoText">/m²</text>
			</view>
			<view>
				<view class="row-between-center itemView">
					<text class="label">房间设施</text>
					<text class="font-26 color-999 text-right flex-grow" @click="showPop">选择设施</text>
					<uni-icons type="right" class="m-t-3" color="#999"></uni-icons>
				</view>
				<view v-if="dataDic.house_set.length > 0" class="grid-five bg-white p-all-10 grid-gap-0" style="grid-template-columns: repeat(10,1fr);width: 710rpx;">
					<view class="set_n" style="border: none;" v-for="(item, index) in dataDic.house_set" :key="index">
						<text :class="['iconfont', item.value]" style="font-size: 40rpx;"></text>
						<!-- <text>{{ item.text }}</text> -->
					</view>
				</view>
			</view>
			<text class="p-tb-10 color-999">实拍照片</text>

			<ss-upimage
				@remove="deleteImg"
				:cover="dataDic.cover"
				type="租房"
				maxCount="9"
				:canFile="false"
				v-model:mediaArr="dataDic.images"
				v-model:cover="dataDic.cover"
			></ss-upimage>

			<text class="p-tb-10 color-999">备注</text>
			<textarea
				v-model="dataDic.remark"
				placeholder="说点什么"
				class="bg-white w-100 p-all-10 border-radius-10"
				style="height: 160rpx;"
				name=""
				id=""
				cols="30"
				rows="10"
			></textarea>
		</view>
		<view style="height: 180rpx;"></view>
		<view class="fixed-bottom p-all-12">
			<view class="commit_bt" @click="commitVoid"><text>发布</text></view>
		</view>
		<uni-popup ref="popView">
			<view class="bg-white grid-one p-all-10 border-radius-10 p-all-15" style="width: 690rpx;">
				<view class="row-between-center">
					<text class="font-bold font-36">选择房间设置</text>
					<!-- <uni-icons type="close" color="#999" size="30"></uni-icons> -->
				</view>
				<view class="grid-five">
					<view
						@click="selectSetItem(item)"
						:class="dataDic.house_set.includes(item) ? 'set_s' : 'set_n'"
						v-for="(item, index) in formOptions.icon_localdata"
						:key="index"
					>
						<text :class="['iconfont', item.value]" style="font-size: 40rpx;"></text>

						<text>{{ item.text }}</text>
					</view>
				</view>
				<view class="commit_bt" @click="hidePop"><text>确定</text></view>
			</view>
		</uni-popup>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
import { formOptions } from './contant.js';
const houseRentApi = uniCloud.importObject('house-rent');
const mediaApi = uniCloud.importObject('media');
const wxApi = uniCloud.importObject('wxapi');
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

onLoad(e => {
	if (e.houseId) {
		dataDic.value['_id'] = e.houseId;
		houseRentApi.doc(e.houseId).then(res => {
			if (res.errCode == 0) {
				Object.assign(dataDic.value, res.data);
			}
		});
	} else {
		dataDic.value.phone = userInfo.value.mobile || '';
	}
});

const dataDic = ref({
	phone: '', //联系电话
	rent_pay_cycle: '押一付三',
	sall_pay_cycle: '全款',
	contacts: '', //联系人
	sall_rent_type: 0, //租售类型
	rent_type: 0, //出租类型 整租 合租
	strata_fee: '0',
	house_class: 0, //住宅/大平层/商铺/别墅
	main_room_type: 0, //是不是主卧
	rent_duration: 3,
	rent_duration_type: 0,
	life_type: 0, //民用 水电煤
	price: '', //价格
	address: '',
	address_name: '',
	house_room: '',
	house_play: '',
	house_toilet: '',
	have_car: 0, //车位
	car_price: '0', //车位费
	gps: { latitude: '', longitude: '' },
	house_class: 0,
	build: '',
	unit: '',
	number: '',
	floor: '',
	total_floor: '',
	area: '',
	toward: 2, //房屋朝向
	house_set: [],
	repair_mode: 2,
	create_date: '',
	remark: '',
	user_id: '',
	images: [],
	state: 0,
	elevator: '',
	family: '',
	cover: ''
});
// 发布
const ssAlert = ref();

function commitVoid() {
	const mustArr = [
		'address',
		'address_name',
		'phone', //手机号
		'contacts', //联系人
		'strata_fee', //物业费
		'price', //价格
		'house_room', //几室
		'house_play', //几厅
		'house_toilet', //几卫
		'build', //几栋
		'unit', //几单元
		'floor', //几层
		'total_floor', //总层
		'area', //面积
		'elevator', //几梯
		'family' //几户
	];
	let isEmpty = false;
	for (let key of mustArr) {
		if (dataDic.value[key] == '') {
			console.log(key);
			isEmpty = true;
			break;
		}
	}
	if (isEmpty) {
		msg('请完善信息');
		return;
	}

	if (dataDic.value.sall_rent_type == 0 && !dataDic.value.rent_pay_cycle) {
		return msg('请输入付款周期');
	}
	if (dataDic.value.sall_rent_type == 1 && !dataDic.value.sall_pay_cycle) {
		return msg('请输入结算方式');
	}

	if (dataDic.value.rent_duration_type == 1 && !dataDic.value.rent_duration) {
		msg('请输入短租时长');
		return;
	}
	if (dataDic.value.have_car == 1 && !dataDic.value.car_price) {
		msg('请输入停车费');
		return;
	}
	console.log(dataDic.value);
	if (dataDic.value.house_set.length == 0) {
		msg('请完善房间设施信息');
		return;
	}
	if (dataDic.value.repair_mode != 0 && dataDic.value.house_set.length == 0) {
		msg('请完善房间设施信息');
		return;
	}
	if (dataDic.value.images.length == 0) {
		msg('至少传一张实景照片');
		return;
	}
	if (dataDic.value.images.length > 0 && !dataDic.value.cover) {
		dataDic.value.cover = dataDic.value.images[0]['url'];
	}
	if (dataDic.value._id) {
		houseRentApi.edit(dataDic.value).then(res => {
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
		houseRentApi.add(dataDic.value).then(res => {
			ssAlert.value.showModalDic({
				show: true,
				title: '发布成功',
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
		},
		complete: function(err) {
			console.log(err);
		}
	});
}

// 选择配置
const popView = ref();
function showPop() {
	popView.value.open();
}
function hidePop() {
	popView.value.close();
}
function selectSetItem(e) {
	if (dataDic.value.house_set.includes(e)) {
		const a = dataDic.value.house_set.indexOf(e);
		dataDic.value.house_set.splice(a, 1);
	} else {
		dataDic.value.house_set.push(e);
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
	houseRentApi.edit(dic);
	mediaApi.remove([item]);
}
// 获取手机号
function getPhone(e) {
	if (e.detail.errMsg == 'getPhoneNumber:ok') {
		wxApi.getWxPhone(e.detail.code).then(res => {
			console.log(res);
			if (res.errCode == 0) {
				dataDic.value.phone = res.data;
			} else {
				msg('请重试');
			}
		});
	}
	// console.log(e)
}
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
	padding: 20rpx;
}
.itemView {
	background-color: #fff;
	padding: 15rpx;
}
.label {
	width: 160rpx;
	flex-shrink: 0;
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
	height: 72rpx;
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
