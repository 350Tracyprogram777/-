<template>
	<view @click="sendSms" class=" row-center-center" style="width: 200rpx;border-radius: 44rpx;">
		<text class="font-bold themecolor " style="color: inherit;font-size: inherit;font-weight: inherit;">{{ btText }}</text>
	</view>
</template>

<script>
// import htmparser from "@/common/super-uni/html-parser.js"
export default {
	props: {
		phone: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			btText: '获取验证码',
			timer: '',
			code: ''
		};
	},
	mounted() {},
	methods: {
		sendSms: function() {
			let self = this;
			if (this.btText == '获取验证码' || this.btText == '重新获取') {
				if (this.phone.length != 11) {
				
					uni.showToast({
						title: '手机号码不正确',
						icon: 'none'
					});
					return;
				}
				clearInterval(this.timer);
				this.btText = 59;
				this.timer = setInterval(function() {
					if (self.btText > 0) {
						self.btText--;
						if (self.btText == 0) {
							self.btText = '重新获取';
						}
					} else {
						clearInterval(self.timer);
						console.log('清楚');
					}
				}, 1000);
				let dic = {
					account: this.phone
				};

				this.superData.superRequest('appTool/verifyCode/get', { account: this.phone }).then(res => {
					uni.showToast({
						title: '已发送',
						icon: 'none'
					});
				});
			}
		},
		checkCode: async function(code) {
			if (this.phone.length != 11) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			if (code.length != 6) {
				uni.showToast({
					title: '验证码不正确',
					icon: 'none'
				});
				return;
			}
			this.superData.superCloudRequest('system/checkSmsCode', { phone: this.phone, code: code }).then(res => {
				return checkResult;
			});
		}
	}
};
</script>

<style></style>
