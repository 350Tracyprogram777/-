// 声网 账户姓名 密码 鉴权
let username = "a76287506f5641d79c825251cf1567a8"
let password = "47c986abcedb4d79b0f16a4e77a618e3"
let loginString = username + ':' + password //String(format: "%@:%@", username, password)
let getAuthorization = (str) => {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
}
let appId = 'd62495d243854f3c8b90f72a9821a4b5'

let Authorization = 'Basic ' + getAuthorization(loginString)


const startCloudRecord = {

	// 获取录制资源
	record_acquire: (uid = '', channel = '') => {
		let acquire_body = {
			"uid": uid, //用户id
			"cname": channel, //用户频道
			"clientRequest": {
				"resourceExpiredHour": 24
			}
		}
		return new Promise(function(reject, resolve) {
			uni.request({
				url: 'https://api.agora.io/v1/apps/' + appId + '/cloud_recording/acquire', //仅为示例，并非真实接口地址。
				data: acquire_body,
				method: 'POST',
				header: {
					'Content-type': "application/json",
					"Authorization": Authorization
				},
				success: (res) => {
					//console.log(res);
					if (res.statusCode == 200) {
						reject(res.data.resourceId)

					} else {
						//console.log('获取resourceId失败', res)
					}
				}
			});

		})
	},
	// 开启录制
	record_start: (uid = '', channel = '', resourceid = '', mode = 'mix') => {
		let start_body = {
			"cname": channel,
			"uid": uid,
			"clientRequest": {
				
				"recordingConfig": {
					"streamTypes": 2, //录制音频视频
					"channelType": 0,
					"videoStreamType": 0, //录制视频大流  0 大流 1小流
					"transcodingConfig": {
						"height": 640,
						"width": 360,
						"bitrate": 500,
						"fps": 15,
						"mixedVideoLayout": 1,
						"backgroundColor": "#000000"
					}
					// "subscribeVideoUids": [
					// 	"123",
					// 	"456"
					// ],
					// "subscribeAudioUids": [
					// 	"“123”",
					// 	"“456”"
					// ],
					// "subscribeUidGroup": 0
				},
				"storageConfig": { //云存储设置
					"accessKey": "0j06qcyw1yus5quvohpora9t",
					"region": 3, //云服务器 华北地区
					"bucket": "superarchives",
					"secretKey": "iGz/1zlNUl0AMrafBGpXJQ/vkGI=",
					"vendor": 2, //2阿里云  3腾讯云
					"fileNamePrefix": [
						"demo",
						"superarchives"
					]
				}
			}
		}
		return new Promise(function(reject, resolve) {
			uni.request({
				url: 'https://api.agora.io/v1/apps/' + appId + '/cloud_recording/resourceid/' + resourceid + '/mode/' + mode +
					'/start', //仅为示例，并非真实接口地址。
				data: start_body,
				method: 'POST',
				header: {
					'Content-type': "application/json",
					"Authorization": Authorization
				},
				success: (res) => {
					//console.log(res);
					if (res.statusCode == 200) {
						reject(res.data)

					} else {
						//console.log('开始录制失败',res)
						
					}
				}
			});

		})
	},
	// 查询录制
	record_query: (uid = '', channel = '', resourceid = '',  sid = '',mode='mix') => {
		
		return new Promise(function(reject, resolve) {
			uni.request({
				url: 'https://api.agora.io/v1/apps/'+appId+'/cloud_recording/resourceid/'+resourceid +'/sid/'+sid+'/mode/'+mode +'/query', //仅为示例，并非真实接口地址。
				method: 'GET',
				header: {
					'Content-type': "application/json;charset=utf-8",
					"Authorization": Authorization
				},
				success: (res) => {
					if (res.statusCode == 200) {
						reject(res)
	
					} else {
						//console.log('停止录制失败',res)
						
						
					}
				}
			});
	
		})
	},
	// 停止录制
	record_stop: (uid = '', channel = '', resourceid = '',  sid = '',mode='mix') => {
		let stop_body = {
			"uid": uid, //用户id
			"cname": channel, //用户频道
			"clientRequest": {}
		}
		return new Promise(function(reject, resolve) {
			uni.request({
				url: 'https://api.agora.io/v1/apps/'+appId+'/cloud_recording/resourceid/'+resourceid +'/sid/'+sid+'/mode/'+mode +'/stop', //仅为示例，并非真实接口地址。
				data: stop_body,
				method: 'POST',
				header: {
					'Content-type': "application/json;charset=utf-8",
					"Authorization": Authorization
				},
				success: (res) => {
					if (res.statusCode == 200) {
						reject(res)

					} else {
						//console.log('停止录制失败',res)
						
						
					}
				}
			});

		})
	}


}

// 四个参数  分别为 :url 参数 方法  加载文字
export default startCloudRecord
