"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_icons2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ss_twoAlert = () => "../../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const community_cloud = common_vendor.Ws.importObject("community");
    const serverDic = common_vendor.ref({
      remark: "",
      address_name: "",
      address: "",
      phone: "",
      contacts: "",
      members: [],
      state: 0,
      sys_msg: "",
      cover: "",
      images: [],
      gps: {
        latitude: "",
        longitude: ""
      }
    });
    const ssAlert = common_vendor.ref();
    function commitVoid() {
      console.log(serverDic.value);
      if (!serverDic.value.contacts) {
        return common_ssSuperModules_superConfig.msg("请输入姓名");
      }
      if (serverDic.value.phone.length != 11) {
        return common_ssSuperModules_superConfig.msg("请输入手机号");
      }
      if (!serverDic.value.remark) {
        return common_ssSuperModules_superConfig.msg("请输入认领的理由");
      }
      if (!serverDic.value.address_name) {
        return common_ssSuperModules_superConfig.msg("请选择要认领的小区");
      }
      community_cloud.add(serverDic.value).then((res) => {
        ssAlert.value.showModalDic({
          show: true,
          title: "提交成功",
          confirmText: "确定",
          showCancel: false,
          content: "请耐心等待系统审核",
          success: (e) => {
            if (e.confirm) {
              common_vendor.index.navigateBack();
            }
          }
        });
      });
    }
    function chooseMap() {
      console.log(333);
      common_vendor.index.chooseLocation({
        success: function(e) {
          console.log(e);
          serverDic.value.address = e.address;
          serverDic.value.address_name = e.name;
          serverDic.value.gps["latitude"] = e.latitude;
          serverDic.value.gps["longitude"] = e.longitude;
        },
        fail: function(err) {
          console.log(err);
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: serverDic.value.contacts,
        b: common_vendor.o(($event) => serverDic.value.contacts = $event.detail.value),
        c: serverDic.value.phone,
        d: common_vendor.o(($event) => serverDic.value.phone = $event.detail.value),
        e: serverDic.value.remark,
        f: common_vendor.o(($event) => serverDic.value.remark = $event.detail.value),
        g: common_vendor.t(serverDic.value.address_name),
        h: common_vendor.t(serverDic.value.address),
        i: common_vendor.o(chooseMap),
        j: common_vendor.p({
          type: "right",
          size: "20"
        }),
        k: common_vendor.o(commitVoid),
        l: common_vendor.sr(ssAlert, "7c043e2e-1", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/manager/community/add.vue"]]);
wx.createPage(MiniProgramPage);
