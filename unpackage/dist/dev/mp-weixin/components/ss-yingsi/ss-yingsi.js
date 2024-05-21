"use strict";
const components_ssYingsi_yingsi = require("./yingsi.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    titleArr: {
      type: Array,
      default: function() {
        return ["用户服务协议"];
      }
    },
    showcancle: {
      type: Boolean,
      default: true
    },
    cancleText: {
      type: String,
      default: "不同意"
    },
    sureText: {
      type: String,
      default: "同意"
    }
  },
  data() {
    return {
      dataDic: { title: "用户服务协议和隐私政策" },
      showxyView: false,
      isAgree: false
    };
  },
  mounted() {
  },
  methods: {
    tyclick: function(e) {
      this.isAgree = e;
      this.$emit("agreeChange", e);
      this.showxyView = false;
    },
    //展示协议
    showxyVoid: function() {
      console.log(components_ssYingsi_yingsi.content);
      this.dataDic["content"] = components_ssYingsi_yingsi.content;
      this.showxyView = true;
    },
    agreeVoid: function() {
      this.isAgree = !this.isAgree;
      this.$emit("agreeChange", this.isAgree);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.agreeVoid && $options.agreeVoid(...args)),
    b: common_vendor.n($data.isAgree ? "iconic_gouwuche_quan_p themecolor" : "iconic_gouwuche_quan_n color-999"),
    c: common_vendor.f($props.titleArr, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.showxyVoid(), index),
        c: index
      };
    }),
    d: $data.showxyView
  }, $data.showxyView ? common_vendor.e({
    e: common_vendor.t($data.dataDic.title),
    f: $props.showcancle
  }, $props.showcancle ? {
    g: common_vendor.t($props.cancleText),
    h: common_vendor.o(($event) => $options.tyclick(false))
  } : {}, {
    i: common_vendor.t($props.sureText),
    j: common_vendor.o(($event) => $options.tyclick(true))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/components/ss-yingsi/ss-yingsi.vue"]]);
wx.createComponent(Component);
