"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_addressBook2 = common_vendor.resolveComponent("addressBook");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_topTabar2 + _easycom_addressBook2 + _easycom_bottomMore2 + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_addressBook = () => "../../components/addressBook/addressBook.js";
const _easycom_bottomMore = () => "../../components/bottomMore/bottomMore.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_addressBook + _easycom_bottomMore + _easycom_uni_icons + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const tabarList = [{ text: "正常", value: 0 }, { text: "已拒绝", value: 30 }];
    const topIndex = common_vendor.ref(0);
    const curState = common_vendor.computed((e) => tabarList[topIndex.value]["value"]);
    const addressBookApi = common_vendor.Ws.importObject("address-book");
    common_vendor.onLoad(() => {
    });
    const dataArr = common_vendor.ref([]);
    const loadStatus = common_vendor.ref("more");
    common_vendor.onLoad(() => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 100);
    });
    function changeTabIndex(e) {
      topIndex.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    common_vendor.onPullDownRefresh(() => {
      const dic = {
        pageIndex: 0,
        state: curState.value
      };
      addressBookApi.adminQuery(dic).then((res) => {
        dataArr.value = res.data;
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    common_vendor.onReachBottom(() => {
      const dic = {
        pageIndex: dataArr.value.length,
        state: curState.value
      };
      loadStatus.value = "loading";
      addressBookApi.adminQuery(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    const rejectPop = common_vendor.ref();
    const rejectContent = common_vendor.ref("");
    let selectItem = "";
    function rejectVoid(e) {
      selectItem = e;
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
      addressBookApi.adminEdit(dic).then((res) => {
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
            addressBookApi.adminEdit(dic).then((res2) => {
              const inx = dataArr.value.findIndex(function(a, b) {
                return a._id == e.value._id;
              });
              dataArr.value.splice(inx, 1);
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
          if (res.confirm)
            ;
        }
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
        content: "如非必要,不建议删除",
        success: (re) => {
          if (re.confirm) {
            addressBookApi.adminRemove(e._id).then((res) => {
              common_vendor.index.startPullDownRefresh({});
              common_ssSuperModules_superConfig.msg("已删除");
            });
          }
        }
      });
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
            f: "91bd1ea2-1-" + i0,
            g: common_vendor.p({
              admin: true,
              dataDic: item
            })
          };
        }),
        d: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadStatus.value
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
        k: common_vendor.sr(rejectPop, "91bd1ea2-3", {
          "k": "rejectPop"
        }),
        l: common_vendor.sr(ssAlert, "91bd1ea2-5", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/addressBook/list.vue"]]);
wx.createPage(MiniProgramPage);
