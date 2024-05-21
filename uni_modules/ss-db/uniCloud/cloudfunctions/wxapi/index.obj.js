// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const createConfig = require('uni-config-center/')
var WXBizDataCrypt = require('./WXBizDataCrypt')
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
})
const db = uniCloud.database()
const db_media = db.collection("user-media")
const db_houseRent = db.collection("house-rent")
const db_addressBook = db.collection("address-book")
const db_news = db.collection("user-news")
const db_doc = db.collection("user-doc")
const db_secondShop = db.collection("second-shop")
const db_user = db.collection('uni-id-users')
const {
	getAccessToken,
	setAccessToken,
	removeAccessToken
} = require('uni-open-bridge-common')
const key_weixin_mp = {
	dcloudAppid: '__UNI__C22E2CC',
	platform: 'weixin-mp'
}
const key_weixin_h5 = {
	dcloudAppid: '__UNI__C22E2CC',
	platform: 'weixin-h5'
}
// 小程序appid
const mp_appid = uniIdConfig.config('mp-weixin.oauth.weixin.appid')
const mp_appsecret = uniIdConfig.config('mp-weixin.oauth.weixin.appsecret')
const {
	getWxGzhAccessToken,
	getNewsList,
	text
} = require('./timetask')
module.exports = {
	_timing: async function() {
		// await getWxGzhAccessToken()
		// await getNewsList()
	},
	aa: async function() {
		// await getNewsList()
	},
	// 获取手机号
	getWxEnctyMsg: async function(dic) {
		const res = await uniCloud.httpclient.request(
			`https://api.weixin.qq.com/sns/jscode2session?appid=${mp_appid}&secret=${mp_appsecret}&js_code=${dic.code}&grant_type=authorization_code`, {
				dataType: 'json',
				method: "GET",
				contentType: 'json',
			})
		const session_key = res.data['session_key']
		const openid = res.data['openid']
		var pc = new WXBizDataCrypt(mp_appid, session_key)
		var data = pc.decryptData(dic.encryptedData, dic.iv)
		if (data['opengid']) {
			return {
				errCode: 0,
				data: data['opengid']
			}
		} else {
			return {
				errCode: 0,
				data: ""
			}
		}
	},
	// 获取手机号
	getWxPhone: async function(code) {
		const accessToken = await getAccessToken(key_weixin_mp)
		console.log('getAccessToken', accessToken)
		const res = await uniCloud.httpclient.request(
			`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken.access_token}`, {
				dataType: 'json',
				method: "POST",
				contentType: 'json',
				data: {
					code: code
				}
			})
		if (res.data['errcode'] == 0) {
			return {
				errCode: 0,
				data: res.data['phone_info']['phoneNumber']
			}
		} else {
			return {
				errCode: 1,
				errMsg: res.data['errmsg'],
				data: res
			}
		}
	},
	// 文字检查
	msgSecCheck: async function(msg, openid) {
		const accessToken = await getAccessToken(key_weixin_mp)
		console.log('getAccessToken', accessToken)
		const res = await uniCloud.httpclient.request(
			`https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${accessToken.access_token}`, {
				dataType: 'json',
				method: "POST",
				contentType: 'json',
				data: {
					content: msg,
					version: 2,
					scene: 1,
					openid: openid
				}
			})
		if (res.data['errcode'] == 0) {
			const checkText = res.data['result']['suggest']
			if (checkText == 'risky') {
				return {
					errCode: 1,
					errMsg: '内容不合规,请整改后再发布'
				}
			}
			if (checkText == 'review') {
				return {
					errCode: 2,
					errMsg: '内容偏敏感,建议整改后再发布'
				}
			}
			if (checkText == 'pass') {
				return {
					errCode: 0,
					errMsg: ''
				}
			}
		} else {
			return {
				errCode: 1,
				errMsg: res.data['errmsg'],
				data: res
			}
		}
	},
	// 图片检测
	mediaCheckAsync: async function(url, openid) {
		const accessToken = await getAccessToken(key_weixin_mp)
		console.log('getAccessToken', accessToken)
		const res = await uniCloud.httpclient.request(
			`https://api.weixin.qq.com/wxa/media_check_async?access_token=${accessToken.access_token}`, {
				dataType: 'json',
				method: "POST",
				contentType: 'json',
				data: {
					media_url: url,
					media_type: 2,
					version: 2,
					scene: 1,
					openid: openid
				}
			})
		if (res.data['errcode'] == 0) {
			return {
				errCode: 0,
				errMsg: res.data['errmsg'],
				data: res.data['trace_id']
			}
		} else {
			return {
				errCode: 1,
				errMsg: res.data['errmsg'],
				data: res
			}
		}
	},
	// 微信服务器返回
	wxMediaCheck: async function(e) {
		let httpInfo = this.getHttpInfo()
		if (!httpInfo['body']) {
			return e.echostr
		}
		const body = JSON.parse(httpInfo['body'])
		const trace_id = body.trace_id
		const openid = body.FromUserName
		const suggest = body.result.suggest
		// 图片检测没有通过 存储未通过的原因
		if (suggest == 'risky' || suggest == 'review') {
			const mediaRes = await db_media.where({
				trace_id: trace_id
			}).limit(1).get()
			if (mediaRes.data.length > 0) {
				const mediaDic = mediaRes.data[0]
				await db_media.doc(mediaDic._id).update({
					suggest: suggest,
					check: body
				})
				// 通讯录的图片
				if (mediaDic.type == '通讯录') {
					const findRes = await db_addressBook.where({
						user_id: mediaDic.user_id,
						"images.url": mediaDic.url
					}).limit(1).get()
					if (findRes.data.length == 1) {
						mediaInfo = findRes.data[0]
						const noImg = mediaInfo.images.find(function(a, b) {
							return a.trace_id == trace_id
						})
						noImg['suggest'] = suggest
						noImg['check'] = body
						await db_addressBook.doc(mediaInfo._id).update({
							images: mediaInfo.images,
							state: 30,
							sys_msg: "图片违规"
						})
					}
				}
				// 通讯录的图片
				if (mediaDic.type == '租房') {
					const findRes = await db_houseRent.where({
						user_id: mediaDic.user_id,
						"images.url": mediaDic.url
					}).limit(1).get()
					if (findRes.data.length == 1) {
						mediaInfo = findRes.data[0]
						const noImg = mediaInfo.images.find(function(a, b) {
							return a.trace_id == trace_id
						})
						noImg['suggest'] = suggest
						noImg['check'] = body
						await db_houseRent.doc(mediaInfo._id).update({
							images: mediaInfo.images,
							state: 30,
							sys_msg: "图片违规"
						})
					}
				}
				// 通讯录的图片
				if (mediaDic.type == '新闻资讯') {
					const findRes = await db_news.where({
						user_id: mediaDic.user_id,
						"images.url": mediaDic.url
					}).limit(1).get()
					if (findRes.data.length == 1) {
						mediaInfo = findRes.data[0]
						const noImg = mediaInfo.images.find(function(a, b) {
							return a.trace_id == trace_id
						})
						noImg['suggest'] = suggest
						noImg['check'] = body
						await db_news.doc(mediaInfo._id).update({
							images: mediaInfo.images,
							state: 30,
							sys_msg: "图片违规"
						})
					}
				}
				// 二手市场
				if (mediaDic.type == '二手市场') {
					const findRes = await db_secondShop.where({
						user_id: mediaDic.user_id,
						"images.url": mediaDic.url
					}).limit(1).get()
					if (findRes.data.length == 1) {
						mediaInfo = findRes.data[0]
						const noImg = mediaInfo.images.find(function(a, b) {
							return a.trace_id == trace_id
						})
						noImg['suggest'] = suggest
						noImg['check'] = body
						await db_secondShop.doc(mediaInfo._id).update({
							images: mediaInfo.images,
							state: 30,
							sys_msg: "图片违规"
						})
					}
				}
				if (mediaDic.type == '用户头像') {
					const findRes = await db_user.where({
						_id: mediaDic.user_id,
						"avatar": mediaDic.url
					}).limit(1).get()
					if (findRes.data.length == 1) {
						mediaInfo = findRes.data[0]
						await db_user.doc(mediaInfo._id).update({
							avatar: '',
							sys_msg: "图片违规"
						})
						// 用户的头像直接删除掉
						try {
							await uniCloud.deleteFile({
								fileList: [mediaDic.url]
							})
							console.log('头像违规已经删除')
						} catch (e) {
							console.log('删除头像失败')
						}
					}
				}
				// 资料库的图片
				if (mediaDic.type == '资料库') {
					const findRes = await db_doc.where({
						user_id: mediaDic.user_id,
						"images.url": mediaDic.url
					}).limit(1).get()
					if (findRes.data.length == 1) {
						mediaInfo = findRes.data[0]
						const noImg = mediaInfo.images.find(function(a, b) {
							return a.trace_id == trace_id
						})
						noImg['suggest'] = suggest
						noImg['check'] = body
						await db_doc.doc(mediaInfo._id).update({
							images: mediaInfo.images,
							state: 30,
							sys_msg: "图片违规"
						})
					}
				}
			}
		}
		return e.echostr
	}
}
