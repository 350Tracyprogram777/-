import superTools from "@/common/ss-superModules/superBase/supertools.js"
import superData from "@/common/ss-superModules/superBase/superData.js"

import {
	defineStore
} from 'pinia';
const wxApi = uniCloud.importObject('wxapi');

export default defineStore('systemStore', {
	state: () => {
		return {
			screenW: uni.getSystemInfoSync().screenWidth,
			screenH: uni.getSystemInfoSync().screenHeight,
			navH: uni.getSystemInfoSync().statusBarHeight,
			systemConfig: {
				allowWithdraw: true,
				withdrawDesc: "系统升级期间，暂不允许提现",
				withdrawFixAmount: "1",
				withdrawLimit: "1",
				withdrawRate: "0.03",
			},
			loginBackPage: '',
			pageDic: "",
			wxStartEnv: {
				scene: 0,
				path: "",
				opengid: "",
				query: {
					timestmap: 0
				}

			},
			selectGroupArr: []

		}
	},
	actions: {
		// 获取群标识
		getWxGroup() {
			let xcxEnvDic = wx.getEnterOptionsSync()
			let self = this
			console.log('微信环境', xcxEnvDic)
			return new Promise(function(resolve, reject) {
				if (xcxEnvDic.scene != 1008) {
					console.log('直接返回')
					reject(false)
				}
				// 地址一样  启动参数一样 opengid存在 直接验证返回
				if (xcxEnvDic.path == self.wxStartEnv.path && xcxEnvDic.scene == self
					.wxStartEnv.scene &&
					self.wxStartEnv.opengid && xcxEnvDic.query.timestmap == self
					.wxStartEnv.query.timestmap) {
					console.log('取得花村', self.wxStartEnv)
					resolve(self.wxStartEnv.opengid)


				} else {
					wx.login({
						success(loginRes) {
							if (loginRes.code) {
								wx.getGroupEnterInfo({
									success(res) {
										if (res.errMsg ==
											'getGroupEnterInfo:ok') {
											wxApi.getWxEnctyMsg({
												code: loginRes.code,
												iv: res.iv,
												encryptedData: res
													.encryptedData
											}).then(successres => {

												if (successres
													.errCode == 0) {
													xcxEnvDic[
															'opengid'
														] =
														successres
														.data
													console.log(
														'pppppppppppppp',
														xcxEnvDic)

													Object.assign(self
														.wxStartEnv,
														xcxEnvDic)
													console.log(
														'pppppppppppppp',
														self.wxStartEnv)
													resolve(self
														.wxStartEnv
														.opengid
													)
												} else {
													reject(false)
												}
											});
										}
										// console.log('群消息',res.encryptedData)
									},
									fail() {}
								});
							} else {
								reject(false)
							}
						}
					});
				}


			})

		}


	},
	persist: {
		enabled: true,
		strategies: [{
			//本地存储名字
			key: 'PinaSystem',
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => {}
			}
		}]


	}




})
