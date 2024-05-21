"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ss-image",
  props: {
    src: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: [String, Number],
      default: ""
    },
    size: {
      type: String,
      default: "200"
    }
  },
  setup(__props) {
    const props = __props;
    const src_path = common_vendor.computed(() => {
      if (props.src.indexOf("http") >= 0) {
        console.log(props.src);
        return props.src + `?x-oss-process=image/resize,h_${props.size},m_lfit`;
      } else {
        return props.src;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: src_path.value,
        b: props.width + "rpx",
        c: props.height + "rpx"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/ss-image/ss-image.vue"]]);
wx.createComponent(Component);
