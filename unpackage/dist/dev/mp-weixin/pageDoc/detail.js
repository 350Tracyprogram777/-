"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/ss-superModules/superConfig.js");
const pageDoc_doc = require("./doc.js");
require("../store/index.js");
const store_modules_user = require("../store/modules/user.js");
const store_modules_system = require("../store/modules/system.js");
if (!Array) {
  const _easycom_docFile2 = common_vendor.resolveComponent("docFile");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_docFile2 + _easycom_ss_twoAlert2)();
}
const _easycom_docFile = () => "../components/docFile/docFile.js";
const _easycom_ss_twoAlert = () => "../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_docFile + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const docApi = common_vendor.Ws.importObject("user-doc", { customUI: true });
    common_vendor.Ws.importObject("report-center");
    const userStore = store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    common_vendor.computed(() => userStore.userInfo);
    const classDic = common_vendor.ref({ wx_group: [] });
    const dataDic = common_vendor.ref({
      user_id: "",
      images: [],
      cover: "",
      sys_msg: "",
      content: "",
      category_id: "",
      author: "",
      //作者
      view_count: 0,
      //阅读数量
      like_count: 0,
      //点赞量
      is_sticky: false,
      //是否置顶
      address: "",
      address_name: "",
      gps: "",
      state: 0,
      create_date: 0,
      zan: [],
      collect: []
    });
    const ssAlert = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      console.log("我有进来了", e);
      if (e.isEdit) {
        dataDic.value["_id"] = e.docId;
        getDetail();
        return;
      }
      if (e.docId && e.classId) {
        dataDic.value["_id"] = e.docId;
        classDic.value["_id"] = e.classId;
        loadBaseData();
      }
    });
    function loadBaseData() {
      docApi.getClassDetail(classDic.value._id).then((res) => {
        if (res.errCode == 0) {
          Object.assign(classDic.value, res.data);
          if (classDic.value.wx_group.length > 0) {
            systemStore.getWxGroup(classDic.value).then((res2) => {
              const findItem = classDic.value.wx_group.find(function(a, b) {
                return a.opengid == res2;
              });
              if (findItem) {
                getDetail();
              } else {
                common_vendor.index.showModal({
                  title: "群资料,外部打开无效",
                  content: `请从微信群:${classDic.value.name}内打开`,
                  showCancel: false,
                  success: function(e) {
                    common_vendor.index.switchTab({
                      url: "/pages/tabar/main"
                    });
                  }
                });
              }
            }).catch((err) => {
              {
                common_vendor.index.showModal({
                  title: "群资料,外部打开无效",
                  content: `请从微信群:${classDic.value.name}内打开`,
                  showCancel: false,
                  success: function(e) {
                    common_vendor.index.switchTab({
                      url: "/pages/tabar/main"
                    });
                  }
                });
              }
            });
          } else {
            getDetail();
          }
        }
      });
    }
    function getDetail() {
      docApi.doc(dataDic.value._id).then((res) => {
        if (res.errCode == 0) {
          Object.assign(dataDic.value, res.data);
        }
      }).catch((err) => {
        ssAlert.value.showModalDic({
          show: true,
          title: "未找到,可能已被删除",
          confirmText: "确定",
          showCancel: false,
          cancelText: "",
          content: "",
          success: (e) => {
            if (e.confirm) {
              common_vendor.index.redirectTo({
                url: "/pageDoc/class"
              });
            }
          }
        });
      });
    }
    const shareDic = common_vendor.ref("");
    function docShare(e) {
      console.log(e);
      shareDic.value = e.value;
    }
    common_vendor.onShareAppMessage((res) => {
      console.log(res);
      if (res.from === "button") {
        return {
          title: dataDic.value.content,
          path: "/pageDoc/detail?docId=" + dataDic.value._id + "&timestmap=" + (/* @__PURE__ */ new Date()).getTime(),
          imageUrl: dataDic.value.cover
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
          title: dataDic.value.content,
          path: "/pageDoc/detail?docId=" + dataDic.value._id + "&timestmap=" + (/* @__PURE__ */ new Date()).getTime(),
          imageUrl: dataDic.value.cover
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
        a: common_vendor.o(_ctx.addClick),
        b: common_vendor.o(docShare),
        c: common_vendor.o(common_vendor.unref(pageDoc_doc.docZan)),
        d: common_vendor.o(common_vendor.unref(pageDoc_doc.docCollect)),
        e: common_vendor.p({
          detail: true,
          dataDic: dataDic.value
        }),
        f: common_vendor.sr(ssAlert, "904701f2-1", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageDoc/detail.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
