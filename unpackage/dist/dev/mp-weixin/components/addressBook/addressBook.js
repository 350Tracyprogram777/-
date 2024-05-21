"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../pages/houseRent/contant.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_icons2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "addressBook",
  props: {
    dataDic: {
      type: Object,
      default: () => {
      }
    },
    edit: {
      //是不是自己可以编辑
      type: Boolean,
      default: false
    },
    admin: {
      //是不是管理员
      type: Boolean,
      default: false
    },
    select: {
      type: Boolean,
      default: false
    },
    selectItem: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ["delete", "err", "edit", "clear", "select", "update:selectItem", "reject", "resolve"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dataDic = common_vendor.toRef(props, "dataDic");
    const selectItem = common_vendor.toRef(props, "selectItem");
    function switchImageSize(size = 100) {
      if (dataDic.value.cover) {
        return dataDic.value.cover + `?x-oss-process=image/resize,h_${size},m_lfit`;
      } else {
        if (dataDic.value.images.length > 0) {
          console.log("---", dataDic.value.images[0]["url"]);
          return dataDic.value.images[0]["url"] + `?x-oss-process=image/resize,h_${size},m_lfit`;
        }
        return "/static/logo.png";
      }
    }
    function navToDetail() {
      if (dataDic.value.is_clear) {
        emit("clear", dataDic.value);
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/detail?bookId=" + dataDic.value._id
      });
    }
    const ssAlert = common_vendor.ref();
    function makePhone() {
      ssAlert.value.showModalDic({
        show: true,
        title: "温馨提示",
        confirmText: "确定",
        showCancel: true,
        cancelText: "取消",
        content: "本程序只提供信息互通,如涉及商业行为,请自行斟酌",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.makePhoneCall({
              phoneNumber: dataDic.value.phone
            });
          }
        }
      });
    }
    function moreClick(e) {
      emit(e, dataDic.value);
    }
    function getFrist() {
      const a = dataDic.value.name.substr(0, 1);
      return a;
    }
    function selectItemVoid() {
      if (dataDic.value._id != selectItem.value._id) {
        emit("update:selectItem", dataDic.value);
      } else {
        emit("update:selectItem", { _id: 0 });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.cover || dataDic.value.images.length > 0
      }, dataDic.value.cover || dataDic.value.images.length > 0 ? {
        b: switchImageSize()
      } : {
        c: common_vendor.t(getFrist())
      }, {
        d: common_vendor.t(dataDic.value.name),
        e: !__props.select
      }, !__props.select ? {
        f: common_vendor.o(($event) => makePhone())
      } : common_vendor.e({
        g: selectItem.value._id != dataDic.value._id
      }, selectItem.value._id != dataDic.value._id ? {
        h: common_vendor.p({
          type: "circle",
          size: "22"
        })
      } : {
        i: common_vendor.p({
          type: "checkbox-filled",
          size: "22",
          color: "#00755C"
        })
      }, {
        j: common_vendor.o(selectItemVoid)
      }), {
        k: common_vendor.t(dataDic.value.reamrk),
        l: common_vendor.t(dataDic.value.phone),
        m: common_vendor.o(($event) => navToDetail()),
        n: __props.edit
      }, __props.edit ? common_vendor.e({
        o: common_vendor.o(($event) => moreClick("delete")),
        p: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {} : {}, {
        q: dataDic.value.state != 30
      }, dataDic.value.state != 30 ? {
        r: common_vendor.o(($event) => moreClick("edit"))
      } : {}, {
        s: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        t: common_vendor.o(($event) => moreClick("err")),
        v: common_vendor.p({
          type: "info",
          color: "red",
          size: "19"
        })
      } : {}) : {}, {
        w: __props.admin
      }, __props.admin ? common_vendor.e({
        x: common_vendor.o(($event) => moreClick("delete")),
        y: dataDic.value.state != 30
      }, dataDic.value.state != 30 ? {
        z: common_vendor.o(($event) => moreClick("reject"))
      } : {}, {
        A: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        B: common_vendor.o(($event) => moreClick("resolve"))
      } : {}) : {}, {
        C: common_vendor.sr(ssAlert, "40352782-3", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/addressBook/addressBook.vue"]]);
wx.createComponent(Component);
