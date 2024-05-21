// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_house = db.collection('house-rent')
const db_banner = db.collection('banner')
const db_report = db.collection('report-center')
const db_media = db.collection('user-media')
const db_favorite = db.collection('user-favorite')
const db_user = db.collection('uni-id-users')

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
						if (this.userInfo.stop_permissions.includes('add-houserent')) {
							if (!this.userInfo.stop_permissions.includes('add-houserent')) {
								throw new Error('请联系客服')
							}
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
		dic.house_class = 0 //普通住宅 大平层 别墅
		dic['user_id'] = this.user_id
		dic['sort'] = 1000
		dic.state = 0
		const res = await db_house.add(dic)
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
			const res = await db_house.doc(_id).update(dic)
			return {
				errCode: 0,
				errMsg: "修改成功",
				data: res
			}
		} else {
			return {
				errCode: 0,
				errMsg: "_id不存在",
				data: ''
			}
		}
	},
	doc: async function(_id) {
		const res = await db_house.doc(_id).get()
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
	remove: async function(_id) {
		const res = await db_house.doc(_id).get()
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
			await db_house.doc(_id).remove()
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
			state: 0, //出租中
			// have_car: 0, //是否有车位
			// house_class: 0, //住宅
			// life_type: 0, //水电煤
			// main_room_type: 0, //主卧
			// price: 0, //价格排序
			// rent_duration_type: 0, //短期 长期
			// rent_type: 0, //整租 合租
			// repair_mode: 0, //精装
			// sall_rent_type: 0, //出租/售
			// toward: 0 //朝向
		}
		const price_sort = param.where.price == 1 ? 'desc' : 'asc'
		delete(param.where.price)
		Object.assign(where, param.where)
		// console.log(where, price_sort)
		// orderBy('price', price_sort)
		const res = await db_house.where(where).orderBy('create_date', 'desc').orderBy('sort', 'asc').skip(param
			.pageIndex).limit(10).get()
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	// 查询
	querySelf: async function(param) {
		let where = {
			state: 0,
			user_id: this.user_id
		}
		delete(param.where.price)
		Object.assign(where, param.where)

		if (param.where.state == 2) {
			where = {
				state: dbCmd.eq(2).or(dbCmd.eq(30)),
				user_id: this.user_id
			}
		}
		const res = await db_house.where(where).orderBy('create_date', 'desc').orderBy('sort', 'asc').skip(param
			.pageIndex).limit(10).get()
		return {
			errCode: 0,
			errMsg: "查询成功",
			data: res.data
		}
	},
	getBanner: async function() {
		const res = await db_banner.where({
			position: 20
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
			param['class'] = 0 //通讯录
			param['user_id'] = this.user_id //通讯录
			param['type'] = '房屋出租' //通讯录
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
			class: 0,
			user_id:this.user_id
		}).skip(param.pageIndex).limit(10).lookup({
			from: "house-rent",
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
	report: async function(dic) {
		const exitRes = await db_report.where({
			user_id: this.user_id,
			uni_id: dic.uni_id
		}).limit(1).get()
		if (exitRes.data.length == 0) {
			dic.create_date = new Date().getTime()
			dic['type'] = '房屋出租'
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
		const res = await db_house.where(where).orderBy('create_date', 'asc').skip(param.pageIndex).limit(30)
			.get()
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
			const res = await db_house.doc(_id).update(dic)
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
		const res = await db_house.doc(_id).get()
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
			await db_house.doc(_id).remove()
		}
		return {
			errCode: 0,
			errMsg: "删除成功",
			data: ''
		}
	},
}
