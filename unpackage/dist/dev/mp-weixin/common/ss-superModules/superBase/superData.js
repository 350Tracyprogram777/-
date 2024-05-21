"use strict";
const common_vendor = require("../../vendor.js");
const common_ssSuperModules_superBase_superCrypto = require("./superCrypto.js");
const common_ssSuperModules_superBase_ss_config = require("./ss.config.js");
const common_ssSuperModules_superBase_supertools = require("./supertools.js");
const common_ssSuperModules_superBase_superCache = require("./superCache.js");
let currDomain = common_ssSuperModules_superBase_ss_config.appConfig.domain_pro;
const openCache = true;
const systemDic = common_vendor.index.getSystemInfoSync();
const superTS = (msg) => {
  common_vendor.index.showToast({
    title: msg,
    icon: "none",
    duration: 2e3,
    mask: true
  });
};
const hub = {
  open: (msg) => {
    common_vendor.index.showLoading({
      title: msg,
      mask: true
    });
  },
  close: () => common_vendor.index.hideLoading()
};
class superdata {
  constructor() {
    this.openCache = openCache;
    this.cloudPathPrefix = `${common_ssSuperModules_superBase_ss_config.appConfig.appName}/`;
    this.filterArr = [];
  }
  watchPush({
    success
  }) {
  }
  // 单例方法
  static getInstace() {
    if (!this.instance) {
      this.instance = new superdata();
    }
    return this.instance;
  }
  // 所有请求 中间件
  middleCheck(otherDic, url2 = "", parameter = {}) {
    currDomain = common_ssSuperModules_superBase_ss_config.appConfig.base_url_pro;
    let defaultDic = {
      hubtitle: "",
      allBack: false,
      errToast: true,
      domain: "",
      header: {},
      method: "POST",
      cloudFun: "",
      cache: true,
      cacheTime: ""
    };
    Object.assign(defaultDic, otherDic);
    if (defaultDic.hubtitle != " ") {
      hub.open(defaultDic.hubtitle || "");
    }
    defaultDic.domain = defaultDic.domain ? defaultDic.domain : currDomain;
    defaultDic.method = defaultDic.method ? defaultDic.method : "POST";
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    const nonce = common_ssSuperModules_superBase_supertools.superTools.rand32order();
    const sign = common_ssSuperModules_superBase_superCrypto.superCrypto.customJM(parameter, timestamp, nonce);
    let headerDic = {
      "content-type": "application/x-www-form-urlencoded",
      "account": common_ssSuperModules_superBase_supertools.superTools.get_userinfo() ? common_ssSuperModules_superBase_supertools.superTools.get_userinfo()._id : "",
      "token": common_ssSuperModules_superBase_supertools.superTools.get_token() ? common_ssSuperModules_superBase_supertools.superTools.get_token() : "",
      "signature": common_vendor.md5(url2 + "twgdw666"),
      // 'sign': md5(url + 'twgdw666'),
      "timestamp": timestamp,
      "nonce": nonce,
      "sign": sign,
      "version": systemDic.uniPlatform == "app" ? systemDic.appWgtVersion : systemDic.appVersion,
      "deviceId": systemDic.deviceId,
      "test": common_ssSuperModules_superBase_ss_config.appConfig.debug
    };
    Object.assign(headerDic, defaultDic.header);
    defaultDic.header = headerDic;
    return defaultDic;
  }
  getCacheTime(url2, parameter = {}) {
    let cacheKeyStr = JSON.stringify(parameter) + url2;
    let cacheKey = common_vendor.md5(cacheKeyStr);
    return common_ssSuperModules_superBase_superCache.superCache.getCacheTime(cacheKey);
  }
  // http 请求
  superRequest(url2, parameter = {}, otherDic = {}) {
    let defaultDic = this.middleCheck(otherDic, url2, parameter);
    let cacheKeyStr = JSON.stringify(parameter) + url2;
    let cacheKey = common_vendor.md5(cacheKeyStr);
    return new Promise(function(resolve, reject) {
      if (defaultDic.cache) {
        let cacheData = common_ssSuperModules_superBase_superCache.superCache.get(cacheKey);
        if (cacheData) {
          common_vendor.index.stopPullDownRefresh();
          resolve(cacheData);
          return;
        }
      }
      {
        console.group("请求接口---", url2);
        console.table(parameter);
        console.groupEnd();
      }
      common_vendor.index.request({
        url: defaultDic.domain + url2,
        data: parameter,
        header: defaultDic.header,
        method: defaultDic.method,
        dataType: "json",
        responseType: "text",
        success: function(res) {
          {
            console.group("接口返回---", res.data.code, url2);
            console.table(res.data.data);
            console.groupEnd();
          }
          if (res.data.code == 1) {
            if (defaultDic.cache && common_ssSuperModules_superBase_superCache.superCache.isCacheOfApi(url2)) {
              let api_cache_config = common_ssSuperModules_superBase_superCache.superCache.getCustomCacheOfApi(url2);
              const cacheTime = defaultDic.cacheTime || api_cache_config.time;
              common_ssSuperModules_superBase_superCache.superCache.set(cacheKey, res.data.data, cacheTime);
            }
            if (defaultDic.allBack) {
              resolve(res.data);
            } else {
              resolve(res.data.data);
            }
          } else {
            if (defaultDic.allBack) {
              resolve(res.data);
              return;
            }
            if (res.data.code == 300) {
              window.location.href = common_ssSuperModules_superBase_ss_config.appConfig.webpath;
              return;
            }
            if (res.data.code == 99 && defaultDic.header.token) {
              common_vendor.index.showModal({
                title: "请返回重新登录",
                showCancel: false,
                success: function() {
                  common_ssSuperModules_superBase_supertools.superTools.clear_autoLogin();
                  common_vendor.index.clearStorageSync();
                  common_vendor.index.reLaunch({
                    url: "/pages/login/login"
                  });
                }
              });
              return;
            }
            if (res.data.msg && defaultDic.errToast) {
              superTS(res.data.msg);
            }
            reject(res.data);
          }
        },
        complete() {
          hub.close();
          common_vendor.index.stopPullDownRefresh();
        }
      });
    });
  }
  // 上传图片
  superImgRequest(url2, parameter = {}, filePath, otherDic = {}) {
    let defaultDic = this.middleCheck(otherDic, url2, parameter);
    delete defaultDic.header["content-type"];
    return new Promise(function(resolve, reject) {
      common_vendor.index.uploadFile({
        url: defaultDic.domain + url2,
        //仅为示例，非真实的接口地址
        filePath,
        header: defaultDic.header,
        name: "file",
        formData: parameter,
        success: (uploadFileRes) => {
          let dic = JSON.parse(uploadFileRes.data);
          hub.close();
          common_vendor.index.stopPullDownRefresh();
          resolve(dic.data);
        }
      });
    });
  }
  // 云函数请求
  superCloudRequest(action, parameter = {}, otherDic = {}) {
    let defaultDic = this.middleCheck(otherDic, url);
    let jmData = common_ssSuperModules_superBase_superCrypto.superCrypto.serverEncrypt(parameter);
    let cloudFunStr = defaultDic.cloudFun || "client";
    let apiUrl = cloudFunStr + "/" + action;
    let cacheKeyStr = apiUrl + JSON.stringify(parameter);
    let cacheKey = common_vendor.md5(cacheKeyStr);
    if (defaultDic.cache) {
      let cacheData = common_ssSuperModules_superBase_superCache.superCache.get(cacheKey);
      if (cacheData) {
        hub.close();
        ssprint("缓存数据", cacheData);
        common_vendor.index.stopPullDownRefresh();
        return Promise.resolve(cacheData);
      }
    }
    return new Promise(function(resolve, reject) {
      common_vendor.Ws.callFunction({
        name: cloudFunStr,
        data: {
          action,
          data: jmData
        }
      }).then((res) => {
        hub.close();
        common_vendor.index.stopPullDownRefresh();
        if (res.result.code == 200) {
          if (defaultDic.cache && common_ssSuperModules_superBase_superCache.superCache.isCacheOfApi(url)) {
            let api_cache_config = common_ssSuperModules_superBase_superCache.superCache.getCustomCacheOfApi(url);
            const cacheTime = defaultDic.cacheTime || api_cache_config.time;
            common_ssSuperModules_superBase_superCache.superCache.set(cacheKey, res.data.data, cacheTime);
          }
          resolve(res.result.data);
        } else {
          superTS(res.result.data);
          reject(res.result.state);
        }
      }).catch((err) => {
        superTS(err);
        reject();
      });
    });
  }
  // 云函数请求
  // 云函数请求
  superImgCloudRequest(filePath, cloudPath, isAliyun = true, isCustom = false, otherDic = {}) {
    return new Promise(function(resolve, reject) {
      common_vendor.Ws.uploadFile({
        filePath,
        cloudPath
      }).then((res) => {
        if (!isAliyun) {
          common_vendor.Ws.getTempFileURL({
            fileList: [res.fileID]
          }).then((fileRes) => {
            resolve(fileRes.fileList[0]["tempFileURL"]);
          });
        } else {
          resolve(res.fileID);
        }
      }).catch((err) => {
        console.log("上传错误", err);
        superTS(err);
        hub.close();
        reject();
      });
    });
  }
}
const superData = superdata.getInstace();
exports.superData = superData;
