"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
require("../contant.js");
const store_modules_user = require("../../../store/modules/user.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_houseRent2 = common_vendor.resolveComponent("houseRent");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_topTabar2 + _easycom_houseRent2 + _easycom_bottomMore2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_topTabar = () => "../../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_houseRent = () => "../../../components/houseRent/houseRent.js";
const _easycom_bottomMore = () => "../../../components/bottomMore/bottomMore.js";
const _easycom_ss_twoAlert = () => "../../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_houseRent + _easycom_bottomMore + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const houseRentApi = common_vendor.Ws.importObject("house-rent");
    const tabarList = [{ text: "租售中", value: 0 }, { text: "已租售", value: 1 }, { text: "暂停租售", value: 2 }];
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
      houseRentApi.querySelf(dic).then((res) => {
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
      houseRentApi.querySelf(dic).then((res) => {
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
        url: "/pages/houseRent/add"
      });
    };
    const ssAlert = common_vendor.ref();
    function remove(item) {
      ssAlert.value.showModalDic({
        show: true,
        title: "确定删除",
        confirmText: "确定",
        showCancel: true,
        content: "",
        success: (e) => {
          if (e.confirm) {
            houseRentApi.remove(item.value._id).then((res) => {
              common_vendor.index.startPullDownRefresh({});
              msg("已删除");
            });
          }
        }
      });
    }
    function changeState(e) {
      if (e.value.state == 30) {
        msg("严重违规,请联系客户处理");
        return;
      }
      const stateArr = ["出租", "已出租/售", "暂停租售"];
      stateArr.splice(e.value.state, 1);
      common_vendor.index.showActionSheet({
        title: "发布状态",
        itemList: stateArr,
        success: function(res) {
          console.log("选中了第" + (res.tapIndex + 1) + "个按钮");
          const tt = stateArr[res.tapIndex];
          const dic = {
            _id: e.value._id,
            state: res.tapIndex
          };
          if (tt == "出租") {
            dic.state = 0;
          }
          if (tt == "已出租/售") {
            dic.state = 1;
          }
          if (tt == "暂停租售") {
            dic.state = 2;
          }
          houseRentApi.edit(dic).then((res2) => {
            common_vendor.index.startPullDownRefresh({});
          });
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    }
    function navToEdit(e) {
      common_vendor.index.navigateTo({
        url: "/pages/houseRent/add?houseId=" + e.value._id
      });
    }
    function showErr(e) {
      ssAlert.value.showModalDic({
        show: true,
        title: "请整改",
        confirmText: "去修改",
        showCancel: true,
        cancelText: "取消",
        content: e.value.sys_msg,
        success: (res) => {
          if (res.confirm) {
            navToEdit(e);
          }
        }
      });
    }
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
            a: common_vendor.o(remove, index),
            b: common_vendor.o(changeState, index),
            c: common_vendor.o(showErr, index),
            d: common_vendor.o(navToEdit, index),
            e: index,
            f: "73bb4b34-1-" + i0,
            g: common_vendor.p({
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
        f: common_vendor.sr(ssAlert, "73bb4b34-3", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/houseRent/mySelf/list.vue"]]);
wx.createPage(MiniProgramPage);
