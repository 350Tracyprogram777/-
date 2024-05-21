"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
const pages_newsArticle_news = require("../newsArticle/news.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_newsOne2 = common_vendor.resolveComponent("newsOne");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_ss_topTabar2 + _easycom_newsOne2 + _easycom_bottomMore2 + _easycom_uni_fab2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_newsOne = () => "../../components/newsOne/newsOne.js";
const _easycom_bottomMore = () => "../../components/bottomMore/bottomMore.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_newsOne + _easycom_bottomMore + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "main",
  setup(__props) {
    const newsApi = common_vendor.Ws.importObject("news-article", {
      customUI: true
    });
    const bigDic = common_vendor.ref({});
    const bannerArr = common_vendor.ref([]);
    const classArr = common_vendor.ref([]);
    const topIndex = common_vendor.ref(0);
    const classId = common_vendor.computed((e) => classArr.value.length > 0 ? classArr.value[topIndex.value]["value"] : "");
    const dataArr = common_vendor.computed((e) => bigDic.value[classId.value] || []);
    const loadStatus = common_vendor.ref("more");
    const shareDic = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      common_vendor.index.$on("newsUpdate", function(e2) {
        const item = dataArr.value.find(function(a, b) {
          return a._id == e2._id;
        });
        Object.assign(item, e2);
      });
    });
    common_vendor.onShow((e) => {
      loadBaseData();
    });
    function loadBaseData() {
      newsApi.getBanner().then((res) => {
        bannerArr.value = res.data;
      });
      newsApi.getClass().then((res) => {
        let arr = [{
          text: "最新",
          value: "all"
        }];
        classArr.value = arr.concat(res.data);
        console.log("res", classArr.value);
        if (dataArr.value.length == 0) {
          common_vendor.index.startPullDownRefresh({});
        }
      });
    }
    function changeTabIndex(e) {
      topIndex.value = e.index;
      if (dataArr.value.length == 0) {
        loadData();
      }
    }
    common_vendor.onPullDownRefresh(() => {
      loadData();
    });
    function loadData() {
      const dic = {
        pageIndex: 0,
        where: {
          category_id: classId.value
        }
      };
      newsApi.query(dic).then((res) => {
        bigDic.value[classId.value] = res.data;
        common_vendor.index.stopPullDownRefresh({});
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    }
    common_vendor.onReachBottom(() => {
      const dic = {
        pageIndex: dataArr.value.length,
        where: {
          category_id: classId.value
        }
      };
      loadStatus.value = "loading";
      newsApi.query(dic).then((res) => {
        bigDic.value[classId.value] = bigDic.value[classId.value].concat(res.data);
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    const prewImg = (e) => {
      let arr = [];
      for (let item of bannerArr.value) {
        arr.push(item.url);
      }
      common_vendor.index.previewImage({
        current: e.url,
        urls: arr
      });
    };
    const navToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/newsArticle/add"
      });
    };
    function navToUrl(e) {
      common_vendor.index.navigateTo({
        url: e
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
          title: shareDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
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
        a: common_vendor.f(bannerArr.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => prewImg(item.url), index),
            c: index
          };
        }),
        b: common_vendor.o(($event) => navToUrl("/pageDoc/class")),
        c: common_vendor.o(($event) => navToUrl("/pages/addressBook/list")),
        d: common_vendor.o(changeTabIndex),
        e: common_vendor.p({
          styleSet: "3",
          widthNum: "w-25",
          tabarArr: classArr.value,
          topSelectIndex: topIndex.value
        }),
        f: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(newsShare, index),
            b: common_vendor.o(common_vendor.unref(pages_newsArticle_news.newsZan), index),
            c: common_vendor.o(common_vendor.unref(pages_newsArticle_news.newsCollect), index),
            d: index,
            e: "37ce67dd-1-" + i0,
            f: common_vendor.p({
              dataDic: item
            })
          };
        }),
        g: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadStatus.value
        }),
        h: common_vendor.o(navToAdd),
        i: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/tabar/main.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
