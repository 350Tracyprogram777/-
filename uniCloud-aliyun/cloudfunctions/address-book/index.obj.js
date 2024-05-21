// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const {
	error
} = require('console')
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_addressBook = db.collection('address-book')
const db_banner = db.collection('banner')
const db_favorite = db.collection('user-favorite')
const db_category = db.collection('sys-category')
const db_report = db.collection('report-center')
const db_user = db.collection('uni-id-users')
const db_media = db.collection('user-media')

module.exports = {
	_before: async function() { // 通用预处理器
		const methodName = this.getMethodName()
		const authApis = ['add', 'edit', 'delete', 'querySelf']
		const token = this.getUniIdToken()
		if (!this.getUniIdToken()) {
			if (authApis.includes(methodName)) {
				throw new Error(methodName)
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
						if (this.userInfo.stop_permissions.includes('add-addressbook')) {
							throw new Error('请联系客服')
						}
					}
				}
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
		const res = await db_addressBook.add(dic)
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
			delete(dic['collect'])
			dic['state'] = 0
			const res = await db_addressBook.doc(_id).update(dic)
			return {
				errCode: 0,
				errMsg: "修改成功",
				data: res
			}
		} else {
			return {
				errCode: 0,
				errMsg: "_id为空",
				data: ''
			}
		}
	},
	doc: async function(_id) {
		const res = await db_addressBook.doc(_id).get()
		if (res.data.length == 0) {
			return {
				errCode: 0,
				errMsg: ",未找到,可能已被删除",
				data: ''
			}
		}
		const favoriteRes = await db_favorite.where({
			uni_id: _id,
			user_id: this.user_id
		}).limit(1).get()
		if (favoriteRes.data.length > 0) {
			res.data[0]['collect'] = true
		} else {
			res.data[0]['collect'] = false
		}
		return {
			errCode: 0,
			errMsg: "已发布",
			data: res.data[0]
		}
	},
	// 查询
	query: async function(param) {
		let where = {
			state: 0,
			}
		if (param.keyWord) {
			
			where = dbCmd.or({
				state: 0,
				title: RegExp(param.keyWord, 'i'),
				open: true
			}, {
				state: 0,
				name: RegExp(param.keyWord, 'i'),
				open: true

			}, {
				state: 0,
				phone: RegExp(param.keyWord, 'i'),
				open: true

			}, {
				state: 0,
				user_id:this.user_id
			})
		} else {
			Object.assign(where, param.where)
		}
		const res = await db_addressBook.where(where).orderBy('create_date', 'desc').orderBy('sort', 'asc')
			.skip(param.pageIndex).limit(10).get()
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	querySelf: async function(param) {
		const where = {
			user_id: this.user_id,
			state: dbCmd.neq(2) //0正常 1未通过 2自己删除
		}

		const res = await db_addressBook.where(where).orderBy('create_date', 'desc').skip(param.pageIndex)
			.limit(10).get()
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	// 收藏
	favorite: async function(param) {
		if (!this.user_id) {
			return {
				errCode: 1,
				errMsg: "收藏失败",
				data: uni_id
			}
		}
		let dic = {
			user_id: this.user_id,
			uni_id: param.uni_id
		}
		const res = await db_favorite.where(dic).limit(1).get()
		if (res.data.length > 0) {
			// 取消收藏
			const cancleRes = await db_favorite.where(dic).remove()
			return {
				errCode: 0,
				errMsg: "取消收藏",
				data: '取消成功'
			}
		} else {
			param['create_date'] = new Date().getTime()
			param['class'] = 1 //通讯录
			param['user_id'] = this.user_id //通讯录
			param['type'] = '通讯录' //通讯录
			// 添加收藏
			const res = await db_favorite.add(param)
			return {
				errCode: 0,
				errMsg: "已收藏",
				data: "已收藏"
			}
		}
	},
	// 收藏
	queyfavorite: async function(param) {
		const res = await db_favorite.aggregate().match({
			class: 1
		}).skip(param.pageIndex).limit(10).lookup({
			from: "address-book",
			foreignField: "_id",
			localField: "uni_id",
			as: "originalArr"
		}).end()
		let arr = []
		for (let item of res.data) {
			let dic = {
				collect: true,
				is_clear: false
			}
			if (item.originalArr.length > 0) {
				Object.assign(dic, item.originalArr[0])
			} else {
				dic['is_clear'] = true
				Object.assign(dic, item.uni_data)
			}
			arr.push(dic)
		}
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: arr
		}
	},
	remove: async function(_id) {
		const res = await db_addressBook.doc(_id).get()
		if (res.data.length == 1) {
			for (let img of res.data[0]['images']) {
				await db_media.where({
					url: img.url,
					user_id: this.user_id
				}).remove()
				
				await uniCloud
					.deleteFile({
						fileList: [img.url]
					})
			}
			await db_addressBook.doc(_id).remove()
		}
		return {
			errCode: 0,
			errMsg: "删除成功",
			data: ''
		}
	},
	getBanner: async function() {
		const res = await db_banner.where({
			position: 30
		}).get()
		for (let item of res.data) {
			item.url = item.images[0]['url']
		}
		return {
			errCode: 0,
			errMsg: "成功",
			data: res.data
		}
	},
	// 获取新闻的分类
	getClass: async function(param) {
		let whereArr = [{
			type: 1,
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
					type: 1,
					state: 0
				}]
			} else {
				for (let item of this.role) {
					whereArr.push({
						type: 1,
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
	},
	report: async function(dic) {
		const exitRes = await db_report.where({
			user_id: this.user_id,
			uni_id: dic.uni_id
		}).limit(1).get()
		if (exitRes.data.length == 0) {
			dic.create_date = new Date().getTime()
			dic['type'] = '通讯录'
			dic['user_id'] = this.user_id
			const res = await db_report.add(dic)
			return {
				errCode: 0,
				errMsg: "感谢反馈",
				data: '感谢反馈'
			}
		} else {
			return {
				errCode: 0,
				errMsg: "已收到您的反馈,请勿重复提交",
				data: '已收到您的反馈,请勿重复提交'
			}
		}
	},
	// ------------------admin
	adminQuery: async function(param) {
		const where = {
			state: param.state //0正常 1未通过 2自己删除
		}
		if (param.state == 1) {
			where['state'] = dbCmd.eq(1).or(dbCmd.eq(30))
		}
		const res = await db_addressBook.where(where).orderBy('create_date', 'desc').skip(param.pageIndex)
			.limit(30).get()
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	adminEdit: async function(dic) {
		const _id = dic._id
		if (_id) {
			delete(dic['_id'])
			const res = await db_addressBook.doc(_id).update(dic)
			return {
				errCode: 0,
				errMsg: "修改成功",
				data: res
			}
		} else {
			return {
				errCode: 0,
				errMsg: "_id为空",
				data: ''
			}
		}
	},
	adminRemove: async function(_id) {
		const res = await db_addressBook.doc(_id).get()
		if (res.data.length == 1) {
			for (let img of res.data[0]['images']) {
				await db_media.where({
					url: img.url
				}).remove()
				await uniCloud
					.deleteFile({
						fileList: [img.url]
					})
			}
			await db_addressBook.doc(_id).remove()
		}
		return {
			errCode: 0,
			errMsg: "删除成功",
			data: ''
		}
	},
}
