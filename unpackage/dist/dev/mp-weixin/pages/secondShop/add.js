"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_system = require("../../store/modules/system.js");
const store_modules_contant = require("../../store/modules/contant.js");
if (!Array) {
  const _easycom_ss_upimage2 = common_vendor.resolveComponent("ss-upimage");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ss_superSelectView2 = common_vendor.resolveComponent("ss-superSelectView");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_upimage2 + _easycom_uni_data_checkbox2 + _easycom_uni_icons2 + _easycom_ss_superSelectView2 + _easycom_uni_data_select2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_upimage = () => "../../components/ss-upimage/ss-upimage.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ss_superSelectView = () => "../../uni_modules/ss-components/components/ss-superSelectView/ss-superSelectView.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_upimage + _easycom_uni_data_checkbox + _easycom_uni_icons + _easycom_ss_superSelectView + _easycom_uni_data_select + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const sallStateArr = [{ text: "出售/求购中", value: 0 }, { text: "暂停出售/求购", value: 1 }, { text: "已卖出/求购", value: 2 }];
    const systemStore = store_modules_system.useSystemStore();
    const selectPhone = common_vendor.computed(() => systemStore.pageDic);
    const contantStore = store_modules_contant.useContantStore();
    const secondApi = common_vendor.Ws.importObject("second-shop");
    const mediaApi = common_vendor.Ws.importObject("media");
    common_vendor.ref(false);
    common_vendor.ref([]);
    const dataDic = common_vendor.ref({
      user_id: "",
      images: [],
      tags: [],
      cover: "",
      sys_msg: "",
      price: "",
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
      gps: { latitude: 0, longitude: 0 },
      state: 0,
      create_date: 0,
      model: 0,
      replacement: {
        open: false,
        content: ""
      },
      trade_type: 0,
      //0包邮 自提
      address_book_id: ""
    });
    common_vendor.onLoad((e) => {
      if (e.productId) {
        dataDic.value["_id"] = e.productId;
        getDetail();
      } else {
        systemStore.pageDic = "";
      }
    });
    function getDetail() {
      secondApi.doc(dataDic.value._id).then((res) => {
        if (res.errCode == 0) {
          Object.assign(dataDic.value, res.data);
          if (dataDic.value.address_book_id) {
            systemStore.pageDic = res.data.phoneDic;
          }
        }
      });
    }
    function switchVoid() {
      dataDic.value.replacement.open = !dataDic.value.replacement.open;
    }
    const ssAlert = common_vendor.ref();
    function commitVoid() {
      if (dataDic.value.state == 30) {
        return common_ssSuperModules_superConfig.msg("严重违规,请联系客服");
      }
      if (!dataDic.value.content) {
        return common_ssSuperModules_superConfig.msg("请输入物品的描述");
      }
      if (dataDic.value.images.length == 0) {
        return common_ssSuperModules_superConfig.msg("请上传物品图片");
      }
      if (dataDic.value.trade_type == 1 && !dataDic.value.address_name) {
        return common_ssSuperModules_superConfig.msg("请选择物品所在的地址");
      }
      if (!selectPhone.value) {
        return common_ssSuperModules_superConfig.msg("请选择联系方式");
      }
      if (selectPhone.value) {
        dataDic.value.address_book_id = selectPhone.value._id;
      }
      if (dataDic.value.tags.length == 0) {
        return common_ssSuperModules_superConfig.msg("请选择标签");
      }
      if (!isNaN(dataDic.value.price) && dataDic.value.price > 0) {
        dataDic.value.price = parseFloat(dataDic.value.price);
      } else {
        dataDic.value.price = 0;
      }
      if (dataDic.value._id) {
        secondApi.edit(dataDic.value).then((res) => {
          ssAlert.value.showModalDic({
            show: true,
            title: "修改成功",
            confirmText: "确定",
            showCancel: false,
            content: "",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateBack();
              }
            }
          });
        });
      } else {
        secondApi.add(dataDic.value).then((res) => {
          ssAlert.value.showModalDic({
            show: true,
            title: "提交成功",
            confirmText: "确定",
            showCancel: false,
            content: "",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateBack();
              }
            }
          });
        });
      }
    }
    function chooseMap() {
      common_vendor.index.chooseLocation({
        success: function(e) {
          console.log(e);
          dataDic.value.address = e.address;
          dataDic.value.address_name = e.name;
          dataDic.value.gps["latitude"] = e.latitude;
          dataDic.value.gps["longitude"] = e.longitude;
        }
      });
    }
    function deleteImg(e) {
      const item = dataDic.value.images[e];
      dataDic.value.images.splice(e, 1);
      if (dataDic.value.cover == item.url) {
        common_ssSuperModules_superConfig.msg("封面图也被删除了");
      }
      const dic = {
        cover: dataDic.value.cover,
        images: dataDic.value.images,
        _id: dataDic.value._id
      };
      secondApi.edit(dic);
      mediaApi.remove([item]);
    }
    function navToAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/newsArticle/selectAddressBook/selectAddressBook"
      });
    }
    function clearPhone() {
      console.log("ppp");
      systemStore.pageDic = "";
    }
    function deleteVoid() {
      ssAlert.value.showModalDic({
        show: true,
        title: "确定删除",
        confirmText: "删除",
        showCancel: true,
        content: "",
        success: (e) => {
          if (e.confirm) {
            secondApi.remove(dataDic.value._id).then((res) => {
              common_vendor.index.navigateBack();
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        b: common_vendor.t(dataDic.value.sys_msg)
      } : {}, {
        c: dataDic.value.content,
        d: common_vendor.o(($event) => dataDic.value.content = $event.detail.value),
        e: common_vendor.o(deleteImg),
        f: common_vendor.o(($event) => dataDic.value.images = $event),
        g: common_vendor.o(($event) => dataDic.value.cover = $event),
        h: common_vendor.p({
          canFile: false,
          canVideo: false,
          type: "二手市场",
          maxCount: "9",
          fixH: "40",
          mediaArr: dataDic.value.images,
          cover: dataDic.value.cover
        }),
        i: common_vendor.o(($event) => dataDic.value.model = $event),
        j: common_vendor.p({
          mode: "button",
          localdata: [{
            text: "出售",
            value: 0
          }, {
            text: "求购",
            value: 1
          }],
          modelValue: dataDic.value.model
        }),
        k: dataDic.value.model == 0
      }, dataDic.value.model == 0 ? common_vendor.e({
        l: dataDic.value.price,
        m: common_vendor.o(($event) => dataDic.value.price = $event.detail.value),
        n: !dataDic.value.replacement.open
      }, !dataDic.value.replacement.open ? {
        o: common_vendor.p({
          type: "circle",
          color: "#999",
          size: "20"
        })
      } : {
        p: common_vendor.p({
          type: "checkbox-filled",
          color: "#00755C",
          size: "20"
        })
      }, {
        q: common_vendor.o(switchVoid)
      }) : {}, {
        r: dataDic.value.model == 1
      }, dataDic.value.model == 1 ? {
        s: dataDic.value.price,
        t: common_vendor.o(($event) => dataDic.value.price = $event.detail.value)
      } : {}, {
        v: dataDic.value.replacement.open
      }, dataDic.value.replacement.open ? {
        w: dataDic.value.replacement.content,
        x: common_vendor.o(($event) => dataDic.value.replacement.content = $event.detail.value)
      } : {}, {
        y: dataDic.value.model == 0
      }, dataDic.value.model == 0 ? {
        z: common_vendor.o(($event) => dataDic.value.trade_type = $event),
        A: common_vendor.p({
          mode: "button",
          localdata: [{
            text: "包邮",
            value: 0
          }, {
            text: "自提",
            value: 1
          }],
          modelValue: dataDic.value.trade_type
        })
      } : {}, {
        B: dataDic.value.address_name,
        C: common_vendor.o(($event) => dataDic.value.address_name = $event.detail.value),
        D: common_vendor.p({
          type: "location-filled",
          size: "20",
          color: "#00755C"
        }),
        E: common_vendor.o(chooseMap),
        F: common_vendor.o(($event) => dataDic.value.tags = $event),
        G: common_vendor.p({
          value: "text",
          localdata: common_vendor.unref(contantStore).secondClassArr,
          selectArr: dataDic.value.tags
        }),
        H: !selectPhone.value
      }, !selectPhone.value ? {
        I: common_vendor.o(($event) => navToAddress())
      } : {
        J: common_vendor.t(selectPhone.value.name),
        K: common_vendor.o(($event) => navToAddress()),
        L: common_vendor.o(clearPhone)
      }, {
        M: common_vendor.p({
          type: "right"
        }),
        N: dataDic.value._id
      }, dataDic.value._id ? {
        O: common_vendor.o(($event) => dataDic.value.state = $event),
        P: common_vendor.p({
          clear: false,
          localdata: sallStateArr,
          modelValue: dataDic.value.state
        })
      } : {}, {
        Q: common_vendor.o(deleteVoid),
        R: common_vendor.o(($event) => commitVoid()),
        S: common_vendor.sr(ssAlert, "c78c6752-9", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/secondShop/add.vue"]]);
wx.createPage(MiniProgramPage);
