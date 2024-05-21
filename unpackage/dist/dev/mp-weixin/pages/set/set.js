"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const _sfc_main = {
  __name: "set",
  setup(__props) {
    const sysApi = common_vendor.Ws.importObject("system-test");
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    common_vendor.onLoad(() => {
      sysApi.getClass().then((res) => {
        console.log(res);
        for (let item of res.data) {
        }
      });
      getPhone({ text: "宽带", value: "6322c30c4c97840001724025" });
    });
    function getPhone(classDic) {
      const url = `https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(34.784816,113.971746,2500)&page_size=20&page_index=1&keyword=${classDic.text}&key=FAJBZ-ZHOC2-G2PUI-C6KJU-RSMG2-QCFVG`;
      common_vendor.index.request({
        url,
        method: "GET",
        success: function(res) {
          if (res.statusCode == 200) {
            let arr = [];
            for (let item of res.data.data) {
              if (!item.tel) {
                continue;
              }
              const phones = item.tel.split(";");
              let other = [];
              if (phones.length > 1) {
                for (let i = 1; i < phones.length; i++) {
                  other.push({ name: "", phone: phones[i] });
                }
              }
              let dic = {
                _id: item.id,
                community_id: "",
                user_id: "admin",
                images: [],
                cover: "",
                sys_msg: "",
                name: item.title,
                phone: item.tel.split(";")[0],
                other,
                remark: "数据来自腾讯地图",
                address: item.address,
                address_name: item.title,
                gps: {
                  latitude: item.location.lat,
                  longitude: item.location.lng
                },
                state: 0,
                class: 10,
                category_id: classDic.value,
                create_date: (/* @__PURE__ */ new Date()).getTime()
              };
              arr.push(dic);
            }
            console.log(classDic.text, arr);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {};
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/set/set.vue"]]);
wx.createPage(MiniProgramPage);
