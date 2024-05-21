<template>
	<view class="">
		<view class="row-start-center  " style="padding-bottom: 10rpx;z-index: 1;">
			<text @click="agreeVoid" :class="['iconfont', isAgree ? 'iconic_gouwuche_quan_p themecolor' : 'iconic_gouwuche_quan_n color-999', 'font-32']"></text>

			<text class="m-l-5 flex-shrink" style="font-size:24rpx;font-family:PingFangSC-Regular,PingFang SC;color:#999;line-height:33rpx;">已阅读并同意</text>
			<block v-for="(item, index) in titleArr" :key="index">
				<text @click="showxyVoid()" class="themecolor flex-shrink" style="font-size:24rpx;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;line-height:33rpx;">
					《{{ item }}》
				</text>
			</block>
		</view>

		<view v-if="showxyView" class="superview" style="">
			<view class="bg-white align-self-stretch column-center-center" style="border-radius:40rpx;margin: 88rpx;padding:40rpx 30rpx 31rpx 30rpx;">
				<text class="align-self-stretch text-center" style="font-size: 30rpx;color: #222;font-weight:500;">{{ dataDic.title }}</text>
				<view class="column-start-start align-self-stretch overflow_scroll" style="height: 530rpx;margin-top:32rpx;">
					<!-- <text>隐私政策</text> -->
					<rich-text :nodes="dataDic.content"></rich-text>
				</view>
				<view class="row-between-center align-self-stretch" style="margin-top: 32rpx;">
					<text v-if="showcancle" @click="tyclick(false)" class="twobt-cancle">{{ cancleText }}</text>
					<text @click="tyclick(true)" class="twobt-sure bg-theme">{{ sureText }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// import htmparser from "@/common/super-uni/html-parser.js"
export default {
	props: {
		titleArr: {
			type: Array,
			default: function() {
				return ['用户服务协议'];
			}
		},
		showcancle: {
			type: Boolean,
			default: true
		},
		cancleText: {
			type: String,
			default: '不同意'
		},
		sureText: {
			type: String,
			default: '同意'
		}
	},
	data() {
		return {
			dataDic: {},
			showxyView: false,
			isAgree: false
		};
	},
	mounted() {},
	methods: {
		tyclick: function(e) {
			this.isAgree = e;
			this.$emit('agreeChange', e);
			this.showxyView = false;
		},
		//展示协议
		showxyVoid: function() {
			console.log('33333',this)
			this.superData.superRequest('appBasic/rule/get', { type: 3 }).then(res => {
				// console.log('获取新闻分类列表', res);
				this.dataDic = res;
				this.showxyView = true;
			});
		},

		agreeVoid: function() {
			this.isAgree = !this.isAgree;
			this.$emit('agreeChange', this.isAgree);
		}
	}
};
</script>

<style>
.superview {
	position: fixed;
	top: 0px;
	right: 0px;
	left: 0rpx;
	bottom: 0rpx;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
}

.twobt-cancle {
	flex-grow: 1;
	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	color: rgba(255, 255, 255, 1);
	line-height: 80rpx;
	background-color: #aaa;
	border-radius: 8rpx;
	margin-right: 10rpx;
}

.twobt-sure {
	flex-grow: 1;
	margin-left: 10rpx;

	height: 80rpx;
	border-radius: 40rpx;
	text-align: center;
	color: #fff;
	line-height: 80rpx;
	border-radius: 8rpx;
}
</style>
