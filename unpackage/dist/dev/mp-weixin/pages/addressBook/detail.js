"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const common_ssSuperModules_superOther_uniCopy = require("../../common/ss-superModules/superOther/uni-copy.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const addressBookApi = common_vendor.Ws.importObject("address-book");
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    common_vendor.ref(false);
    const dataDic = common_vendor.ref({
      community_id: "",
      user_id: "",
      images: [],
      cover: "",
      sys_msg: "",
      contacts: [],
      title: "",
      remark: "",
      address: "",
      address_name: "",
      gps: {
        latitude: 0,
        longitude: 0
      },
      state: 0,
      class: 0,
      create_date: null,
      collect: false
    });
    const ssAlert = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      if (e.bookId) {
        addressBookApi.doc(e.bookId).then((res) => {
          if (res.data.state == 0) {
            Object.assign(dataDic.value, res.data);
            common_vendor.index.setNavigationBarTitle({
              title: res.data.name
            });
          } else {
            ssAlert.value.showModalDic({
              show: true,
              title: "内容可能被删除了",
              confirmText: "确定",
              showCancel: false,
              cancelText: "",
              content: "",
              success: (e2) => {
                if (e2.confirm) {
                  common_vendor.index.navigateBack();
                }
              }
            });
          }
        });
      }
    });
    common_vendor.onShareAppMessage((e) => {
      return {
        title: dataDic.value.name + "-" + dataDic.value.phone,
        path: "/pages/addressBook/detail?bookId=" + dataDic.value._id,
        imageUrl: dataDic.value.cover || "/static/logo.png"
      };
    });
    common_vendor.onShareTimeline((e) => {
      return {
        title: dataDic.value.name + "-" + dataDic.value.phone,
        path: "/pages/addressBook/detail?bookId=" + dataDic.value._id,
        imageUrl: dataDic.value.cover || "/static/logo.png"
      };
    });
    function openMap() {
      console.log(dataDic.value);
      common_vendor.wx$1.openLocation({
        latitude: dataDic.value.gps.latitude,
        longitude: dataDic.value.gps.longitude,
        name: dataDic.value.address_name,
        scale: 20,
        complete: function(err) {
          console.log(err);
        }
      });
    }
    function copyPhone(e) {
      console.log(e);
      ssAlert.value.showModalDic({
        show: true,
        title: "温馨提示",
        confirmText: "确定",
        showCancel: true,
        cancelText: "取消",
        content: "本程序只提供信息互通,如涉及商业行为,请自行斟酌",
        success: (e2) => {
          if (e2.confirm) {
            common_ssSuperModules_superOther_uniCopy.uniCopy({
              content: e2,
              success: function() {
                common_ssSuperModules_superConfig.msg("号码已复制");
              }
            });
          }
        }
      });
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
    function makePhone() {
      ssAlert.value.showModalDic({
        show: true,
        title: "温馨提示",
        confirmText: "确定",
        showCancel: true,
        cancelText: "取消",
        content: "本程序只提供信息互通,如涉及商业行为,请自行斟酌",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.makePhoneCall({
              phoneNumber: dataDic.value.phone
            });
          }
        }
      });
    }
    function collect() {
      const dic = {
        uni_id: dataDic.value._id,
        uni_data: dataDic.value
      };
      addressBookApi.favorite(dic).then((res) => {
        if (res.errCode == 0) {
          dataDic.value.collect = !dataDic.value.collect;
          console.log(dataDic.value.collect);
        }
      });
    }
    const addPop = common_vendor.ref();
    const reportDic = common_vendor.ref({ content: "" });
    function reportClick() {
      addPop.value.open();
    }
    function hidePop() {
      addPop.value.close();
    }
    function commit() {
      if (!reportDic.value.content) {
        common_ssSuperModules_superConfig.msg("请输入内容");
        return;
      }
      const dic = {
        uni_id: dataDic.value._id,
        content: reportDic.value.content,
        uni_data: dataDic.value
      };
      addressBookApi.report(dic).then((res) => {
        reportDic.value.content = "";
        common_ssSuperModules_superConfig.msg(res.data);
        hidePop();
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(dataDic.value.images, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => prewImg(item.url), index),
            c: index
          };
        }),
        b: common_vendor.t(dataDic.value.name),
        c: common_vendor.t(dataDic.value.remark),
        d: common_vendor.t(dataDic.value.phone),
        e: common_vendor.o(($event) => copyPhone(dataDic.value.phone)),
        f: common_vendor.f(dataDic.value.other, (item, index, i0) => {
          return {
            a: common_vendor.t(item.phone),
            b: common_vendor.o(($event) => copyPhone(item.phone), index),
            c: index
          };
        }),
        g: dataDic.value.address_name
      }, dataDic.value.address_name ? {
        h: common_vendor.t(dataDic.value.address_name),
        i: common_vendor.t(dataDic.value.address),
        j: common_vendor.o(($event) => openMap()),
        k: common_vendor.p({
          type: "paperplane",
          size: "22",
          color: "#999"
        }),
        l: common_vendor.o(($event) => openMap())
      } : {}, {
        m: common_vendor.o(($event) => reportClick()),
        n: !dataDic.value.collect
      }, !dataDic.value.collect ? {
        o: common_vendor.p({
          type: "star",
          size: "21",
          color: "#666"
        })
      } : {}, {
        p: dataDic.value.collect
      }, dataDic.value.collect ? {
        q: common_vendor.p({
          type: "star-filled",
          size: "21",
          color: "#00755C"
        })
      } : {}, {
        r: common_vendor.o(($event) => collect()),
        s: common_vendor.o(($event) => makePhone()),
        t: common_vendor.o(hidePop),
        v: common_vendor.p({
          type: "close",
          color: "#999"
        }),
        w: reportDic.value.content,
        x: common_vendor.o(($event) => reportDic.value.content = $event.detail.value),
        y: common_vendor.o(($event) => commit()),
        z: common_vendor.sr(addPop, "2478e344-3", {
          "k": "addPop"
        }),
        A: common_vendor.sr(ssAlert, "2478e344-5", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/addressBook/detail.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
