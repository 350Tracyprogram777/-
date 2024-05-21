"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/ss-superModules/superConfig.js");
require("./doc.js");
require("../store/index.js");
const _sfc_main = {
  __name: "class",
  setup(__props) {
    const docWidth = (common_vendor.index.getSystemInfoSync().screenWidth - 30 - 10) / 2 + "px";
    const docApi = common_vendor.Ws.importObject("user-doc");
    common_vendor.Ws.importObject("wxapi");
    const classArr = common_vendor.ref([]);
    common_vendor.onLoad(() => {
      loadBaseData();
    });
    function navToList(item) {
      console.log(item);
      common_vendor.index.navigateTo({
        url: "/pageDoc/list?classId=" + item.value
      });
    }
    function loadBaseData() {
      docApi.getClass().then((res) => {
        classArr.value = res.data;
        console.log(classArr.value);
        common_vendor.index.stopPullDownRefresh();
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(classArr.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.text),
            b: item.wx_group.length == 0
          }, item.wx_group.length == 0 ? {} : {}, {
            c: item.wx_group.length > 0
          }, item.wx_group.length > 0 ? {} : {}, {
            d: common_vendor.o(($event) => navToList(item), index),
            e: index
          });
        }),
        b: docWidth,
        c: docWidth,
        d: docWidth,
        e: docWidth
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageDoc/class.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
