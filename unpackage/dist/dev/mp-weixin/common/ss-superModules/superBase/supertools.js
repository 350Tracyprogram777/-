"use strict";
const common_vendor = require("../../vendor.js");
const common_ssSuperModules_superBase_superCrypto = require("./superCrypto.js");
const common_ssSuperModules_superBase_superTime = require("./superTime.js");
const tel = /^1[34578]\d{9}$/;
const ischinese = /^[\u4E00-\u9FA5]+$/;
const carnum = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})+$/;
const email = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const idcard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
const pswed = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
const AppName = "HTX";
const key_login = AppName + "LOGIN";
const key_autologin = AppName + "AUTOLOGIN";
const key_userinfo = AppName + "USERINFO";
const key_mpopenid = AppName + "MPOPENID";
const key_sharenum = AppName + "SHARENUM";
const key_navdata = AppName + "NAVDATA";
const key_subuserinfo = AppName + "SUBUSERINFO";
const key_navdata2 = AppName + "NAVDATA2";
const key_pushId = AppName + "PUSHID";
const key_version = AppName + "VERSION";
const key_defaultaddress = AppName + "DEFAULTADDRESS";
const key_myLocation = AppName + "LOCATION";
const key_token = AppName + "TOKEN";
const key_searchArchives = AppName + "SEARCHARCHIVES";
const key_pageData = AppName + "PAGEDATA";
const superTools = {
  // 验证手机号
  cheakphone: (e) => tel.test(e),
  // 验证密码
  cheakpswed: (e) => pswed.test(e),
  // 验证中文
  cheakchinese: (e) => ischinese.test(e),
  // 验证车牌号
  cheakcarnum: (e) => carnum.test(e),
  // 验证邮箱
  cheakemail: (e) => email.test(e),
  //验证身份证号
  cheakidcard: (e) => idcard.test(e),
  // 隐藏手机号
  hidPhone: (e) => {
    return e.substr(0, 3) + "****" + e.substr(7);
  },
  //获取各种格式的日期
  getCurrentTime: (format = "yyyy/MM/dd hh:mm:ss") => {
    let date = /* @__PURE__ */ new Date();
    return common_ssSuperModules_superBase_superTime.superTime.formatDate(date, format);
  },
  //获取各种格式的日期
  getCurrentTimeNYD: (format = "yyyy-MM-dd") => {
    let date = /* @__PURE__ */ new Date();
    return common_ssSuperModules_superBase_superTime.superTime.formatDate(date, format);
  },
  keepTwoDecimal: (num) => {
    var result = parseFloat(num);
    result = Math.round(num * 100) / 100;
    return result;
  },
  superRandomNum: (Min, Max) => {
    var Range = Max - Min;
    var Rand = Math.random();
    if (Math.round(Rand * Range) == 0) {
      return Min + 1;
    } else if (Math.round(Rand * Max) == Max) {
      index++;
      return Max - 1;
    } else {
      var num = Min + Math.round(Rand * Range) - 1;
      return num;
    }
  },
  openDYApp: (packName = "com.tencent.mm", action = "weixin://") => {
    if (plus.os.name == "Android") {
      plus.runtime.launchApplication({
        pname: packName
      }, function(e) {
      });
    } else if (plus.os.name == "iOS") {
      plus.runtime.launchApplication({
        action
      }, function(e) {
      });
    }
  },
  rand32order(randomFlag = 32, min = 32, max = 32) {
    let str = "", range = min, arr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ];
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
      let pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str.toLowerCase();
  },
  // 公众号用
  // 获取url 指定参数
  getUrlDataWithName: (name) => {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i"), url = window.location;
    if (reg.test(url))
      return unescape(RegExp.$2.replace(/\+/g, " "));
    return "";
  },
  //保存code
  save_code: (vaule) => common_vendor.index.setStorage({
    key: "usercode",
    data: vaule
  }),
  get_code: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync("usercode"),
  getLoction: () => {
  },
  /*
  ---------------- 小程序用---------------------------------
  
  */
  // 自动登录
  save_autoLogin: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_autologin, vaule),
  get_autoLogin: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_autologin),
  clear_autoLogin: () => common_vendor.index.removeStorageSync(key_autologin),
  // 登录的信息
  save_login: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_login, vaule),
  get_login: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_login),
  clear_login: () => common_vendor.index.removeStorageSync(key_login),
  // 获取子账号
  save_subuserinfo: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_subuserinfo, vaule),
  get_subuserinfo: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_subuserinfo),
  clear_subuserinfo: () => common_vendor.index.removeStorageSync(key_subuserinfo),
  // 获取用户信息
  save_userinfo: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_userinfo, vaule),
  get_userinfo: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_userinfo),
  clear_userinfo: () => common_vendor.index.removeStorageSync(key_userinfo),
  // 保存openid
  save_openid: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_mpopenid, vaule),
  get_openid: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_mpopenid),
  clear_mpopenid: () => common_vendor.index.removeStorageSync(key_mpopenid),
  // 保存邀请码
  save_sharenum: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_sharenum, vaule),
  get_sharenum: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_sharenum),
  clear_sharenum: () => common_vendor.index.removeStorageSync(key_sharenum),
  // 获取用户授权
  getAuthorize: (scope) => getauthorize(scope),
  // 临时数据
  save_navdata: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_navdata, vaule),
  get_navdata: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_navdata),
  clear_navdata: () => common_vendor.index.removeStorageSync(key_navdata),
  // 临时数据
  save_navdata2: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_navdata2, vaule),
  get_navdata2: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_navdata2),
  clear_navdata2: () => common_vendor.index.removeStorageSync(key_navdata2),
  // 推送id
  save_pushId: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_pushId, vaule),
  get_pushId: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_pushId),
  clear_pushId: () => common_vendor.index.removeStorageSync(key_pushId),
  // 获取版本信息
  save_version: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_version, vaule),
  get_version: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_version),
  clear_version: () => common_vendor.index.removeStorageSync(key_version),
  // 获取版本信息
  save_defaultaddress: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_defaultaddress, vaule),
  get_defaultaddress: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_defaultaddress),
  clear_defaultaddress: () => common_vendor.index.removeStorageSync(key_defaultaddress),
  // 获取版本信息
  save_myLocation: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_myLocation, vaule),
  get_myLocation: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_myLocation),
  clear_myLocation: () => common_vendor.index.removeStorageSync(key_myLocation),
  // 获取版本信息
  save_token: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_token, vaule),
  get_token: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_token),
  clear_token: () => common_vendor.index.removeStorageSync(key_token),
  // 搜索
  save_searchArchives: (vaule) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_searchArchives, vaule),
  get_searchArchives: () => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_searchArchives),
  clear_searchArchives: () => common_vendor.index.removeStorageSync(key_searchArchives),
  // 搜索
  save_pageData: (vaule) => {
    let dic = common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_pageData) || {};
    let pageKey = (/* @__PURE__ */ new Date()).getTime();
    dic[pageKey] = vaule;
    common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key_pageData, dic);
    return pageKey;
  },
  get_pageData: (pageKey) => {
    let dic = common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key_pageData) || {};
    if (dic[pageKey]) {
      return dic[pageKey];
    } else {
      return "";
    }
  },
  clear_pageData: () => common_vendor.index.removeStorageSync(key_pageData),
  superTS: (msg) => {
    common_vendor.index.showToast({
      title: msg,
      icon: "none",
      duration: 2e3,
      mask: true
    });
  },
  // app 分享
  appWxShare: (dic) => {
    common_vendor.index.share({
      provider: dic.provider,
      scene: dic.scene,
      type: 0,
      href: dic.href,
      title: dic.title,
      summary: dic.summary,
      imageUrl: dic.imageUrl,
      success: function(res) {
      },
      fail: function(err) {
      }
    });
  },
  superSet: (key, value) => common_ssSuperModules_superBase_superCrypto.superCrypto.superSetStorageSync(key, value),
  superGet: (key) => common_ssSuperModules_superBase_superCrypto.superCrypto.superGetStorageSync(key),
  jiaM: (data) => wxcrytpo.encrypt(JSON.stringify(data)),
  jieM: (data) => JSON.parse(wxcrytpo.decrypt(data).message),
  server_encrypt: (data) => common_ssSuperModules_superBase_superCrypto.superCrypto.serverEncrypt(data),
  server_deccrypt: (data) => common_ssSuperModules_superBase_superCrypto.superCrypto.serverDecrypt(data)
};
const getauthorize = (scope) => {
  return new Promise(function(relsove, reject) {
    common_vendor.index.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          common_vendor.index.authorize({
            scope,
            success(e) {
              relsove(true);
            },
            fail() {
              reject(false);
            }
          });
        } else {
          relsove(true);
        }
      }
    });
  });
};
exports.superTools = superTools;
