"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
const pages_houseRent_contant = require("./contant.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_ss_twoAlert2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons + _easycom_uni_popup + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const dataDic = common_vendor.ref({ _id: "" });
    const houseRentApi = common_vendor.Ws.importObject("house-rent");
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    const ssAlert = common_vendor.ref();
    common_vendor.onLoad((e) => {
      console.log(e);
      dataDic.value._id = e.houseId;
      getDetail();
    });
    function getDetail() {
      houseRentApi.doc(dataDic.value._id).then((res) => {
        console.log("详情", res);
        if (res.data.state == 0) {
          Object.assign(dataDic.value, res.data);
          let title = "";
          if (dataDic.value.sall_rent_type == 0) {
            title = "出租 · " + dataDic.value.address_name;
          } else {
            title = "出售 · " + dataDic.value.address_name;
          }
          common_vendor.index.setNavigationBarTitle({
            title
          });
        } else {
          ssAlert.value.showModalDic({
            show: true,
            title: "未找到,可能已被删除",
            confirmText: "确定",
            showCancel: false,
            cancelText: "",
            content: "",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.navigateBack();
              }
            }
          });
        }
      });
    }
    function openMap() {
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
    function getHouseMarker() {
      let dic = {
        id: 1,
        latitude: dataDic.value.gps.latitude,
        longitude: dataDic.value.gps.longitude,
        title: dataDic.value.address,
        callout: {
          content: dataDic.value.address_name,
          bgColor: "#FD7904",
          display: "ALWAYS",
          color: "#fff",
          borderRadius: 10,
          padding: 4
        }
      };
      return [dic];
    }
    function prewImg(index) {
      let arr = [];
      for (let item of dataDic.value.images) {
        arr.push(switchImageSize(item.url, 1e3));
      }
      common_vendor.index.previewImage({
        current: index,
        urls: arr
      });
    }
    function makePhone() {
      common_vendor.index.makePhoneCall({
        phoneNumber: dataDic.value.phone
      });
    }
    function collect() {
      const dic = {
        uni_id: dataDic.value._id,
        uni_data: dataDic.value
      };
      houseRentApi.favorite(dic).then((res) => {
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
        msg("请输入内容");
        return;
      }
      const dic = {
        uni_id: dataDic.value._id,
        content: reportDic.value.content,
        uni_data: dataDic.value
      };
      houseRentApi.report(dic).then((res) => {
        reportDic.value.content = "";
        msg(res.data);
        hidePop();
      });
    }
    common_vendor.onShareAppMessage((e) => {
      let name = "";
      if (dataDic.value.sall_rent_type == 0) {
        name = "出租 · " + dataDic.value.address_name;
      } else {
        name = "出售 · " + dataDic.value.address_name;
      }
      return {
        title: name,
        imageUrl: dataDic.value.cover,
        path: "pages/houseRent/detail?houseId=" + dataDic.value._id
      };
    });
    common_vendor.onShareTimeline((e) => {
      let name = "";
      if (dataDic.value.sall_rent_type == 0) {
        name = "出租 · " + dataDic.value.address_name;
      } else {
        name = "出售 · " + dataDic.value.address_name;
      }
      return {
        title: name,
        path: "pages/houseRent/detail?houseId=" + dataDic.value._id
      };
    });
    function switchImageSize(url, size = 500) {
      return url + `?x-oss-process=image/resize,h_${size},m_lfit`;
    }
    function switchVideoSize(imageurl) {
      return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
    }
    const playUrl = common_vendor.ref("");
    function playVideo(url) {
      playUrl.value = url;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dataDic.value.price
      }, dataDic.value.price ? common_vendor.e({
        b: common_vendor.f(dataDic.value.images, (item, index, i0) => {
          return common_vendor.e({
            a: item.fileType == "image"
          }, item.fileType == "image" ? {
            b: switchImageSize(item.url),
            c: common_vendor.o(($event) => prewImg(index), index)
          } : {}, {
            d: item.fileType == "video"
          }, item.fileType == "video" ? {
            e: switchVideoSize(item.url),
            f: _ctx.width,
            g: _ctx.height,
            h: common_vendor.o(($event) => playVideo(item.url), index)
          } : {}, {
            i: index
          });
        }),
        c: !_ctx.playState,
        d: dataDic.value.sall_rent_type == 1
      }, dataDic.value.sall_rent_type == 1 ? {} : {}, {
        e: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? common_vendor.e({
        f: dataDic.value.rent_type == 0
      }, dataDic.value.rent_type == 0 ? {} : {}, {
        g: dataDic.value.rent_type == 1
      }, dataDic.value.rent_type == 1 ? {} : {}) : {}, {
        h: common_vendor.t(dataDic.value.address_name),
        i: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? {
        j: common_vendor.t(dataDic.value.price)
      } : {}, {
        k: dataDic.value.sall_rent_type == 1
      }, dataDic.value.sall_rent_type == 1 ? {
        l: common_vendor.t(dataDic.value.price)
      } : {}, {
        m: common_vendor.t(dataDic.value.price),
        n: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? {} : {}, {
        o: dataDic.value.sall_rent_type == 1
      }, dataDic.value.sall_rent_type == 1 ? {} : {}, {
        p: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? common_vendor.e({
        q: dataDic.value.rent_duration_type == 1
      }, dataDic.value.rent_duration_type == 1 ? {} : {}, {
        r: dataDic.value.rent_duration_type == 0
      }, dataDic.value.rent_duration_type == 0 ? {
        s: common_vendor.t(dataDic.value.rent_duration)
      } : {}) : {}, {
        t: dataDic.value.sall_rent_type == 0
      }, dataDic.value.sall_rent_type == 0 ? {
        v: common_vendor.t(dataDic.value.rent_pay_cycle)
      } : {}, {
        w: dataDic.value.sall_rent_type == 1
      }, dataDic.value.sall_rent_type == 1 ? {
        x: common_vendor.t(dataDic.value.sall_pay_cycle)
      } : {}, {
        y: common_vendor.t(dataDic.value.strata_fee),
        z: dataDic.value.have_car == 0
      }, dataDic.value.have_car == 0 ? {} : {}, {
        A: common_vendor.p({
          date: dataDic.value.create_date,
          format: "yyyy/MM/dd"
        }),
        B: common_vendor.t(dataDic.value.house_room + "室" + dataDic.value.house_play + "厅" + dataDic.value.house_toilet + "卫"),
        C: common_vendor.t(dataDic.value.area),
        D: common_vendor.t(common_vendor.unref(pages_houseRent_contant.formOptions)["toward_localdata"][dataDic.value.toward]["text"]),
        E: common_vendor.t(dataDic.value.floor),
        F: common_vendor.t(dataDic.value.total_floor),
        G: common_vendor.t(dataDic.value.elevator),
        H: common_vendor.t(dataDic.value.family),
        I: common_vendor.t(common_vendor.unref(pages_houseRent_contant.formOptions)["repair_mode_localdata"][dataDic.value.repair_mode]["text"]),
        J: common_vendor.t(common_vendor.unref(pages_houseRent_contant.formOptions)["life_type_localdata"][dataDic.value.life_type]["text"]),
        K: dataDic.value.house_set.length >= 0
      }, dataDic.value.house_set.length >= 0 ? {
        L: common_vendor.f(dataDic.value.house_set, (item, index, i0) => {
          return {
            a: common_vendor.n(item.value),
            b: common_vendor.t(item.text),
            c: common_vendor.o(($event) => _ctx.selectSetItem(item), index),
            d: index
          };
        })
      } : {}, {
        M: dataDic.value.house_set.length == 0
      }, dataDic.value.house_set.length == 0 ? {} : {}, {
        N: common_vendor.t(dataDic.value.remark || "无"),
        O: common_vendor.o(($event) => openMap()),
        P: common_vendor.p({
          type: "paperplane",
          size: "22",
          color: "#00755C"
        }),
        Q: common_vendor.o(($event) => openMap()),
        R: common_vendor.o(($event) => openMap()),
        S: dataDic.value.gps.latitude,
        T: dataDic.value.gps.longitude,
        U: getHouseMarker(),
        V: common_vendor.o(($event) => reportClick()),
        W: !dataDic.value.collect
      }, !dataDic.value.collect ? {
        X: common_vendor.p({
          type: "star",
          size: "21",
          color: "#666"
        })
      } : {}, {
        Y: dataDic.value.collect
      }, dataDic.value.collect ? {
        Z: common_vendor.p({
          type: "star-filled",
          size: "21",
          color: "#00755C"
        })
      } : {}, {
        aa: common_vendor.o(($event) => collect()),
        ab: common_vendor.o(makePhone),
        ac: common_vendor.o(hidePop),
        ad: common_vendor.p({
          type: "close",
          color: "#999"
        }),
        ae: reportDic.value.content,
        af: common_vendor.o(($event) => reportDic.value.content = $event.detail.value),
        ag: common_vendor.o(($event) => commit()),
        ah: common_vendor.sr(addPop, "57bf4022-4", {
          "k": "addPop"
        }),
        ai: playUrl.value
      }, playUrl.value ? {
        aj: playUrl.value,
        ak: common_vendor.o(($event) => playVideo("")),
        al: common_vendor.p({
          type: "close",
          size: "30",
          color: "#eee",
          click: "m-t-10"
        })
      } : {}) : {}, {
        am: common_vendor.sr(ssAlert, "57bf4022-7", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/houseRent/detail.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
