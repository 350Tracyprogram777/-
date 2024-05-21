"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    prewImg: function() {
      common_vendor.index.previewImage({
        current: 0,
        urls: ["/static/public/gzh.jpg"]
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/pages/set/about.vue"]]);
wx.createPage(MiniProgramPage);
