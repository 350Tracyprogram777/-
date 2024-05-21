"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  props: {
    //选项数组
    tabarArr: {
      type: Array,
      default: function() {
        return [{
          value: 0,
          text: "我的"
        }, {
          value: 1,
          text: "公开模板"
        }];
      }
    },
    // 选中的那个
    topSelectIndex: {
      type: [Number, String],
      default: 0
    },
    // 风格
    styleSet: {
      type: [String, Number],
      default: "2"
    },
    // 等分
    widthNum: {
      type: String,
      default: ""
    },
    justifycontent: {
      type: String,
      default: "flex-start"
    },
    bgcolor: {
      type: String,
      default: "#FFFFFF"
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      scrollLeft: 1
    };
  },
  computed: {
    leftdance: function() {
      return 100 * (this.topSelectIndex - 1);
    }
  },
  methods: {
    changeVoid: function(e) {
      this.$emit("tabSelect", e);
    },
    getStyle: function() {
      return "style-" + this.styleSet;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.tabarArr, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.text),
        b: common_vendor.n(index == $props.topSelectIndex ? "item_s" : "item_n"),
        c: item.num > 0
      }, item.num > 0 ? {
        d: common_vendor.t(item.num)
      } : {}, {
        e: common_vendor.n(index == $props.topSelectIndex ? "item_s_b" : "item_n_b"),
        f: index,
        g: common_vendor.o(($event) => $options.changeVoid({
          index,
          item
        }), index)
      });
    }),
    b: common_vendor.n($props.widthNum),
    c: common_vendor.n($options.getStyle()),
    d: $options.leftdance,
    e: common_vendor.n($props.border ? "border_s" : "border_n"),
    f: $props.justifycontent,
    g: $props.bgcolor
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/uni_modules/ss-components/components/ss-topTabar/ss-topTabar.vue"]]);
wx.createComponent(Component);
