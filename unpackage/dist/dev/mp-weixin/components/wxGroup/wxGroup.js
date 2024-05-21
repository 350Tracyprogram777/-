"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../pages/houseRent/contant.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_system = require("../../store/modules/system.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "wxGroup",
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
    }
  },
  emits: ["delete", "select", "update:selectItem", "reject", "resolve"],
  setup(__props, { emit: __emit }) {
    store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    const props = __props;
    const emit = __emit;
    const dataDic = common_vendor.toRef(props, "dataDic");
    const selectModel = common_vendor.toRef(props, "select");
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
      if (selectModel.value) {
        return;
      }
      systemStore.WxStartEnv = {
        scene: 0,
        path: ""
      };
      common_vendor.index.navigateTo({
        url: "/pageAdmin/wxGroup/add?groupId=" + dataDic.value._id
      });
    }
    function moreClick(e) {
      emit(e, dataDic.value);
    }
    function getFrist() {
      const a = dataDic.value.name.substr(0, 1);
      return a;
    }
    function selectVoid() {
      dataDic.value["select"] = !dataDic.value["select"];
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
        e: common_vendor.p({
          date: dataDic.value.create_date,
          format: "yyyy/MM/dd"
        }),
        f: common_vendor.t(dataDic.value.opengid),
        g: common_vendor.t(dataDic.value.remark),
        h: __props.select
      }, __props.select ? common_vendor.e({
        i: !dataDic.value["select"]
      }, !dataDic.value["select"] ? {
        j: common_vendor.o(($event) => selectVoid()),
        k: common_vendor.p({
          type: "circle",
          size: "25",
          color: "#999"
        })
      } : {
        l: common_vendor.o(($event) => selectVoid()),
        m: common_vendor.p({
          type: "checkbox-filled",
          size: "25",
          color: "#00755C"
        })
      }) : {}, {
        n: common_vendor.o(($event) => navToDetail()),
        o: __props.admin
      }, __props.admin ? {
        p: common_vendor.o(($event) => moreClick("delete"))
      } : {}, {
        q: common_vendor.sr("ssAlert", "50b91c78-3")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/wxGroup/wxGroup.vue"]]);
wx.createComponent(Component);
