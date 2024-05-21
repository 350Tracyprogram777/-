"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      showAlertInfo: {
        show: false,
        title: "",
        contentVoid: (e) => {
        },
        contentStyle: { color: "#444" },
        content: "",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        success: (e) => {
        }
      }
    };
  },
  methods: {
    showModalDic: function(e) {
      if (e.show) {
        this.$refs.alertPop.open();
      } else {
        this.$refs.alertPop.close();
      }
      Object.assign(this.showAlertInfo, e);
    },
    contentFuc: function(e) {
      this.$refs.alertPop.close();
      this.showAlertInfo.contentVoid();
    },
    twoClick: function(e) {
      this.$refs.alertPop.close();
      this.showAlertInfo.success({ confirm: e });
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.showAlertInfo.title),
    b: common_vendor.t($data.showAlertInfo.content),
    c: common_vendor.o((...args) => $options.contentFuc && $options.contentFuc(...args)),
    d: common_vendor.s($data.showAlertInfo.contentStyle),
    e: $data.showAlertInfo.showCancel
  }, $data.showAlertInfo.showCancel ? {
    f: common_vendor.t($data.showAlertInfo.cancelText),
    g: common_vendor.o(($event) => $options.twoClick(false))
  } : {}, {
    h: common_vendor.t($data.showAlertInfo.confirmText),
    i: common_vendor.o(($event) => $options.twoClick(true)),
    j: common_vendor.sr("alertPop", "2fb39365-0"),
    k: common_vendor.p({
      maskClick: false
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.vue"]]);
wx.createComponent(Component);
