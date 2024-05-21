"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superBase/superData.js");
const wxApi = common_vendor.Ws.importObject("wxapi");
const useSystemStore = common_vendor.defineStore("systemStore", {
  state: () => {
    return {
      screenW: common_vendor.index.getSystemInfoSync().screenWidth,
      screenH: common_vendor.index.getSystemInfoSync().screenHeight,
      navH: common_vendor.index.getSystemInfoSync().statusBarHeight,
      systemConfig: {
        allowWithdraw: true,
        withdrawDesc: "系统升级期间，暂不允许提现",
        withdrawFixAmount: "1",
        withdrawLimit: "1",
        withdrawRate: "0.03"
      },
      loginBackPage: "",
      pageDic: "",
      wxStartEnv: {
        scene: 0,
        path: "",
        opengid: "",
        query: {
          timestmap: 0
        }
      },
      selectGroupArr: []
    };
  },
  actions: {
    // 获取群标识
    getWxGroup() {
      let xcxEnvDic = common_vendor.wx$1.getEnterOptionsSync();
      let self = this;
      console.log("微信环境", xcxEnvDic);
      return new Promise(function(resolve, reject) {
        if (xcxEnvDic.scene != 1008) {
          console.log("直接返回");
          reject(false);
        }
        if (xcxEnvDic.path == self.wxStartEnv.path && xcxEnvDic.scene == self.wxStartEnv.scene && self.wxStartEnv.opengid && xcxEnvDic.query.timestmap == self.wxStartEnv.query.timestmap) {
          console.log("取得花村", self.wxStartEnv);
          resolve(self.wxStartEnv.opengid);
        } else {
          common_vendor.wx$1.login({
            success(loginRes) {
              if (loginRes.code) {
                common_vendor.wx$1.getGroupEnterInfo({
                  success(res) {
                    if (res.errMsg == "getGroupEnterInfo:ok") {
                      wxApi.getWxEnctyMsg({
                        code: loginRes.code,
                        iv: res.iv,
                        encryptedData: res.encryptedData
                      }).then((successres) => {
                        if (successres.errCode == 0) {
                          xcxEnvDic["opengid"] = successres.data;
                          console.log(
                            "pppppppppppppp",
                            xcxEnvDic
                          );
                          Object.assign(
                            self.wxStartEnv,
                            xcxEnvDic
                          );
                          console.log(
                            "pppppppppppppp",
                            self.wxStartEnv
                          );
                          resolve(
                            self.wxStartEnv.opengid
                          );
                        } else {
                          reject(false);
                        }
                      });
                    }
                  },
                  fail() {
                  }
                });
              } else {
                reject(false);
              }
            }
          });
        }
      });
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      //本地存储名字
      key: "PinaSystem",
      storage: {
        getItem: (key) => common_vendor.index.getStorageSync(key),
        setItem: (key, value) => common_vendor.index.setStorageSync(key, value),
        removeItem: (key) => {
        }
      }
    }]
  }
});
exports.useSystemStore = useSystemStore;
