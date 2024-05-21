"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_addressBook2 = common_vendor.resolveComponent("addressBook");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_ss_topTabar2 + _easycom_addressBook2 + _easycom_uni_fab2 + _easycom_uni_load_more2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_addressBook = () => "../../components/addressBook/addressBook.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_addressBook + _easycom_uni_fab + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const addressBookApi = common_vendor.Ws.importObject("address-book", { customUI: true });
    common_vendor.onLoad(() => {
    });
    const bigDic = common_vendor.ref({});
    const classArr = common_vendor.ref([]);
    const topIndex = common_vendor.ref(0);
    const classId = common_vendor.computed((e) => classArr.value.length > 0 ? classArr.value[topIndex.value]["value"] : "");
    const dataArr = common_vendor.computed((e) => bigDic.value[classId.value] || []);
    const loadStatus = common_vendor.ref("more");
    const bannerArr = common_vendor.ref([]);
    common_vendor.onLoad(() => {
      getBaseData();
    });
    function getBaseData() {
      addressBookApi.getBanner().then((res) => {
        bannerArr.value = res.data;
      });
      addressBookApi.getClass().then((res) => {
        classArr.value = res.data;
        if (res.data.length > 0) {
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
        where: { category_id: classId.value, open: true }
      };
      addressBookApi.query(dic).then((res) => {
        console.log(res.data);
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
        where: { category_id: classId.value, open: true }
      };
      loadStatus.value = "loading";
      addressBookApi.query(dic).then((res) => {
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
        url: "/pages/addressBook/add"
      });
    };
    common_vendor.onShareAppMessage((res) => {
      return {
        title: "龙兴嘉苑社区通讯录",
        path: "/pages/addressBook/list",
        imageUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/4fda7a0d-6e87-4ae7-b89b-61f9e12e8c98.png"
      };
    });
    common_vendor.onShareTimeline((res) => {
      return {
        title: "龙兴嘉苑社区通讯录",
        path: "/pages/addressBook/list",
        imageUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e993806-2adc-4cdf-98d2-1e3ca1eba21e/4fda7a0d-6e87-4ae7-b89b-61f9e12e8c98.png"
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
        b: common_vendor.o(changeTabIndex),
        c: common_vendor.p({
          styleSet: "3",
          widthNum: "w-25",
          tabarArr: classArr.value,
          topSelectIndex: topIndex.value
        }),
        d: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: index,
            b: "9b089d2a-1-" + i0,
            c: common_vendor.p({
              dataDic: item
            })
          };
        }),
        e: common_vendor.o(navToAdd),
        f: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        }),
        g: dataArr.value.length > 0
      }, dataArr.value.length > 0 ? {
        h: common_vendor.p({
          status: loadStatus.value
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/addressBook/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
