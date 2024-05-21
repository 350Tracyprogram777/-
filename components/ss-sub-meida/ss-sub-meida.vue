<template>
	<view>
		<view class="" v-if="mediaArr.length == 1" @click.stop="">
			<view class="p_r" v-for="(item, index) in imgVideoArr" :key="index">
				<!-- 图片 -->
				<image
					@click.stop="openFileVoid(item)"
					v-if="item.fileType == 'image'"
					:src="switchImageSize(item.url)"
					style="width: 300rpx;height: 300rpx;"
					class="bg-color border-radius-4"
				></image>
				
				<!-- 视频 -->

				<ss-play-video @play.stop="openFileVoid(item, $event)" v-if="item.fileType == 'video'" :mediaDic="item" width="400rpx" height="300rpx"></ss-play-video>
			</view>
			<view class="grid-one grid-gap-1">
				<!-- v-if="item.fileType != 'file'" -->
				<view class="" v-for="(item, index) in mediaArr" :key="index">
					<view v-if="item.fileType == 'file'" class="bg-color row-start-center border-radius-4 p-lr-10 p-tb-5" @click.stop="openFileVoid(item)">
						<text class="oneText">{{ item.extname }}</text>
						<text class="text-maxline-one m-l-10 font-26 flex-grow">{{ item.name }}</text>
						<text class=" color-999 font-26 ">{{ getSizeMb(item.size) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="grid-one" v-else>
			<view class="grid-three grid-gap-4 ">
				<view class="p_r" v-for="(item, index) in imgVideoArr" :key="index">
					<!-- 图片 -->
					<image
						@click.stop="openFileVoid(item)"
						v-if="item.fileType == 'image' && index<maxShowNum"
						:src="switchImageSize(item.url)"
						style="width: 100%;height: 240rpx;display: block;"
						class="bg-color border-radius-4"
						:style="{'width':'100%','height':threeImgW+'px'}"
					></image>
					<!--数字  -->
					<view @click="openFileVoid(item)" v-if="index==(maxShowNum-1) && (imgVideoArr.length-maxShowNum)>0" class="column-center-center p_a p_a_all " style="width: 100%;height: 240rpx;background-color: rgba(255, 255, 255, 0.2);">
						<text class="font-bold font-40 text-white" style="font-size: 30px;">+{{imgVideoArr.length-maxShowNum}}</text>
						<!-- <text class="  text-white">更多</text> -->
					</view>
					<!-- 视频 -->
					<!--  -->
					<ss-play-video v-if="item.fileType == 'video'" @play="openFileVoid(item, $event)" :mediaDic="item" width="100%" height="240rpx"></ss-play-video>
				</view>
			</view>
			<view class="grid-one grid-gap-1" :style="{'max-height': fileShowAll?'auto':'280rpx','overflow': 'auto'}">
				<view class="" v-for="(item, index) in mediaArr" :key="index">
					<view v-if="item.fileType == 'file'" class="bg-color row-start-center border-radius-4 p-lr-10 p-tb-5" @click.stop="openFileVoid(item)">
						<text class="oneText">{{ item.extname }}</text>
						<text class="text-maxline-one m-l-10 font-26 flex-grow">{{ item.name }}</text>
						<text class=" color-999 font-26 ">{{ getSizeMb(item.size) }}</text>
					</view>
				</view>
			</view>
		</view>

		<uni-popup ref="pswPop">
			<view class="bg-white p-all-15 border-radius-10 grid-one" style="width: 690rpx;">
				<view class="row-between-center">
					<text class="font-bold font-30">查看密码</text>
					<uni-icons type="close" color="#999" size="20" @click.stop="hidePop"></uni-icons>
				</view>
				<textarea style="height: 78px;" class="border p-all-10 border-radius-10  w-100 font-28" v-model="inputPassWord" name="" id="" cols="30" rows="10" :placeholder="password_msg"></textarea>
				<!-- <input class="border p-all-10 border-radius-10 m-tb-15" style="height: 88rpx;" type="text" placeholder="输入密码可查看详情" v-model="inputPassWord" /> -->
				<view class="grid-one">
					<view class="commit_bt" @click.stop="verifyPassWord"><text>确定</text></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';

import { openFile, canOpenFile, prewImage } from './prewMedia.js';

export default {
	name: 'ss-sub-meida',
	props: {
		mediaArr: {
			type: Array,
			default: () => []
		},
		imW: {
			type: String,
			default: '300'
		},
		showDocStyle: {
			//文件的展示形式 true 左右结构 false为图片模式
			type: Boolean,
			default: false
		},
		password: {
			//文件的展示形式 true 左右结构 false为图片模式
			type: String,
			default: ''
		},
		password_msg: {
			//文件的展示形式 true 左右结构 false为图片模式
			type: String,
			default: ''
		},
		maxShowNum:{
			type: Number,
			default: 9
		},
		fileShowAll:{
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			canOpenFile: canOpenFile,
			inputPassWord: '',
			selectItem: '',
			playSuccess: '',
			threeImgW:(uni.getSystemInfoSync().screenWidth-56)/3
		};
	},
	computed:{
		imgVideoArr:function()
		{
			return this.mediaArr.filter(function(a, b) {
				return a.fileType != 'file';
			});
		}
	},
	methods: {
		// 去除文件
		getMediaArr: function() {
			if (this.showDocStyle) {
				return this.mediaArr.filter(function(a, b) {
					return a.fileType != 'file';
				});
			} else {
				return this.mediaArr;
			}
		},
		// 等比缩水
		switchImageSize: function(imageurl, size = 200) {
			// 等比缩放
			return imageurl + `?x-oss-process=image/resize,h_${size},m_lfit`;
		},
		// 等比缩水
		switchVideoSize: function(imageurl) {
			// 等比缩放
			return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
		},
		// 预览图片
		prewImgVoid(item) {
			const imgArr = this.mediaArr.filter(function(a, b) {
				if (a.fileType != 'video' && a.fileType != 'file') {
					return true;
				}
			});
			const inx = imgArr.findIndex(function(a, b) {
				return a.url == item.url;
			});
			prewImage(inx,imgArr);
		},
		// 预览文件
		openFileVoid(item, playVoid) {
			if (playVoid) {
				this.playSuccess = playVoid;
			}
			if (this.password) {
				this.selectItem = item;
				this.inputPassWord = this.inputPassWord.trim();
				if (this.inputPassWord.length > 0 && this.inputPassWord == this.password) {
					this.verifyPassWord();
					return;
				}
				this.$refs.pswPop.open();
				return;
			} else {
				if (item.fileType == 'file') {
					openFile(item);
				} else if (this.playSuccess) {
					// 播放视频
					this.playSuccess();
				} else {
					this.prewImgVoid(item);
				}
			}
		},
		// 密码
		verifyPassWord: function() {
			this.inputPassWord = this.inputPassWord.trim();
			if (this.inputPassWord.length > 0 && this.inputPassWord == this.password) {
				if (this.selectItem.fileType == 'file') {
					openFile(this.selectItem);
				} else if (this.playSuccess) {
					// 播放视频
					this.playSuccess();
					console.log('eeee');
				} else {
					this.prewImgVoid(this.selectItem);
					console.log('eeee222');
				}
				this.hidePop();
			} else {
				msg('密码不对');
			}
		},
		hidePop: function() {
			this.playSuccess = '';
			this.$refs.pswPop.close();
		},
		getSizeMb: function(e) {
			// superTools()e/1024
			return this.superTools.keepTwoDecimal(e / 1024 / 1024) + 'MB';
		}
	}
};
</script>

<style>
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
