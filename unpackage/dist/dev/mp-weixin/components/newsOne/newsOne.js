"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../pages/houseRent/contant.js");
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
  __name: "newsOne",
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
    const newsApir = common_vendor.Ws.importObject("news-article");
    const props = __props;
    const emit = __emit;
    const dataDic = common_vendor.toRef(props, "dataDic");
    const detail = common_vendor.toRef(props, "detail");
    function navToDetail() {
      if (dataDic.value.category_id == "weixinnews") {
        common_vendor.index.navigateTo({
          url: "/pages/newsArticle/webUrl?newsId=" + dataDic.value._id
        });
      } else {
        if (!detail.value) {
          common_vendor.index.navigateTo({
            url: "/pages/newsArticle/detail?newsId=" + dataDic.value._id
          });
        }
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
      newsApir.add(dic);
    }
    function navToAddressBook() {
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/detail?bookId=" + dataDic.value.address_book_id
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.mode == 0
      }, dataDic.value.mode == 0 ? {
        b: dataDic.value.cover,
        c: common_vendor.t(dataDic.value.title),
        d: common_vendor.t(dataDic.value.author || "龙兴嘉苑"),
        e: common_vendor.p({
          date: dataDic.value.create_date,
          format: "yyyy/MM/dd"
        }),
        f: common_vendor.o(navToDetail)
      } : {}, {
        g: dataDic.value.mode == 1
      }, dataDic.value.mode == 1 ? common_vendor.e({
        h: dataDic.value.author_user && !dataDic.value.hider
      }, dataDic.value.author_user && !dataDic.value.hider ? common_vendor.e({
        i: dataDic.value.author_user.avatar,
        j: common_vendor.t(dataDic.value.author_user.nickname),
        k: common_vendor.p({
          date: dataDic.value.create_date,
          threshold: [0, 24 * 3600 * 1e3 * 3],
          format: "yyyy/MM/dd"
        }),
        l: dataDic.value.address_book_id
      }, dataDic.value.address_book_id ? {
        m: common_vendor.o(($event) => navToAddressBook())
      } : {}) : {}, {
        n: common_vendor.t(dataDic.value.content),
        o: common_vendor.n(detail.value ? "text-autoline" : "text-maxline-three"),
        p: dataDic.value.hider
      }, dataDic.value.hider ? {
        q: common_vendor.p({
          date: dataDic.value.create_date,
          threshold: [0, 24 * 3600 * 1e3 * 3],
          format: "yyyy/MM/dd"
        })
      } : {}, {
        r: common_vendor.o(($event) => navToDetail()),
        s: common_vendor.p({
          mediaArr: dataDic.value.images
        }),
        t: !__props.edit && !__props.admin
      }, !__props.edit && !__props.admin ? common_vendor.e({
        v: common_vendor.o(($event) => reportVoid()),
        w: common_vendor.o(($event) => moreClick("share")),
        x: dataDic.value.zan.length == 0
      }, dataDic.value.zan.length == 0 ? {} : {}, {
        y: common_vendor.t(dataDic.value.like_count),
        z: common_vendor.o(($event) => moreClick("zan")),
        A: dataDic.value.collect.length == 0
      }, dataDic.value.collect.length == 0 ? {} : {}, {
        B: common_vendor.o(($event) => moreClick("collect"))
      }) : {}) : {}, {
        C: __props.edit
      }, __props.edit ? common_vendor.e({
        D: common_vendor.p({
          type: "trash",
          color: "#555",
          size: "18"
        }),
        E: common_vendor.o(($event) => moreClick("delete")),
        F: common_vendor.p({
          type: "compose",
          color: "#555",
          size: "18"
        }),
        G: common_vendor.o(($event) => moreClick("edit")),
        H: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        I: common_vendor.o(($event) => moreClick("err")),
        J: common_vendor.p({
          type: "info",
          color: "red",
          size: "19"
        })
      } : {}, {
        K: common_vendor.p({
          type: "redo",
          color: "#555",
          size: "18"
        }),
        L: common_vendor.o(($event) => moreClick("share"))
      }) : {}, {
        M: __props.admin
      }, __props.admin ? common_vendor.e({
        N: common_vendor.o(($event) => moreClick("delete")),
        O: dataDic.value.state == 0
      }, dataDic.value.state == 0 ? {
        P: common_vendor.o(($event) => moreClick("reject"))
      } : {
        Q: common_vendor.o(($event) => moreClick("resolve"))
      }) : {}, {
        R: common_vendor.o(hidePop),
        S: common_vendor.p({
          type: "close",
          color: "#999",
          size: "20"
        }),
        T: reportDic.value.content,
        U: common_vendor.o(($event) => reportDic.value.content = $event.detail.value),
        V: common_vendor.o(($event) => commit()),
        W: common_vendor.sr(addPop, "e5fac6a4-8", {
          "k": "addPop"
        }),
        X: common_vendor.sr("ssAlert", "e5fac6a4-10")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/newsOne/newsOne.vue"]]);
wx.createComponent(Component);
