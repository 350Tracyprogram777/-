"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
const store_modules_user = require("../../../store/modules/user.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_secondShop2 = common_vendor.resolveComponent("secondShop");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_topTabar2 + _easycom_secondShop2 + _easycom_bottomMore2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_topTabar = () => "../../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_secondShop = () => "../../../components/secondShop/secondShop.js";
const _easycom_bottomMore = () => "../../../components/bottomMore/bottomMore.js";
const _easycom_ss_twoAlert = () => "../../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_secondShop + _easycom_bottomMore + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const secondApi = common_vendor.Ws.importObject("second-shop");
    const tabarList = [{ text: "出售/求购中", value: 0 }, { text: "暂停出售/求购", value: 1 }, { text: "已卖出/求购", value: 2 }];
    const topIndex = common_vendor.ref(0);
    const userStore = store_modules_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const dataArr = common_vendor.ref([]);
    const loadStatus = common_vendor.ref("more");
    common_vendor.onLoad((e) => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 200);
    });
    const curState = common_vendor.computed((e) => tabarList[topIndex.value]["value"]);
    common_vendor.onPullDownRefresh(() => {
      let dic = {};
      if (topIndex.value == 0) {
        dic = { pageIndex: 0, where: { state: curState.value, user_id: userInfo.value._id } };
      } else {
        dic = { pageIndex: 0, where: { state: curState.value, user_id: userInfo.value._id } };
      }
      secondApi.querySelf(dic).then((res) => {
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
      let dic = {};
      if (topIndex.value == 0) {
        dic = { pageIndex: dataArr.value.length, where: { state: curState.value, user_id: userInfo.value._id } };
      } else {
        dic = { pageIndex: dataArr.value.length, where: { state: curState.value, user_id: userInfo.value._id } };
      }
      secondApi.querySelf(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    function changeTabIndex(e) {
      topIndex.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    const navToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/secondShop/add"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(changeTabIndex),
        b: common_vendor.p({
          styleSet: "3",
          widthNum: "w-33",
          tabarArr: tabarList,
          topSelectIndex: topIndex.value
        }),
        c: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(_ctx.newsShare, index),
            b: common_vendor.o(_ctx.newsZan, index),
            c: common_vendor.o(_ctx.newsCollect, index),
            d: index,
            e: "954dfe2a-1-" + i0,
            f: common_vendor.p({
              edit: true,
              dataDic: item
            })
          };
        }),
        d: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadStatus.value
        }),
        e: common_vendor.o(($event) => navToAdd()),
        f: common_vendor.sr("ssAlert", "954dfe2a-3")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/secondShop/mySelf/list.vue"]]);
wx.createPage(MiniProgramPage);
