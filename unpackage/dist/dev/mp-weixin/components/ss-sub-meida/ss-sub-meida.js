"use strict";
const common_vendor = require("../../common/vendor.js");
const common_ssSuperModules_superConfig = require("../../common/ss-superModules/superConfig.js");
const components_ssSubMeida_prewMedia = require("./prewMedia.js");
const _sfc_main = {
  name: "ss-sub-meida",
  props: {
    mediaArr: {
      type: Array,
      default: () => []
    },
    imW: {
      type: String,
      default: "300"
    },
    showDocStyle: {
      //文件的展示形式 true 左右结构 false为图片模式
      type: Boolean,
      default: false
    },
    password: {
      //文件的展示形式 true 左右结构 false为图片模式
      type: String,
      default: ""
    },
    password_msg: {
      //文件的展示形式 true 左右结构 false为图片模式
      type: String,
      default: ""
    },
    maxShowNum: {
      type: Number,
      default: 9
    },
    fileShowAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canOpenFile: components_ssSubMeida_prewMedia.canOpenFile,
      inputPassWord: "",
      selectItem: "",
      playSuccess: "",
      threeImgW: (common_vendor.index.getSystemInfoSync().screenWidth - 56) / 3
    };
  },
  computed: {
    imgVideoArr: function() {
      return this.mediaArr.filter(function(a, b) {
        return a.fileType != "file";
      });
    }
  },
  methods: {
    // 去除文件
    getMediaArr: function() {
      if (this.showDocStyle) {
        return this.mediaArr.filter(function(a, b) {
          return a.fileType != "file";
        });
      } else {
        return this.mediaArr;
      }
    },
    // 等比缩水
    switchImageSize: function(imageurl, size = 200) {
      return imageurl + `?x-oss-process=image/resize,h_${size},m_lfit`;
    },
    // 等比缩水
    switchVideoSize: function(imageurl) {
      return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
    },
    // 预览图片
    prewImgVoid(item) {
      const imgArr = this.mediaArr.filter(function(a, b) {
        if (a.fileType != "video" && a.fileType != "file") {
          return true;
        }
      });
      const inx = imgArr.findIndex(function(a, b) {
        return a.url == item.url;
      });
      components_ssSubMeida_prewMedia.prewImage(inx, imgArr);
    },
    // 预览文件
    openFileVoid(item, playVoid) {
      if (playVoid) {
        this.playSuccess = playVoid;
      }
      if (this.password) {
        this.selectItem = item;
        this.inputPassWord = this.inputPassWord.trim();
        if (this.inputPassWord.length > 0 && this.inputPassWord == this.password) {
          this.verifyPassWord();
          return;
        }
        this.$refs.pswPop.open();
        return;
      } else {
        if (item.fileType == "file") {
          components_ssSubMeida_prewMedia.openFile(item);
        } else if (this.playSuccess) {
          this.playSuccess();
        } else {
          this.prewImgVoid(item);
        }
      }
    },
    // 密码
    verifyPassWord: function() {
      this.inputPassWord = this.inputPassWord.trim();
      if (this.inputPassWord.length > 0 && this.inputPassWord == this.password) {
        if (this.selectItem.fileType == "file") {
          components_ssSubMeida_prewMedia.openFile(this.selectItem);
        } else if (this.playSuccess) {
          this.playSuccess();
          console.log("eeee");
        } else {
          this.prewImgVoid(this.selectItem);
          console.log("eeee222");
        }
        this.hidePop();
      } else {
        common_ssSuperModules_superConfig.msg("密码不对");
      }
    },
    hidePop: function() {
      this.playSuccess = "";
      this.$refs.pswPop.close();
    },
    getSizeMb: function(e) {
      return this.superTools.keepTwoDecimal(e / 1024 / 1024) + "MB";
    }
  }
};
if (!Array) {
  const _easycom_ss_play_video2 = common_vendor.resolveComponent("ss-play-video");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_ss_play_video2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_ss_play_video = () => "../ss-play-video/ss-play-video.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_ss_play_video + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.mediaArr.length == 1
  }, $props.mediaArr.length == 1 ? {
    b: common_vendor.f($options.imgVideoArr, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType == "image"
      }, item.fileType == "image" ? {
        b: common_vendor.o(($event) => $options.openFileVoid(item), index),
        c: $options.switchImageSize(item.url)
      } : {}, {
        d: item.fileType == "video"
      }, item.fileType == "video" ? {
        e: common_vendor.o(($event) => $options.openFileVoid(item, $event), index),
        f: "2c3de906-0-" + i0,
        g: common_vendor.p({
          mediaDic: item,
          width: "400rpx",
          height: "300rpx"
        })
      } : {}, {
        h: index
      });
    }),
    c: common_vendor.f($props.mediaArr, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType == "file"
      }, item.fileType == "file" ? {
        b: common_vendor.t(item.extname),
        c: common_vendor.t(item.name),
        d: common_vendor.t($options.getSizeMb(item.size)),
        e: common_vendor.o(($event) => $options.openFileVoid(item), index)
      } : {}, {
        f: index
      });
    }),
    d: common_vendor.o(() => {
    })
  } : {
    e: common_vendor.f($options.imgVideoArr, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType == "image" && index < $props.maxShowNum
      }, item.fileType == "image" && index < $props.maxShowNum ? {
        b: common_vendor.o(($event) => $options.openFileVoid(item), index),
        c: $options.switchImageSize(item.url),
        d: $data.threeImgW + "px"
      } : {}, {
        e: index == $props.maxShowNum - 1 && $options.imgVideoArr.length - $props.maxShowNum > 0
      }, index == $props.maxShowNum - 1 && $options.imgVideoArr.length - $props.maxShowNum > 0 ? {
        f: common_vendor.t($options.imgVideoArr.length - $props.maxShowNum),
        g: common_vendor.o(($event) => $options.openFileVoid(item), index)
      } : {}, {
        h: item.fileType == "video"
      }, item.fileType == "video" ? {
        i: common_vendor.o(($event) => $options.openFileVoid(item, $event), index),
        j: "2c3de906-1-" + i0,
        k: common_vendor.p({
          mediaDic: item,
          width: "100%",
          height: "240rpx"
        })
      } : {}, {
        l: index
      });
    }),
    f: common_vendor.f($props.mediaArr, (item, index, i0) => {
      return common_vendor.e({
        a: item.fileType == "file"
      }, item.fileType == "file" ? {
        b: common_vendor.t(item.extname),
        c: common_vendor.t(item.name),
        d: common_vendor.t($options.getSizeMb(item.size)),
        e: common_vendor.o(($event) => $options.openFileVoid(item), index)
      } : {}, {
        f: index
      });
    }),
    g: $props.fileShowAll ? "auto" : "280rpx"
  }, {
    h: common_vendor.o($options.hidePop),
    i: common_vendor.p({
      type: "close",
      color: "#999",
      size: "20"
    }),
    j: $props.password_msg,
    k: $data.inputPassWord,
    l: common_vendor.o(($event) => $data.inputPassWord = $event.detail.value),
    m: common_vendor.o((...args) => $options.verifyPassWord && $options.verifyPassWord(...args)),
    n: common_vendor.sr("pswPop", "2c3de906-2")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/components/ss-sub-meida/ss-sub-meida.vue"]]);
wx.createComponent(Component);
