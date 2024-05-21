"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const store_modules_system = require("../../store/modules/system.js");
if (!Array) {
  const _easycom_ss_upimage2 = common_vendor.resolveComponent("ss-upimage");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_ss_twoAlert2 = common_vendor.resolveComponent("ss-twoAlert");
  (_easycom_ss_upimage2 + _easycom_uni_icons2 + _easycom_uni_data_picker2 + _easycom_uni_data_checkbox2 + _easycom_ss_twoAlert2)();
}
const _easycom_ss_upimage = () => "../../components/ss-upimage/ss-upimage.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_ss_twoAlert = () => "../../uni_modules/ss-components/components/ss-twoAlert/ss-twoAlert.js";
if (!Math) {
  (_easycom_ss_upimage + _easycom_uni_icons + _easycom_uni_data_picker + _easycom_uni_data_checkbox + _easycom_ss_twoAlert)();
}
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const newsApi = common_vendor.Ws.importObject("news-article");
    const mediaApi = common_vendor.Ws.importObject("media");
    common_vendor.ref(false);
    const classArr = common_vendor.ref([]);
    const userStore = store_modules_user.useUserStore();
    const systemStore = store_modules_system.useSystemStore();
    const selectPhone = common_vendor.computed(() => systemStore.pageDic);
    const userInfo = common_vendor.computed(() => userStore.userInfo);
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
      address_book_id: ""
    });
    common_vendor.ref();
    common_vendor.onLoad((e) => {
      if (e.newsId) {
        dataDic.value["_id"] = e.newsId;
        getDetail();
      }
      systemStore.pageDic = "";
      getBaseData();
    });
    function getDetail() {
      newsApi.doc(dataDic.value._id).then((res) => {
        console.log(res);
        if (res.errCode == 0) {
          Object.assign(dataDic.value, res.data);
          if (dataDic.value.address_book_id) {
            systemStore.pageDic = res.data.phoneDic;
          }
        }
      });
    }
    function getBaseData() {
      newsApi.getClass({ role: userInfo.value.role }).then((res) => {
        classArr.value = res.data;
        if (!dataDic.value.category_id) {
          dataDic.value.category_id = classArr.value[0]["value"];
        }
      });
    }
    const ssAlert = common_vendor.ref();
    function commitVoid() {
      if (!dataDic.value.content) {
        return common_ssSuperModules_superConfig.msg("请输入要发表的内容");
      }
      if (!dataDic.value.category_id) {
        return common_ssSuperModules_superConfig.msg("请选择分类");
      }
      if (selectPhone.value) {
        dataDic.value.address_book_id = selectPhone.value._id;
      }
      if (dataDic.value.state == 30) {
        return common_ssSuperModules_superConfig.msg("严重违规,请联系客服");
      }
      if (dataDic.value._id) {
        newsApi.edit(dataDic.value).then((res) => {
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
        newsApi.add(dataDic.value).then((res) => {
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
      newsApi.edit(dic);
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
        title: "联系方式",
        confirmText: "确定",
        showCancel: true,
        content: "内容中禁止出现任何联系方式,这里添加联系方式,用户联系您会更方便!",
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
        a: dataDic.value.state == 30 && dataDic.value.sys_msg
      }, dataDic.value.state == 30 && dataDic.value.sys_msg ? {
        b: common_vendor.t(dataDic.value.sys_msg)
      } : {}, {
        c: dataDic.value.content,
        d: common_vendor.o(($event) => dataDic.value.content = $event.detail.value),
        e: common_vendor.o(deleteImg),
        f: common_vendor.o(($event) => dataDic.value.images = $event),
        g: common_vendor.o(($event) => dataDic.value.cover = $event),
        h: common_vendor.p({
          type: "新闻",
          maxCount: "9",
          fixH: "40",
          mediaArr: dataDic.value.images,
          cover: dataDic.value.cover
        }),
        i: dataDic.value.address_name,
        j: common_vendor.o(($event) => dataDic.value.address_name = $event.detail.value),
        k: common_vendor.p({
          type: "location-filled",
          size: "20",
          color: "#00755C"
        }),
        l: common_vendor.o(chooseMap),
        m: common_vendor.o(($event) => dataDic.value.category_id = $event),
        n: common_vendor.p({
          clearIcon: false,
          border: false,
          mode: "tag",
          localdata: classArr.value,
          modelValue: dataDic.value.category_id
        }),
        o: !selectPhone.value
      }, !selectPhone.value ? {
        p: common_vendor.o(($event) => navToAddress())
      } : {
        q: common_vendor.t(selectPhone.value.name),
        r: common_vendor.o(($event) => navToAddress()),
        s: common_vendor.o(clearPhone)
      }, {
        t: common_vendor.p({
          type: "right"
        }),
        v: dataDic.value._id
      }, dataDic.value._id ? {
        w: common_vendor.o(($event) => dataDic.value.state = $event),
        x: common_vendor.p({
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
        y: common_vendor.o(($event) => commitVoid()),
        z: common_vendor.sr(ssAlert, "b7cceaec-5", {
          "k": "ssAlert"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/newsArticle/add.vue"]]);
wx.createPage(MiniProgramPage);
