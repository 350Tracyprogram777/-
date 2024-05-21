<template>
	<view class="">
		<view v-if="dataDic.state ==30 && dataDic.sys_msg" class="row-center-center p-tb-8">
			<text class=" iconfont icon-weiguitongzhi color-wain"></text>
			<text class="text-pricen m-l-5 font-26">{{ dataDic.sys_msg }}</text>
		</view>
		<view class="grid-one grid-gap-1 p-all-10" style="background-color: #fafafa;">
			<textarea v-model="dataDic.content" placeholder="说些什么" style="width: 100%;min-height: 400rpx;" class=" font-30" maxlength="-1"></textarea>

			<ss-upimage class="flex-grow" @remove="deleteImg" type="新闻" maxCount="9" fixH="40" v-model:mediaArr="dataDic.images" v-model:cover="dataDic.cover"></ss-upimage>
			<view class="row-start-center itemView m-t-10" @click="chooseMap">
				<text class="label">位置</text>
				<input disabled v-model="dataDic.address_name" class="content_input flex-grow p-lr-10" style="text-align: left;" placeholder="选择位置" />
				<uni-icons type="location-filled" class="m-t-3 m-r-4" size="20" color="#00755C"></uni-icons>
			</view>

			<view class="row-start-center itemView">
				<text class="label must">版块</text>
				<!-- <ss-picker v-model:selectValue="dataDic.category_id" class="content_input content" :localdata="classArr"></ss-picker> -->

				<uni-data-picker :clearIcon="false" :border="false" mode="tag" v-model="dataDic.category_id" class="content" :localdata="classArr"></uni-data-picker>
			</view>
			<view class="row-start-center itemView">
				<text class="label ">联系方式</text>
				<text v-if="!selectPhone" class="flex-grow color-999" @click="navToAddress()">请选择联系方式</text>
				<view v-else class="row-start-center flex-grow">
					<text class="flex-grow text-maxline-one" @click="navToAddress()">{{ selectPhone.name }}</text>
					<text class="iconfont icon-shanchu color-666 font-36" @click="clearPhone"></text>
				</view>
				<uni-icons type="right"></uni-icons>
			</view>

			<view v-if="dataDic._id" class="row-start-center itemView">
				<text class="label must">状态</text>
				<!-- <ss-picker class="content_input content" :localdata="[{ text: '正常', value: 0 }, { text: '下架', value: 1 }]"  v-model:selectValue="dataDic.state"></ss-picker> -->

				<uni-data-checkbox :localdata="[{ text: '正常', value: 0 }, { text: '下架', value: 1 }]" v-model="dataDic.state"></uni-data-checkbox>
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
		<view class="row-center-center"><text class="color-999">记录生活</text></view>
		<ss-twoAlert ref="ssAlert"></ss-twoAlert>
		<!-- <pushMust ref="pushPop"></pushMust> -->
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore, useSystemStore } from '@/store';
const newsApi = uniCloud.importObject('news-article');
const mediaApi = uniCloud.importObject('media');
const moreBt = ref(false);
const classArr = ref([]);
const userStore = useUserStore();
const systemStore = useSystemStore();
const selectPhone = computed(() => systemStore.pageDic);
const userInfo = computed(() => userStore.userInfo);

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
	address_book_id: ''
});
const pushPop = ref();
onLoad(e => {
	if (e.newsId) {
		dataDic.value['_id'] = e.newsId;
		getDetail();
	}
	systemStore.pageDic = '';

	// setTimeout(function(){
	// 	pushPop.value.show()

	// },1000)

	getBaseData();
});

function getDetail() {
	newsApi.doc(dataDic.value._id).then(res => {
		console.log(res);
		if (res.errCode == 0) {
			Object.assign(dataDic.value, res.data);
			if (dataDic.value.address_book_id) {
				systemStore.pageDic = res.data.phoneDic;
			}
		}
	});
}
function getBaseData() {
	newsApi.getClass({ role: userInfo.value.role }).then(res => {
		classArr.value = res.data;
		if(!dataDic.value.category_id)
		{
			dataDic.value.category_id=classArr.value[0]['value']
		}
	});
}

// 提交
const ssAlert = ref();

function commitVoid() {
	if (!dataDic.value.content) {
		return msg('请输入要发表的内容');
	}
	if (!dataDic.value.category_id) {
		return msg('请选择分类');
	}
	if (selectPhone.value) {
		dataDic.value.address_book_id = selectPhone.value._id;
	}
	if (dataDic.value.state == 30) {
		return msg('严重违规,请联系客服');
	}

	if (dataDic.value._id) {
		newsApi.edit(dataDic.value).then(res => {
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
		newsApi.add(dataDic.value).then(res => {
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
	newsApi.edit(dic);
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
		title: '联系方式',
		confirmText: '确定',
		showCancel: true,
		content: '内容中禁止出现任何联系方式,这里添加联系方式,用户联系您会更方便!',
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
