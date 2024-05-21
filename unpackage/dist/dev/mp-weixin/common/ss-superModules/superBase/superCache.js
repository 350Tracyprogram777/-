"use strict";
const common_ssSuperModules_superBase_superCrypto = require("./superCrypto.js");
const common_ssSuperModules_superBase_ss_config = require("./ss.config.js");
const common_ssSuperModules_superBase_supertools = require("./supertools.js");
const sec_num = (s) => {
  return s * 1e3;
};
const CACHEKEY = function() {
  const userCode = common_ssSuperModules_superBase_supertools.superTools.get_userinfo()._id || "";
  if (userCode) {
    return common_ssSuperModules_superBase_ss_config.appConfig.appName + userCode + "HUNCUN";
  } else {
    return "";
  }
};
class superCache {
  constructor(time = 1e4) {
    this.cacheDic = common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(CACHEKEY()) || {};
    this.noCacheArr = [{
      url: "appUser/login/pwd",
      time: 1e3
    }];
    this.cacheArr = [
      {
        url: "appGame/area/list",
        time: sec_num(2)
      },
      {
        url: "appGame/good/going/list",
        time: sec_num(2)
      },
      {
        url: "appGame/good/list",
        time: sec_num(2)
      },
      {
        url: "appBusiness/team/data",
        time: sec_num(1800)
      },
      {
        url: "appBusiness/team/list",
        time: sec_num(1800)
      }
    ];
  }
  // 单例方法
  static getInstace() {
    if (!this.instance) {
      this.instance = new superCache();
    }
    return this.instance;
  }
  // 设置不需要缓存的数据
  setNoCacheArr(arr) {
    this.noCacheArr = this.noCacheArr.concat(arr);
  }
  // 设置需要缓存的数据api
  setCacheArr(arr) {
    this.cacheArr = this.cacheArr.concat(arr);
  }
  // 查询此api 是否需要缓存 true 需要缓存你  false不需要缓存
  isCacheOfApi(api) {
    let isIndex_no = this.noCacheArr.findIndex(function(a, b) {
      return api == a.url;
    });
    let isIndex_yes = this.cacheArr.findIndex(function(a, b) {
      return api == a.url;
    });
    if (isIndex_yes >= 0) {
      return true;
    }
    if (isIndex_no >= 0 && isIndex_yes < 0) {
      return false;
    }
    return false;
  }
  // 查询此api 是否需要缓存 true 需要缓存你  false不需要缓存
  getCustomCacheOfApi(api) {
    let item = this.cacheArr.find(function(a, b) {
      return api == a.url;
    });
    if (item) {
      return item;
    } else {
      return "";
    }
  }
  set(key, value, time) {
    let expirationTime = time ? time : this.expTime;
    let expTime = (/* @__PURE__ */ new Date()).getTime() + expirationTime;
    this.cacheDic[key] = {
      data: value,
      expTime,
      startTime: (/* @__PURE__ */ new Date()).getTime()
    };
    common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(CACHEKEY(), this.cacheDic);
  }
  get(key) {
    let keyData = this.cacheDic[key];
    if (keyData) {
      let expTime = keyData["expTime"];
      let currTime = (/* @__PURE__ */ new Date()).getTime();
      if (currTime > expTime) {
        return "";
      }
      return keyData["data"];
    } else {
      return "";
    }
  }
  getCacheTime(key) {
    let keyData = this.cacheDic[key];
    if (keyData) {
      let expTime = keyData["expTime"];
      let currTime = (/* @__PURE__ */ new Date()).getTime();
      if (currTime > expTime) {
        return "";
      }
      return keyData["startTime"];
    } else {
      return "";
    }
  }
}
const superCache$1 = superCache.getInstace();
exports.superCache = superCache$1;
