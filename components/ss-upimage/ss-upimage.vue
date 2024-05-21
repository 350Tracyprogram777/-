<template>
	<view class="flex-grow">
		<view class="grid-five p-all-4 border-radius-5 w-100 " style="grid-gap: 3px;background-color: #F8F8F8">
			<image @click.stop="chooseType()" v-if="mediaArr.length < maxCount" src="./addImg.png" :style="{ width: '100%', height: itemW + 'px' }"></image>
			<view class="p_r row-center-center" v-for="(item, index) in getMediaArr()" :key="index">
				<image
					v-if="item.fileType == 'image'"
					@longpress="setCover(item.url)"
					@click.stop="prewImg(item, mediaArr)"
					class="d-block border-radius-4"
					:src="switchImageSize(item.url)"
					:style="{ width: '100%', height: itemW + 'px' }"
				></image>
				<view class="row-center-center p_r" v-else-if="item.fileType == 'video'" @click.stop="openVoid(item)">
					<image class="d-block border-radius-4" :src="switchVideoSize(item.url)" :style="{ width: '100%', height: itemW + 'px' }"></image>
					<text class="videoImg iconfont icon-icon_video"></text>
				</view>

				<view class="bg-color column-center-center border-radius-4" v-if="item.fileType == 'file'" :style="{ width: '100%', height: itemW + 'px' }">
					<text @click.stop="openFileVoid(item.url)" class="text-maxline-three font-26 ">1{{ item.name }}</text>
				</view>

				<text v-if="item.suggest" class="waingImg iconfont icon-weiguitongzhi color-wain"></text>
				<text v-if="!stopDelete" class="delectImg iconfont icon-shanchu" @click="deleteImg(item)"></text>
				<text class="coverImg" v-if="item.url == cover && cover && item.fileType == 'image'">封面</text>

				<uni-dateformat class="dateText text-maxline-one" v-if="item.create_date" :date="item.create_date" format="MM/d-h:mm"></uni-dateformat>
			</view>
		</view>
		<view class="grid-one grid-gap-1">
			<!-- v-if="item.fileType != 'file'" -->
			<view class="" v-for="(item, index) in mediaArr" :key="index">
				<view v-if="item.fileType == 'file'" class="bg-color row-start-center border-radius-4 p-lr-10 p-tb-5" @click.stop="openFileVoid(item.url)">
					<text class="oneText">{{ item.extname }}</text>
					<text class="text-maxline-one m-l-10 font-26 flex-grow" @click="showRenameVoid(item)">{{ item.name }}</text>
					<text v-if="!stopDelete" class=" iconfont icon-shanchu color-666" @click.stop="deleteImg(item)"></text>

					<!-- <uni></uni> -->
				</view>
			</view>
		</view>
		<view v-if="playVideo" class="fixed-all column-center-center" style="width: 750rpx;">
			<video :src="playItem.url" autoplay style="width: 100%;"></video>
			<uni-icons type="close" size="26" color="#aaa" @click="closeVideo"></uni-icons>
		</view>
		<!-- <uni-popup ref="renamePop">
			<view class="bg-white p-all-15 border-radius-10 grid-one" style="width: 690rpx;">
				<view class="row-between-center">
					<text class="font-bold font-30">重命名</text>
					<uni-icons type="close" color="#999" size="20"></uni-icons>
				</view>
				<input class="border p-all-10 border-radius-10 m-tb-15" style="height: 88rpx;" type="text" placeholder="重命名" v-model="selectItem.rename" />
				<view class="grid-one">
					<view class="commit_bt"><text>确定</text></view>
				</view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive, toRef, toRefs } from 'vue';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { openFile, prewImage } from './prewMedia.js';
import { useUserStore, useSystemStore } from '@/store';
const mediaTable = uniCloud.importObject('media', { customUI: true });
const wxApi = uniCloud.importObject('wxapi', { customUI: true });
const userStore = useUserStore();
const userInfo = userStore.userInfo;
const props = defineProps({
	oneImg: {
		//单选还是多选
		type: Boolean,
		default: false
	},
	stopDelete: {
		//单选还是多选
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		default: '用户'
	},
	canVideo: {
		// 能否选择视频
		type: Boolean,
		default: true
	},
	canFile: {
		// 能否选择文件
		type: Boolean,
		default: true
	},
	wxType: {
		type: String,
		default: 'all' //video file image
	},

	mediaArr: {
		//选中的模型
		type: Array,
		default: () => []
	},
	maxCount: {
		type: [Number, String],
		default: 9
	},
	cover: {
		type: String,
		default: ''
	},
	fixH: {
		type: [Number, String],
		default: 0
	},
	showDocStyle: {
		//文件的展示形式 true 左右结构 false为图片模式
		type: Boolean,
		default: false
	}
});

