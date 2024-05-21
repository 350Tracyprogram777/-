"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
if (!Array) {
  const _easycom_addressBook2 = common_vendor.resolveComponent("addressBook");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_addressBook2 + _easycom_bottomMore2 + _easycom_uni_fab2 + _easycom_ss_twoAlert2)();
}
const _easycom_addressBook = () => "../../../components/addressBook/addressBook.js";
const _easycom_bottomMore = () => "../../../components/bottomMore/bottomMore.js";
const _easycom_uni_fab = () => "../../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
const _easycom_ss_twoAlert = () => "../../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_addressBook + _easycom_bottomMore + _easycom_uni_fab + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const addressBookApi = common_vendor.Ws.importObject("address-book");
    const loadStatus = common_vendor.ref("more");
    common_vendor.onLoad(() => {
    });
    const dataArr = common_vendor.ref([]);
    common_vendor.onLoad(() => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 100);
    });
    common_vendor.onPullDownRefresh(() => {
      const dic = {
        pageIndex: 0
      };
      addressBookApi.querySelf(dic).then((res) => {
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
      const dic = {
        pageIndex: dataArr.value.length
      };
      addressBookApi.querySelf(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    const navToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/add"
      });
    };
    function navToEdit(e) {
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/add?addressId=" + e._id
      });
    }
    const ssAlert = common_vendor.ref();
    function remove(e) {
      console.log("shanchu ", e);
      ssAlert.value.showModalDic({
        show: true,
        title: "确定删除",
        confirmText: "确定",
        showCancel: true,
        content: "",
        success: (re) => {
          if (re.confirm) {
            addressBookApi.remove(e._id).then((res) => {
              common_vendor.index.startPullDownRefresh({});
              msg("已删除");
            });
          }
        }
      });
    }
    function showErr(e) {
      ssAlert.value.showModalDic({
        show: true,
        title: "请整改",
        confirmText: "去修改",
        showCancel: true,
        cancelText: "取消",
        content: e.sys_msg,
        success: (res) => {
          if (res.confirm) {
            navToEdit(e);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(navToEdit, index),
            b: common_vendor.o(remove, index),
            c: common_vendor.o(showErr, index),
            d: index,
            e: "fecafb10-0-" + i0,
            f: common_vendor.p({
              edit: true,
              dataDic: item
            })
          };
        }),
        b: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadStatus.value
        }),
        c: common_vendor.o(navToAdd),
        d: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        }),
        e: common_vendor.sr(ssAlert, "fecafb10-3", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/addressBook/mySelf/list.vue"]]);
wx.createPage(MiniProgramPage);
