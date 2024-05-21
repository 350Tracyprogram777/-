"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
const pageDoc_doc = require("../doc.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_docFile2 = common_vendor.resolveComponent("docFile");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_docFile2 + _easycom_ss_twoAlert2 + _easycom_bottomMore2 + _easycom_uni_fab2)();
}
const _easycom_docFile = () => "../../components/docFile/docFile.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
const _easycom_bottomMore = () => "../../components/bottomMore/bottomMore.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_docFile + _easycom_ss_twoAlert + _easycom_bottomMore + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const docApi = common_vendor.Ws.importObject("user-doc");
    common_vendor.ref({});
    common_vendor.ref([]);
    const classArr = common_vendor.ref([]);
    const topIndex = common_vendor.ref(0);
    common_vendor.computed((e) => classArr.value.length > 0 ? classArr.value[topIndex.value]["value"] : "");
    const dataArr = common_vendor.ref([]);
    const shareDic = common_vendor.ref("");
    const loadMore = common_vendor.ref("more");
    common_vendor.onLoad((e) => {
      loadData();
    });
    common_vendor.onShow((e) => {
    });
    common_vendor.onPullDownRefresh(() => {
      console.log("-----2");
    });
    common_vendor.onPullDownRefresh(() => {
      loadData();
    });
    function loadData() {
      const dic = {
        pageIndex: 0,
        // where: { category_id: classId.value }
        where: {}
      };
      docApi.querySelf(dic).then((res) => {
        dataArr.value = res.data;
        common_vendor.index.stopPullDownRefresh({});
        if (dataArr.value.length % 10 == 0) {
          loadMore.value = "more";
        } else {
          loadMore.value = "noMore";
        }
      });
    }
    common_vendor.onReachBottom(() => {
      const dic = {
        pageIndex: dataArr.value.length,
        // where: { category_id: classId.value }
        where: {}
      };
      loadMore.value = "loading";
      docApi.querySelf(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        if (dataArr.value.length % 10 == 0) {
          loadMore.value = "more";
        } else {
          loadMore.value = "noMore";
        }
        common_vendor.index.stopPullDownRefresh();
      });
    });
    const navToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pageDoc/add"
      });
    };
    function docShare(e) {
      shareDic.value = e.value;
      console.log(shareDic.value.content);
    }
    common_vendor.onShareAppMessage((res) => {
      console.log(res);
      if (res.from === "button") {
        return {
          title: shareDic.value.content,
          path: "/pageDoc/detail?docId=" + shareDic.value._id + "&classId=" + shareDic.value.category_id + "&timestmap=" + (/* @__PURE__ */ new Date()).getTime(),
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
          path: "/pageDoc/detail?docId=" + shareDic.value._id + "&classId=" + shareDic.value.category_id + "&timestmap=" + (/* @__PURE__ */ new Date()).getTime(),
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
            docApi.remove(item.value._id).then((res) => {
              common_vendor.index.startPullDownRefresh({});
              msg("已删除");
            });
          }
        }
      });
    }
    function navToEdit(e) {
      common_vendor.index.navigateTo({
        url: "/pageDoc/add?docId=" + e.value._id
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(docShare, index),
            b: common_vendor.o(common_vendor.unref(pageDoc_doc.docZan), index),
            c: common_vendor.o(common_vendor.unref(pageDoc_doc.docCollect), index),
            d: common_vendor.o(remove, index),
            e: common_vendor.o(_ctx.changeState, index),
            f: common_vendor.o(showErr, index),
            g: common_vendor.o(navToEdit, index),
            h: index,
            i: "1e0ad922-0-" + i0,
            j: common_vendor.p({
              edit: true,
              dataDic: item
            })
          };
        }),
        b: common_vendor.sr(ssAlert, "1e0ad922-1", {
          "k": "ssAlert"
        }),
        c: common_vendor.p({
          dataList: dataArr.value,
          loadMore: loadMore.value
        }),
        d: common_vendor.o(navToAdd),
        e: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageDoc/mySelf/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
