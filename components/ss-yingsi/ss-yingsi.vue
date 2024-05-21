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
				<text class="align-self-stretch text-center" style="font-size: 30rpx;color: #222;font-weight:600;">{{ dataDic.title }}</text>
				<view class="grid-one align-self-stretch overflow_scroll" style="height: 530rpx;margin-top:32rpx;">
					<!-- <text>隐私政策</text> -->
					<text class="">
						&emsp;家在龙兴嘉苑2号院,以下简称我们,为了更好的为您提供服务,我们需要收集并使用您的信息,请您仔细阅读并充分理解本协议,同意本协议将可进行下一步操作,否则我们将无法为您提供更多服务!
					</text>
					<text class="font-bold color-333">信息的收集与使用目的</text>
					<text>为了更友好的展示，我们将在获取你的明示同意后，收集你的微信昵称、头像</text>
					<text>为了获取具体位置信息，我们将在获取你的明示同意后，收集你的位置信息。</text>
					<text>为了更友好的展示，我们将在获取你的明示同意后，收集你的微信昵称、头像</text>
					<text>为了用户更好的联系到你，我们将在获取你的明示同意后，收集你的手机号</text>
					<text>我们收集你选中的文件，用于展示给其他用户查看或者下载</text>
					<text class="font-bold color-333">信息的使用规则</text>
					<text>
						我们将会在本指引所明示的用途内使用收集的信息
						如我们使用你的信息超出本指引目的或合理范围，我们必须在变更使用目的或范围前，再次以电话方式告知并征得你的明示同意。 信息对外提供
						我们承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，我们应当直接征得或确认第三方征得你的单独同意。
						我们承诺，不会对外公开披露你的信息，如必须公开披露时，我们应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
						若你认为我们未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与我们联系；或者向微信进行投诉。 - 手机号: 15903627013
					</text>
					<text class="font-bold color-333">信息对外提供</text>
					<text>
						我们承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，我们应当直接征得或确认第三方征得你的单独同意。
						我们承诺，不会对外公开披露你的信息，如必须公开披露时，我们应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
						若你认为我们未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与我们联系；或者向微信进行投诉。 手机号: 15903627013
					</text>
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
import content from './yingsi.js';
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
			dataDic: { title: '用户服务协议和隐私政策' },
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
			console.log(content);
			this.dataDic['content'] = content;
			this.showxyView = true;
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
