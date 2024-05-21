<template>
	<uni-popup ref="popview">
		<view @click="prewImg" class="column-start-center border-radius-10  bg-white p-all-15" style="width: 690rpx;">
			<text class="font-bold color-999" style="font-size: 60rpx;">{{ product.amount }}劵</text>
			<image class="w-80 border-radius-10" mode="widthFix" :src="qrcode.url" />
			<!-- <text class="text-white font-26" style="color: #FFC07B;">有效期：{{ item.beginTime }}-{{ item.endTime }}</text> -->
		</view>

		<view style="height:50rpx"></view>
		<!-- <view @click="savQrVoid" class="commit_bt  m-all-10"><text>保存</text></view> -->
		<view @click="hide()" class="row-center-center"><uni-icons type="close" size="30" color="#fff"></uni-icons></view>

		<gg-draw-posters :postersData="postersData" @success="onSuccessCreatePosters" @error="onPostersError" />

		<canvas class="canvas-hide" canvas-id="qqrcode" style="width: 300px;height: 300px; " />
	</uni-popup>
</template>

<script>
import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import appConfig from '@/common/ss-superModules/superBase/ss.config.js';

export default {
	data() {
		return {
			product: '',
			swiperH: uni.getSystemInfoSync().screenWidth,
			screenH: uni.getSystemInfoSync().screenHeight + 'rpx',
			showShare: false,
			canvasId: 'default_PosterCanvasId',
			postersData: {},
			posterImg: {},
			code: appConfig.webpath + '/#/pages/login/register?pid=' + this.superTools.get_userinfo().inviteCode,
			qrcode: {
				width: 660 * 0.8,
				top: 820 * 0.2,
				left: 660 * 0.1,
				url: ''
			},

			posterSize: {
				width: 660,
				height: 820
			},
			imgArr: [
				{
					bgImg: '/static/mine/share.png',
					posterImg: ''
				}
			],

			currIndex: 0,
			shareBt: 750 * 0.15, //20,//
			swiperCurIndex: 0
		};
	},
	mounted() {
		// this.createQRcode();
	},
	computed: {
		...mapGetters({
			userInfo: 'user/userInfo'
		})
	},
	methods: {
		show: function(item) {
			this.product = item;
			this.code = item.code;
			this.$refs.popview.open();
			this.createQRcode();
		},
		hide: function() {
			this.$refs.popview.close();
		},
		prewImg: function() {
			uni.previewImage({
				current: 0,
				urls: [this.imgArr[this.swiperCurIndex]['posterImg']]
			});
		},
		createQRcode: function() {
			// console.log(111);
			// this.code = 'http://mt.junzhongvip.com/register/#/pages/login/register?pid=' + 'this.superTools.get_userinfo().inviteCode';
			// return;
			let self = this;
			uQRCode
				.make({
					canvasId: 'qqrcode',
					componentInstance: this,
					text: this.code,
					size: 300,
					margin: 15,
					backgroundColor: 'transparent',
					foregroundColor: '#000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H
				})
				.then(res => {
					self.onResult(res);
					// console.log(res);
				});
		},
		sharevoid: function() {
			this.showShare = true;
		},
		shareTowxVoid: function(e) {
			let self = this;
			let shareimg = this.imgArr[this.swiperCurIndex]['posterImg'];

			// #ifdef APP-PLUS
			uni.shareWithSystem({
				summary: '',
				href: '',
				imageUrl: shareimg,
				success() {
					// 分享完成，请注意此时不一定是成功分享
				},
				fail() {
					// 分享失败
				}
			});

			// #endif

			// #ifdef H5
			uni.previewImage({
				current: 0,
				urls: [shareimg]
			});
			// #endif

			//
			return;
		},
		savQrVoid: function() {
			let self = this;
			let shareimg = this.imgArr[this.swiperCurIndex]['posterImg'];

			uni.saveImageToPhotosAlbum({
				filePath: shareimg,
				success: function() {
					self.$api.msg('以保存到系统相册');
					self.hide();
					//console.log('save success');
				}
			});
		},

		initPostersConfig() {
			let self = this;
			const config = {
				clear: true,
				width: this.posterSize.width,
				height: this.posterSize.height,
				background: '#ffffff',
				views: [
					{
						type: 'image',
						width: this.posterSize.width,
						height: this.posterSize.height,
						top: 0,
						left: 0,
						// 封面图，测试的时候填上
						url: this.imgArr[this.currIndex]['bgImg']
					},
					{
						type: 'text',
						width: 200,
						height: 50,
						left: this.posterSize.width * 0.35,
						top: this.posterSize.height * 0.06,
						fontSize: 46,
						fontWeight: 1000,
						lineHeight: 40,
						bolder: true,
						breakWord: true,
						content: '邀请门店',
						color: '#fff',
						MaxLineNumber: 2
					},
					// {
					// 	type: 'image',
					// 	width: 64,
					// 	height: 64,
					// 	left: this.posterSize.width / 2 - 32,
					// 	top: this.posterSize.height * 0.83,
					// 	radius: 8,
					// 	// 封面图，测试的时候填上
					// 	url: '/static/logo.png'
					// },

					// {
					// 	type: 'text',
					// 	width: 200,
					// 	height: 50,
					// 	left: this.posterSize.width / 2 - 49,
					// 	top: this.posterSize.height * 0.84,
					// 	fontSize: 46,
					// 	fontWeight: 600,
					// 	lineHeight: 40,
					// 	bolder: true,
					// 	breakWord: true,
					// 	content: '喵团',
					// 	color: '#FD7904',
					// 	MaxLineNumber: 1
					// },
					// {
					// 	type: 'text',
					// 	width: 1000,
					// 	height: 50,
					// 	left: this.posterSize.width * 0.312,
					// 	top: this.posterSize.height * 0.85,
					// 	fontSize: 33,
					// 	fontWeight: 800,
					// 	lineHeight: 40,
					// 	bolder: true,
					// 	breakWord: true,
					// 	content: '邀请码:',
					// 	color: '#888',
					// 	background: '#000',
					// 	MaxLineNumber: 2
					// },
					// {
					// 	type: 'text',
					// 	width: 1000,
					// 	height: 50,
					// 	left: this.posterSize.width * 0.47,
					// 	top: this.posterSize.height * 0.85,
					// 	fontSize: 33,
					// 	fontWeight: 800,
					// 	lineHeight: 40,
					// 	bolder: true,
					// 	breakWord: true,
					// 	content: this.userInfo.inviteCode,
					// 	color: '#F34646',
					// 	background: '#000',
					// 	MaxLineNumber: 2
					// },
					{
						type: 'image',
						width: parseInt(this.qrcode.width),
						height: parseInt(this.qrcode.width),
						top: parseInt(this.qrcode.top),
						left: parseInt(this.qrcode.left),
						// 二维码图片路径，测试的时候填上'this.qrcode.url'
						url: self.qrcode.url
					}
				]
			};
			this.$set(this, 'postersData', config);
			// //console.log({ ...this.postersData });
		},
		onSuccessCreatePosters: async function(res) {
			let self = this;
			this.$set(this, 'posterImg', res);
			self.imgArr[self.currIndex]['posterImg'] = res.path;

			// #ifdef H5
			self.currIndex++;

			if (self.currIndex == self.imgArr.length) {
				uni.hideLoading();
				return;
			}
			self.initPostersConfig();
			// #endif
		},

		onPostersError(res) {
			// //console.log(res);
		},
		onResult(e) {
			this.qrcode.url = e;
			console.log('二维码地址', this.qrcode.url);
			// this.$forceUpdate();
			// this.initPostersConfig();
		}
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
.canvas-hide {
	/* 1 */
	position: fixed;
	right: 100vw;
	bottom: 100vh;
	/* 2 */
	z-index: -9999;
	/* 3 */
	opacity: 0;
}
</style>
