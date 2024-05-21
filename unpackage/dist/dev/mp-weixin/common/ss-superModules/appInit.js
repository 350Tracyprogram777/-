"use strict";
const common_vendor = require("../vendor.js");
const common_ssSuperModules_appConfig = require("./appConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
async function appInit() {
  common_ssSuperModules_appConfig.uniStarterConfig.router.login;
  const {
    "router": {
      needLogin,
      visitor,
      login
    }
  } = common_ssSuperModules_appConfig.uniStarterConfig;
  let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  list.forEach((item) => {
    common_vendor.index.addInterceptor(item, {
      invoke(e) {
        const to_page_url = e.url.split("?")[0];
        const login_url = "/pages/set/userInfo";
        const userStore = store_modules_user.useUserStore();
        console.log("usestore", userStore);
        userStore.hasLogin;
        const userInfo = userStore.userInfo;
        const pages = getCurrentPages();
        console.log("要去的界面", e);
        console.log("userInfo", userInfo);
        if (!pages.length) {
          console.log("首页启动调用了");
          return e;
        }
        pages[pages.length - 1].route;
        if (login_url == to_page_url) {
          return e;
        }
        const isMustNeed = needLogin.findIndex(function(item2, index) {
          if (typeof item2 == "string") {
            if (item2 == to_page_url) {
              return true;
            }
          } else {
            return item2.pattern.test(to_page_url);
          }
        });
        if (isMustNeed >= 0) {
          if (!userInfo.nickname || !userInfo.mobile) {
            userInfo.loginBackPage = to_page_url;
            common_vendor.index.navigateTo({
              url: login_url
            });
            return false;
          }
        }
        return e;
      },
      fail(err) {
        console.log("hhhha3333");
        console.log(err);
      }
    });
  });
}
exports.appInit = appInit;
