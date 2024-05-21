const mapKey = "5bada3f98c469d41f2765ea688f8c2a8" // web服务
const mapWebKey = "6b43e2e93d6367e851d7917b4253d11c" // 前端
// let wx = require('jweixin-module')
import phoneAuto from './phoneAuto.js';
import superData from '../superBase/superData.js';

class superMap {

	constructor() {

		this.isIos = uni.getSystemInfoSync().platform
		this.timer = ""
	}
	// 单例方法
	static getInstace() {
		if (!this.instance) {
			this.instance = new superMap()
		}
		return this.instance

	}
	//开启定位
	startLocation() {
		let self = this
		phoneAuto.getLocationAuto({
			success: function() {
				//console.log('开始定位')
				self.intervalTimeLocation()

			}
		})
	}

	intervalTimeLocation() {
		let self = this
		if (!this.timer) {
			this.timer = setInterval(function() {
				self.timelocation()

			}, 10000)
		} else {
			clearInterval(this.timer)
			this.timer = setInterval(function() {
				self.timelocation()

			}, 10000)

		}

	}

	timelocation() {
		plus.geolocation.getCurrentPosition(function(p) {
			let dic = {
				latitude: p.coords.latitude, //维度
				longitude: p.coords.longitude, //经度
				height: p.coords.altitude, //海拔
				radius: p.coords.accuracy, //精度
				speed: p.coords.speed, //速度
				locTime: p.timestamp,
				direction: p.heading || 0


			}
			superData.superRequest('appBusiness/trace/point/upload', dic, {
				hubtitle: ' '
			}).then(res => {})
			//console.log('定位成功---', dic)


		}, function(e) {
			//console.log('定位---失败', e)
		}, {
			provider: 'amap',
			coordsType: 'gcj02',
			maximumAge: 60000,
			geocode: false,
			enableHighAccuracy: true //高精度定位
		});

		// 位置发生变化
		// plus.geolocation.watchPosition(function(p) {

		// 	let dic = {
		// 		latitude: p.coords.latitude, //维度
		// 		longitude: p.coords.longitude, //经度
		// 		height: p.coords.altitude, //海拔
		// 		radius: p.coords.accuracy, //精度
		// 		speed: p.coords.speed, //速度
		// 		locTime: p.timestamp,
		// 		direction: p.heading||0

		// 	}
		// 	superData.superRequest('appBusiness/trace/point/upload', dic, {
		// 		hubtitle: ' '
		// 	}).then(res => {})

		// 	//console.log('位置变动---',dic)


		// }, function(e) {

		// });

	}







	// 定位
	async getLocation() {
		let self = this
		// #ifdef H5
		return new Promise(function(resolve, reject) {
			wx.getLocation({
				type: 'wgs84',
				success: async function(res) {
					let address = await self.getGecodeFromPoint({
						latitude: res.latitude,
						longitude: res.longitude
					})

					//console.log('定位999', address)

					let dic = {
						latitude: res.latitude,
						longitude: res.longitude,
						address: address
					}
					resolve(dic)

				},
				fail: err => {
					//console.log('微信信息', err);
				}
			});

		})
		// #endif

		// #ifdef APP-PLUS  || MP
		return new Promise(function(resolve, reject) {
			uni.getLocation({
				type: 'wgs84',
				success: async function(res) {
					let address = await self.getGecodeFromPoint({
						latitude: res.latitude,
						longitude: res.longitude
					})
					let dic = {
						latitude: res.latitude,
						longitude: res.longitude,
						address: address

					}
					resolve(dic)

				},
				fail: err => {
					//console.log('微信信息', err);
				}
			});



		})


		// #endif

	}




	// 高德地理解析
	async getGecodeFromPoint(e) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: `https://restapi.amap.com/v3/geocode/regeo?location=${e.longitude},${e.latitude}&key=${mapKey}&radius=1000&extensions=all`,
				method: "GET",
				success(res) {
					// //console.log('解析地址位置', res)
					// //console.log('解析地址位置', res.data.regeocode.formatted_address)
					if (res.data.info == 'OK') {
						resolve(res.data.regeocode.formatted_address)
					}
				},
				fail() {
					//console.log('你地理错误')
				}
			})
		})
	}

	// 输入提示
	async searchLocationFromInput(e) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: `https://restapi.amap.com/v3/assistant/inputtips?city=0371&keywords=${e}&key=${mapKey}`,
				method: "GET",
				success(res) {

					if (res.data.info == 'OK') {
						resolve(res.data.tips)
					}

				}
			})
		})
	}
	// 打开地图并导航
	openLocation(latitude = '0', longitude = '0', address_name = '', address_detail = '') {
		//console.log(address_name, address_detail)
		// #ifdef H5
		wx.openLocation({
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude),
			name: address_name, // 位置名
			address: address_detail, // 地址详情说明
			scale: 10, // 地图缩放级别,整型值,范围从1~28。默认为最大
			infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
		});
		// #endif

		// #ifdef APP-PLUS || MP

		uni.openLocation({
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude),
			name: address_name, // 位置名
			address: address_detail, // 地址详情说明
			success: function() {
				//console.log('success');
			}
		})

		// #endif




	}
	// 通过ip 获取定位信息
	async getLocationFromIp(e) {
		return new Promise(function(resolve, reject) {
			uni.request({
				url: `https://restapi.amap.com/v3/ip?key=${mapKey}`,
				method: "GET",
				success(ipres) {
					if (ipres.data.info == 'OK') {
						resolve(ipres.data.city)
					}

				}
			})
		})





	}






}
export default superMap.getInstace()
