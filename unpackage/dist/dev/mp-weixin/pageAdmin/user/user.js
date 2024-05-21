"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_system = require("../../store/modules/system.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  _easycom_ss_topTabar2();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
if (!Math) {
  _easycom_ss_topTabar();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const adminApi = common_vendor.Ws.importObject("admin");
    const tabarList = [{ text: "用户", value: "user" }, { text: "物业", value: "wuye" }, { text: "管理员", value: "communityAdmin" }];
    const topIndex = common_vendor.ref(0);
    const userStore = store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    common_vendor.computed(() => userStore.userInfo);
    const curState = common_vendor.computed((e) => tabarList[topIndex.value]["value"]);
    const dataArr = common_vendor.ref([]);
    common_vendor.onLoad((e) => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 200);
    });
    function roleSetVoid(e) {
      systemStore.pageDic = e;
      common_vendor.index.navigateTo({
        url: "/pageAdmin/user/setUser"
      });
    }
    function searchVoid() {
      common_vendor.index.startPullDownRefresh({});
    }
    const keyWord = common_vendor.ref("");
    common_vendor.onPullDownRefresh(() => {
      let dic = {};
      if (topIndex.value == 0) {
        dic = { pageIndex: 0, role: curState.value, keyWord: keyWord.value };
      } else {
        dic = { pageIndex: 0, role: curState.value, keyWord: keyWord.value };
      }
      adminApi.queryUser(dic).then((res) => {
        dataArr.value = res.data;
        common_vendor.index.stopPullDownRefresh();
      });
    });
    common_vendor.onReachBottom(() => {
      let dic = {};
      if (topIndex.value == 0) {
        dic = { pageIndex: dataArr.value.length, role: curState.value, keyWord: keyWord.value };
      } else {
        dic = { pageIndex: dataArr.value.length, role: curState.value, keyWord: keyWord.value };
      }
      adminApi.queryUser(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
      });
    });
    function changeTabIndex(e) {
      topIndex.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    return (_ctx, _cache) => {
      return {
        a: keyWord.value,
        b: common_vendor.o(($event) => keyWord.value = $event.detail.value),
        c: common_vendor.o(searchVoid),
        d: common_vendor.o(changeTabIndex),
        e: common_vendor.p({
          styleSet: "3",
          widthNum: "w-33",
          tabarArr: tabarList,
          topSelectIndex: topIndex.value
        }),
        f: common_vendor.f(dataArr.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.avatar,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(item.mobile),
            d: !item.role.includes("communityAdmin")
          }, !item.role.includes("communityAdmin") ? {
            e: common_vendor.o(($event) => roleSetVoid(item), item._id)
          } : {}, {
            f: item._id
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/user/user.vue"]]);
wx.createPage(MiniProgramPage);
