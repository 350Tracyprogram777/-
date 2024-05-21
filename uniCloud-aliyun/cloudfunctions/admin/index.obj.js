// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_category = db.collection('sys-category')
const db_user = db.collection('uni-id-users')
module.exports = {
	_before: function() { // 通用预处理器

	},
	// 添加分类
	queryClass: async function(param) {
		const where = {
			type: param.type

		}
		const res = await db_category.where(where).orderBy('state', 'asc').orderBy('sort', 'asc').skip(param
			.pageIndex).limit(30).get()
		return {
			errCode: 0,
			errMsg: "",
			data: res.data
		}

	},
	addClass: async function(param) {
		param['sort'] = parseInt(param['sort'])
		param['state'] = parseInt(param['state'])
		param['create_date'] = new Date().getTime()
		const res = await db_category.add(param)
		return {
			errCode: 0,
			errMsg: "添加成功",
			data: res.data
		}

	},
	editClass: async function(param) {
		const _id = param['_id']
		param['sort'] = parseInt(param['sort'])
		param['state'] = parseInt(param['state'])
		delete(param['_id'])
		const res = await db_category.doc(_id).update(param)
		return {
			errCode: 0,
			errMsg: "修改成功",
			data: res.data
		}

	},
	// 用户管理
	queryUser: async function(param) {
		const where = {
			role: param.role,
			mobile: dbCmd.exists(true)
		}
		if (param.keyWord) {
			where['nickname'] = RegExp(param.keyWord, 'i')
		}
		console.log(where)
		const res = await db_user.where(where).orderBy('create_date', 'desc').skip(param
			.pageIndex).limit(100).field({
			role: true,
			nickname: true,
			mobile: true,
			avatar: true,
			stop_permissions: true
		}).get()

		for (let item of res.data) {
			if (!item.stop_permissions) {
				item.stop_permissions = []
			}
			if (!item.role) {
				item.role = []
			}
		}
		return {
			errCode: 0,
			errMsg: "",
			data: res.data
		}

	},
	editUserStop: async function(param) {

		const res = await db_user.doc(param._id).update({
			role: param.role,
			stop_permissions: param.stop_permissions
		})
		return {
			errCode: 0,
			errMsg: "修改成功",
			data: "成功"
		}
	}

}
