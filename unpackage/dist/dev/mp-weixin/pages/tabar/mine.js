"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    common_vendor.Ws.importObject("wxapi");
    common_vendor.onLoad((e) => {
    });
    const userStore = store_modules_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const isCommunityAdmin = common_vendor.computed(() => userInfo.value.role ? userInfo.value.role.includes("communityAdmin") : false);
    function navToAuth() {
      common_vendor.index.navigateTo({
        url: "/pages/set/userInfo?back=1"
      });
    }
    function navToPage(url) {
      common_vendor.index.navigateTo({
        url
      });
    }
    function gzhErr(e) {
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.nickname
      }, userInfo.value.nickname ? {
        b: userInfo.value.avatar || "/static/logo.png",
        c: common_vendor.t(userInfo.value.nickname),
        d: common_vendor.t(userInfo.value.mobile),
        e: common_vendor.p({
          type: "right",
          color: "#999",
          size: "16"
        }),
        f: common_vendor.o(($event) => navToPage("/pages/set/userInfo"))
      } : {
        g: common_vendor.o(($event) => navToAuth())
      }, {
        h: common_vendor.o(($event) => navToPage("/pages/newsArticle/mySelf/list")),
        i: common_vendor.o(($event) => navToPage("/pages/houseRent/mySelf/list")),
        j: common_vendor.o(($event) => navToPage("/pages/addressBook/mySelf/list")),
        k: common_vendor.o(($event) => navToPage("/pageDoc/mySelf/list")),
        l: common_vendor.o(($event) => navToPage("/pages/secondShop/mySelf/list")),
        m: common_vendor.o(($event) => navToPage("/pages/collect/list")),
        n: common_vendor.o(($event) => navToPage("/pages/set/about")),
        o: isCommunityAdmin.value
      }, isCommunityAdmin.value ? {
        p: common_vendor.o(($event) => navToPage("/pageAdmin/index"))
      } : {}, {
        q: common_vendor.o(gzhErr),
        r: common_vendor.o(gzhErr)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/tabar/mine.vue"]]);
wx.createPage(MiniProgramPage);
