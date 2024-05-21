"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  (_easycom_ss_topTabar2 + _easycom_uni_dateformat2)();
}
const _easycom_ss_topTabar = () => "../../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_uni_dateformat)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const community_cloud = common_vendor.Ws.importObject("community");
    common_vendor.onLoad(() => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      });
    });
    const topTabarArr = [{ text: "已认领", value: 1 }, { text: "审核中", value: 0 }, { text: "审核失败", value: 2 }];
    const topInx = common_vendor.ref(0);
    function topBarIndex(e) {
      topInx.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    const dataArr = common_vendor.ref([]);
    common_vendor.onPullDownRefresh(() => {
      const dic = {
        state: topTabarArr[topInx.value]["id"]
      };
      community_cloud.query({ pageIndex: 0, where: dic }).then((res) => {
        console.log("----", res);
        dataArr.value = res.data;
        common_vendor.index.stopPullDownRefresh();
      });
    });
    common_vendor.onReachBottom(() => {
      const dic = {
        state: topTabarArr[topInx.value]["id"]
      };
      community_cloud.query({ pageIndex: dataArr.value, where: dic }).then((res) => {
        console.log("----", res);
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
      });
    });
    function navToAdd() {
      common_vendor.index.navigateTo({
        url: "/pages/manager/community/desc"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(topBarIndex),
        b: common_vendor.p({
          styleSet: "3",
          widthNum: "w-33",
          tabarArr: topTabarArr,
          topSelectIndex: topInx.value
        }),
        c: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.address_name),
            b: common_vendor.t(item.address),
            c: "bdfbf13e-1-" + i0,
            d: index
          };
        }),
        d: common_vendor.p({
          date: /* @__PURE__ */ new Date(),
          format: "yyyy.mm.dd"
        }),
        e: common_vendor.o(navToAdd)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/manager/community/list.vue"]]);
wx.createPage(MiniProgramPage);
