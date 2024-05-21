"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_wxGroup2 = common_vendor.resolveComponent("wxGroup");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_ss_topTabar2 + _easycom_wxGroup2 + _easycom_uni_load_more2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_wxGroup = () => "../../components/wxGroup/wxGroup.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_wxGroup + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const wxGroupkApi = common_vendor.Ws.importObject("wx-group", { customUI: true });
    common_vendor.onLoad(() => {
    });
    const bigDic = common_vendor.ref({});
    const classArr = common_vendor.ref([]);
    const topIndex = common_vendor.ref(0);
    const classId = common_vendor.computed((e) => classArr.value.length > 0 ? classArr.value[topIndex.value]["value"] : "");
    const dataArr = common_vendor.computed((e) => bigDic.value[classId.value] || []);
    const loadStatus = common_vendor.ref("more");
    common_vendor.ref([]);
    common_vendor.onLoad(() => {
      getBaseData();
    });
    function getBaseData() {
      wxGroupkApi.getClass().then((res) => {
        classArr.value = res.data;
        if (res.data.length > 0) {
          common_vendor.index.startPullDownRefresh({});
        }
      });
    }
    function changeTabIndex(e) {
      topIndex.value = e.index;
      if (dataArr.value.length == 0) {
        loadData();
      }
    }
    common_vendor.onPullDownRefresh(() => {
      loadData();
    });
    function loadData() {
      const dic = {
        pageIndex: 0,
        where: { category_id: classId.value }
      };
      console.log("------", dic);
      wxGroupkApi.query(dic).then((res) => {
        console.log(res.data);
        bigDic.value[classId.value] = res.data;
        common_vendor.index.stopPullDownRefresh({});
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    }
    common_vendor.onReachBottom(() => {
      const dic = {
        pageIndex: dataArr.value.length,
        where: { category_id: classId.value }
      };
      loadStatus.value = "loading";
      wxGroupkApi.query(dic).then((res) => {
        bigDic.value[classId.value] = bigDic.value[classId.value].concat(res.data);
        if (res.data.length % 10 == 0 && res.data.length > 0) {
          loadStatus.value = "more";
        } else {
          loadStatus.value = "noMore";
        }
      });
    });
    common_vendor.onShareAppMessage((res) => {
      return {
        title: "群认证",
        path: "/pageAdmin/wxGroup/add?timestmap=" + (/* @__PURE__ */ new Date()).getTime(),
        imageUrl: "/static/share/share-main2.jpg"
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(changeTabIndex),
        b: common_vendor.p({
          styleSet: "3",
          widthNum: "w-25",
          tabarArr: classArr.value,
          topSelectIndex: topIndex.value
        }),
        c: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: index,
            b: "3ff8662e-1-" + i0,
            c: common_vendor.p({
              dataDic: item
            })
          };
        }),
        d: dataArr.value.length > 0
      }, dataArr.value.length > 0 ? {
        e: common_vendor.p({
          status: loadStatus.value
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/wxGroup/list.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
