"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
const pages_newsArticle_news = require("../newsArticle/news.js");
const pages_collect_doc = require("./doc.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_addressBook2 = common_vendor.resolveComponent("addressBook");
  const _easycom_houseRent2 = common_vendor.resolveComponent("houseRent");
  const _easycom_newsOne2 = common_vendor.resolveComponent("newsOne");
  const _easycom_docFile2 = common_vendor.resolveComponent("docFile");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_topTabar2 + _easycom_addressBook2 + _easycom_houseRent2 + _easycom_newsOne2 + _easycom_docFile2 + _easycom_bottomMore2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_addressBook = () => "../../components/addressBook/addressBook.js";
const _easycom_houseRent = () => "../../components/houseRent/houseRent.js";
const _easycom_newsOne = () => "../../components/newsOne/newsOne.js";
const _easycom_docFile = () => "../../components/docFile/docFile.js";
const _easycom_bottomMore = () => "../../components/bottomMore/bottomMore.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_addressBook + _easycom_houseRent + _easycom_newsOne + _easycom_docFile + _easycom_bottomMore + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const addressBookApi = common_vendor.Ws.importObject("address-book", { customUI: true });
    const houseRentApi = common_vendor.Ws.importObject("house-rent", { customUI: true });
    const newsApi = common_vendor.Ws.importObject("news-article", { customUI: true });
    const docApi = common_vendor.Ws.importObject("user-doc", { customUI: true });
    const tabarList = [
      { text: "通讯录", value: 0, id: "txl", api: addressBookApi },
      { text: "房屋出租", value: 1, id: "fwcz", api: houseRentApi },
      { text: "帖子", value: 2, id: "news", api: newsApi },
      { text: "资料库", value: 4, id: "doc", api: docApi }
    ];
    const topIndex = common_vendor.ref(0);
    const topItem = common_vendor.computed(() => tabarList[topIndex.value]);
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    const bigDic = common_vendor.ref({});
    const dataArr = common_vendor.computed(() => bigDic.value[topItem.value.id] ? bigDic.value[topItem.value.id] : []);
    const loadMore = common_vendor.ref("more");
    const shareDic = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 200);
    });
    function changeTabIndex(e) {
      topIndex.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    common_vendor.onPullDownRefresh(() => {
      let dic = { pageIndex: 0 };
      topItem.value.api.queyfavorite(dic).then((res) => {
        console.log(res.data);
        bigDic.value[topItem.value["id"]] = res.data;
        common_vendor.index.stopPullDownRefresh();
        if (dataArr.value.length % 10 == 0) {
          loadMore.value = "more";
        } else {
          loadMore.value = "noMore";
        }
      });
    });
    common_vendor.onReachBottom(() => {
      let dic = { pageIndex: dataArr.value.length };
      loadMore.value = "loading";
      topItem.value.api.queyfavorite(dic).then((res) => {
        bigDic.value[topItem.value["id"]] = bigDic.value[topItem.value["id"]].concat(res.data);
        if (dataArr.value.length % 10 == 0 && res.data.length > 0) {
          loadMore.value = "more";
        } else {
          loadMore.value = "noMore";
        }
      });
    });
    const ssAlert = common_vendor.ref("");
    function cancleAddress(_id) {
      ssAlert.value.showModalDic({
        show: true,
        title: "内容已被删除",
        confirmText: "取消收藏",
        showCancel: true,
        content: "",
        success: (e) => {
          if (e.confirm) {
            addressBookApi.favorite(e).then((res) => {
              common_vendor.index.startPullDownRefresh({});
            });
          }
        }
      });
    }
    function cancleHouse(_id) {
      ssAlert.value.showModalDic({
        show: true,
        title: "内容已被删除",
        confirmText: "取消收藏",
        showCancel: true,
        content: "",
        success: (e) => {
          if (e.confirm) {
            houseRentApi.favorite(e).then((res) => {
              common_vendor.index.startPullDownRefresh({});
            });
          }
        }
      });
    }
    function newsShare(e) {
      console.log(e);
      shareDic.value = e.value;
    }
    common_vendor.onShareAppMessage((res) => {
      console.log(res);
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
        };
      }
    });
    common_vendor.onShareTimeline((res) => {
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
        };
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(changeTabIndex),
        b: common_vendor.p({
          styleSet: "3",
          widthNum: "w-33",
          tabarArr: tabarList,
          topSelectIndex: topIndex.value
        }),
        c: topIndex.value == 0
      }, topIndex.value == 0 ? {
        d: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(cancleAddress, index),
            b: index,
            c: "91ade544-1-" + i0,
            d: common_vendor.p({
              dataDic: item
            })
          };
        })
      } : {}, {
        e: topIndex.value == 1
      }, topIndex.value == 1 ? {
        f: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(cancleHouse, index),
            b: index,
            c: "91ade544-2-" + i0,
            d: common_vendor.p({
              dataDic: item
            })
          };
        })
      } : {}, {
        g: topIndex.value == 2
      }, topIndex.value == 2 ? {
        h: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(newsShare, index),
            b: common_vendor.o(common_vendor.unref(pages_newsArticle_news.newsZan), index),
            c: common_vendor.o(common_vendor.unref(pages_newsArticle_news.newsCollect), index),
            d: index,
            e: "91ade544-3-" + i0,
            f: common_vendor.p({
              dataDic: item
            })
          };
        })
      } : {}, {
        i: topIndex.value == 3
      }, topIndex.value == 3 ? {
        j: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(_ctx.docShare, index),
            b: common_vendor.o(common_vendor.unref(pages_collect_doc.docZan), index),
            c: common_vendor.o(common_vendor.unref(pages_collect_doc.docCollect), index),
            d: index,
            e: "91ade544-4-" + i0,
            f: common_vendor.p({
              dataDic: item
            })
          };
        })
      } : {}, {
        k: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadMore.value
        }),
        l: common_vendor.sr(ssAlert, "91ade544-6", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/collect/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
