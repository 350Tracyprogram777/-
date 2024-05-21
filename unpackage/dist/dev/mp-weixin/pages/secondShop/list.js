"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_secondShop2 = common_vendor.resolveComponent("secondShop");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_secondShop2 + _easycom_bottomMore2 + _easycom_uni_fab2)();
}
const _easycom_secondShop = () => "../../components/secondShop/secondShop.js";
const _easycom_bottomMore = () => "../../components/bottomMore/bottomMore.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_secondShop + _easycom_bottomMore + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const secondApi = common_vendor.Ws.importObject("second-shop");
    const bannerArr = common_vendor.ref([]);
    const dataArr = common_vendor.ref([]);
    const loadStatus = common_vendor.ref("more");
    const shareDic = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      loadBaseData();
      loadData();
    });
    common_vendor.onShow((e) => {
    });
    function loadBaseData() {
      secondApi.getBanner().then((res) => {
        bannerArr.value = res.data;
      });
    }
    common_vendor.onPullDownRefresh(() => {
      loadData();
    });
    function loadData() {
      const dic = {
        pageIndex: 0,
        where: {}
      };
      secondApi.query(dic).then((res) => {
        dataArr.value = res.data;
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
        where: {}
      };
      loadStatus.value = "loading";
      secondApi.query(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
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
        url: "/pages/secondShop/add"
      });
    };
    function newsShare(e) {
      console.log(e);
      shareDic.value = e.value;
    }
    common_vendor.onShareAppMessage((res) => {
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pages/secondShop/detail?productId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
        };
      } else {
        return {
          title: "家在龙兴嘉苑2号院-二手置换",
          path: "/pages/tabar/main",
          imageUrl: "/static/share/share-main2.jpg"
        };
      }
    });
    common_vendor.onShareTimeline((res) => {
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pages/secondShop/detail?productId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
        };
      } else {
        return {
          title: "家在龙兴嘉苑2号院-二手置换",
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
        b: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(newsShare, index),
            b: common_vendor.o(_ctx.newsZan, index),
            c: common_vendor.o(_ctx.newsCollect, index),
            d: index,
            e: "f1038350-0-" + i0,
            f: common_vendor.p({
              dataDic: item
            })
          };
        }),
        c: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadStatus.value
        }),
        d: common_vendor.o(navToAdd),
        e: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/secondShop/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
