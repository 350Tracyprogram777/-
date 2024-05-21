"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_ss_image2 = common_vendor.resolveComponent("ss-image");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_media_one2 = common_vendor.resolveComponent("media-one");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_image2 + _easycom_uni_dateformat2 + _easycom_media_one2 + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_image = () => "../../components/ss-image/ss-image.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_media_one = () => "../../components/media-one/media-one.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_image + _easycom_uni_dateformat + _easycom_media_one + _easycom_uni_icons + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const secondApi = common_vendor.Ws.importObject("second-shop");
    common_vendor.Ws.importObject("address-book");
    common_vendor.computed(() => userStore.userInfo);
    const dataDic = common_vendor.ref({
      user_id: "",
      images: [],
      tags: [],
      cover: "",
      sys_msg: "",
      price: "",
      content: "",
      category_id: "",
      author: "",
      //作者
      view_count: 0,
      //阅读数量
      like_count: 0,
      //点赞量
      is_sticky: false,
      //是否置顶
      address: "",
      address_name: "",
      gps: { latitude: 0, longitude: 0 },
      state: 0,
      create_date: 0,
      mode: 2,
      replacement: {
        open: false,
        content: ""
      },
      trade_type: 0
      //0包邮 自提
    });
    const ssAlert = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      if (e.productId) {
        dataDic.value["_id"] = e.productId;
        getDetail();
      }
    });
    function getDetail() {
      secondApi.doc(dataDic.value._id).then((res) => {
        console.log("获取商品详情", res);
        if (res.errCode == 0) {
          Object.assign(dataDic.value, res.data);
        } else {
          ssAlert.value.showModalDic({
            show: true,
            title: "未找到,可能已被删除",
            confirmText: "确定",
            showCancel: false,
            cancelText: "",
            content: "",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateBack();
              }
            }
          });
        }
      });
    }
    common_vendor.onShareAppMessage((e) => {
      let title = "";
      if (dataDic.value.model == 0) {
        if (dataDic.value.price > 0) {
          title = "¥" + dataDic.value.price + "出售" + dataDic.value.content;
        } else {
          title = "免费赠送:" + dataDic.value.content;
        }
      } else {
        if (dataDic.value.price > 0) {
          title = "¥" + dataDic.value.price + "求购" + dataDic.value.content;
        } else {
          title = "求购:" + dataDic.value.content;
        }
      }
      return {
        title,
        path: "/pages/secondShop/detail?productId=" + dataDic.value._id,
        imageUrl: dataDic.value.cover
      };
    });
    common_vendor.onShareTimeline((e) => {
      let title = "";
      if (dataDic.value.model == 0) {
        if (dataDic.value.price > 0) {
          title = "¥" + dataDic.value.price + " 出售" + dataDic.value.content;
        } else {
          title = "免费赠送:" + dataDic.value.content;
        }
      } else {
        if (dataDic.value.price > 0) {
          title = "¥" + dataDic.value.price + "求购" + dataDic.value.content;
        } else {
          title = "求购:" + dataDic.value.content;
        }
      }
      return {
        title,
        path: "/pages/secondShop/detail?productId=" + dataDic.value._id,
        imageUrl: dataDic.value.cover
      };
    });
    function commitReport() {
      if (!reportDic.value.content) {
        common_ssSuperModules_superConfig.msg("请输入内容");
        return;
      }
      const dic = {
        uni_id: dataDic.value._id,
        content: reportDic.value.content,
        uni_data: dataDic.value
      };
      secondApi.report(dic).then((res) => {
        reportDic.value.content = "";
        common_ssSuperModules_superConfig.msg(res.data);
        hidePop();
      });
    }
    function secondZan() {
      secondApi.zan(dataDic.value._id).then((res) => {
        if (res.data.length == 0) {
          dataDic.value.zan = [];
          dataDic.value.like_count--;
        } else {
          dataDic.value.zan = res.data;
          dataDic.value.like_count++;
        }
      });
    }
    const addPop = common_vendor.ref();
    const reportDic = common_vendor.ref({ content: "" });
    function reportClick() {
      addPop.value.open();
    }
    function hidePop() {
      addPop.value.close();
    }
    function navToAddressBook() {
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/detail?bookId=" + dataDic.value.address_book_id
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.author_user
      }, dataDic.value.author_user ? {
        b: common_vendor.p({
          src: dataDic.value.author_user.avatar,
          width: "80",
          height: "80",
          size: "60"
        }),
        c: common_vendor.t(dataDic.value.author_user.nickname),
        d: common_vendor.p({
          date: dataDic.value.create_date,
          format: "yyyy/MM/dd"
        })
      } : {}, {
        e: !dataDic.value.model
      }, !dataDic.value.model ? common_vendor.e({
        f: dataDic.value.price == 0
      }, dataDic.value.price == 0 ? {} : {
        g: common_vendor.t(dataDic.value.price)
      }, {
        h: common_vendor.t(dataDic.value.like_count),
        i: dataDic.value.replacement.open
      }, dataDic.value.replacement.open ? {} : common_vendor.e({
        j: dataDic.value.price == 0
      }, dataDic.value.price == 0 ? {} : {}, {
        k: dataDic.value.price > 0
      }, dataDic.value.price > 0 ? {} : {})) : {
        l: common_vendor.t(dataDic.value.like_count)
      }, {
        m: common_vendor.t(dataDic.value.content),
        n: !dataDic.value.mode
      }, !dataDic.value.mode ? common_vendor.e({
        o: dataDic.value.replacement.content
      }, dataDic.value.replacement.content ? {
        p: common_vendor.t(dataDic.value.replacement.content)
      } : {}) : {}, {
        q: common_vendor.p({
          mediaArr: dataDic.value.images
        }),
        r: common_vendor.o(($event) => reportClick()),
        s: dataDic.value.zan.length == 0
      }, dataDic.value.zan.length == 0 ? {
        t: common_vendor.p({
          type: "heart",
          size: "21",
          color: "#666"
        })
      } : {
        v: common_vendor.p({
          type: "heart-filled",
          size: "21",
          color: "#00755C"
        })
      }, {
        w: common_vendor.o(($event) => secondZan()),
        x: common_vendor.o(($event) => navToAddressBook()),
        y: common_vendor.o(hidePop),
        z: common_vendor.p({
          type: "close",
          color: "#999"
        }),
        A: reportDic.value.content,
        B: common_vendor.o(($event) => reportDic.value.content = $event.detail.value),
        C: common_vendor.o(($event) => commitReport()),
        D: common_vendor.sr(addPop, "e752d7ea-5", {
          "k": "addPop"
        }),
        E: common_vendor.sr(ssAlert, "e752d7ea-7", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/secondShop/detail.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
