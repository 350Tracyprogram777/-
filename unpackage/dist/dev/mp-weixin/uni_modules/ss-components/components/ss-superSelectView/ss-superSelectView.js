"use strict";
const common_vendor = require("../../../../common/vendor.js");
require("../../../../common/ss-superModules/superConfig.js");
require("../../../../store/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../../uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "ss-superSelectView",
  props: {
    selectArr: {
      type: Array,
      default: () => []
    },
    maxNum: {
      type: Number,
      default: 3
    },
    localdata: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: "value"
    }
  },
  emits: ["update:selectArr"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dataList = common_vendor.ref([]);
    const showTextArr = common_vendor.ref([]);
    common_vendor.watch(() => {
      dataList.value = props.localdata;
      for (let item of dataList.value) {
        const isselect = props.selectArr.findIndex(function(a, b) {
          return a == item[props.value];
        });
        if (isselect >= 0) {
          if (!showTextArr.value.includes(item["text"])) {
            showTextArr.value.push(item["text"]);
          }
          item.isSelect = true;
        } else {
          if (showTextArr.value.includes(item["text"])) {
            const inx = showTextArr.value.findIndex(function(a, b) {
              return a == item["text"];
            });
            showTextArr.value.splice(inx, 1);
          }
          item.isSelect = false;
        }
      }
    });
    const temSelectArr = common_vendor.computed(() => {
      return dataList.value.filter(function(a, b) {
        return a.isSelect;
      });
    });
    const labelNum = common_vendor.computed(() => {
      return temSelectArr.value.length + "/" + props.maxNum;
    });
    function selectItem(item) {
      if (temSelectArr.value.length < props.maxNum || item.isSelect) {
        item.isSelect = !item.isSelect;
      }
    }
    function sureVoid() {
      let arr = [];
      for (let item of dataList.value) {
        if (item.isSelect) {
          arr.push(item[props.value]);
        }
      }
      console.log(arr);
      emit("update:selectArr", arr);
      selectPop.value.close();
    }
    const selectPop = common_vendor.ref();
    function showPop() {
      selectPop.value.open();
    }
    function hidePop() {
      selectPop.value.close();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.selectArr.length > 0
      }, __props.selectArr.length > 0 ? {
        b: common_vendor.f(showTextArr.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        })
      } : {}, {
        c: common_vendor.p({
          type: "right",
          color: "#999",
          size: "15"
        }),
        d: common_vendor.o(showPop),
        e: common_vendor.o(hidePop),
        f: common_vendor.t(labelNum.value),
        g: common_vendor.o(sureVoid),
        h: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: common_vendor.o(($event) => selectItem(item), index),
            c: common_vendor.n(item.isSelect ? "selectItem-s" : "selectItem-n"),
            d: index
          };
        }),
        i: common_vendor.sr(selectPop, "f2f6f6ee-1", {
          "k": "selectPop"
        }),
        j: common_vendor.p({
          type: "bottom"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/uni_modules/ss-components/components/ss-superSelectView/ss-superSelectView.vue"]]);
wx.createComponent(Component);
