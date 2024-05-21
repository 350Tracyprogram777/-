"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Array) {
  const _easycom_ss_upimage2 = common_vendor.resolveComponent("ss-upimage");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_ss_yingsi2 = common_vendor.resolveComponent("ss-yingsi");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_upimage2 + _easycom_uni_icons2 + _easycom_uni_data_checkbox2 + _easycom_uni_data_picker2 + _easycom_ss_yingsi2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_upimage = () => "../../components/ss-upimage/ss-upimage.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_ss_yingsi = () => "../../components/ss-yingsi/ss-yingsi.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_upimage + _easycom_uni_icons + _easycom_uni_data_checkbox + _easycom_uni_data_picker + _easycom_ss_yingsi + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const addressBookApi = common_vendor.Ws.importObject("address-book");
    const mediaApi = common_vendor.Ws.importObject("media");
    common_vendor.ref(false);
    const classArr = common_vendor.ref([]);
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const dataDic = common_vendor.ref({
      community_id: "",
      user_id: "",
      images: [],
      cover: "",
      sys_msg: "",
      name: "",
      phone: "",
      wx: "",
      other: [],
      remark: "",
      address: "",
      address_name: "",
      gps: { latitude: 0, longitude: 0 },
      state: 0,
      category_id: 0,
      create_date: "",
      open: true
    });
    common_vendor.onLoad((e) => {
      getBaseData();
      if (e.addressId) {
        dataDic.value["_id"] = e.addressId;
        addressBookApi.doc(e.addressId).then((res) => {
          if (res.errCode == 0) {
            Object.assign(dataDic.value, res.data);
          }
        });
      }
    });
    function getBaseData() {
      addressBookApi.getClass({ role: userInfo.value.role }).then((res) => {
        classArr.value = res.data;
      });
    }
    const ssAlert = common_vendor.ref();
    const xieyi = common_vendor.ref();
    function commitVoid() {
      if (!dataDic.value.name) {
        return common_ssSuperModules_superConfig.msg("请输入姓名");
      }
      if (dataDic.value.phone.lenght == 11 || dataDic.value.phone.lenght >= 6) {
        return common_ssSuperModules_superConfig.msg("请输入有效的电话");
      }
      if (!dataDic.value.category_id) {
        return common_ssSuperModules_superConfig.msg("请选择分类");
      }
      if (!dataDic.value.state == 30) {
        return common_ssSuperModules_superConfig.msg("严重违规,请联系客服");
      }
      if (!xieyi.value.isAgree) {
        return common_ssSuperModules_superConfig.msg("请阅读并同意用户隐私服务协议");
      }
      dataDic.value.other = dataDic.value.other.filter(function(a, b) {
        if (a.phone.lenght == 11 || a.phone >= 6) {
          return true;
        }
      });
      if (dataDic.value._id) {
        addressBookApi.edit(dataDic.value).then((res) => {
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
        addressBookApi.add(dataDic.value).then((res) => {
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
    function addOtherPhone() {
      dataDic.value.other.push({ phone: "", name: "" });
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
      addressBookApi.edit(dic);
      mediaApi.remove([item]);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.state == 30 && dataDic.value.sys_msg
      }, dataDic.value.state == 30 && dataDic.value.sys_msg ? {
        b: common_vendor.t(dataDic.value.sys_msg)
      } : {}, {
        c: common_vendor.o(deleteImg),
        d: common_vendor.o(($event) => dataDic.value.images = $event),
        e: common_vendor.o(($event) => dataDic.value.cover = $event),
        f: common_vendor.p({
          type: "通讯录",
          maxCount: "9",
          fixH: "140",
          canFile: false,
          canVideo: false,
          wxType: "image",
          mediaArr: dataDic.value.images,
          cover: dataDic.value.cover
        }),
        g: dataDic.value.name,
        h: common_vendor.o(($event) => dataDic.value.name = $event.detail.value),
        i: dataDic.value.phone,
        j: common_vendor.o(($event) => dataDic.value.phone = $event.detail.value),
        k: common_vendor.o(addOtherPhone),
        l: common_vendor.p({
          type: "plus",
          size: "22",
          color: "#999"
        }),
        m: common_vendor.f(dataDic.value.other, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 2),
            b: item.phone,
            c: common_vendor.o(($event) => item.phone = $event.detail.value, index),
            d: index
          };
        }),
        n: dataDic.value.wx,
        o: common_vendor.o(($event) => dataDic.value.wx = $event.detail.value),
        p: dataDic.value.remark,
        q: common_vendor.o(($event) => dataDic.value.remark = $event.detail.value),
        r: dataDic.value.address_name,
        s: common_vendor.o(($event) => dataDic.value.address_name = $event.detail.value),
        t: common_vendor.p({
          type: "location-filled",
          color: "#999"
        }),
        v: common_vendor.o(chooseMap),
        w: common_vendor.o(($event) => dataDic.value.open = $event),
        x: common_vendor.p({
          localdata: [{
            text: "是",
            value: true
          }, {
            text: "否",
            value: false
          }],
          modelValue: dataDic.value.open
        }),
        y: common_vendor.o(($event) => dataDic.value.category_id = $event),
        z: common_vendor.p({
          clearIcon: false,
          border: false,
          localdata: classArr.value,
          modelValue: dataDic.value.category_id
        }),
        A: dataDic.value._id
      }, dataDic.value._id ? {
        B: common_vendor.o(($event) => dataDic.value.state = $event),
        C: common_vendor.p({
          localdata: [{
            text: "正常",
            value: 0
          }, {
            text: "下架",
            value: 1
          }],
          modelValue: dataDic.value.state
        })
      } : {}, {
        D: common_vendor.sr(xieyi, "4b082ae4-6", {
          "k": "xieyi"
        }),
        E: common_vendor.p({
          titleArr: ["《用户服务协议和隐私政策》"]
        }),
        F: common_vendor.o(($event) => commitVoid()),
        G: common_vendor.sr(ssAlert, "4b082ae4-7", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/addressBook/add.vue"]]);
wx.createPage(MiniProgramPage);
