<template>
	<view>
		<scroll-view scroll-with-animation :scroll-left="leftdance" scroll-x
			:class="['topTabar', border ? 'border_s' : 'border_n']"
			:style="{ 'justify-content': justifycontent, 'background-color': bgcolor }">
			<view :class="[widthNum, getStyle()]" v-for="(item, index) in tabarArr" :key="index"
				@click="changeVoid({ index: index, item: item })" class="column-center-center   flex-shrink "
				style="display:inline-flex;color:#FBBD08">
				<view class="p_r">
					<text :class="[index == topSelectIndex ? 'item_s' : 'item_n']">{{ item.text }}</text>
					<text v-if="item.num > 0" class="p_a redNum">{{ item.num }}</text>
				</view>
				<text :class="[index == topSelectIndex ? 'item_s_b' : 'item_n_b']"></text>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		props: {
			//选项数组
			tabarArr: {
				type: Array,
				default: function() {
					return [{
						value: 0,
						text: '我的'
					}, {
						value: 1,
						text: '公开模板'
					}];
				}
			},
			// 选中的那个
			topSelectIndex: {
				type: [Number, String],
				default: 0
			},
			// 风格
			styleSet: {
				type: [String, Number],
				default: '2'
			},
			// 等分
			widthNum: {
				type: String,
				default: ''
			},
			justifycontent: {
				type: String,
				default: 'flex-start'
			},
			bgcolor: {
				type: String,
				default: '#FFFFFF'
			},
			border: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				scrollLeft: 1
			};
		},
		computed: {
			leftdance: function() {
				return 100 * (this.topSelectIndex - 1);
			}
		},
		methods: {
			changeVoid: function(e) {
				// this.topSelectIndex=e.index
				this.$emit('tabSelect', e);
			},
			getStyle: function() {
				return 'style-' + this.styleSet;
			}
		}
	};

</script>
<style lang="scss">
	// ::v-deep .uni-scroll-view {
	// 	overflow: hidden !important;
	// }
	.topTabar {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		overflow: scroll;
		background-color: #fff;
		position: sticky;
		white-space: nowrap;
		width: 100%;
		top: 0px;
		z-index: 10;
		padding: 8px 8px 0px 8px;
	}

	.border_s {
		border-bottom: 1px #f9f9f9 solid;
	}

	.redNum {
		height: 10px;
		width: 10px;
		line-height: 10px;
		font-size: 10px;
		color: #fb740a;
		font-weight: bold;
	}

	.style-1 //选中变大

		{
		.item_s {
			color: #f24646;
			font-size: 12pt;
			align-self: stretch;
			text-align: center;
			font-weight: bold;
		}

		.item_n {
			color: #333;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
		}

		.item_s_b {
			height: 2px;
			margin-top: 8px;
			width: 90%;
			background: #f24646;
			border-radius: 2px;
		}

		.item_n_b {
			align-self: stretch;
			height: 2px;
			background-color: #fff;
			margin-top: 8px;
		}
	}

	.style-2 //正常	

		{
		.item_s {
			color: #ff4742;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
			// font-weight: bold;
		}

		.item_n {
			color: #222222;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
			font-size: 400;
		}

		.item_s_b {
			height: 2px;
			margin-top: 8px;
			width: 50%;
			background: #ff4742;
			border-radius: 2px;
		}

		.item_n_b {
			align-self: stretch;
			height: 2px;
			background-color: #fff;
			margin-top: 8px;
		}
	}

	.style-3 //横线短

		{
		.item_s {
			color: #FF944D;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
			font-weight: bold;
		}

		.item_n {
			color: #666;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
		}

		.item_s_b {
			height: 2px;
			margin-top: 8px;
			width: 30%;
			background: #FF944D;
			border-radius: 2px;
		}

		.item_n_b {
			align-self: stretch;
			height: 2px;
			background-color: #fff;
			margin-top: 8px;
		}
	}

	.style-4 //横线短

		{
		.item_s {
			color: #ff4742;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
		}

		.item_n {
			color: #333;
			font-size: 11pt;
			align-self: stretch;
			text-align: center;
		}

		.item_s_b {
			height: 2px;
			margin-top: 8px;
			width: 30%;
			background: #ff4742;
			border-radius: 2px;
		}

		.item_n_b {
			align-self: stretch;
			height: 2px;
			background-color: #fff;
			margin-top: 8px;
		}
	}

	.style-5 //横线短

		{
		.item_s {
			color: #ff4742;
			font-size: 32rpx;
			align-self: stretch;
			text-align: center;
			font-weight: bold;
		}

		.item_n {
			color: #333;
			font-size: 32rpx;
			align-self: stretch;
			text-align: center;
			font-weight: bold;
		}

		.item_s_b {
			height: 2px;
			margin-top: 8px;
			width: 100%;
			background: #ff4742;
			border-radius: 2px;
		}

		.item_n_b {
			align-self: stretch;
			height: 2px;
			/* background-color: #fff; */
			margin-top: 8px;
		}
	}

	.style-11 {
		.item_s {
			background: rgba(32, 84, 244, 0.08);
			border-radius: 8rpx;
			padding: 12rpx 26rpx;
			color: #ff4742;
			display: block;
			font-size: 28rpx;
			align-self: stretch;
			text-align: center;
		}

		.item_n {
			background: #f6f6f6;
			border-radius: 8rpx;
			padding: 12rpx 26rpx;
			color: #3d414b;
			display: block;
			font-size: 28rpx;
			align-self: stretch;
			text-align: center;
		}

		.item_s_b {
			// height: 2px;
			// margin-top: 8px;
			// width: 90%;
			// background: #f24646;
			// border-radius: 2px;
		}

		.item_n_b {
			// align-self: stretch;
			// height: 2px;
			// background-color: #fff;
			// margin-top: 8px;
		}
	}

	.w-25 {
		width: 25%;
	}

	.w-33 {
		width: 33.33%;
	}

	.w-50 {
		width: 50%;
	}

</style>
