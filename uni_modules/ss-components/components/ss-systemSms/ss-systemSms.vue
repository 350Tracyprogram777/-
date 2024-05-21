<template>
	<view v-if="showview" class="fixed-all column-center-center" style="z-index: 10000;background-color: rgba(0,0,0,0.3);">
		<view class="bg-white  w-80 column-center-center" style="padding: 48rpx 30rpx 38rpx 30rpx;border-radius: 40rpx;">
			<text class="font-30" style="color: #000;font-weight: bold;">{{ dataDic.title }}</text>
			<text class="m-tb-10 text-autoline overflow_scroll" style="line-height: 40rpx;max-height: 200px;">{{ dataDic.content }}</text>

			<!-- <text class="font-24 themecolor" @click="NavToDetail()">查看详情</text> -->
			<view class="row-between-center align-self-stretch" style="margin-top: 26rpx;">
				<text class="twobt-sure bg-color color-999" @click="twoClick(true)">知道了</text>

				<text class="twobt-sure bt-bg-theme text-white" @click="NavToDetail()">查看详情</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataDic: '',
			showview: false,
			selectState: false
		};
	},
	mounted() {
		this.getNewMsg();
	},

	methods: {
		getNewMsg: function() {
			this.superData.superRequest('appBasic/notice/pop',{},' ').then(res => {
				console.log('系统公告', res);
				if (res) {
					this.dataDic = res;
					this.showview = true;
				}
			});
		},

		twoClick: function(e) {
			this.showview = false;
			this.superData
				.superRequest('appBasic/notice/get', {
					id: this.dataDic.id
				},' ')
				.then(res => {
					// console.log('获取新闻分类列表', res)
					// this.dataDic = res
				});
		},
		NavToDetail: function() {
			this.superTools.save_navdata(this.dataDic);
			this.showview = false;
			uni.navigateTo({
				url: '/pages/systemMsgManager/msgDetail/msgDetail'
			});
		}
	}
};
</script>

<style>
.text-radius {
	width: 40rpx;
	height: 40rpx;
	line-height: 40rpx;
	border-radius: 20rpx;
	background-color: #8645fd;
	color: #ffffff;
	flex-shrink: 0;
	text-align: center;
	font-size: 24rpx;
}

.twobt-cancle {
	flex-grow: 1;
	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	color: #fff;
	line-height: 80rpx;
	background: #bbbbbb;
	border-radius: 40rpx;
	margin-right: 10rpx;
}

.twobt-sure {
	flex-grow: 1;
	margin-left: 10rpx;
	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	line-height: 80rpx;
	border-radius: 40rpx;
}
</style>
