"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const pages_houseRent_contant = require("./contant.js");
if (!Array) {
  const _easycom_houseRent2 = common_vendor.resolveComponent("houseRent");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_houseRent2 + _easycom_uni_load_more2 + _easycom_uni_fab2)();
}
const _easycom_houseRent = () => "../../components/houseRent/houseRent.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_houseRent + _easycom_uni_load_more + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const houseRentApi = common_vendor.Ws.importObject("house-rent", { customUI: true });
    common_vendor.onLoad(() => {
    });
    const dataArr = common_vendor.ref([]);
    common_vendor.ref(pages_houseRent_contant.filterData);
    const loadStatus = common_vendor.ref("more");
    let where = {};
    const bannerArr = common_vendor.ref([]);
    common_vendor.onLoad(() => {
      houseRentApi.getBanner().then((res) => {
        bannerArr.value = res.data;
      });
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 300);
    });
    common_vendor.onPullDownRefresh(() => {
      houseRentApi.query({ pageIndex: 0, where }).then((res) => {
        dataArr.value = res.data;
        common_vendor.index.stopPullDownRefresh();
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    common_vendor.onReachBottom(() => {
      loadStatus.value = "loading";
      houseRentApi.query({ pageIndex: dataArr.value.length, where }).then((res) => {
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
        url: "/pages/houseRent/add"
      });
    };
    common_vendor.onShareAppMessage((res) => {
      return {
        title: "龙兴嘉苑品质房源租售平台",
        path: "/pages/houseRent/list",
        imageUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/56f03e4b-cf24-43eb-a2ee-d05d8dde94c2.png"
      };
    });
    common_vendor.onShareTimeline((res) => {
      return {
        title: "龙兴嘉苑品质房源租售平台",
        path: "/pages/houseRent/list",
        imageUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/56f03e4b-cf24-43eb-a2ee-d05d8dde94c2.png"
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(bannerArr.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => prewImg(item.url), index),
            c: index
          };
        }),
        b: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: index,
            b: "eefdf7a2-0-" + i0,
            c: common_vendor.p({
              dataDic: item
            })
          };
        }),
        c: dataArr.value.length > 0
      }, dataArr.value.length > 0 ? {
        d: common_vendor.p({
          status: loadStatus.value
        })
      } : {}, {
        e: common_vendor.o(navToAdd),
        f: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/houseRent/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
