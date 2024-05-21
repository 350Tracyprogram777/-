"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const common_ssSuperModules_superBase_superData = require("../../common/ss-superModules/superBase/superData.js");
if (!Array) {
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  _easycom_ss_twoAlert2();
}
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  _easycom_ss_twoAlert();
}
const _sfc_main = {
  __name: "userInfo",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const loginBackPage = common_vendor.computed(() => userStore.loginBackPage);
    const db = common_vendor.Ws.database();
    const usersTable = db.collection("uni-id-users");
    const wxApi = common_vendor.Ws.importObject("wxapi", {
      customUI: true
      // 取消自动展示的交互提示界面
    });
    const userApi = common_vendor.Ws.importObject("user-info");
    const mediaApi = common_vendor.Ws.importObject("media");
    common_vendor.onLoad(() => {
    });
    function inputChange(e) {
      userInfo.value.nickname = e.detail.value;
    }
    const ssAlert = common_vendor.ref();
    async function commitVoid() {
      console.log(userInfo.value);
      if (!userInfo.value.nickname) {
        common_ssSuperModules_superConfig.msg("昵称不能为空");
        return;
      }
      if (!userInfo.value.mobile) {
        common_ssSuperModules_superConfig.msg("手机号不能为空");
        return;
      }
      wxApi.msgSecCheck(userInfo.value.nickname, userInfo.value.wx_openid.mp).then((res) => {
        if (res.errCode == 0) {
          usersTable.where("_id==$env.uid").update({
            nickname: userInfo.value.nickname,
            gender: userInfo.value.gender
          }).then((e) => {
            userApi.bindPhone(userInfo.value.mobile).then((iphoneRes) => {
              if (iphoneRes.errCode == 0) {
                common_vendor.index.setStorageSync("uni_id_token", iphoneRes.data.token);
                common_vendor.index.setStorageSync("uni_id_token_expired", iphoneRes.data.tokenExpired);
              }
            });
            Object.assign(userInfo.value, {
              nickname: userInfo.value.nickname,
              gender: userInfo.value.gender,
              mobile: userInfo.value.mobile
            });
            ssAlert.value.showModalDic({
              show: true,
              title: "保存成功",
              confirmText: "确定",
              showCancel: false,
              cancelText: "",
              content: "",
              success: (e2) => {
                if (e2.confirm) {
                  if (loginBackPage.value) {
                    common_vendor.index.redirectTo({
                      url: loginBackPage.value
                    });
                    userStore.loginBackPage = "";
                  } else {
                    common_vendor.index.navigateBack();
                  }
                }
              }
            });
          });
        }
      }).catch((err) => {
        common_ssSuperModules_superConfig.msg("昵称不合规");
      });
    }
    function getPhone(e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wxApi.getWxPhone(e.detail.code).then((res) => {
          console.log(res);
          if (res.errCode == 0) {
            userInfo.value.mobile = res.data;
          } else {
            common_ssSuperModules_superConfig.msg("请重试");
          }
        });
      }
    }
    async function onChooseAvatar(e) {
      const {
        avatarUrl
      } = e.detail;
      const filename = "user_img_" + String((/* @__PURE__ */ new Date()).getTime()) + "." + avatarUrl.split(".").pop();
      let imgUrl = await common_ssSuperModules_superBase_superData.superData.superImgCloudRequest(avatarUrl, filename);
      const {
        data
      } = await wxApi.mediaCheckAsync(imgUrl, userInfo.value.wx_openid.mp);
      let filedata = {
        user_id: userInfo.value._id,
        type: "用户头像",
        name: filename,
        extname: avatarUrl.split(".").pop(),
        cloudPath: filename,
        fileType: "image",
        url: imgUrl,
        size: 100 * 1024,
        //单位是字节
        path: imgUrl,
        create_date: (/* @__PURE__ */ new Date()).getTime(),
        trace_id: data
      };
      mediaApi.add([filedata]);
      if (userInfo.value.avatar) {
        mediaApi.remove([{
          url: userInfo.value.avatar
        }]).then((res) => {
          console.log(res);
        });
      }
      usersTable.where("_id==$env.uid").update({
        avatar: imgUrl
      }).then((res) => {
        Object.assign(userInfo.value, {
          avatar: imgUrl
        });
        common_ssSuperModules_superConfig.msg("头像保存成功");
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onChooseAvatar),
        b: userInfo.value.avatar,
        c: common_vendor.o(inputChange),
        d: userInfo.value.nickname,
        e: common_vendor.o(($event) => userInfo.value.nickname = $event.detail.value),
        f: userInfo.value.mobile
      }, userInfo.value.mobile ? {
        g: common_vendor.t(userInfo.value.mobile)
      } : {}, {
        h: !userInfo.value.mobile
      }, !userInfo.value.mobile ? {} : {}, {
        i: common_vendor.o(getPhone),
        j: common_vendor.o(commitVoid),
        k: !userInfo.value.nickname || !userInfo.value.mobile
      }, !userInfo.value.nickname || !userInfo.value.mobile ? {} : {}, {
        l: common_vendor.sr(ssAlert, "e6a7f8be-0", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/set/userInfo.vue"]]);
wx.createPage(MiniProgramPage);
