// 上次启动时的用户信息
import {
	superData,
	superTools
} from '@/common/ss-superModules/superConfig.js'
import appConfig from '@/common/ss-superModules/superBase/ss.config.js';

import {
	defineStore
} from 'pinia';

const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')
const uniIdCo = uniCloud.importObject("uni-id-co", {
	customUI: true
})

export default defineStore('userStore', {
	state: () => {

		return {
			hasLogin: false,
			autoLogin: true,
			wxGzhOpenId: "",
			//用户信息
			userInfo: {
				name: '张三'
			},
			loginBackPage: "", //登录成功后需要返回的页面
			defaultAddress: "", //默认地址信息
			temDefaultAddress: "" //临时地址信息
		}
	},

	actions: {
		// 登录
		async loginIn() {
			let self = this
			return new Promise(function(resolve, reject) {
				wx.login({
					success({
						code
					}) {
						uniIdCo.loginByWeixin({
							code
						}).then(e => {
							self.hasLogin = true
							superTools.save_token(e.newToken.token || '')
							if (e.uid != self.userInfo._id) {
								self.userInfo = {}
								// superTools.clear_userinfo()
								console.log('用户被删除')
							}
							self.getUserInfo()
							resolve(e)
						});
					},
					fail: err => {
						reject(err)
					}
				});
			})
		},
		// 获取用户信息
		getUserInfo() {
			let self = this
			return new Promise(function(resolve, reject) {
				usersTable.where("'_id' == $cloudEnv_uid").field(
						'mobile,sys_msg,nickname,wx_unionid,wx_openid,avatar,gender,wxnickname,role')
					.get().then(res => {
						const userInfo = res.result.data[0]
						self.userInfo = userInfo
						self.hasLogin = true
						console.log('用户信息', self.userInfo)

						resolve(userInfo)
					}).catch(e => {
						self.loginOut()
						superTools.clear_mpopenid()
						reject(e)
					}).finally(e => {
						uni.hideLoading()
					})
			})
		},
		// 退出
		loginOut() {
			this.$reset()
		}

	},
	persist: {
		enabled: true,
		strategies: [{
			//本地存储名字
			key: 'PinaUser',
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => {}
			}
		}]


	}


})
