"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const pages_houseRent_contant = require("./contant.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Array) {
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_combox2 = common_vendor.resolveComponent("uni-combox");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ss_upimage2 = common_vendor.resolveComponent("ss-upimage");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_data_checkbox2 + _easycom_uni_combox2 + _easycom_uni_icons2 + _easycom_ss_upimage2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_combox = () => "../../uni_modules/uni-combox/components/uni-combox/uni-combox.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ss_upimage = () => "../../components/ss-upimage/ss-upimage.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_data_checkbox + _easycom_uni_combox + _easycom_uni_icons + _easycom_ss_upimage + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const houseRentApi = common_vendor.Ws.importObject("house-rent");
    const mediaApi = common_vendor.Ws.importObject("media");
    const wxApi = common_vendor.Ws.importObject("wxapi");
    const userStore = store_modules_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    common_vendor.onLoad((e) => {
      if (e.houseId) {
        dataDic.value["_id"] = e.houseId;
        houseRentApi.doc(e.houseId).then((res) => {
          if (res.errCode == 0) {
            Object.assign(dataDic.value, res.data);
          }
        });
      } else {
        dataDic.value.phone = userInfo.value.mobile || "";
      }
    });
    const dataDic = common_vendor.ref({
      phone: "",
      //联系电话
      rent_pay_cycle: "押一付三",
      sall_pay_cycle: "全款",
      contacts: "",
      //联系人
      sall_rent_type: 0,
      //租售类型
      rent_type: 0,
      //出租类型 整租 合租
      strata_fee: "0",
      house_class: 0,
      //住宅/大平层/商铺/别墅
      main_room_type: 0,
      //是不是主卧
      rent_duration: 3,
      rent_duration_type: 0,
      life_type: 0,
      //民用 水电煤
      price: "",
      //价格
      address: "",
      address_name: "",
      house_room: "",
      house_play: "",
      house_toilet: "",
      have_car: 0,
      //车位
      car_price: "0",
      //车位费
      gps: { latitude: "", longitude: "" },
      house_class: 0,
      build: "",
      unit: "",
      number: "",
      floor: "",
      total_floor: "",
      area: "",
      toward: 2,
      //房屋朝向
      house_set: [],
      repair_mode: 2,
      create_date: "",
      remark: "",
      user_id: "",
      images: [],
      state: 0,
      elevator: "",
      family: "",
      cover: ""
    });
    const ssAlert = common_vendor.ref();
    function commitVoid() {
      const mustArr = [
        "address",
        "address_name",
        "phone",
        //手机号
        "contacts",
        //联系人
        "strata_fee",
        //物业费
        "price",
        //价格
        "house_room",
        //几室
        "house_play",
        //几厅
        "house_toilet",
        //几卫
        "build",
        //几栋
        "unit",
        //几单元
        "floor",
        //几层
        "total_floor",
        //总层
        "area",
        //面积
        "elevator",
        //几梯
        "family"
        //几户
      ];
      let isEmpty = false;
      for (let key of mustArr) {
        if (dataDic.value[key] == "") {
          console.log(key);
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) {
        common_ssSuperModules_superConfig.msg("请完善信息");
        return;
      }
      if (dataDic.value.sall_rent_type == 0 && !dataDic.value.rent_pay_cycle) {
        return common_ssSuperModules_superConfig.msg("请输入付款周期");
      }
      if (dataDic.value.sall_rent_type == 1 && !dataDic.value.sall_pay_cycle) {
        return common_ssSuperModules_superConfig.msg("请输入结算方式");
      }
      if (dataDic.value.rent_duration_type == 1 && !dataDic.value.rent_duration) {
        common_ssSuperModules_superConfig.msg("请输入短租时长");
        return;
      }
      if (dataDic.value.have_car == 1 && !dataDic.value.car_price) {
        common_ssSuperModules_superConfig.msg("请输入停车费");
        return;
      }
      console.log(dataDic.value);
      if (dataDic.value.house_set.length == 0) {
        common_ssSuperModules_superConfig.msg("请完善房间设施信息");
        return;
      }
      if (dataDic.value.repair_mode != 0 && dataDic.value.house_set.length == 0) {
        common_ssSuperModules_superConfig.msg("请完善房间设施信息");
        return;
      }
      if (dataDic.value.images.length == 0) {
        common_ssSuperModules_superConfig.msg("至少传一张实景照片");
        return;
      }
      if (dataDic.value.images.length > 0 && !dataDic.value.cover) {
        dataDic.value.cover = dataDic.value.images[0]["url"];
      }
      if (dataDic.value._id) {
        houseRentApi.edit(dataDic.value).then((res) => {
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
        houseRentApi.add(dataDic.value).then((res) => {
          ssAlert.value.showModalDic({
            show: true,
            title: "发布成功",
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
        },
        complete: function(err) {
          console.log(err);
        }
      });
    }
    const popView = common_vendor.ref();
    function showPop() {
      popView.value.open();
    }
    function hidePop() {
      popView.value.close();
    }
    function selectSetItem(e) {
      if (dataDic.value.house_set.includes(e)) {
        const a = dataDic.value.house_set.indexOf(e);
        dataDic.value.house_set.splice(a, 1);
      } else {
        dataDic.value.house_set.push(e);
      }
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
      houseRentApi.edit(dic);
      mediaApi.remove([item]);
    }
    function getPhone(e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wxApi.getWxPhone(e.detail.code).then((res) => {
          console.log(res);
          if (res.errCode == 0) {
            dataDic.value.phone = res.data;
          } else {
            common_ssSuperModules_superConfig.msg("请重试");
          }
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.state == 30
      }, dataDic.value.state == 30 ? {
        b: common_vendor.t(dataDic.value.sys_msg)
      } : {}, {
        c: common_vendor.o(($event) => dataDic.value.sall_rent_type = $event),
        d: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).sall_rent_type_localdata,
          modelValue: dataDic.value.sall_rent_type
        }),
        e: common_vendor.o(($event) => dataDic.value.rent_type = $event),
        f: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).rent_type_localdata,
          modelValue: dataDic.value.rent_type
        }),
        g: dataDic.value.sall_rent_type == 0,
        h: common_vendor.o(($event) => dataDic.value.main_room_type = $event),
        i: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).main_room_type_localdata,
          modelValue: dataDic.value.main_room_type
        }),
        j: dataDic.value.rent_type == 1,
        k: common_vendor.o(($event) => dataDic.value.rent_duration_type = $event),
        l: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).rent_duration_type_localdata,
          modelValue: dataDic.value.rent_duration_type
        }),
        m: dataDic.value.rent_duration,
        n: common_vendor.o(($event) => dataDic.value.rent_duration = $event.detail.value),
        o: dataDic.value.rent_duration_type == 1,
        p: dataDic.value.sall_rent_type == 0,
        q: common_vendor.o(($event) => dataDic.value.rent_pay_cycle = $event),
        r: common_vendor.p({
          border: false,
          candidates: common_vendor.unref(pages_houseRent_contant.formOptions).rent_pay_cycle_localdata,
          modelValue: dataDic.value.rent_pay_cycle
        }),
        s: dataDic.value.sall_rent_type == 0,
        t: common_vendor.o(($event) => dataDic.value.sall_pay_cycle = $event),
        v: common_vendor.p({
          candidates: common_vendor.unref(pages_houseRent_contant.formOptions).sall_pay_cycle_localdata,
          modelValue: dataDic.value.sall_pay_cycle
        }),
        w: dataDic.value.sall_rent_type == 1,
        x: dataDic.value.area,
        y: common_vendor.o(($event) => dataDic.value.area = $event.detail.value),
        z: dataDic.value.price,
        A: common_vendor.o(($event) => dataDic.value.price = $event.detail.value),
        B: dataDic.value.sall_rent_type == 0,
        C: dataDic.value.price,
        D: common_vendor.o(($event) => dataDic.value.price = $event.detail.value),
        E: dataDic.value.sall_rent_type == 1,
        F: dataDic.value.contacts,
        G: common_vendor.o(($event) => dataDic.value.contacts = $event.detail.value),
        H: dataDic.value.phone,
        I: common_vendor.o(($event) => dataDic.value.phone = $event.detail.value),
        J: common_vendor.o(getPhone),
        K: !dataDic.value.address_name
      }, !dataDic.value.address_name ? {
        L: common_vendor.t("选择位置")
      } : {
        M: common_vendor.t(dataDic.value.address_name)
      }, {
        N: common_vendor.p({
          type: "location-filled",
          color: "#00755C",
          size: "26"
        }),
        O: common_vendor.o(chooseMap),
        P: dataDic.value.house_room,
        Q: common_vendor.o(($event) => dataDic.value.house_room = $event.detail.value),
        R: dataDic.value.house_play,
        S: common_vendor.o(($event) => dataDic.value.house_play = $event.detail.value),
        T: dataDic.value.house_toilet,
        U: common_vendor.o(($event) => dataDic.value.house_toilet = $event.detail.value),
        V: dataDic.value.build,
        W: common_vendor.o(($event) => dataDic.value.build = $event.detail.value),
        X: dataDic.value.unit,
        Y: common_vendor.o(($event) => dataDic.value.unit = $event.detail.value),
        Z: dataDic.value.total_floor,
        aa: common_vendor.o(($event) => dataDic.value.total_floor = $event.detail.value),
        ab: dataDic.value.floor,
        ac: common_vendor.o(($event) => dataDic.value.floor = $event.detail.value),
        ad: common_vendor.o(($event) => dataDic.value.repair_mode = $event),
        ae: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).repair_mode_localdata,
          modelValue: dataDic.value.repair_mode
        }),
        af: common_vendor.o(($event) => dataDic.value.toward = $event),
        ag: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).toward_localdata,
          modelValue: dataDic.value.toward
        }),
        ah: dataDic.value.elevator,
        ai: common_vendor.o(($event) => dataDic.value.elevator = $event.detail.value),
        aj: dataDic.value.family,
        ak: common_vendor.o(($event) => dataDic.value.family = $event.detail.value),
        al: common_vendor.o(($event) => dataDic.value.life_type = $event),
        am: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).life_type_localdata,
          modelValue: dataDic.value.life_type
        }),
        an: common_vendor.o(($event) => dataDic.value.have_car = $event),
        ao: common_vendor.p({
          mode: "tag",
          localdata: common_vendor.unref(pages_houseRent_contant.formOptions).have_car_localdata,
          modelValue: dataDic.value.have_car
        }),
        ap: dataDic.value.price,
        aq: common_vendor.o(($event) => dataDic.value.price = $event.detail.value),
        ar: dataDic.value.have_car == 1 && dataDic.value.sall_rent_type == 0,
        as: dataDic.value.strata_fee,
        at: common_vendor.o(($event) => dataDic.value.strata_fee = $event.detail.value),
        av: common_vendor.o(showPop),
        aw: common_vendor.p({
          type: "right",
          color: "#999"
        }),
        ax: dataDic.value.house_set.length > 0
      }, dataDic.value.house_set.length > 0 ? {
        ay: common_vendor.f(dataDic.value.house_set, (item, index, i0) => {
          return {
            a: common_vendor.n(item.value),
            b: index
          };
        })
      } : {}, {
        az: common_vendor.o(deleteImg),
        aA: common_vendor.o(($event) => dataDic.value.images = $event),
        aB: common_vendor.o(($event) => dataDic.value.cover = $event),
        aC: common_vendor.p({
          cover: dataDic.value.cover,
          type: "租房",
          maxCount: "9",
          canFile: false,
          mediaArr: dataDic.value.images,
          cover: dataDic.value.cover
        }),
        aD: dataDic.value.remark,
        aE: common_vendor.o(($event) => dataDic.value.remark = $event.detail.value),
        aF: common_vendor.o(commitVoid),
        aG: common_vendor.f(common_vendor.unref(pages_houseRent_contant.formOptions).icon_localdata, (item, index, i0) => {
          return {
            a: common_vendor.n(item.value),
            b: common_vendor.t(item.text),
            c: common_vendor.o(($event) => selectSetItem(item), index),
            d: common_vendor.n(dataDic.value.house_set.includes(item) ? "set_s" : "set_n"),
            e: index
          };
        }),
        aH: common_vendor.o(hidePop),
        aI: common_vendor.sr(popView, "416b6fa0-13", {
          "k": "popView"
        }),
        aJ: common_vendor.sr(ssAlert, "416b6fa0-14", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/houseRent/add.vue"]]);
wx.createPage(MiniProgramPage);
