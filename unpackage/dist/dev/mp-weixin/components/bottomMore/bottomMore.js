"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "bottomMore",
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    loadMore: {
      type: String,
      default: "more"
    }
  }
};
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.dataList.length > 0
  }, $props.dataList.length > 0 ? {
    b: common_vendor.p({
      status: $props.loadMore
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/components/bottomMore/bottomMore.vue"]]);
wx.createComponent(Component);
