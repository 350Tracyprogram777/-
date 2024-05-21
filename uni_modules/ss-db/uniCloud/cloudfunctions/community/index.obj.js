// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_community = db.collection('community')
module.exports = {
	_before: function() { // 通用预处理器
		const methodName = this.getMethodName()
		const token = this.getUniIdToken()
		if (!this.getUniIdToken()) {
			throw new Error('token不存在')
		}
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
		this.user_id = this.uniID.checkToken(token)
	},
	add: async function(dic) {
		dic.create_date = new Date().getTime()
		dic.state = 0
		dic.user_id = this.user_id
		const res = await db_community.add(dic)
		return {
			errCode: 0,
			errMsg: "已发布",
			data: res
		}
	},
	doc: async function(_id) {
		const res = await db_communitydoc(_id).get()
		return {
			errCode: 0,
			errMsg: "已发布",
			data: res.data[0]
		}
	},
	// 查询
	query: async function(param) {
		const res = await db_community.where(param.where).orderBy('create_date', 'desc').skip(param.pageIndex)
			.limit(10).get()
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	// 查询自己是否认领
	query_is_have: async function(param) {
		const where = dbCmd.or([{
			user_id: this.user_id
		}, {
			members: this.user_id
		}])
		const res = await db_community.where(where).limit(1).get()
		if (res.data.length == 0) {
			return {
				errCode: 0,
				errMsg: "查询成功",
				data: res.data
			}
		} else {
			return {
				errCode: 1,
				errMsg: "每个人只能认领与管理一个社区",
				data: res.data
			}
		}
	},
}
