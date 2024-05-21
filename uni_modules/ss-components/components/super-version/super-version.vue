<template>
	<view class="">
		<view v-if="isAdmin" class="fixed-bug bg-theme row-center-center" @click="show"><text class="text-white font-bold">debug</text></view>

		<uni-popup ref="popview" :isMaskClick="false">
			<view class="grid-one bg-white border-radius-15" style="width: 690rpx;padding: 30rpx;">
				<view class="row-center-center"><text class="font-bold font-36">切换服务器</text></view>
				<uni-data-checkbox :localdata="checkBox" @change="boxChange" v-model="serverUrl"></uni-data-checkbox>

				<uni-combox class="flex-grow" placeholder="选择输入服务器地址" v-model="serverUrl" :candidates="candidates"></uni-combox>
				<view class="commit_bt font-26 border-radius-5" style="height: 68rpx;width: 100%;" @click="commitVoid"><text>切换</text></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import appConfig from '@/common/ss-superModules/superBase/ss.config.js';
const curr_domain = appConfig.isdev ? appConfig.base_url_dev : appConfig.base_url_pro;

export default {
	name: 'super-version',
	props: {
		phone: {
			type: String || Number,
			default: ''
		}
	},
	data() {
		return {
			checkBox: [{ text: '线上', value: appConfig.base_url_pro }, { text: '本地', value: appConfig.base_url_dev }],
			candidates: [],
			serverUrl: curr_domain,
			isOpen: false
		};
	},
	computed: {
		isAdmin() {
			if (this.phone == '15903627013' || this.phone == '18538602022') {
				return true;
			} else {
				return false;
			}
		}
	},

	mounted() {
		this.candidates = uni.getStorageSync('SERVERLIST') || [appConfig.base_url_dev, appConfig.base_url_pro];
		this.initInterceptor();
	},
	unmounted() {
		// uni.removeInterceptor('request');
	},

	methods: {
		show: function() {
			this.$refs.popview.open();
		},
		hide: function() {
			this.$refs.popview.close();
		},
		initInterceptor: function() {
			console.log('------')
			let self = this;
			uni.addInterceptor('request', {
				invoke(args) {
					args.url = args.url.replace(curr_domain, self.serverUrl);
					// console.log('url--',curr_domain)
					console.log('args.url',args.url)
				},
				success(args) {
					if (!self.candidates.includes(self.serverUrl)) {
						self.candidates.push(self.serverUrl);
						uni.setStorageSync('SERVERLIST', self.candidates);
					}
					// 请求成功后，修改code值为1
					// args.data.code = 1;
				},
				fail(err) {
					// console.log('interceptor-fail', err);
				},
				complete(res) {
					// console.log('interceptor-complete', res);
				}
			});
		},
		// 切换改变
		commitVoid: function(e) {
			if (this.serverUrl.indexOf('http://') == 0 || this.serverUrl.indexOf('https://') == 0) {
				if (this.serverUrl.substr(-1, 1) != '/') {
					this.serverUrl = this.serverUrl + '/';
				}
				this.hide();
			} else {
				uni.showToast({
					title: '格式错误',
					icon: 'error'
				});
			}
		},
		// 黑子改变
		boxChange: function(e) {
			console.log(e);
			this.serverUrl = e.detail.value;
		}
	}
};
</script>

<style>
.fixed-bug {
	position: fixed;
	bottom: 200rpx;
	right: 30rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
}
</style>
