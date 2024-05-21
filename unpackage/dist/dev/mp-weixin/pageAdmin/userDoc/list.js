"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_docFile2 = common_vendor.resolveComponent("docFile");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_topTabar2 + _easycom_docFile2 + _easycom_bottomMore2 + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_docFile = () => "../../components/docFile/docFile.js";
const _easycom_bottomMore = () => "../../components/bottomMore/bottomMore.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_docFile + _easycom_bottomMore + _easycom_uni_icons + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const tabarList = [{ text: "正常", value: 0 }, { text: "已拒绝", value: 1 }];
    const topIndex = common_vendor.ref(0);
    const curState = common_vendor.computed((e) => tabarList[topIndex.value]["value"]);
    const docApi = common_vendor.Ws.importObject("user-doc");
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    const dataArr = common_vendor.ref([]);
    common_vendor.ref({});
    common_vendor.onLoad((e) => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 100);
    });
    common_vendor.onPullDownRefresh(() => {
      let dic = {};
      dic = { pageIndex: 0, state: curState.value };
      docApi.adminQuery(dic).then((res) => {
        dataArr.value = res.data;
        common_vendor.index.stopPullDownRefresh();
      });
    });
    common_vendor.onReachBottom(() => {
      let dic = {};
      dic = { pageIndex: dataArr.value.length, state: curState.value };
      docApi.adminQuery(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
      });
    });
    const rejectPop = common_vendor.ref();
    const rejectContent = common_vendor.ref("");
    let selectItem = "";
    function rejectVoid(e) {
      selectItem = e.value;
      console.log(selectItem);
      rejectPop.value.open();
    }
    function hideReject() {
      rejectPop.value.close();
    }
    function commitReject(e) {
      if (!rejectContent.value) {
        common_ssSuperModules_superConfig.msg("请说明下架的原因,方便用户整改");
        return;
      }
      const dic = {
        state: e,
        sys_msg: rejectContent.value,
        _id: selectItem._id
      };
      docApi.adminEdit(dic).then((res) => {
        const inx = dataArr.value.findIndex(function(a, b) {
          return a._id == selectItem._id;
        });
        dataArr.value.splice(inx, 1);
        hideReject();
      });
    }
    function resolveVoid(e) {
      ssAlert.value.showModalDic({
        show: true,
        title: "重新上架",
        confirmText: "确定",
        showCancel: true,
        cancelText: "取消",
        content: "",
        success: (res) => {
          if (res.confirm) {
            const dic = {
              state: 0,
              sys_msg: "",
              _id: e.value._id
            };
            docApi.adminEdit(dic).then((res2) => {
              const inx = dataArr.value.findIndex(function(a, b) {
                return a._id == e.value._id;
              });
              dataArr.value.splice(inx, 1);
            });
          }
        }
      });
    }
    const ssAlert = common_vendor.ref();
    function remove(item) {
      ssAlert.value.showModalDic({
        show: true,
        title: "确定删除",
        confirmText: "删除",
        showCancel: true,
        content: "如非必要,不建议删除",
        success: (e) => {
          if (e.confirm) {
            docApi.adminRemove(item.value._id).then((res) => {
              common_vendor.index.startPullDownRefresh({});
              common_ssSuperModules_superConfig.msg("已删除");
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
        success: (e2) => {
          if (e2.confirm) {
            navToEdit(e2);
          }
        }
      });
    }
    function changeTabIndex(e) {
      topIndex.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(changeTabIndex),
        b: common_vendor.p({
          styleSet: "3",
          widthNum: "w-50",
          tabarArr: tabarList,
          topSelectIndex: topIndex.value
        }),
        c: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(resolveVoid, index),
            b: common_vendor.o(rejectVoid, index),
            c: common_vendor.o(remove, index),
            d: common_vendor.o(showErr, index),
            e: index,
            f: "039b81bf-1-" + i0,
            g: common_vendor.p({
              admin: true,
              dataDic: item
            })
          };
        }),
        d: common_vendor.p({
          dataList: dataArr.value
        }),
        e: common_vendor.o(hideReject),
        f: common_vendor.p({
          type: "close",
          size: "20"
        }),
        g: rejectContent.value,
        h: common_vendor.o(($event) => rejectContent.value = $event.detail.value),
        i: common_vendor.o(($event) => commitReject(30)),
        j: common_vendor.o(($event) => commitReject(1)),
        k: common_vendor.sr(rejectPop, "039b81bf-3", {
          "k": "rejectPop"
        }),
        l: common_vendor.sr(ssAlert, "039b81bf-5", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/userDoc/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
