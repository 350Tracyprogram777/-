"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const loginBackPage = common_vendor.computed(() => userStore.loginBackPage);
    const db = common_vendor.Ws.database();
    const usersTable = db.collection("uni-id-users");
    const back = common_vendor.ref(false);
    common_vendor.onLoad((e) => {
      if (e.back == 1) {
        back.value = true;
      }
    });
    function getUserInfo() {
      common_vendor.wx$1.getUserProfile({
        desc: "用于完善会员资料",
        success: function(wxres) {
          console.log("用户表", wxres);
          let dic = {
            avatar: wxres.userInfo.avatarUrl,
            wxnickname: wxres.userInfo.nickName
          };
          if (!userInfo.value.nickname) {
            dic = {
              nickname: wxres.userInfo.nickName,
              avatar: wxres.userInfo.avatarUrl,
              wxnickname: wxres.userInfo.nickName
            };
          }
          usersTable.where("_id==$env.uid").update(dic).then((e) => {
            Object.assign(userInfo.value, dic);
            userStore.loginBackPage = "";
            if (loginBackPage.value) {
              common_vendor.index.redirectTo({
                url: loginBackPage.value
              });
            } else {
              common_vendor.index.navigateBack();
            }
          });
        },
        fail: function(err) {
          console.log(err);
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(getUserInfo)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
