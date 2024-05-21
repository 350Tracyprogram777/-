// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command

const db_media = db.collection('user-media')
const db_category = db.collection('sys-category')
const db_user = db.collection('uni-id-users')
const db_wxgroup = db.collection('wx-group')

module.exports = {
	_before: async function() { // 通用预处理器
		const methodName = this.getMethodName()
		const authApis = ['add', 'edit', 'delete', 'querySelf']
		const token = this.getUniIdToken()
		// token 不存在
		if (!this.getUniIdToken()) {
			if (authApis.includes(methodName)) {
				throw new Error('请重试')
			}
		} else {
			const clientInfo = this.getClientInfo()
			this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
				clientInfo
			})
			const userRes = await this.uniID.checkToken(token)
			if (userRes.code == 0) {
				this.user_id = userRes.uid
				this.role = userRes.role || []
				if (methodName == 'add') {
					const userInfoRes = await db_user.doc(this.user_id).get()
					if (userInfoRes.data.length == 1) {
						this.userInfo = userInfoRes.data[0]
						if (!this.userInfo.stop_permissions) {
							this.userInfo.stop_permissions = []
						}
						if (this.userInfo.stop_permissions.includes('add-news')) {
							throw new Error('请联系客服')
						}
					}
				}
				console.log('角色', this.role)
			} else {
				if (authApis.includes(methodName)) {
					throw new Error('请重试')
				}
				// throw new Error('请重新登录')
			}
		}
	},
	add: async function(dic) {
		dic.create_date = new Date().getTime()
		dic.state = 0
		dic['sort'] = 1000
		dic['user_id'] = this.user_id
		const exitRes = await db_wxgroup.where({
			opengid: dic.opengid
		}).get()
		if (exitRes.data.length > 0) {
			return {
				errCode: 1,
				errMsg: "该群已认证,请勿重复添加",
				data: ''
			}
		}
		const res = await db_wxgroup.add(dic)
		return {
			errCode: 0,
			errMsg: "已发布",
			data: res
		}
	},
	edit: async function(dic) {
		const _id = dic._id
		if (_id) {
			delete(dic['_id'])
			dic['state'] = 0
			const res = await db_wxgroup.doc(_id).update(dic)
			return {
				errCode: 0,
				errMsg: "修改成功",
				data: res
			}
		} else {
			return {
				errCode: 0,
				errMsg: "_id为空",
				data: dic
			}
		}
	},
	doc: async function(_id) {
		const res = await db_wxgroup.aggregate().match({
			_id: _id
		}).sort({
			'create_date': -1
		}).end()
		if (res.data.length == 0) {
			return {
				errCode: 0,
				errMsg: ",未找到,可能已被删除",
				data: ''
			}
		}
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data[0]
		}
	},

	remove: async function(_id) {
		const res = await db_wxgroup.doc(_id).get()
		if (res.data.length == 1) {
			for (let img of res.data[0]['images']) {
				await db_media.where({
					url: img.url,
					user_id: this.user_id
				}).remove()
			}
			const deRes = await db_wxgroup.doc(_id).remove()
			// 删除关联的
			const classRes = await db_category.where({
				'wx_group._id': _id
			}).get()

			for (let item of classRes.data) {
				const findInx = item.wx_group.findIndex(function(a, b) {
					return a._id == _id

				})
				item.wx_group.splice(findInx, 1)
				await db_category.doc(item._id).update({
					wx_group: item.wx_group
				})

			}


			console.log('删除', deRes)
		}
		return {
			errCode: 0,
			errMsg: "删除成功",
			data: ''
		}
	},
	// 查询
	query: async function(param) {
		let where = {
			state: 0
		}
		Object.assign(where, param.where)

		const res = await db_wxgroup.aggregate().match(where).sort({
			'sort': 1,
			'create_date': -1
		}).skip(param.pageIndex).limit(10).end()


		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},

	// 获取资料库的分类
	getClass: async function(param) {
		let whereArr = [{
			type: 100,
			state: 0
		}]
		if (param) {
			whereArr = []
			if (this.role.length == 0) {
				this.role = ['user']
			}
			if (this.role.includes('communityAdmin')) {
				// 身份刷选普通用户
				whereArr = [{
					type: 100,
					state: 0
				}]
			} else {
				for (let item of this.role) {
					whereArr.push({
						type: 100,
						state: 0,
						role: item
					})
				}
			}
		}
		const res = await db_category.where(dbCmd.or(whereArr)).orderBy('sort', 'asc').get()
		let arr = []
		for (let item of res.data) {
			arr.push({
				text: item.name,
				value: item._id
			})
		}
		return {
			errCode: 0,
			errMsg: "成功",
			data: arr
		}
	}
}
