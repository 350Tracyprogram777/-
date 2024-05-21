const createConfig = require('uni-config-center/')
const {
	appid,
	appsecret
} = createConfig({
	pluginId: 'uni-id'
}).config('mp-weixin.oauth.weixin')
const wx_token_cache_id = `access_token_mp-weixin_${appid}`
const db = uniCloud.database()
const db_cache = db.collection('opendb-cloud-cache')
// 获取token
const get_wx_token = async function() {
	const {
		data
	} = await db_cache.doc(wx_token_cache_id).get()
	const token = data[0]['value']
	return token
}
const msgSecCheck = async function(token, content, openid) {
	const api =
		`https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${token}&content=${content}&version=2&openid=${openid}`
	const res = await uniCloud.httpclient.request(
		api, {
			dataType: 'json'
		})
	return res

}


module.exports = {
	get_wx_token,
	msgSecCheck
}
