"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../../common/ss-superModules/superConfig.js");
require("../../../store/index.js");
const store_modules_user = require("../../../store/modules/user.js");
const store_modules_system = require("../../../store/modules/system.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_addressBook2 = common_vendor.resolveComponent("addressBook");
  const _easycom_bottomMore2 = common_vendor.resolveComponent("bottomMore");
  (_easycom_uni_icons2 + _easycom_addressBook2 + _easycom_bottomMore2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_addressBook = () => "../../../components/addressBook/addressBook.js";
const _easycom_bottomMore = () => "../../../components/bottomMore/bottomMore.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_addressBook + _easycom_bottomMore)();
}
const _sfc_main = {
  __name: "selectAddressBook",
  setup(__props) {
    const addressBookApi = common_vendor.Ws.importObject("address-book");
    common_vendor.onLoad(() => {
    });
    const dataArr = common_vendor.ref([]);
    const keyWord = common_vendor.ref("");
    const selectPhone = common_vendor.ref({ _id: 0 });
    store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    common_vendor.onLoad(() => {
      loadData();
    });
    common_vendor.onPullDownRefresh(() => {
      loadData();
    });
    function loadData() {
      const dic = {
        pageIndex: 0,
        keyWord: keyWord.value,
        mySelf: true
      };
      addressBookApi.query(dic).then((res) => {
        dataArr.value = res.data;
        common_vendor.index.stopPullDownRefresh({});
      });
    }
    common_vendor.onReachBottom(() => {
      const dic = {
        pageIndex: dataArr.value.length,
        keyWord: keyWord.value
      };
      addressBookApi.query(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
      });
    });
    const navToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addressBook/add"
      });
    };
    function sureVoid() {
      if (selectPhone.value._id != 0) {
        systemStore.pageDic = selectPhone.value;
        common_vendor.index.navigateBack();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: keyWord.value,
        c: common_vendor.o(($event) => keyWord.value = $event.detail.value),
        d: common_vendor.p({
          type: "clear",
          size: "15",
          color: "#999"
        }),
        e: common_vendor.o(loadData),
        f: common_vendor.f(dataArr.value, (item, index, i0) => {
          return {
            a: index,
            b: "4d7f5f1c-2-" + i0,
            c: common_vendor.o(($event) => selectPhone.value = $event, index),
            d: common_vendor.p({
              select: true,
              dataDic: item,
              selectItem: selectPhone.value
            })
          };
        }),
        g: common_vendor.p({
          dataList: dataArr.value
        }),
        h: selectPhone.value._id == 0
      }, selectPhone.value._id == 0 ? {
        i: common_vendor.o(navToAdd)
      } : {
        j: common_vendor.o(sureVoid)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/newsArticle/selectAddressBook/selectAddressBook.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
