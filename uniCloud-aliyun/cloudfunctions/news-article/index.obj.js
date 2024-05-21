// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_news = db.collection("user-news")
const db_banner = db.collection('banner')
const db_report = db.collection('report-center')
const db_media = db.collection('user-media')
const db_category = db.collection('sys-category')
const db_zan = db.collection('user-zan')
const db_favorite = db.collection('user-favorite')
const db_user = db.collection('uni-id-users')

module.exports = {
	_before: async function() { // 通用预处理器
		const methodName = this.getMethodName()
		const authApis = ['add', 'edit', 'delete', 'zan', 'favorite', 'querySelf']
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
		dic.mode = 1
		dic['sort'] = 1000
		dic['user_id'] = this.user_id
		const res = await db_news.add(dic)
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
			delete(dic['zan'])
			delete(dic['collect'])
			delete(dic['phoneDic'])
			delete(dic['author_user'])
			dic['state'] = 0
			const res = await db_news.doc(_id).update(dic)
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
		const res = await db_news.aggregate().match({
			_id: _id
		}).sort({
			'create_date': -1
		}).limit(1).lookup({
			from: "uni-id-users",
			foreignField: "_id",
			localField: "user_id",
			as: "userArr"
		}).lookup({
			from: "address-book",
			foreignField: "_id",
			localField: "address_book_id",
			as: "phoneArr"
		}).end()
		if (res.data.length == 0) {
			return {
				errCode: 0,
				errMsg: ",未找到,可能已被删除",
				data: ''
			}
		}
		for (let item of res.data) {
			item['zan'] = []
			item['collect'] = []
			if (this.user_id) {
				const zanRes = await db_zan.where({
					uni_id: item._id,
					user_id: this.user_id
				}).limit(1).get()
				const colletctRes = await db_favorite.where({
					uni_id: item._id,
					user_id: this.user_id
				}).limit(1).get()
				if (zanRes.data.length > 0) {
					item['zan'] = zanRes.data
				}
				if (colletctRes.data.length > 0) {
					item['collect'] = colletctRes.data
				}
			}

			if (item.userArr.length > 0) {
				item.author_user = {
					nickname: item.userArr[0]['nickname'] || '',
					avatar: item.userArr[0]['avatar'] || ''
				}
			} else {
				item.author_user = {
					nickname: "无名氏",
					avatar: ""
				}
			}

			if (item.phoneArr.length > 0) {
				item.phoneDic = {
					name: item.phoneArr[0]['name'] || '',
					phone: item.phoneArr[0]['phone'] || ''
				}
			} else {
				item.phoneDic = {
					name: '',
					phone: ''
				}
			}
			delete(item['userArr'])
			delete(item['phoneArr'])


		}
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data[0]
		}
	},
	// 点赞
	zan: async function(uni_id) {
		if (!this.user_id) {
			return {
				errCode: 1,
				errMsg: "点赞失败",
				data: uni_id
			}
		}
		let dic = {
			user_id: this.user_id,
			uni_id: uni_id,
			class: 2,
			type: "新闻"
		}
		const res = await db_zan.where(dic).limit(1).get()
		if (res.data.length == 0) {
			dic['create_date'] = new Date().getTime()
			await db_zan.add(dic)
			await db_news.doc(dic.uni_id).update({
				like_count: dbCmd.inc(1)

			})
			return {
				errCode: 0,
				errMsg: "点赞成功",
				data: dic
			}
		} else {
			await db_zan.where(dic).remove()
			await db_news.doc(dic.uni_id).update({
				like_count: dbCmd.inc(1)

			})
			return {
				errCode: 0,
				errMsg: "点赞成功",
				data: []
			}
		}
	},
	// 收藏
	// 收藏
	favorite: async function(param) {
		if (!this.user_id) {
			return {
				errCode: 1,
				errMsg: "收藏失败",
				data: param.uni_id
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
				data: []
			}
		} else {
			param['create_date'] = new Date().getTime()
			param['class'] = 2 //通讯录
			param['user_id'] = this.user_id //通讯录
			param['type'] = '新闻' //通讯录
			// 添加收藏
			const res = await db_favorite.add(param)
			return {
				errCode: 0,
				errMsg: "已收藏",
				data: [param]
			}
		}
	},
	// 收藏
	queyfavorite: async function(param) {
		const res = await db_favorite.aggregate().match({
			class: 2,
			user_id: this.user_id
		}).sort({
			'create_date': -1
		}).skip(param.pageIndex).limit(10).lookup({
			from: "user-news",
			foreignField: "_id",
			localField: "uni_id",
			as: "originalArr"
		}).lookup({
			from: "user-zan",
			foreignField: "uni_id",
			localField: "_id",
			as: "zan"
		}).end()
		let arr = []
		for (let item of res.data) {
			let dic = {
				collect: true,
				is_clear: false,
				zan: item.zan,
				collect: [{}]
			}
			if (item.originalArr.length > 0) {
				Object.assign(dic, item.originalArr[0])
				const authorRes = await db_user.doc(dic.user_id).field({
					nickname: true,
					avatar: true
				}).get()
				dic['author_user'] = authorRes.data[0]
				if (authorRes.data.length > 0) {
					dic.author_user = {
						nickname: authorRes.data[0]['nickname'] || '',
						avatar: authorRes.data[0]['avatar'] || ''
					}
				} else {
					dic.author_user = {
						nickname: "无名氏",
						avatar: ""
					}
				}



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
		const res = await db_news.doc(_id).get()
		console.log('删除', res)
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
			const deRes = await db_news.doc(_id).remove()
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
			state: 0,
			mode: 1
		}
		if (param.where.category_id == 'all') {

		} else {
			Object.assign(where, param.where)

		}


		const res = await db_news.aggregate().match(where).sort({
			'sort': 1,
			'create_date': -1
		}).skip(param.pageIndex).limit(10).lookup({
			from: "uni-id-users",
			foreignField: "_id",
			localField: "user_id",
			as: "userArr"
		}).end()


		for (let item of res.data) {

			item['zan'] = []
			item['collect'] = []
			if (this.user_id) {
				const zanRes = await db_zan.where({
					uni_id: item._id,
					user_id: this.user_id
				}).limit(1).get()
				const colletctRes = await db_favorite.where({
					uni_id: item._id,
					user_id: this.user_id
				}).limit(1).get()
				if (zanRes.data.length > 0) {
					item['zan'] = zanRes.data
				}
				if (colletctRes.data.length > 0) {
					item['collect'] = colletctRes.data
				}
			}

			if (item.userArr.length > 0) {
				item.author_user = {
					nickname: item.userArr[0]['nickname'] || '',
					avatar: item.userArr[0]['avatar'] || ''
				}
			} else {
				item.author_user = {
					nickname: "无名氏",
					avatar: ""
				}
			}

			delete(item['userArr'])

		}
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	// 查询
	querySelf: async function(param) {
		let where = {
			// state: 0,
			user_id: this.user_id
		}
		Object.assign(where, param.where)
		if (param.where.state == 1) {
			where = {
				state: dbCmd.eq(1).or(dbCmd.eq(30)),
				user_id: this.user_id
			}
		}
		const res = await db_news.aggregate().match(where).sort({
			'create_date': -1
		}).skip(param.pageIndex).limit(10).lookup({
			from: "uni-id-users",
			foreignField: "_id",
			localField: "user_id",
			as: "userArr"
		}).end()
		for (let item of res.data) {

			item['zan'] = []
			item['collect'] = []
			if (this.user_id) {
				const zanRes = await db_zan.where({
					uni_id: item._id,
					user_id: this.user_id
				}).limit(1).get()
				const colletctRes = await db_favorite.where({
					uni_id: item._id,
					user_id: this.user_id
				}).limit(1).get()
				if (zanRes.data.length > 0) {
					item['zan'] = zanRes.data
				}
				if (colletctRes.data.length > 0) {
					item['collect'] = colletctRes.data
				}
			}



			if (item.userArr.length > 0) {
				item.author_user = {
					nickname: item.userArr[0]['nickname'] || '',
					avatar: item.userArr[0]['avatar'] || ''
				}
			} else {
				item.author_user = {
					nickname: "无名氏",
					avatar: ""
				}
			}
			delete(item['userArr'])

		}
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	getBanner: async function() {
		const res = await db_banner.where({
			// position: 10
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
			type: 2,
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
					type: 2,
					state: 0
				}]
			} else {
				for (let item of this.role) {
					whereArr.push({
						type: 2,
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
			dic['type'] = '新闻'
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
			mode: 1,
			state: param.state //0正常 1未通过 2自己删除
		}
		if (param.state == 1) {
			where['state'] = dbCmd.eq(1).or(dbCmd.eq(30))
		}
		const res = await db_news.aggregate().match(where).sort({
			'create_date': -1
		}).skip(param.pageIndex).limit(30).lookup({
			from: "uni-id-users",
			foreignField: "_id",
			localField: "user_id",
			as: "userArr"
		}).end()
		for (let item of res.data) {
			if (item.userArr.length > 0) {
				item.author_user = {
					nickname: item.userArr[0]['nickname'] || '',
					avatar: item.userArr[0]['avatar'] || ''
				}
			} else {
				item.author_user = {
					nickname: "无名氏",
					avatar: ""
				}
			}
		}
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
			const res = await db_news.doc(_id).update(dic)
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
		const res = await db_news.doc(_id).get()
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
			const deRes = await db_news.doc(_id).remove()
			console.log('删除', deRes)
		}
		return {
			errCode: 0,
			errMsg: "删除成功",
			data: ''
		}
	},
}
