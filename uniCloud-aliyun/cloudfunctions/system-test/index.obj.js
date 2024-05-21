// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()
const dbCmd = db.command
const $ = db.command.aggregate

const db_addressBook = db.collection('address-book')
const db_news = db.collection('user-news')
const db_doc = db.collection('user-doc')
const db_banner = db.collection('banner')
const db_favorite = db.collection('user-favorite')
const db_category = db.collection('sys-category')
const db_zan = db.collection('user-zan')
module.exports = {
	_before: function() { // 通用预处理器
	},
	zan: async function() {
		
		
		const res= await db.collection('user-doc').get()
		for(let item of res.data)
		{
			const id=item['_id']
			
			delete(item['zan'])
			delete(item['collect'])
			delete(item['author_user'])
			delete(item['userArr'])
			delete(item['_id'])
			 await db.collection('user-doc').doc(id).set(item)
		}
		
		
	
	},


	getClass: async function(param) {
		let where = {
			type: 1,
			state: 0
		}
		const res = await db_category.where(where).orderBy('sort', 'asc').get()
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
	addBook: async function(arr) {

		const res = await db_addressBook.add(arr)

		return {
			errCode: 0,
			errMsg: "成功",
			data: res
		}
	}
}
