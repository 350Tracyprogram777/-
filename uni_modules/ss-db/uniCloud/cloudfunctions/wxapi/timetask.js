// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const createConfig = require('uni-config-center/')
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
})
const db = uniCloud.database()
const db_news = db.collection("user-news")
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
module.exports = {
	// 获取小程序 暂时无用
	getWxMpAccessToken: async function() {
		const {
			appid,
			appsecret
		} = uniIdConfig.config('mp-weixin.oauth.weixin')
		const res = await uniCloud.httpclient.request(
			`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`, {
				dataType: 'json'
			})
		const {
			access_token: accessToken,
			expires_in: expiresIn
		} = res.data
		// uni-sec-check会自动读取数据库内的accessToken缓存，需要将此值存储在opendb-cloud-cache集合的_id为`access_token_mp-weixin_${appid}`的记录内
		const accessTokenCacheKey = `access_token_mp-weixin_${appid}`
		await db.collection('opendb-cloud-cache').doc(accessTokenCacheKey).set({
			value: accessToken,
			expired: Date.now() + expiresIn * 1000,
			create_date: new Date()
		})
	},
	// 获取公众号的access_token 
	getWxGzhAccessToken: async function() {
		const {
			appid,
			appsecret
		} = uniIdConfig.config('web.oauth.weixin-h5')
		const res = await uniCloud.httpProxyForEip.get('https://api.weixin.qq.com/cgi-bin/token', {
			"grant_type": "client_credential",
			"appid": appid,
			"secret": appsecret
		})
		const dic = JSON.parse(res)
		if (dic.body.access_token) {
			setAccessToken(key_weixin_h5, {
				accessToken: dic.body.access_token
			}, dic.body.expires_in)
			return dic.body.access_token
		}
	},
	//获取公众号的文章
	getNewsList: async function() {
		const accessToken = await getAccessToken(key_weixin_h5)
		console.log('token--->',accessToken)
		let totalCount = 0
		async function getWzList() {
			let pageIndex = 0
			const lastRes = await db_news.where({
				category_id: 'weixinnews'
			}).orderBy('num', 'desc').limit(1).get()
			if (lastRes.data.length > 0) {
				const laseDic = lastRes.data[0]
				pageIndex = laseDic.num + 1
			}
			const res = await uniCloud.httpProxyForEip.postJson(
				`https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken.access_token}`, {
					"access_token": accessToken.accessToken,
					"type": 'news',
					"offset": pageIndex,
					"count": 20
				})
			console.log('-------微信返回',res)
			const {
				body
			} = JSON.parse(res)
			const {
				item,
				total_count,
				item_count
			} = JSON.parse(body)
			const arr = []
			const num = pageIndex + item_count
			totalCount = total_count
			for (let dic of item) {
				const newsArr = dic['content']['news_item']
				for (let wz of newsArr) {
					arr.push({
						title: wz['title'],
						author: wz['author'],
						digest: wz['digest'],
						cover: wz['thumb_url'],
						url: wz['url'],
						create_date: dic['content']['create_time']*1000,
						num: num,
						category_id: "weixinnews",
						state:0,
						mode:0//展示方式
					})
				}
			}
			if (arr.length > 0) {
				await db_news.add(arr)
			}
			console.log(`------从${pageIndex}开始,共${total_count}个,到${item_count}`)
			if (num < total_count) {
				await getWzList()
			}
		}
		await getWzList()
	},
	text: function() {
		console.log('测试')
	}
}
