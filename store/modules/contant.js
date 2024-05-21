import superTools from "@/common/ss-superModules/superBase/supertools.js"
import superData from "@/common/ss-superModules/superBase/superData.js"

import {
	defineStore
} from 'pinia';

export default defineStore('contantStore', {
	state: () => {
		return {
			// 二手的分类
			secondClassArr: [{
					text: '家居日用',
					value: 1,
					isSelect: false
				},
				{
					text: '住宅家居',
					value: 2,
					isSelect: false
				},
				{
					text: '生活电器',
					value: 3,
					isSelect: false
				},
				{
					text: '五金工具',
					value: 4,
					isSelect: false
				},
				{
					text: '宠物用品',
					value: 5,
					isSelect: false
				},
				{
					text: '儿童玩具',
					value: 6,
					isSelect: false
				},
				{
					text: '户外车品',
					value: 7,
					isSelect: false
				},
				{
					text: '绘本书籍',
					value: 8,
					isSelect: false
				},
				{
					text: '服饰配件',
					value: 9,
					isSelect: false
				},
				{
					text: '其他',
					value: 10,
					isSelect: false
				}
			],
			userRole: [{
				text: '普通用户',
				value: 'user'
			}, {
				text: '物业',
				value: 'wuye'
			}, {
				text: '业主',
				value: 'owner'
			}, {
				text: '管理员',
				value: 'communityAdmin'
			}],
			// 禁止发布
			stopCanArr: [{
				text: '租房',
				value: 'add-houserent'
			}, {
				text: '通讯录',
				value: 'add-addressbook'
			}, {
				text: '社区圈(首页)',
				value: 'add-news'
			}, {
				text: '二手商城',
				value: 'add-news'
			}]
		}
	},
	actions: {




	},
	persist: {
		enabled: true,
		strategies: [{
			//本地存储名字
			key: 'PinaContant',
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => {}
			}
		}]
	
	
	}




})
