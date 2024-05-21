// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_user = db.collection('uni-id-users')
const db_favorite = db.collection('user-favorite')
module.exports = {
	_before: async function() { // 通用预处理器
		const methodName = this.getMethodName()
		const token = this.getUniIdToken()
		if (!this.getUniIdToken()) {
			throw new Error('token不存在')
		}
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
		const userRes = await this.uniID.checkToken(token)
		if (userRes.code == 0) {
			this.token = token
			this.user_id = userRes.uid
			this.role = userRes.role || []
		} else {
			throw new Error('请重新登录')
		}
	},
	text:async function(){
		
		const tokenRes=await this.uniID.refreshToken({
			token: this.token
		})
		return {
			errCode: 0,
			data: tokenRes
		}
	},
	bindPhone: async function(phone) {
		let dic = {
			mobile: phone
		}
		if (this.role.length == 0) {
			dic['role'] = ['user']
		}
		const res = await db_user.doc(this.user_id).update(dic)
		const tokenRes=await this.uniID.refreshToken({
			token: this.token
		})
		return {
			errCode: 0,
			data: tokenRes
		}
	}
}
