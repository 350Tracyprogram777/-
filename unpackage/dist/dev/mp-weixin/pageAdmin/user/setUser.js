"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_system = require("../../store/modules/system.js");
const store_modules_contant = require("../../store/modules/contant.js");
if (!Array) {
  const _easycom_ss_superSelectView2 = common_vendor.resolveComponent("ss-superSelectView");
  _easycom_ss_superSelectView2();
}
const _easycom_ss_superSelectView = () => "../../uni_modules/ss-components/components/ss-superSelectView/ss-superSelectView.js";
if (!Math) {
  _easycom_ss_superSelectView();
}
const _sfc_main = {
  __name: "setUser",
  setup(__props) {
    const adminApi = common_vendor.Ws.importObject("admin");
    const systemStore = store_modules_system.useSystemStore();
    const contantStore = store_modules_contant.useContantStore();
    const userInfo = common_vendor.computed(() => systemStore.pageDic);
    common_vendor.onLoad((e) => {
      console.log("-------------", userInfo.value);
    });
    function commitVoid() {
      let dic = {
        _id: userInfo.value._id,
        stop_permissions: userInfo.value.stop_permissions,
        role: userInfo.value.role
      };
      adminApi.editUserStop(dic).then((res) => {
        common_ssSuperModules_superConfig.msg("设置成功");
        setTimeout(function() {
          common_vendor.index.startPullDownRefresh({});
        }, 200);
      });
    }
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar,
        b: common_vendor.t(userInfo.value.nickname),
        c: common_vendor.t(userInfo.value.mobile),
        d: common_vendor.o(($event) => userInfo.value.role = $event),
        e: common_vendor.p({
          maxNum: "10",
          localdata: common_vendor.unref(contantStore).userRole,
          selectArr: userInfo.value.role
        }),
        f: common_vendor.o(($event) => userInfo.value.stop_permissions = $event),
        g: common_vendor.p({
          maxNum: "10",
          localdata: common_vendor.unref(contantStore).stopCanArr,
          selectArr: userInfo.value.stop_permissions
        }),
        h: common_vendor.o(commitVoid)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/user/setUser.vue"]]);
wx.createPage(MiniProgramPage);
