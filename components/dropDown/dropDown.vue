<template>
	<view class="dropview">
		<view class="grid-one grid-gap-1 " :style="{ 'grid-template-columns': 'repeat(' + menuArr.length + ',1fr)' }">
			<view
				:class="[selectMenuIndex == index ? 'themecolor' : 'color-333']"
				class="row-center-center menuView"
				v-for="(item, index) in menuArr"
				:key="index"
				@click="mainMenuClick(item, index)"
			>
				<text style="color:inherit" class="m-r-3">{{ item.text }}</text>
				<uni-icons
					v-if="item.type == 'radio'"
					color="inherit"
					size="14"
					type="right"
					:style="{ transform: selectMenuIndex == index ? 'rotate(90deg)' : 'rotate(0deg)', transition: ' all 0.3s' }"
					s
				></uni-icons>
				<text v-if="item.type == 'check'" class="iconfont icon-shaixuan" style="color: inherit;"></text>
				
			</view>
		</view>
		<view class="shadwView"  :style="{	'height':popviewH > 0 ? '500px':'0rpx', 'z-index': popviewH > 0 ? 10 : -100 }">
			<view v-if="selectMenuItem.type == 'radio'" class="popview grid-one grid-gap-1 " :style="{ height: popviewH + 'rpx' }">
				<view
					@click.stop="subItemClick(subItem)"
					class="row-between-center submenuview  bg-white p-lr-15 "
					style="height: 80rpx;"
					:class="[subItem.value == selectMenuItem.value ? 'themecolor' : 'color-333']"
					v-for="(subItem, index) in selectMenuItem.options"
					:key="subItem.value"
				>
					<text style="color: inherit;">{{ subItem.text }}</text>
					<uni-icons v-if="subItem.value == selectMenuItem.value" type="checkmarkempty" color="inherit"></uni-icons>
					<uni-icons v-else type="checkmarkempty" color="#fff"></uni-icons>
				</view>
			</view>
			<!-- 筛选 -->
			<view v-if="selectMenuItem.type == 'check'" class="popview grid-one grid-gap-1 " :style="{ height: popviewH + 'rpx' }">
				<view class="" style="max-height: 900rpx;overflow:scroll;">
					<view class="" v-for="(item, index) in selectMenuItem.options" :key="item.text">
						<view v-if="isShow(item)" class="grid-one grid-gap-4 submenuview  bg-white p-lr-15" style="height: 140rpx;align-content: center;">
							<text class="color-999">{{ item.text }}</text>
							<uni-data-checkbox v-model="item.value" mode="tag" :localdata="item.options"></uni-data-checkbox>
						</view>
					</view>
				</view>

				<view class="grid-two bg-white ">
					<view @click.stop="resetClick" class="commit_bt bg-white" style="border: 2rpx solid orange;color: orange;"><text>重置</text></view>
					<view class="commit_bt" @click.stop="sureClick()"><text>确定</text></view>
				</view>
			</view>
			<view @click="hideClick" class="p_a" :style="{'top':popviewH+'rpx'}" style="background-color: rgba(0, 0, 0, 0.1);width: 750rpx;left: 0rpx;bottom: 0px;">
				
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'dropDown',
	props: {
		menuArr: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			selectMenuIndex: -1,
			selectMenuItem: '',
			popviewH: 0,
			sall_rent_type: 0
		};
	},

	methods: {
		mainMenuClick: function(item, index) {
			if (index != this.selectMenuIndex) {
				this.selectMenuIndex = index;
				this.selectMenuItem = item;
				if (item.type == 'radio') {
					this.popviewH = this.selectMenuItem.options.length * 80;
				} else {
					if (this.sall_rent_type == 0) {
						this.popviewH = this.selectMenuItem.options.length * 140 + 10;
					} else {
						this.popviewH = (this.selectMenuItem.options.length - 3) * 140 + 10;
					}
				}
			} else {
				this.popviewH = 0;
				this.selectMenuIndex = -1;
			}
			console.log(this.selectMenuItem);
		},
		isShow: function(item) {
			if (item.field == 'rent_type' || item.field == 'main_room_type' || item.field == 'rent_duration_type') {
				if (this.sall_rent_type != 0) {
					return false;
				}
			}
			if (item.field == 'main_room_type') {
				let rent_type_item = '';
				for (let item of this.menuArr) {
					if (item.type == 'check') {
						rent_type_item = item.options.find((a, b) => a.field == 'rent_type');
					}
				}
				if (rent_type_item.value != 1) {
					return false;
				}
			}

			return true;
		},
		// 确认选择
		subItemClick: function(subitem) {
			this.selectMenuItem.value = subitem.value;
			this.selectMenuItem.text = subitem.text;
			this.selectMenuIndex = -1;
			this.popviewH = 0;
			if (this.selectMenuItem.field == 'sall_rent_type') {
				this.sall_rent_type = subitem.value;
			}
			let dic = {};
			for (let item of this.menuArr) {
				if (item.type == 'radio') {
					dic[item.field] = item.value;
				} else {
					for (let item2 of item.options) {
						dic[item2.field] = item2.value;
					}
				}
			}
			this.$emit('sure', dic);
		},
		sureClick: function() {
			let dic = {};
			for (let item of this.menuArr) {
				if (item.type == 'radio') {
					dic[item.field] = item.value;
				} else {
					for (let item2 of item.options) {
						dic[item2.field] = item2.value;
					}
				}
			}
			this.selectMenuIndex = -1;
			this.popviewH = 0;
			this.$emit('sure', dic);
		},
		resetClick: function() {
			for (let item of this.menuArr) {
				if (item.type == 'check') {
					for (let item2 of item.options) {
						item2.value = 0;
					}
				}
			}
		},
		hideClick:function(e)
		{
			
			console.log(e)
			this.popviewH = 0;
			this.selectMenuIndex = -1;
		}
	}
};
</script>

<style>
.dropview {
	position: sticky;
	top: 0rpx;
	left: 0rpx;
	right: 0rpx;
	z-index: 10;
}
.menuView {
	background-color: #fff;
	padding: 20rpx 0rpx;
	/* height: 80rpx; */
}
.shadwView {
	position: absolute;
	left: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	top: 80rpx;
	z-index: -1;
	transition: all 0.1s;
}
.popview {
	background-color: #fff;
	border-top: 1rpx solid #eee;
	transition: all 0.2s;
	overflow: scroll;
}
</style>