// 父类
const mediaArr = toRef(props, 'mediaArr');
const { maxCount, cover } = toRefs(props);
console.log('props----', mediaArr.length);

//本地
const selectItem = ref('');
const playVideo = ref(false);
const playItem = ref({});
const itemW = (uni.getSystemInfoSync().screenWidth - props.fixH) / 5;
const canOpenFile = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx', 'dwg'];
const emit = defineEmits(['update:cover', 'remove', 'change', 'update:mediaArr']);

// 去除文件
function getMediaArr() {
	if (props.showDocStyle) {
		return mediaArr.value.filter(function(a, b) {
			return a.fileType != 'file';
		});
	} else {
		return mediaArr.value;
	}
}
// 等比缩水
function switchImageSize(imageurl, size = 150) {
	// 等比缩放
	return imageurl + `?x-oss-process=image/resize,h_${size},m_lfit`;
}
// 等比缩水
function switchVideoSize(imageurl) {
	// 等比缩放
	return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
}
function openFileVoid(e) {
	openFile(e);
}
function prewImg(item, arr) {
	const imgArr = mediaArr.value.filter(function(a, b) {
		if (a.fileType != 'video' && a.fileType != 'file') {
			return true;
		}
	});
	const inx = imgArr.findIndex(function(a, b) {
		return a.url == item.url;
	});
	console.log(item);

	prewImage(inx, imgArr);
}
// 删除图片
function deleteImg(item) {
	const index = mediaArr.value.findIndex(function(a, b) {
		return a.url == item.url;
	});
	if (mediaArr.value[index]['url'] == props.cover) {
		// $emit('changeCover', '');
		emit('update:cover', '');
	}
	emit('remove', index);
}
// 预览图片
function openVoid(item) {
	const index = mediaArr.value.findIndex(function(a, b) {
		return a.url == item.url;
	});
	playItem.value = mediaArr.value[index];
	playVideo.value = true;
}
function closeVideo() {
	playItem.value = '';
	playVideo.value = false;
}
function chooseImg() {
	// $emit('addImg');

	superUpImg();
}
// 设置封面
function setCover(url) {
	// $emit('changeCover', url);
	emit('update:cover', url);
}
function chooseType() {
	let self = this;
	let arr = ['图片'];
	if (props.canVideo) {
		arr.push('视频');
	}
	if (props.wxType) {
		arr.push('从微信中选择');
	}
	uni.showActionSheet({
		itemList: arr,
		success: function(res) {
			const txt = arr[res.tapIndex];
			if (txt == '图片') {
				superUpImg('image');
			} else if (txt == '视频') {
				superUpImg('video');
			} else if (txt == '从微信中选择') {
				chooseWxMedia();
			}
		},
		fail: function(res) {
			console.log(res.errMsg);
		}
	});
}
function chooseWxMedia() {
	let self = this;
	wx.chooseMessageFile({
		count: 9,
		type: props.wxType,
		success: async function(e) {
			let arr = [];
			uni.showLoading({
				title: '上传中'
			});
			let totalArr = [];

			for (let imgInfo of e.tempFiles) {
				console.log(imgInfo);
				if (imgInfo.type == 'file' && !props.canFile) {
					continue;
				}
				let imgUrl = await superData.superImgCloudRequest(imgInfo.path, imgInfo.name);
				const { data } = await wxApi.mediaCheckAsync(imgUrl, userInfo.wx_openid.mp);
				let extname = imgInfo.path.split('.').pop();
				let fileType = imgInfo.type;
				if (canOpenFile.includes(extname)) {
					fileType = 'file';
				}
				const filedata = {
					user_id: userInfo._id,
					type: props.type,
					name: imgInfo.name,
					rename: imgInfo.name,
					extname: extname,
					cloudPath: imgInfo.name,
					fileType: fileType,
					url: imgUrl,
					size: imgInfo.size, //单位是字节
					path: imgUrl,
					create_date: new Date().getTime(),
					trace_id: data
				};
				arr.push(filedata);
				// 多张图片
				if (props.maxCount > 1) {
					totalArr = [...mediaArr.value, filedata];
				} else {
					// 单张图片
					totalArr = arr;
				}
				// $emit('change', totalArr);
				emit('update:mediaArr', totalArr);
			}
			console.log('上传乘公共', arr);
			mediaTable.add(arr);
			uni.hideLoading();

			if (!props.cover) {
				const defaultCover = totalArr[0];
				if (defaultCover.fileType == 'image') {
					// $emit('changeCover', defaultCover.url);
					emit('update:cover', defaultCover.url);
				} else if (defaultCover.fileType == 'video') {
					// $emit('changeCover', switchVideoSize(defaultCover.url));
					emit('update:cover', switchVideoSize(defaultCover.url));
				} else {
					// $emit('changeCover', '/static/media/word.png');
				}
			}
		}
	});
}

