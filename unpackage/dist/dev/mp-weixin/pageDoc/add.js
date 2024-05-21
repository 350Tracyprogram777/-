"use strict";
const common_vendor = require("../common/vendor.js");
const common_ssSuperModules_superConfig = require("../common/ss-superModules/superConfig.js");
require("../store/index.js");
const store_modules_user = require("../store/modules/user.js");
const store_modules_system = require("../store/modules/system.js");
if (!Array) {
  const _easycom_ss_upimage2 = common_vendor.resolveComponent("ss-upimage");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_upimage2 + _easycom_uni_data_picker2 + _easycom_uni_icons2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_upimage = () => "../components/ss-upimage/ss-upimage.js";
const _easycom_uni_data_picker = () => "../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ss_twoAlert = () => "../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_upimage + _easycom_uni_data_picker + _easycom_uni_icons + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const docApi = common_vendor.Ws.importObject("user-doc");
    const mediaApi = common_vendor.Ws.importObject("media");
    common_vendor.ref(false);
    const classArr = common_vendor.ref([]);
    store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    const selectPhone = common_vendor.computed(() => systemStore.pageDic);
    const dataDic = common_vendor.ref({
      user_id: "",
      hider: false,
      images: [],
      cover: "",
      sys_msg: "",
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
      mode: 1,
      address_book_id: "",
      password: "",
      password_msg: ""
    });
    common_vendor.onLoad((e) => {
      getBaseData();
      if (e.docId) {
        dataDic.value["_id"] = e.docId;
        getDetail();
      }
      systemStore.pageDic = "";
    });
    function getDetail() {
      docApi.doc(dataDic.value._id).then((res) => {
        console.log(res);
        if (res.errCode == 0) {
          Object.assign(dataDic.value, res.data);
        }
      });
    }
    function getBaseData() {
      docApi.getClass().then((res) => {
        classArr.value = res.data;
      });
    }
    const ssAlert = common_vendor.ref();
    function commitVoid() {
      if (!dataDic.value.content) {
        return common_ssSuperModules_superConfig.msg("请输入资料的介绍");
      }
      if (!dataDic.value.category_id) {
        return common_ssSuperModules_superConfig.msg("请选择分类");
      }
      dataDic.value.password = dataDic.value.password.trim();
      dataDic.value.password_msg = dataDic.value.password_msg.trim();
      if (dataDic.value.password && !dataDic.value.password_msg) {
        return common_ssSuperModules_superConfig.msg("请输入获取密码的提示");
      }
      if (selectPhone.value) {
        dataDic.value.address_book_id = selectPhone.value._id;
      }
      if (dataDic.value._id) {
        docApi.edit(dataDic.value).then((res) => {
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
        docApi.add(dataDic.value).then((res) => {
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
      docApi.edit(dic);
      mediaApi.remove([item]);
    }
    function navToAddress() {
      if (selectPhone.value) {
        common_vendor.index.navigateTo({
          url: "/pages/newsArticle/selectAddressBook/selectAddressBook"
        });
        return;
      }
      ssAlert.value.showModalDic({
        show: true,
        title: "添加联系方式后,其他人将可以联系到您",
        confirmText: "确定",
        showCancel: true,
        content: "",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.navigateTo({
              url: "/pages/newsArticle/selectAddressBook/selectAddressBook"
            });
          }
        }
      });
    }
    function clearPhone() {
      console.log("ppp");
      systemStore.pageDic = "";
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
          type: "资料库",
          maxCount: "18",
          fixH: "40",
          showDocStyle: true,
          mediaArr: dataDic.value.images,
          cover: dataDic.value.cover
        }),
        i: common_vendor.o(($event) => dataDic.value.category_id = $event),
        j: common_vendor.p({
          clearIcon: false,
          border: false,
          mode: "tag",
          localdata: classArr.value,
          modelValue: dataDic.value.category_id
        }),
        k: dataDic.value.password,
        l: common_vendor.o(($event) => dataDic.value.password = $event.detail.value),
        m: dataDic.value.password.length > 6
      }, dataDic.value.password.length > 6 ? {
        n: dataDic.value.password_msg,
        o: common_vendor.o(($event) => dataDic.value.password_msg = $event.detail.value)
      } : {}, {
        p: !selectPhone.value
      }, !selectPhone.value ? {
        q: common_vendor.o(($event) => navToAddress())
      } : {
        r: common_vendor.t(selectPhone.value.name),
        s: common_vendor.o(($event) => navToAddress()),
        t: common_vendor.o(clearPhone)
      }, {
        v: common_vendor.p({
          type: "right"
        }),
        w: common_vendor.o(($event) => commitVoid()),
        x: common_vendor.sr(ssAlert, "554822db-3", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pageDoc/add.vue"]]);
wx.createPage(MiniProgramPage);
