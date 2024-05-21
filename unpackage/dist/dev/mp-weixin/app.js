"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const store_modules_user = require("./store/modules/user.js");
require("./common/ss-superModules/superConfig.js");
const common_ssSuperModules_superBase_superData = require("./common/ss-superModules/superBase/superData.js");
const common_ssSuperModules_superBase_supertools = require("./common/ss-superModules/superBase/supertools.js");
if (!Math) {
  "./pages/tabar/main.js";
  "./pages/houseRent/list.js";
  "./pages/houseRent/add.js";
  "./pages/houseRent/detail.js";
  "./pages/manager/community/list.js";
  "./pages/manager/community/add.js";
  "./pages/addressBook/add.js";
  "./pages/addressBook/list.js";
  "./pages/addressBook/detail.js";
  "./pages/photos/list.js";
  "./pages/tabar/mine.js";
  "./pages/login/login.js";
  "./pages/login/bindPhone.js";
  "./pages/houseRent/mySelf/list.js";
  "./pages/addressBook/mySelf/list.js";
  "./pages/manager/community/desc.js";
  "./pages/newsArticle/webUrl.js";
  "./pages/newsArticle/add.js";
  "./pages/newsArticle/detail.js";
  "./pages/newsArticle/mySelf/list.js";
  "./pages/collect/list.js";
  "./pages/set/set.js";
  "./pages/set/userInfo.js";
  "./pages/set/ceshi.js";
  "./pages/newsArticle/selectAddressBook/selectAddressBook.js";
  "./pages/secondShop/list.js";
  "./pages/secondShop/add.js";
  "./pages/secondShop/mySelf/list.js";
  "./pages/secondShop/detail.js";
  "./pages/set/about.js";
  "./pageDoc/list.js";
  "./pageDoc/detail.js";
  "./pageDoc/add.js";
  "./pageDoc/mySelf/list.js";
  "./pageDoc/class.js";
  "./pageDoc/wxGroupDetail.js";
  "./pageAdmin/addressBook/list.js";
  "./pageAdmin/houseRent/list.js";
  "./pageAdmin/newsArticle/list.js";
  "./pageAdmin/index.js";
  "./pageAdmin/category/category.js";
  "./pageAdmin/user/user.js";
  "./pageAdmin/user/setUser.js";
  "./pageAdmin/userDoc/list.js";
  "./pageAdmin/secondShop/list.js";
  "./pageAdmin/wxGroup/list.js";
  "./pageAdmin/wxGroup/add.js";
  "./pageAdmin/category/selectWxGroup.js";
}
const _sfc_main = {
  onLaunch: async function(e) {
    const userStore = store_modules_user.useUserStore();
    userStore.loginIn();
  },
  onShow: function(e) {
    console.log("App Show", e);
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.config.globalProperties.superData = common_ssSuperModules_superBase_superData.superData;
  app.config.globalProperties.superTools = common_ssSuperModules_superBase_supertools.superTools;
  app.use(store_index.pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
