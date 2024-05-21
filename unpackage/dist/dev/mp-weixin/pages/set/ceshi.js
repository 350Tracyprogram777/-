"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    gzhErr(e) {
      console.log("SKDJF;ADSKJF;KDSA", e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.gzhErr && $options.gzhErr(...args)),
    b: common_vendor.o((...args) => $options.gzhErr && $options.gzhErr(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/pages/set/ceshi.vue"]]);
wx.createPage(MiniProgramPage);
