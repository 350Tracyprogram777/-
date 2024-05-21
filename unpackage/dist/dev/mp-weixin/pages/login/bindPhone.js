"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const _sfc_main = {
  __name: "bindPhone",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    const loginBackPage = common_vendor.computed(() => userStore.loginBackPage);
    const wxApi = common_vendor.Ws.importObject("wxapi");
    const userApi = common_vendor.Ws.importObject("user-info");
    common_vendor.onLoad(() => {
      common_vendor.Ws.onRefreshToken(function(event) {
        console.log("token 刷新了-=-=--==-");
      });
    });
    function getPhone(e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wxApi.getWxPhone(e.detail.code).then((res) => {
          console.log(res);
          if (res.errCode == 0) {
            userApi.bindPhone(res.data).then((res2) => {
              if (res2.errCode == 0) {
                common_vendor.index.setStorageSync("uni_id_token", res2.data.token);
                common_vendor.index.setStorageSync("uni_id_token_expired", res2.data.tokenExpired);
              }
              userStore.getUserInfo.then((sures) => {
                if (loginBackPage.value) {
                  common_vendor.index.redirectTo({
                    url: loginBackPage.value
                  });
                  userStore.loginBackPage = "";
                  common_ssSuperModules_superConfig.msg("绑定成功");
                } else {
                  common_vendor.index.navigateBack();
                }
              });
            });
          } else {
            common_ssSuperModules_superConfig.msg("请重试");
          }
        });
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(getPhone)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/login/bindPhone.vue"]]);
wx.createPage(MiniProgramPage);
