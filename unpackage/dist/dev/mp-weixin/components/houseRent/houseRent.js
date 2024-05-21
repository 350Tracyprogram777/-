"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_houseRent_contant = require("../../pages/houseRent/contant.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "houseRent",
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
    const props = __props;
    const emit = __emit;
    const dataDic = common_vendor.toRef(props, "dataDic");
    function switchImageSize(size = 300) {
      if (dataDic.cover) {
        return dataDic.cover + `?x-oss-process=image/resize,h_${size},m_lfit`;
      } else {
        if (dataDic.value.images.length > 0) {
          return dataDic.value.images[0]["url"] + `?x-oss-process=image/resize,h_${size},m_lfit`;
        }
        return "/static/logo.png";
      }
    }
    function navToDetail() {
      if (dataDic.value.is_clear) {
        emit("clear", dataDic);
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/houseRent/detail?houseId=" + dataDic.value._id
      });
    }
    function moreClick(e) {
      emit(e, dataDic);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: switchImageSize(),
        b: dataDic.value.sall_rent_type == 1
      }, dataDic.value.sall_rent_type == 1 ? {} : {}, {
        c: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? common_vendor.e({
        d: dataDic.value.rent_type == 0
      }, dataDic.value.rent_type == 0 ? {} : {}, {
        e: dataDic.value.rent_type == 1
      }, dataDic.value.rent_type == 1 ? {} : {}) : {}, {
        f: common_vendor.t(dataDic.value.address_name),
        g: common_vendor.t(dataDic.value.area),
        h: common_vendor.t(dataDic.value.house_room + "室" + dataDic.value.house_play + "厅" + dataDic.value.house_toilet + "卫"),
        i: common_vendor.t(common_vendor.unref(pages_houseRent_contant.formOptions)["toward_localdata"][dataDic.value.toward]["text"]),
        j: common_vendor.t(common_vendor.unref(pages_houseRent_contant.formOptions)["repair_mode_localdata"][dataDic.value.repair_mode]["text"]),
        k: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? {
        l: common_vendor.t(dataDic.value.price)
      } : {}, {
        m: dataDic.value.sall_rent_type == 1
      }, dataDic.value.sall_rent_type == 1 ? {
        n: common_vendor.t(dataDic.value.price)
      } : {}, {
        o: common_vendor.p({
          date: dataDic.value.create_date,
          format: "yyyy/MM/dd"
        }),
        p: common_vendor.o(navToDetail),
        q: __props.edit
      }, __props.edit ? common_vendor.e({
        r: common_vendor.o(($event) => moreClick("delete")),
        s: common_vendor.o(($event) => moreClick("change")),
        t: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {} : {}, {
        v: dataDic.value.state != 30
      }, dataDic.value.state != 30 ? {
        w: common_vendor.o(($event) => moreClick("edit"))
      } : {}, {
        x: common_vendor.o(($event) => moreClick("err")),
        y: common_vendor.p({
          type: "info",
          color: "red",
          size: "19"
        })
      }) : {}, {
        z: __props.admin
      }, __props.admin ? common_vendor.e({
        A: common_vendor.o(($event) => moreClick("delete")),
        B: dataDic.value.state != 30
      }, dataDic.value.state != 30 ? {
        C: common_vendor.o(($event) => moreClick("reject"))
      } : {}, {
        D: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        E: common_vendor.o(($event) => moreClick("resolve"))
      } : {}) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/houseRent/houseRent.vue"]]);
wx.createComponent(Component);
