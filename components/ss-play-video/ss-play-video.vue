<template>
	<view class="" :style="{ width: width, height: height }">
		<view class="p_r column-center-center " v-if="mediaDic.fileType == 'video'" @click="playVoid">
			<image :src="switchVideoSize(mediaDic.url)" :style="{ width: width, height: height }" class="bg-color border-radius-4"></image>
			<text class="p_a iconfont icon-icon_video  " style="font-size: 30px;color: aliceblue;"></text>
		</view>
		<view v-if="playVideo" class="fixed-all column-center-center" style="width: 750rpx;z-index: 1000;position: fixed;top: 0rpx;left: 0rpx;bottom: 0rpx;">
			<video :src="playUrl" autoplay style="width: 100%;"></video>
			<uni-icons type="close" size="36" color="#eee" @click="closeVideo" click="m-t-15"></uni-icons>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ss-play-video',
	props: {
		mediaDic: {
			type: Object,
			default: () => {}
		},
		width: {
			type: String,
			default: '100%'
		},
		height: {
			type: String,
			default: '750rpx'
		}
	},

	data() {
		return {
			playUrl: '',
			playVideo:false
		};
	},


	methods: {
		// 等比缩水
		switchVideoSize: function(imageurl) {
			// 等比缩放
			return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
		},
		playVoid: function() {
			let self=this
			function startPlay() {
				self.playUrl = self.mediaDic.url;
				self.playVideo = true;
				console.log('播放视频')
			}
			console.log('dddd',startPlay)
			this.$emit('play', startPlay);
			
		},
		closeVideo: function() {
			this.playUrl = '';
			this.playVideo = false;
			// this.$emit('play', false);
		}
	}
};
</script>

<style></style>
