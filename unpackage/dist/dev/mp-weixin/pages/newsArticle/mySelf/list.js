"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
const store_modules_user = require("../../../store/modules/user.js");
if (!Array) {
  const _easycom_newsOne2 = common_vendor.resolveComponent("newsOne");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_newsOne2 + _easycom_bottomMore2 + _easycom_ss_twoAlert2)();
}
const _easycom_newsOne = () => "../../../components/newsOne/newsOne.js";
const _easycom_bottomMore = () => "../../../components/bottomMore/bottomMore.js";
const _easycom_ss_twoAlert = () => "../../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_newsOne + _easycom_bottomMore + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const newsApi = common_vendor.Ws.importObject("news-article");
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    const dataArr = common_vendor.ref([]);
    const shareDic = common_vendor.ref({});
    const tabarList = [{ text: "正常", value: 0 }, { text: "已拒绝", value: 1 }];
    const topIndex = common_vendor.ref(0);
    common_vendor.computed((e) => tabarList[topIndex.value]["value"]);
    const loadStatus = common_vendor.ref("more");
    common_vendor.onLoad((e) => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 100);
    });
    common_vendor.onPullDownRefresh(() => {
      let dic = {};
      dic = { pageIndex: 0, where: { mode: 1 } };
      newsApi.querySelf(dic).then((res) => {
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
      dic = { pageIndex: dataArr.value.length, where: { mode: 1 } };
      newsApi.querySelf(dic).then((res) => {
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
        url: "/pages/newsArticle/add"
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
            newsApi.remove(item.value._id).then((res) => {
              common_vendor.index.startPullDownRefresh({});
              common_ssSuperModules_superConfig.msg("已删除");
            });
          }
        }
      });
    }
    function navToEdit(e) {
      common_vendor.index.navigateTo({
        url: "/pages/newsArticle/add?newsId=" + e.value._id
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
    function newsShare(e) {
      console.log(e);
      shareDic.value = e.value;
    }
    common_vendor.onShareAppMessage((res) => {
      console.log(res);
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
        };
      } else {
        return {
          title: "家在龙兴嘉苑2号院",
          path: "/pages/tabar/main",
          imageUrl: "/static/share/share-main2.jpg"
        };
      }
    });
    common_vendor.onShareTimeline((res) => {
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pages/newsArticle/detail?newsId=" + shareDic.value._id,
          imageUrl: shareDic.value.cover
        };
      } else {
        return {
          title: "家在龙兴嘉苑2号院",
          path: "/pages/tabar/main",
          imageUrl: "/static/share/share-main2.jpg"
        };
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(remove, index),
            b: common_vendor.o(_ctx.changeState, index),
            c: common_vendor.o(showErr, index),
            d: common_vendor.o(navToEdit, index),
            e: common_vendor.o(newsShare, index),
            f: index,
            g: "7b8647c4-0-" + i0,
            h: common_vendor.p({
              edit: true,
              dataDic: item
            })
          };
        }),
        b: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadStatus.value
        }),
        c: common_vendor.o(($event) => navToAdd()),
        d: common_vendor.sr(ssAlert, "7b8647c4-2", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/newsArticle/mySelf/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
