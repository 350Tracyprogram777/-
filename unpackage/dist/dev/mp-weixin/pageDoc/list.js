"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/ss-superModules/superConfig.js");
const pageDoc_doc = require("./doc.js");
require("../store/index.js");
const store_modules_user = require("../store/modules/user.js");
const store_modules_system = require("../store/modules/system.js");
if (!Array) {
  const _easycom_docFile2 = common_vendor.resolveComponent("docFile");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_docFile2 + _easycom_bottomMore2 + _easycom_uni_fab2)();
}
const _easycom_docFile = () => "../components/docFile/docFile.js";
const _easycom_bottomMore = () => "../components/bottomMore/bottomMore.js";
const _easycom_uni_fab = () => "../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_docFile + _easycom_bottomMore + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const docApi = common_vendor.Ws.importObject("user-doc");
    const dataArr = common_vendor.ref([]);
    const shareDic = common_vendor.ref("");
    const loadMore = common_vendor.ref("more");
    const classDic = common_vendor.ref({ wx_group: [] });
    store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    common_vendor.computed(() => systemStore.wxStartEnv);
    common_vendor.onLoad((e) => {
      if (e.classId) {
        classDic.value._id = e.classId;
        loadBaseData();
      }
      common_vendor.index.$on("docUpdate", function(e2) {
        const item = dataArr.value.find(function(a, b) {
          return a._id == e2._id;
        });
        Object.assign(item, e2);
      });
    });
    function loadBaseData() {
      docApi.getClassDetail(classDic.value._id).then((res) => {
        if (res.errCode == 0) {
          Object.assign(classDic.value, res.data);
          if (classDic.value.wx_group.length > 0) {
            systemStore.getWxGroup().then((res2) => {
              const findItem = classDic.value.wx_group.find(function(a, b) {
                return a.opengid == res2;
              });
              console.log("qunid", findItem);
              if (findItem) {
                loadData();
              } else {
                common_vendor.index.showModal({
                  title: "群资料仅能通过群内分享查看",
                  content: `如果您不是该群的成员,可联系群主进群`,
                  showCancel: true,
                  confirmText: "详情",
                  success: function(e) {
                    if (e.confirm) {
                      console.log("lllll", classDic.value.wx_group);
                      systemStore.pageDic = classDic.value.wx_group;
                      common_vendor.index.redirectTo({
                        url: "/pageDoc/wxGroupDetail"
                      });
                    } else {
                      common_vendor.index.switchTab({
                        url: "/pages/tabar/main"
                      });
                    }
                  }
                });
              }
            }).catch((err) => {
              common_vendor.index.showModal({
                title: "群资料仅能通过群内分享查看",
                content: `如果您不是该群的成员,可联系群主进群`,
                showCancel: true,
                confirmText: "详情",
                success: function(e) {
                  if (e.confirm) {
                    console.log("lllll", classDic.value.wx_group);
                    systemStore.pageDic = classDic.value.wx_group;
                    common_vendor.index.redirectTo({
                      url: "/pageDoc/wxGroupDetail"
                    });
                  } else {
                    common_vendor.index.switchTab({
                      url: "/pages/tabar/main"
                    });
                  }
                }
              });
            });
          } else {
            loadData();
          }
        }
      });
    }
    common_vendor.onPullDownRefresh(() => {
      loadData();
    });
    function loadData() {
      const dic = {
        pageIndex: 0,
        where: { category_id: classDic.value._id }
        // where: {}
      };
      docApi.query(dic).then((res) => {
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
        where: { category_id: classDic.value._id }
        // where: {}
      };
      loadMore.value = "loading";
      docApi.query(dic).then((res) => {
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
      console.log(e);
      shareDic.value = e.value;
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
          title: "群文件,群内成员可查看",
          path: "/pageDoc/list?classId=" + classDic.value._id
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
          title: "群文件,群内成员可查看",
          path: "/pageDoc/list?classId=" + classDic.value._id
        };
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: classDic.value.wx_group.length > 0
      }, classDic.value.wx_group.length > 0 ? {} : {}, {
        b: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: common_vendor.o(docShare, index),
            b: common_vendor.o(common_vendor.unref(pageDoc_doc.docZan), index),
            c: common_vendor.o(common_vendor.unref(pageDoc_doc.docCollect), index),
            d: index,
            e: "1f8a8f58-0-" + i0,
            f: common_vendor.p({
              dataDic: item
            })
          };
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
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageDoc/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
