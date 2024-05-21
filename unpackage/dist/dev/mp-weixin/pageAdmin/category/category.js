"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_system = require("../../store/modules/system.js");
if (!Array) {
  const _easycom_ss_topTabar2 = common_vendor.resolveComponent("ss-topTabar");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_ss_topTabar2 + _easycom_uni_fab2 + _easycom_uni_icons2 + _easycom_uni_data_checkbox2 + _easycom_uni_tag2 + _easycom_uni_popup2)();
}
const _easycom_ss_topTabar = () => "../../uni_modules/ss-components/components/ss-topTabar/ss-topTabar.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_ss_topTabar + _easycom_uni_fab + _easycom_uni_icons + _easycom_uni_data_checkbox + _easycom_uni_tag + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "category",
  setup(__props) {
    const adminApi = common_vendor.Ws.importObject("admin");
    const dataArr = common_vendor.ref([]);
    const tabarList = [
      {
        value: 1,
        text: "通讯录"
      },
      {
        value: 2,
        text: "社区圈"
      },
      {
        value: 3,
        text: "二手市场"
      },
      {
        value: 4,
        text: "资料库"
      },
      {
        value: 100,
        text: "微信群"
      }
    ];
    const topIndex = common_vendor.ref(0);
    store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    const curState = common_vendor.computed((e) => tabarList[topIndex.value]["value"]);
    const selectGroupArr = common_vendor.computed((e) => systemStore.selectGroupArr);
    function changeTabIndex(e) {
      topIndex.value = e.index;
      common_vendor.index.startPullDownRefresh({});
    }
    common_vendor.onLoad(() => {
      setTimeout(function() {
        common_vendor.index.startPullDownRefresh({});
      }, 200);
    });
    console.log("---", selectGroupArr.value);
    common_vendor.onPullDownRefresh(() => {
      let dic = {};
      if (topIndex.value == 0) {
        dic = { pageIndex: 0, type: curState.value };
      } else {
        dic = { pageIndex: 0, type: curState.value };
      }
      adminApi.queryClass(dic).then((res) => {
        dataArr.value = res.data;
        console.log(dataArr.value);
        common_vendor.index.stopPullDownRefresh();
      });
    });
    common_vendor.onReachBottom(() => {
      let dic = {};
      if (topIndex.value == 0) {
        dic = { pageIndex: dataArr.value.length, type: curState.value };
      } else {
        dic = { pageIndex: dataArr.value.length, type: curState.value };
      }
      adminApi.queryClass(dic).then((res) => {
        dataArr.value = dataArr.value.concat(res.data);
        common_vendor.index.stopPullDownRefresh();
      });
    });
    const addPop = common_vendor.ref();
    const addDic = common_vendor.ref({
      type: curState.value,
      name: "",
      sort: 1e3,
      state: 0,
      role: ["user"]
    });
    function showAddPop(e) {
      if (e) {
        addDic.value = {
          type: curState.value,
          name: e.name,
          sort: e.sort,
          state: e.state,
          _id: e._id,
          role: e.role,
          wx_group: []
        };
      } else {
        addDic.value = {
          type: curState.value,
          name: "",
          sort: 1e3,
          state: 0,
          role: ["user"]
        };
      }
      console.log(addDic.value);
      if (curState.value == 4) {
        systemStore.selectGroupArr = e ? e.wx_group || [] : [];
      }
      addPop.value.open();
    }
    function commitVoid() {
      addDic.value.wx_group = selectGroupArr.value;
      if (addDic.value._id) {
        adminApi.editClass(addDic.value).then((res) => {
          common_vendor.index.startPullDownRefresh({});
          hideVoid();
        });
      } else {
        adminApi.addClass(addDic.value).then((res) => {
          common_vendor.index.startPullDownRefresh({});
          hideVoid();
        });
      }
    }
    function hideVoid() {
      addPop.value.close();
    }
    function selectWxGroup() {
      common_vendor.index.navigateTo({
        url: "/pageAdmin/category/selectWxGroup"
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(changeTabIndex),
        b: common_vendor.p({
          styleSet: "3",
          widthNum: "w-33",
          tabarArr: tabarList,
          topSelectIndex: topIndex.value
        }),
        c: common_vendor.f(dataArr.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.sort),
            c: item.state == 0
          }, item.state == 0 ? {} : {}, {
            d: common_vendor.o(($event) => showAddPop(item), item._id),
            e: item._id
          });
        }),
        d: common_vendor.o(showAddPop),
        e: common_vendor.p({
          popMenu: false,
          horizontal: "right"
        }),
        f: addDic.value._id
      }, addDic.value._id ? {
        g: common_vendor.t(tabarList[topIndex.value]["text"])
      } : {
        h: common_vendor.t(tabarList[topIndex.value]["text"])
      }, {
        i: common_vendor.o(hideVoid),
        j: common_vendor.p({
          type: "close",
          size: "24",
          color: "#999"
        }),
        k: addDic.value.name,
        l: common_vendor.o(($event) => addDic.value.name = $event.detail.value),
        m: addDic.value.sort,
        n: common_vendor.o(($event) => addDic.value.sort = $event.detail.value),
        o: common_vendor.o(($event) => addDic.value.state = $event),
        p: common_vendor.p({
          localdata: [{
            text: "上线",
            value: 0
          }, {
            text: "下线",
            value: 1
          }],
          modelValue: addDic.value.state
        }),
        q: common_vendor.o(($event) => addDic.value.role = $event),
        r: common_vendor.p({
          multiple: true,
          localdata: [{
            text: "用户",
            value: "user"
          }, {
            text: "物业",
            value: "wuye"
          }],
          modelValue: addDic.value.role
        }),
        s: curState.value == 4
      }, curState.value == 4 ? common_vendor.e({
        t: selectGroupArr.value.length > 0
      }, selectGroupArr.value.length > 0 ? {
        v: common_vendor.f(selectGroupArr.value, (item, index, i0) => {
          return {
            a: index,
            b: "0f912740-6-" + i0 + ",0f912740-2",
            c: common_vendor.p({
              type: "primary",
              text: item.name
            })
          };
        })
      } : {}, {
        w: common_vendor.o(selectWxGroup)
      }) : {}, {
        x: common_vendor.o(commitVoid),
        y: common_vendor.sr(addPop, "0f912740-2", {
          "k": "addPop"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/category/category.vue"]]);
wx.createPage(MiniProgramPage);
