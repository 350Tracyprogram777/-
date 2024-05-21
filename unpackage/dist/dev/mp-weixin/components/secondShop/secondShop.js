"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../pages/houseRent/contant.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_ss_image2 = common_vendor.resolveComponent("ss-image");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_image2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_image = () => "../ss-image/ss-image.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_image + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "secondShop",
  props: {
    dataDic: {
      type: Object,
      default: () => {
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  emits: ["delete", "change", "edit", "err", "clear", "reject", "resolve"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const dataDic = common_vendor.toRef(props, "dataDic");
    function navToDetail() {
      if (props.edit) {
        common_vendor.index.navigateTo({
          url: "/pages/secondShop/add?productId=" + dataDic.value._id
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/secondShop/detail?productId=" + dataDic.value._id
        });
      }
    }
    function moreClick(e) {
      emit(e, dataDic);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          src: dataDic.value.cover,
          width: "345",
          height: "345"
        }),
        b: !dataDic.value.model
      }, !dataDic.value.model ? common_vendor.e({
        c: dataDic.value.replacement.open
      }, dataDic.value.replacement.open ? {} : {}, {
        d: dataDic.value.price == 0 && !dataDic.value.replacement.open
      }, dataDic.value.price == 0 && !dataDic.value.replacement.open ? {} : {}, {
        e: dataDic.value.price > 0 && !dataDic.value.replacement.open
      }, dataDic.value.price > 0 && !dataDic.value.replacement.open ? {} : {}, {
        f: common_vendor.t(dataDic.value.content),
        g: dataDic.value.price == 0
      }, dataDic.value.price == 0 ? {} : {
        h: common_vendor.t(dataDic.value.price)
      }, {
        i: common_vendor.t(dataDic.value.like_count)
      }) : {}, {
        j: dataDic.value.model == 1
      }, dataDic.value.model == 1 ? {
        k: common_vendor.t(dataDic.value.content),
        l: common_vendor.t(dataDic.value.like_count)
      } : {}, {
        m: dataDic.value.author_user
      }, dataDic.value.author_user ? {
        n: common_vendor.p({
          src: dataDic.value.author_user.avatar,
          width: "40",
          height: "40",
          size: "30"
        }),
        o: common_vendor.t(dataDic.value.author_user.nickname)
      } : {}, {
        p: common_vendor.o(navToDetail),
        q: __props.admin
      }, __props.admin ? common_vendor.e({
        r: common_vendor.o(($event) => moreClick("delete")),
        s: dataDic.value.state == 0
      }, dataDic.value.state == 0 ? {
        t: common_vendor.o(($event) => moreClick("reject"))
      } : {
        v: common_vendor.o(($event) => moreClick("resolve"))
      }) : {}, {
        w: common_vendor.sr("ssAlert", "20db34f4-2")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/secondShop/secondShop.vue"]]);
wx.createComponent(Component);
