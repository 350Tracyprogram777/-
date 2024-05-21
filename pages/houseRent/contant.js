const formOptions = {
	"sall_rent_type_localdata": [{
		"text": "出租",
		"value": 0
	}, {
		"text": "出售",
		"value": 1
	}],
	"house_class_localdata": [{
		"text": "住宅",
		"value": 0
	}, {
		"text": "大平层",
		"value": 1
	}, {
		"text": "商铺",
		"value": 2
	}, {
		"text": "别墅",
		"value": 3
	}],
	"rent_duration_type_localdata": [{
		"text": "长期",
		"value": 0
	}, {
		"text": "短期",
		"value": 1
	}],
	"rent_pay_cycle_localdata": ['可协商', "押一付三", "押一付六", "押一付12"],
	"sall_pay_cycle_localdata": ['可协商','全款', "可按揭"],
	"rent_type_localdata": [{
		"text": "整租",
		"value": 0
	}, {
		"text": "合租",
		"value": 1
	}],
	"main_room_type_localdata": [{
		"text": "主卧",
		"value": 0
	}, {
		"text": "次卧",
		"value": 1
	}],
	"repair_mode_localdata": [{
		"text": "毛坯",
		"value": 0
	}, {
		"text": "简装",
		"value": 1
	}, {
		"text": "精装",
		"value": 2
	}],
	"life_type_localdata": [{
		"text": "民用",
		"value": 0
	}, {
		"text": "商用",
		"value": 1
	}],
	"have_car_localdata": [{
		"text": "无",
		"value": 0
	}, {
		"text": "有",
		"value": 1
	}],
	"toward_localdata": [{
		"text": "东",
		"value": 0
	}, {
		"text": "西",
		"value": 1
	}, {
		"text": "南",
		"value": 2
	}, {
		"text": "北",
		"value": 3
	}],
	"icon_localdata": [{
		"text": "阳台",
		"value": 'icon-yangtai'
	}, {
		"text": "暖气",
		"value": 'icon-nuanqi'
	}, {
		"text": "电视",
		"value": 'icon-dianshi'
	}, {
		"text": "热水器",
		"value": 'icon-reshuiqi'
	}, {
		"text": "衣柜",
		"value": 'icon-czIcon-wardrobe'
	}, {
		"text": "空调",
		"value": 'icon-kongtiao'
	}, {
		"text": "冰箱",
		"value": 'icon-bingxiang'
	}, {
		"text": "床",
		"value": 'icon-chuang1'
	}, {
		"text": "洗衣机",
		"value": 'icon-xiyiji'
	}, {
		"text": "WIFI",
		"value": 'icon-wifiwofi-copy'
	}, {
		"text": "燃气",
		"value": 'icon-ranqi'
	}, {
		"text": "鞋柜",
		"value": 'icon-xiegui'
	}, {
		"text": "沙发",
		"value": 'icon-shafa'
	}, {
		"text": "餐桌",
		"value": 'icon-fanzhuo'
	}, {
		"text": "净水器",
		"value": 'icon-jingshuiqi'
	}]
}
const filterData = [{
	text: '住宅',
	field: 'house_class',
	value: 0,
	type: 'radio',
	options: formOptions.house_class_localdata
}, {
	text: '出租',
	field: 'sall_rent_type',
	value: 0,
	type: 'radio',
	options: formOptions.sall_rent_type_localdata
}, {
	text: '精装',
	field: 'repair_mode',
	value: 0,
	type: 'radio',
	options: formOptions.repair_mode_localdata
}, {
	text: '筛选',
	type: 'check',
	options: [{
		text: '价格',
		field: 'price',
		value: 0,
		type: 'radio',
		options: [{
			text: '价格从低到高',
			value: 0
		}, {
			text: '价格从高到低',
			value: 1
		}]
	}, {
		text: '出租类型',
		field: 'rent_type',
		value: 0,
		type: 'radio',
		options: formOptions.rent_type_localdata
	}, {
		text: '主/次卧',
		field: 'main_room_type',
		value: 0,
		type: 'radio',
		options: formOptions.main_room_type_localdata
	}, {
		text: '车位',
		field: 'have_car',
		value: 0,
		type: 'radio',
		options: formOptions.have_car_localdata
	}, {
		text: '水电煤',
		field: 'life_type',
		value: 0,
		type: 'radio',
		options: formOptions.life_type_localdata
	}, {
		text: '房屋朝向',
		field: 'toward',
		value: 0,
		type: 'radio',
		options: formOptions.toward_localdata
	}, {
		text: '租售时长',
		field: 'rent_duration_type',
		value: 0,
		type: 'radio',
		options: formOptions.rent_duration_type_localdata
	}]
}];
export {
	filterData,
	formOptions
}
