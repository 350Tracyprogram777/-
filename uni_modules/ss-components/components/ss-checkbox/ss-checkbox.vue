<template>
	<view>
		<view class="fixed-modal  column-end-center bottom-modal bg-red " :class="show ? 'show' : ''" @click="cancleClick" style="	background: rgba(0, 0, 0, 0.4);">
			<view class="align-self-stretch bg-white " @click.stop="">
				<view class="row-center-center p-tb-10 m-t-10">
					<text class="themecolor font-bold font-36">选择要办理的业务</text>
				</view>
				<view class="row-wrap overflow_scroll" style="max-height: 400px;padding: 20px 30px;">
					<view class="row-center-center m-r-15" style="margin-top: 26rpx;" v-for="(item, index) in enumArr" :key="index">
						<text :class="[item.check ? 'selectItem-s' : 'selectItem-n']" @click.stop="selectItemVoid(item)">{{ item.name }}</text>
					</view>
				</view>
				<!--确定与取消 -->
				<view class="row-between-center  p-t-10 border-bottom-eee  align-self-stretch">
					<text style="background-color:#eee;color: #333;height: 88rpx;line-height: 88rpx;" class="   flex-grow text-center" @click.stop="cancleClick">取消</text>
					<text style="color: #fff;height: 88rpx;line-height: 88rpx;" class="bg-theme  flex-grow text-center font-bold" @click.stop="sureClick">确定</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			//单选还是多选
			type: String,
			default: '选择'
		},

		selectArr: {
			//选中的模型
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			selectDic: {},
			show: false,
			isRadio: false, //单选
			enumArr: [] //选项
		};
	},

	methods: {
		open: function(selectArr, dataArr) {
			this.show = true;
			// this.isRadio = !item.multiple; //单选还是多选
			this.enumArr = dataArr;
			for (let item of this.enumArr) {
				selectArr.map(function(selectItem, index) {
					if (item.name == selectItem.name) {
						item['check'] = true;
					}
				});
			}
		},
		// 取消
		cancleClick: function() {
			this.show = false;
		},
		// 确定提交
		sureClick: function() {
			let arr = [];
			this.enumArr.forEach(function(a, b) {
				if (a.check == true) {
					return arr.push(a);
				}
			});
			this.$emit('success', arr);
			this.show = false;
		},
		// 选中的项
		selectItemVoid: function(item) {
			if (this.isRadio) {
				let find = this.enumArr.find(function(subitem, index) {
					return subitem.check;
				});
				if (find) {
					find.check = false;
				}
			}
			item.check = !item.check;
			this.$forceUpdate();
		}
	}
};
</script>

<style>
.selectItem-s {
	background-color: #388afa;
	padding: 15rpx 30rpx;
	border-radius: 5px;
	font-size: 12pt;
	color: #fff;
}

.selectItem-n {
	background-color: #eee;
	padding: 15rpx 30rpx;
	border-radius: 5px;
	font-size: 12pt;
}
</style>
