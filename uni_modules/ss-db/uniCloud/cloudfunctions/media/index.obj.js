// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const dbCmd = db.command
const db_media = db.collection('user-media')
const checkTools = require('./check.js')

module.exports = {
	_before: async function(b) { // 通用预处理器
		// const wxtoken = await checkTools.get_wx_token()
		// const arr = this.getParams()
		// const openId=arr[1]
		// const mediaArr=arr[0]
		// checkTools.msgSecCheck(token,'草',openId)
		// throw ('ddd')
	},
	add: async function(mediaArr) {
		try {
			const result = await db_media.add(mediaArr)
			return {
				errCode: 0,
				errMsg: '添加成功',
				data: result
			}
		} catch (err) {
			return {
				errCode: 201,
				errMsg: '添加成功',
				data: err
			}
		}
	},
	remove: async function(arr) {
		let fileList = []
		for (let item of arr) {
			await db_media.where({
				url: item.url
			}).remove()
			fileList.push(item.url)
		}

		const res = await uniCloud.deleteFile({
			fileList
		})
		return {
			errCode: 0,
			errMsg: "删除成功",
			data: res
		}



	}

}
