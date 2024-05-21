"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "ss-play-video",
  props: {
    mediaDic: {
      type: Object,
      default: () => {
      }
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "750rpx"
    }
  },
  data() {
    return {
      playUrl: "",
      playVideo: false
    };
  },
  methods: {
    // 等比缩水
    switchVideoSize: function(imageurl) {
      return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
    },
    playVoid: function() {
      let self = this;
      function startPlay() {
        self.playUrl = self.mediaDic.url;
        self.playVideo = true;
        console.log("播放视频");
      }
      console.log("dddd", startPlay);
      this.$emit("play", startPlay);
    },
    closeVideo: function() {
      this.playUrl = "";
      this.playVideo = false;
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.mediaDic.fileType == "video"
  }, $props.mediaDic.fileType == "video" ? {
    b: $options.switchVideoSize($props.mediaDic.url),
    c: $props.width,
    d: $props.height,
    e: common_vendor.o((...args) => $options.playVoid && $options.playVoid(...args))
  } : {}, {
    f: $data.playVideo
  }, $data.playVideo ? {
    g: $data.playUrl,
    h: common_vendor.o($options.closeVideo),
    i: common_vendor.p({
      type: "close",
      size: "36",
      color: "#eee",
      click: "m-t-15"
    })
  } : {}, {
    j: $props.width,
    k: $props.height
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/BOEINGcode/b787/ninini/components/ss-play-video/ss-play-video.vue"]]);
wx.createComponent(Component);
