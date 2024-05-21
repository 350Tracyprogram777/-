import superTools from "@/common/ss-superModules/superBase/supertools.js"
import superData from "@/common/ss-superModules/superBase/superData.js"

import {
	defineStore
} from 'pinia';

export default defineStore('shopStore', {
	state: () => {
		return {
			cartArr: [],
			selectArr: [],
			selectTotalNum: 0, //产品总数量
			selectLongTime: 0, //总时长分钟
			selectTotalPrice: 0,
			isAllSelect: false,
			selectArrIds: [], //选中的ids
			selectArrItemIds: [], //选中的服务项目ids
			cartNum: 0, //购物车数量
			commitShopOrderData:{}//详情页 ->提交页面数据
		}
	},

	actions: {
		setCartArr(info) {
			for (let item of info) {
				const finInx = this.selectArr.findIndex(e => e.code == item.code)
				item.isSelect = finInx >= 0 ? true : false
			}
			this.cartArr = info || []
			this.resetComplute()
		},
		setCartNum(info) {
			this.cartNum = info || 0
		},
		setSelectArr(info) {
			this.selectArr = info || []
			this.cartArr = info
			this.resetComplute()

		},
		// 重新计算
		resetComplute(item) {
			// 如果是选中 
			if (item) {
				item.isSelect = !item.isSelect
			}
			this.selectArr = this.cartArr.filter(e => e.isSelect)
			console.log('this.selectArr', this.selectArr)
			let totalNum = 0
			let totalPrice = 0
			let longTime = 0 //服务总时长
			let ids = []
			let itemIds = []
			for (let item of this.selectArr) {
				totalNum = totalNum + item.quantity
				totalPrice = totalPrice + item.quantity * item.amount
				longTime = longTime + item.quantity * item.duration
				ids.push(item.code)
				itemIds.push(item.itemCode)
			}
			console.log('totalPrice', totalPrice)
			this.selectTotalNum = totalNum //总数量
			this.selectTotalPrice = superTools.keepTwoDecimal(totalPrice) //总金额
			this.selectArrIds = ids //选中的ids
			this.selectArrItemIds = itemIds //选中的ids
			this.selectLongTime = longTime
			this.isAllSelect = this.cartArr.length > 0 ? this.cartArr.length == this.selectArr.length : false
		},
		// 获取购物车的列表
		getCartList() {
			actions.getCartNum({
				commit,
				state
			}, technicianCode)
			return superData.superRequest('appBusiness/item/cart/list', {
				hubtitle: ' '
			}).then(res => {
				console.log(res)
				commit('setCartArr', res)
				return res
			})
		},
		// 获取购物车的列表
		getCartNum(technicianCode = '') {
			return superData.superRequest('appBusiness/item/cart/count', {
				technicianCode: technicianCode
			}, {
				hubtitle: ' '
			}).then(res => {
				this.cartNum = res
				console.log('数量', res)
				if (res > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: res
					})
				} else {
					uni.removeTabBarBadge({
						index: 2
					})
				}
				return res
			})
		},
		// 添加到购物车
		addCart(dic) {
			return superData.superRequest('appBusiness/item/cart/add', dic, {
				hubtitle: ''
			}).then(res => {
				this.getCartList()
				return res
			})
		},
		// 更改数量
		changeNum(dic) {
			return superData.superRequest('appBusiness/item/cart/edit', dic, {
				hubtitle: ''
			}).then(res => {
				let item = this.cartArr.find(function(e, b) {
					return e.code == dic.code
				})
				item.quantity = dic.quantity
				this.resetComplute()
				return res
			})
		},
		// 全选
		allSelect() {
			for (let item of this.cartArr) {
				item.isSelect = !this.isAllSelect
			}
			this.resetComplute()
		},
		// 删除购物车
		deleteCart(ids) {
			return superData.superRequest('appBusiness/item/cart/remove', {
				codes: ids.join(',')
			}, {
				hubtitle: ''
			}).then(res => {
				this.getCartList()
				return res
			})
		}
	},
	persist: {
		enabled: true,
		strategies: [{
			//本地存储名字
			key: 'PinaCart',
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => {}
			}
		}]
	
	
	}
})
