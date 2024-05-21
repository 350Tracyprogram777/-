"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../common/ss-superModules/superConfig.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const _sfc_main = {
  __name: "webUrl",
  setup(__props) {
    const userStore = store_modules_user.useUserStore();
    common_vendor.computed(() => userStore.userInfo);
    const newsApi = common_vendor.Ws.importObject("news-article");
    const dataDic = common_vendor.ref({ _id: "" });
    common_vendor.onLoad((e) => {
      if (e.newsId) {
        dataDic.value._id = e.newsId;
        getDetail();
      }
    });
    function getDetail() {
      newsApi.doc(dataDic.value._id).then((res) => {
        common_vendor.index.setNavigationBarTitle({
          title: res.data.title
        });
        console.log(res);
        Object.assign(dataDic.value, res.data);
      });
    }
    common_vendor.onShareAppMessage((res) => {
      return {
        title: dataDic.value.title,
        path: "/pages/newsArticle/webUrl?newsId=" + dataDic.value._id,
        imageUrl: dataDic.value.cover
      };
    });
    common_vendor.onShareTimeline((res) => {
      return {
        title: dataDic.value.content,
        path: "/pages/newsArticle/webUrl?newsId=" + dataDic.value._id,
        imageUrl: dataDic.value.cover
      };
    });
    return (_ctx, _cache) => {
      return {
        a: dataDic.value.url
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/pages/newsArticle/webUrl.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