// 上传图片
function superUpImg(mediaType) {
	let self = this;
	uni.chooseMedia({
		count: 9,
		mediaType: mediaType,
		sizeType: ['compressed'],
		success: async function(e) {
			console.log(e);

			let arr = [];
			uni.showLoading({
				title: '上传中'
			});
			let totalArr = [];
			for (let imgInfo of e.tempFiles) {
				let filedata = {};
				if (e.type != 'video') {
					let imgName = imgInfo.tempFilePath.split('/').pop();
					// #ifdef H5
					imgName = imgInfo.name;
					// #endif
					let imgUrl = await superData.superImgCloudRequest(imgInfo.tempFilePath, imgName);
					const { data } = await wxApi.mediaCheckAsync(imgUrl, userInfo.wx_openid.mp);
					filedata = {
						user_id: userInfo._id,
						type: props.type,
						name: imgName,
						rename: imgName,
						extname: imgInfo.tempFilePath.split('.').pop(),
						cloudPath: imgName,
						fileType: 'image',
						url: imgUrl,
						size: imgInfo.size, //单位是字节
						path: imgUrl,
						create_date: new Date().getTime(),
						trace_id: data
					};
					arr.push(filedata);
				} else {
					let videoName = imgInfo.tempFilePath.split('/').pop();
					let videoImg = imgInfo.thumbTempFilePath.split('/').pop();
					let videoUrl = await superData.superImgCloudRequest(imgInfo.tempFilePath, videoName);
					// let imgUrl = await superData.superImgCloudRequest(imgInfo.thumbTempFilePath, videoImg);
					const { data } = await wxApi.mediaCheckAsync(videoUrl, userInfo.wx_openid.mp);
					filedata = {
						user_id: userInfo._id,
						type: props.type,
						name: videoName,
						rename: videoName,
						extname: imgInfo.tempFilePath.split('.').pop(),
						cloudPath: videoName,
						fileType: 'video',
						url: videoUrl,
						size: imgInfo.size, //单位是字节
						path: videoUrl,
						create_date: new Date().getTime(),
						trace_id: data
						// duration: imgInfo.duration,
						// width: imgInfo.width,
						// height: imgInfo.height
					};
					arr.push(filedata);
				}

				// 多张图片
				if (props.maxCount > 1) {
					totalArr = [...mediaArr.value, filedata];
				} else {
					// 单张图片
					totalArr = arr;
				}
				// $emit('change', totalArr);
				emit('update:mediaArr', totalArr);
				console.log('--成功----', totalArr, props.mediaArr);
			}
			mediaTable.add(arr);
			uni.hideLoading();

			if (!props.cover) {
				const defaultCover = totalArr[0];
				if (defaultCover.fileType == 'image') {
					// $emit('changeCover', defaultCover.url);
					emit('update:cover', defaultCover.url);
				} else if (defaultCover.fileType == 'video') {
					// $emit('changeCover', switchVideoSize(defaultCover.url));
					emit('update:cover', switchVideoSize(defaultCover.url));
				} else {
					// $emit('changeCover', '/static/media/word.png');
					emit('update:cover', '/static/media/word.png');
				}
			}
			// $emit('change', totalArr);
		}
	});
}
</script>

<style>
.delectImg {
	width: 15px;
	height: 15px;
	line-height: 15px;
	position: absolute;
	top: 5rpx;
	right: 5rpx;
	background-color: #aaa;
	color: #ffffff;
	font-size: 26rpx;
	text-align: center;

	border-radius: 7.5px;
}
.waingImg {
	width: 15px;
	height: 15px;
	line-height: 15px;
	position: absolute;
	top: 5rpx;
	left: 5rpx;
	font-size: 26rpx;
	text-align: center;
}
.coverImg {
	width: 30px;
	height: 15px;
	line-height: 15px;
	position: absolute;
	top: 5rpx;
	left: 5rpx;
	font-size: 20rpx;

	background-color: #388afa;
	color: #ffffff;
	text-align: center;
	border-radius: 0rpx 10rpx 10rpx 0rpx;
}
.videoImg {
	position: absolute;

	font-size: 30px;
	border-radius: 0rpx 10rpx 10rpx 0rpx;
}
.dateText {
	position: absolute;
	bottom: 0rpx;
	right: 0px;
	left: 0rpx;
	color: #ffffff;
	background-color: rgba(0, 0, 0, 0.3);
	color: #ffffff;
	text-align: center;
	display: flexbox;
	padding: 3rpx 0rpx;
	font-size: 10px;
}
/* 文件名字 */
.oneText {
	width: 40px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	display: block;
	background-color: #eee;
	border-radius: 6px;
	font-size: 20rpx;
	color: #999;
}
</style>
