// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "address": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": ""
  },
  "gps": {
    "rules": [
      {
        "format": "object"
      }
    ]
  },
  "build": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "几栋"
  },
  "unit": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "几单元"
  },
  "number": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "门牌号"
  },
  "floor": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "楼层"
  },
  "total_floor": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "楼高"
  },
  "rent_type": {
    "rules": [
      {
        "format": "sting"
      },
      {
        "range": [
          {
            "text": "整租",
            "value": 0
          },
          {
            "text": "合租",
            "value": 1
          }
        ]
      }
    ],
    "label": "出租类型"
  },
  "area": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "房屋面积"
  },
  "toward": {
    "rules": [
      {
        "format": "sting"
      }
    ],
    "label": "房屋朝向"
  },
  "house_set": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "房屋配套"
  },
  "repair_mode": {
    "rules": [
      {
        "format": "sting"
      },
      {
        "range": [
          {
            "text": "毛坯",
            "value": 0
          },
          {
            "text": "简装",
            "value": 1
          },
          {
            "text": "精装",
            "value": 2
          }
        ]
      }
    ],
    "label": "装修精度"
  },
  "rant_price": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "租金"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "remark": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "备注"
  },
  "user_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "用户id"
  },
  "images": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "房屋图片"
  },
  "state": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "租售中",
            "value": 0
          },
          {
            "text": "已出租",
            "value": 1
          },
          {
            "text": "停止租售",
            "value": 2
          },
          {
            "text": "审核未通过",
            "value": 3
          }
        ]
      }
    ],
    "label": "租售状态"
  }
}

const enumConverter = {
  "rent_type_valuetotext": [
    {
      "text": "整租",
      "value": 0
    },
    {
      "text": "合租",
      "value": 1
    }
  ],
  "repair_mode_valuetotext": [
    {
      "text": "毛坯",
      "value": 0
    },
    {
      "text": "简装",
      "value": 1
    },
    {
      "text": "精装",
      "value": 2
    }
  ],
  "state_valuetotext": {
    "0": "租售中",
    "1": "已出租",
    "2": "停止租售",
    "3": "审核未通过"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
