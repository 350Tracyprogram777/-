"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_ss_sub_meida2 = common_vendor.resolveComponent("ss-sub-meida");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_dateformat2 + _easycom_ss_sub_meida2 + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_ss_sub_meida = () => "../ss-sub-meida/ss-sub-meida.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_ss_sub_meida + _easycom_uni_icons + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "docFile",
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
    },
    report: {
      type: Boolean,
      default: true
    },
    detail: {
      type: Boolean,
      default: false
    }
  },
  emits: ["share", "zan", "collect", "err", "report", "clear", "reject", "resolve"],
  setup(__props, { emit: __emit }) {
    const reportCenterApi = common_vendor.Ws.importObject("report-center");
    const props = __props;
    const emit = __emit;
    const dataDic = common_vendor.toRef(props, "dataDic");
    const detail = common_vendor.toRef(props, "detail");
    function navToDetail() {
      if (!detail.value) {
        common_vendor.index.navigateTo({
          url: "/pageDoc/detail?docId=" + dataDic.value._id + "&classId=" + dataDic.value.category_id + "&isEdit=1"
        });
      }
    }
    function moreClick(e) {
      emit(e, dataDic);
    }
    const addPop = common_vendor.ref();
    const reportDic = common_vendor.ref({ content: "" });
    function reportVoid() {
      addPop.value.open();
    }
    function hidePop() {
      addPop.value.close();
    }
    function commit() {
      if (!reportDic.value.content) {
        msg("请输入内容");
        return;
      }
      const dic = {
        uni_id: dataDic.value._id,
        content: reportDic.value.content,
        uni_data: dataDic.value,
        type: "文章",
        user_id: userInfo.value._id
      };
      reportCenterApi.add(dic);
    }
    function navToAddressBook() {
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/detail?bookId=" + dataDic.value.address_book_id
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.author_user && !dataDic.value.hider
      }, dataDic.value.author_user && !dataDic.value.hider ? common_vendor.e({
        b: dataDic.value.author_user.avatar,
        c: common_vendor.t(dataDic.value.author_user.nickname),
        d: common_vendor.p({
          date: dataDic.value.create_date,
          threshold: [0, 24 * 3600 * 1e3 * 3],
          format: "yyyy/MM/dd"
        }),
        e: dataDic.value.address_book_id
      }, dataDic.value.address_book_id ? {
        f: common_vendor.o(($event) => navToAddressBook())
      } : {}) : {}, {
        g: common_vendor.t(dataDic.value.content),
        h: common_vendor.n(detail.value ? "text-autoline" : "text-maxline-three"),
        i: common_vendor.o(navToDetail),
        j: common_vendor.p({
          maxShowNum: 3,
          fileShowAll: detail.value,
          showDocStyle: true,
          mediaArr: dataDic.value.images,
          password: dataDic.value.password,
          password_msg: dataDic.value.password_msg
        }),
        k: !__props.edit && !__props.admin && dataDic.value._id
      }, !__props.edit && !__props.admin && dataDic.value._id ? common_vendor.e({
        l: common_vendor.o(($event) => reportVoid()),
        m: common_vendor.o(($event) => moreClick("share")),
        n: dataDic.value.zan.length == 0
      }, dataDic.value.zan.length == 0 ? {} : {}, {
        o: common_vendor.t(dataDic.value.like_count),
        p: common_vendor.o(($event) => moreClick("zan")),
        q: dataDic.value.collect.length == 0
      }, dataDic.value.collect.length == 0 ? {} : {}, {
        r: common_vendor.o(($event) => moreClick("collect"))
      }) : {}, {
        s: __props.edit
      }, __props.edit ? common_vendor.e({
        t: common_vendor.p({
          type: "trash",
          color: "#555",
          size: "18"
        }),
        v: common_vendor.o(($event) => moreClick("delete")),
        w: common_vendor.p({
          type: "compose",
          color: "#555",
          size: "18"
        }),
        x: common_vendor.o(($event) => moreClick("edit")),
        y: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        z: common_vendor.o(($event) => moreClick("err")),
        A: common_vendor.p({
          type: "info",
          color: "red",
          size: "19"
        })
      } : {}, {
        B: common_vendor.p({
          type: "redo",
          color: "#555",
          size: "18"
        }),
        C: common_vendor.o(($event) => moreClick("share"))
      }) : {}, {
        D: __props.admin
      }, __props.admin ? common_vendor.e({
        E: common_vendor.o(($event) => moreClick("delete")),
        F: dataDic.value.state == 0
      }, dataDic.value.state == 0 ? {
        G: common_vendor.o(($event) => moreClick("reject"))
      } : {
        H: common_vendor.o(($event) => moreClick("resolve"))
      }) : {}, {
        I: common_vendor.o(hidePop),
        J: common_vendor.p({
          type: "close",
          color: "#999",
          size: "20"
        }),
        K: reportDic.value.content,
        L: common_vendor.o(($event) => reportDic.value.content = $event.detail.value),
        M: common_vendor.o(($event) => commit()),
        N: common_vendor.sr(addPop, "4ea899a0-6", {
          "k": "addPop"
        }),
        O: common_vendor.sr("ssAlert", "4ea899a0-8")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/docFile/docFile.vue"]]);
wx.createComponent(Component);
