"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/ss-superModules/superConfig.js");
require("../store/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function navToUrl(e) {
      common_vendor.index.navigateTo({
        url: e
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        b: common_vendor.o(($event) => navToUrl("/pageAdmin/user/user")),
        c: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        d: common_vendor.o(($event) => navToUrl("/pageAdmin/category/category")),
        e: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        f: common_vendor.o(($event) => navToUrl("/pageAdmin/newsArticle/list")),
        g: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        h: common_vendor.o(($event) => navToUrl("/pageAdmin/houseRent/list")),
        i: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        j: common_vendor.o(($event) => navToUrl("/pageAdmin/secondShop/list")),
        k: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        l: common_vendor.o(($event) => navToUrl("/pageAdmin/userDoc/list")),
        m: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        n: common_vendor.o(($event) => navToUrl("/pageAdmin/addressBook/list")),
        o: common_vendor.p({
          type: "right",
          color: "#999",
          size: "20"
        }),
        p: common_vendor.o(($event) => navToUrl("/pageAdmin/wxGroup/list"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
