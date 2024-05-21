"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/ss-superModules/superConfig.js");
require("../store/index.js");
const store_modules_system = require("../store/modules/system.js");
const common_ssSuperModules_superOther_uniCopy = require("../common/ss-superModules/superOther/uni-copy.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_topTabar2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_topTabar = () => "../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_ss_twoAlert = () => "../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "wxGroupDetail",
  setup(__props) {
    common_vendor.Ws.importObject("wx-group");
    const systemStore = store_modules_system.useSystemStore();
    const wxGroupList = common_vendor.computed(() => systemStore.pageDic);
    const tabarList = common_vendor.computed(() => systemStore.pageDic.map(function(a, b) {
      return { text: a.name, value: a._id };
    }));
    const topIndex = common_vendor.ref(0);
    common_vendor.ref([]);
    const dataDic = common_vendor.ref({
      community_id: "",
      user_id: "",
      images: [],
      cover: "",
      sys_msg: "",
      name: "",
      remark: "",
      state: 0,
      category_id: 0,
      create_date: "",
      opengid: "",
      group_owner_wx: ""
      //群主微信
    });
    const ssAlert = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      dataDic.value = wxGroupList.value[0];
    });
    function changeTabIndex(e) {
      topIndex.value = e.index;
      dataDic.value = wxGroupList.value[topIndex.value];
    }
    function prewImg(index) {
      let arr = [];
      for (let item of dataDic.value.images) {
        arr.push(item.url);
      }
      common_vendor.index.previewImage({
        current: index,
        urls: arr
      });
    }
    function copyWxGroup() {
      common_ssSuperModules_superOther_uniCopy.uniCopy({
        content: dataDic.value.group_owner_wx,
        success: function() {
          ssAlert.value.showModalDic({
            show: true,
            title: "已复制群主微信",
            confirmText: "确定",
            showCancel: false,
            cancelText: "取消",
            content: "",
            success: (e) => {
              if (e.confirm)
                ;
            }
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: tabarList.value.length > 1
      }, tabarList.value.length > 1 ? {
        b: common_vendor.o(changeTabIndex),
        c: common_vendor.p({
          styleSet: "3",
          widthNum: "w-33",
          tabarArr: tabarList.value,
          topSelectIndex: topIndex.value
        })
      } : {}, {
        d: common_vendor.f(dataDic.value.images, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => prewImg(item.url), index),
            c: index
          };
        }),
        e: common_vendor.t(dataDic.value.name),
        f: common_vendor.t(dataDic.value.remark),
        g: common_vendor.o(($event) => copyWxGroup()),
        h: common_vendor.sr(ssAlert, "da1bda6e-1", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageDoc/wxGroupDetail.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
