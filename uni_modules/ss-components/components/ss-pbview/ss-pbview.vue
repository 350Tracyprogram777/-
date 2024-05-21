<template>
	<view class="grid-two grid-gap-5 ">
		<!-- 左侧试图 -->
		<view class="grid-one grid-gap-10">
			<view class="bg-white " style="width: 100%;" v-for="(item, index) in leftArr" :key="index"><slot name="left" :data="item"></slot></view>
		</view>
		<!-- 右侧视图 -->
		<view class="grid-one grid-gap-10">
			<view class="bg-white" style="width: 100%;" v-for="(item, index) in rightArr" :key="index">
				<slot name="right" :data="item"></slot>

				<!-- <image :src="item.img" mode="widthFix" class="w-100" :style="{ height: item.height }"></image> -->
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		img_max_h: {
			type: Number,
			default: 300
		},
		dataList: {
			type: Array,
			default: () => []
		},
		img_field: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			leftH: 0,
			rightH: 0,
			leftArr: [],
			rightArr: [],
			img_width: (uni.getSystemInfoSync().screenWidth - 30) / 2 //图片宽度
		};
	},
	mounted() {},
	watch: {
		dataList: function(a) {
			this.switchData();
		}
	},
	methods: {
		switchData: async function() {
			console.log(1111, this.dataList);

			let arr = ['/static/end.png', '/static/fwh.jpg', '/static/hd.png'];
			let allArr = [...this.leftArr, ...this.rightArr];
			if(this.dataList.length==0 && allArr.length>0)
			{
				this.leftArr=[]
				this.rightArr=[]
				this.leftH=0
				this.rightH=0
				return
			}

			for (let item of this.dataList) {
				// 过滤掉已经加载的
				let czIndex = allArr.findIndex(function(cc, dd) {
					return cc._id == item._id;
				});
				if (czIndex >= 0) {
					continue;
				}
				let imgH = await this.getImgH(item[this.img_field]);
				item['height'] = imgH;
				if (this.leftH > this.rightH) {
					this.rightH = this.rightH + imgH;
					this.rightArr.push(item);
				} else {
					this.leftH = this.leftH + imgH;
					this.leftArr.push(item);
				}
			}
		},
		getImgH: async function(imgPath) {
			let res = await uni.getImageInfo({
				src: imgPath
			});
			let w = res[1]['width'];
			let h = res[1]['height'];
			let imgH = (this.img_width * h) / w;
			console.log('ooo', imgH);
			if (imgH > this.img_max_h) {
				return this.img_max_h;
			}
			return imgH;
		}
	}
};
</script>

<style></style>
