"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_system = require("../../store/modules/system.js");
if (!Array) {
  const _easycom_ss_upimage2 = common_vendor.resolveComponent("ss-upimage");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_upimage2 + _easycom_uni_data_picker2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_upimage = () => "../../components/ss-upimage/ss-upimage.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_upimage + _easycom_uni_data_picker + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    const wxGroupkApi = common_vendor.Ws.importObject("wx-group");
    common_vendor.Ws.importObject("wxapi");
    const mediaApi = common_vendor.Ws.importObject("media");
    const classArr = common_vendor.ref([]);
    const userInfo = common_vendor.computed(() => userStore.userInfo);
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
    common_vendor.onLoad((e) => {
      console.log("-------", userInfo.value._id, userInfo.value.role.includes("communityAdmin"));
      if (userInfo.value._id && userInfo.value.role.includes("communityAdmin")) {
        if (e.groupId) {
          dataDic.value["_id"] = e.groupId;
          getDetail();
        } else {
          getWxGroup();
        }
        getBaseData();
      } else {
        common_vendor.index.switchTab({
          url: "/pages/tabar/main"
        });
      }
    });
    function getBaseData() {
      wxGroupkApi.getClass({ role: userInfo.value.role }).then((res) => {
        classArr.value = res.data;
      });
    }
    function getDetail() {
      wxGroupkApi.doc(dataDic.value._id).then((res) => {
        Object.assign(dataDic.value, res.data);
      });
    }
    function getWxGroup() {
      systemStore.getWxGroup().then((res) => {
        console.log("微信圈", res);
        dataDic.value.opengid = res;
      });
    }
    const ssAlert = common_vendor.ref();
    common_vendor.ref();
    function commitVoid() {
      if (!dataDic.value.name) {
        return common_ssSuperModules_superConfig.msg("请输入群名称");
      }
      if (!dataDic.value.remark) {
        return common_ssSuperModules_superConfig.msg("请输入群说明");
      }
      if (!dataDic.value.group_owner_wx) {
        return common_ssSuperModules_superConfig.msg("请输入群主微信");
      }
      if (!dataDic.value.category_id) {
        return common_ssSuperModules_superConfig.msg("请选择分类");
      }
      if (dataDic.value._id) {
        wxGroupkApi.edit(dataDic.value).then((res) => {
          ssAlert.value.showModalDic({
            show: true,
            title: "修改成功",
            confirmText: "确定",
            showCancel: false,
            content: "",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.redirectTo({
                  url: "/pageAdmin/wxGroup/list"
                });
              }
            }
          });
        });
      } else {
        wxGroupkApi.add(dataDic.value).then((res) => {
          ssAlert.value.showModalDic({
            show: true,
            title: "提交成功",
            confirmText: "确定",
            showCancel: false,
            content: "",
            success: (e) => {
              if (e.confirm) {
                common_vendor.index.redirectTo({
                  url: "/pageAdmin/wxGroup/list"
                });
              }
            }
          });
        });
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
      wxGroupkApi.edit(dic);
      mediaApi.remove([item]);
    }
    function delectVoid() {
      ssAlert.value.showModalDic({
        show: true,
        title: "删除",
        confirmText: "确定",
        showCancel: true,
        cancelText: "取消",
        content: "",
        success: (res) => {
          if (res.confirm) {
            wxGroupkApi.remove(dataDic.value._id).then((res2) => {
              common_ssSuperModules_superConfig.msg("删除成功");
              setTimeout(function() {
                common_vendor.index.navigateBack();
              }, 300);
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(deleteImg),
        b: common_vendor.o(($event) => dataDic.value.images = $event),
        c: common_vendor.o(($event) => dataDic.value.cover = $event),
        d: common_vendor.p({
          type: "微信群",
          maxCount: "1",
          fixH: "140",
          canFile: false,
          canVideo: false,
          wxType: "image",
          mediaArr: dataDic.value.images,
          cover: dataDic.value.cover
        }),
        e: dataDic.value.opengid,
        f: common_vendor.o(($event) => dataDic.value.opengid = $event.detail.value),
        g: dataDic.value.name,
        h: common_vendor.o(($event) => dataDic.value.name = $event.detail.value),
        i: dataDic.value.remark,
        j: common_vendor.o(($event) => dataDic.value.remark = $event.detail.value),
        k: dataDic.value.group_owner_wx,
        l: common_vendor.o(($event) => dataDic.value.group_owner_wx = $event.detail.value),
        m: common_vendor.o(($event) => dataDic.value.category_id = $event),
        n: common_vendor.p({
          mode: "tag",
          localdata: classArr.value,
          modelValue: dataDic.value.category_id
        }),
        o: common_vendor.o(delectVoid),
        p: common_vendor.o(($event) => commitVoid()),
        q: common_vendor.sr(ssAlert, "2e9051c1-2", {
          "k": "ssAlert"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageAdmin/wxGroup/add.vue"]]);
wx.createPage(MiniProgramPage);
