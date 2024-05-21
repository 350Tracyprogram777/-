"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
const pages_newsArticle_news = require("./news.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_newsOne2 = common_vendor.resolveComponent("newsOne");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_newsOne2 + _easycom_ss_twoAlert2)();
}
const _easycom_newsOne = () => "../../components/newsOne/newsOne.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_newsOne + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const newsApi = common_vendor.Ws.importObject("news-article");
    common_vendor.Ws.importObject("report-center");
    common_vendor.computed(() => userStore.userInfo);
    const dataDic = common_vendor.ref({
      user_id: "",
      images: [],
      cover: "",
      sys_msg: "",
      content: "",
      category_id: "6322c30c4c9784000172402c",
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
      gps: "",
      state: 0,
      create_date: 0,
      mode: 1,
      zan: [],
      collect: []
    });
    const ssAlert = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      if (e.newsId) {
        dataDic.value["_id"] = e.newsId;
        getDetail();
      }
    });
    function getDetail() {
      newsApi.doc(dataDic.value._id).then((res) => {
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
    const shareDic = common_vendor.ref("");
    function newsShare(e) {
      console.log(e);
      shareDic.value = e.value;
    }
    common_vendor.onShareAppMessage((res) => {
      console.log(res);
      if (res.from === "button") {
        return {
          title: dataDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + dataDic.value._id,
          imageUrl: dataDic.value.cover
        };
      } else {
        return {
          title: "家在龙兴嘉苑2号院",
          path: "/pages/tabar/main",
          imageUrl: "/static/share/share-main2.jpg"
        };
      }
    });
    common_vendor.onShareTimeline((res) => {
      if (res.from === "button") {
        return {
          title: dataDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + dataDic.value._id,
          imageUrl: dataDic.value.cover
        };
      } else {
        return {
          title: "家在龙兴嘉苑2号院",
          path: "/pages/tabar/main",
          imageUrl: "/static/share/share-main2.jpg"
        };
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(_ctx.addClick),
        b: common_vendor.o(newsShare),
        c: common_vendor.o(common_vendor.unref(pages_newsArticle_news.newsZan)),
        d: common_vendor.o(common_vendor.unref(pages_newsArticle_news.newsCollect)),
        e: common_vendor.p({
          detail: true,
          dataDic: dataDic.value
        }),
        f: common_vendor.sr(ssAlert, "4ae57610-1", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/newsArticle/detail.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
