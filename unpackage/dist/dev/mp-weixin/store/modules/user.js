"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
const common_ssSuperModules_superBase_supertools = require("../../common/ss-superModules/superBase/supertools.js");
const db = common_vendor.Ws.database();
const usersTable = db.collection("uni-id-users");
const uniIdCo = common_vendor.Ws.importObject("uni-id-co", {
  customUI: true
});
const useUserStore = common_vendor.defineStore("userStore", {
  state: () => {
    return {
      hasLogin: false,
      autoLogin: true,
      wxGzhOpenId: "",
      //用户信息
      userInfo: {
        name: "张三"
      },
      loginBackPage: "",
      //登录成功后需要返回的页面
      defaultAddress: "",
      //默认地址信息
      temDefaultAddress: ""
      //临时地址信息
    };
  },
  actions: {
    // 登录
    async loginIn() {
      let self = this;
      return new Promise(function(resolve, reject) {
        common_vendor.wx$1.login({
          success({
            code
          }) {
            uniIdCo.loginByWeixin({
              code
            }).then((e) => {
              self.hasLogin = true;
              common_ssSuperModules_superBase_supertools.superTools.save_token(e.newToken.token || "");
              if (e.uid != self.userInfo._id) {
                self.userInfo = {};
                console.log("用户被删除");
              }
              self.getUserInfo();
              resolve(e);
            });
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    },
    // 获取用户信息
    getUserInfo() {
      let self = this;
      return new Promise(function(resolve, reject) {
        usersTable.where("'_id' == $cloudEnv_uid").field(
          "mobile,sys_msg,nickname,wx_unionid,wx_openid,avatar,gender,wxnickname,role"
        ).get().then((res) => {
          const userInfo = res.result.data[0];
          self.userInfo = userInfo;
          self.hasLogin = true;
          console.log("用户信息", self.userInfo);
          resolve(userInfo);
        }).catch((e) => {
          self.loginOut();
          common_ssSuperModules_superBase_supertools.superTools.clear_mpopenid();
          reject(e);
        }).finally((e) => {
          common_vendor.index.hideLoading();
        });
      });
    },
    // 退出
    loginOut() {
      this.$reset();
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      //本地存储名字
      key: "PinaUser",
      storage: {
        getItem: (key) => common_vendor.index.getStorageSync(key),
        setItem: (key, value) => common_vendor.index.setStorageSync(key, value),
        removeItem: (key) => {
        }
      }
    }]
  }
});
exports.useUserStore = useUserStore;
