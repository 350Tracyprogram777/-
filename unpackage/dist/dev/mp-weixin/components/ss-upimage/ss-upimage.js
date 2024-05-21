"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../common/ss-superModules/superConfig.js");
const components_ssUpimage_prewMedia = require("./prewMedia.js");
require("../../store/index.js");
const store_modules_user = require("../../store/modules/user.js");
const common_ssSuperModules_superBase_superData = require("../../common/ss-superModules/superBase/superData.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "ss-upimage",
  props: {
    oneImg: {
      //单选还是多选
      type: Boolean,
      default: false
    },
    stopDelete: {
      //单选还是多选
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "用户"
    },
    canVideo: {
      // 能否选择视频
      type: Boolean,
      default: true
    },
    canFile: {
      // 能否选择文件
      type: Boolean,
      default: true
    },
    wxType: {
      type: String,
      default: "all"
      //video file image
    },
    mediaArr: {
      //选中的模型
      type: Array,
      default: () => []
    },
    maxCount: {
      type: [Number, String],
      default: 9
    },
    cover: {
      type: String,
      default: ""
    },
    fixH: {
      type: [Number, String],
      default: 0
    },
    showDocStyle: {
      //文件的展示形式 true 左右结构 false为图片模式
      type: Boolean,
      default: false
    }
  },
  emits: ["update:cover", "remove", "change", "update:mediaArr"],
  setup(__props, { emit: __emit }) {
    const mediaTable = common_vendor.Ws.importObject("media", { customUI: true });
    const wxApi = common_vendor.Ws.importObject("wxapi", { customUI: true });
    const userStore = store_modules_user.useUserStore();
    const userInfo = userStore.userInfo;
    const props = __props;
    const mediaArr = common_vendor.toRef(props, "mediaArr");
    const { maxCount, cover } = common_vendor.toRefs(props);
    console.log("props----", mediaArr.length);
    common_vendor.ref("");
    const playVideo = common_vendor.ref(false);
    const playItem = common_vendor.ref({});
    const itemW = (common_vendor.index.getSystemInfoSync().screenWidth - props.fixH) / 5;
    const canOpenFile = ["doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx", "dwg"];
    const emit = __emit;
    function getMediaArr() {
      if (props.showDocStyle) {
        return mediaArr.value.filter(function(a, b) {
          return a.fileType != "file";
        });
      } else {
        return mediaArr.value;
      }
    }
    function switchImageSize(imageurl, size = 150) {
      return imageurl + `?x-oss-process=image/resize,h_${size},m_lfit`;
    }
    function switchVideoSize(imageurl) {
      return imageurl + `?x-oss-process=video/snapshot,t_7000,f_jpg,w_300,h_225,m_fast`;
    }
    function openFileVoid(e) {
      components_ssUpimage_prewMedia.openFile(e);
    }
    function prewImg(item, arr) {
      const imgArr = mediaArr.value.filter(function(a, b) {
        if (a.fileType != "video" && a.fileType != "file") {
          return true;
        }
      });
      const inx = imgArr.findIndex(function(a, b) {
        return a.url == item.url;
      });
      console.log(item);
      components_ssUpimage_prewMedia.prewImage(inx, imgArr);
    }
    function deleteImg(item) {
      const index = mediaArr.value.findIndex(function(a, b) {
        return a.url == item.url;
      });
      if (mediaArr.value[index]["url"] == props.cover) {
        emit("update:cover", "");
      }
      emit("remove", index);
    }
    function openVoid(item) {
      const index = mediaArr.value.findIndex(function(a, b) {
        return a.url == item.url;
      });
      playItem.value = mediaArr.value[index];
      playVideo.value = true;
    }
    function closeVideo() {
      playItem.value = "";
      playVideo.value = false;
    }
    function setCover(url) {
      emit("update:cover", url);
    }
    function chooseType() {
      let arr = ["图片"];
      if (props.canVideo) {
        arr.push("视频");
      }
      if (props.wxType) {
        arr.push("从微信中选择");
      }
      common_vendor.index.showActionSheet({
        itemList: arr,
        success: function(res) {
          const txt = arr[res.tapIndex];
          if (txt == "图片") {
            superUpImg("image");
          } else if (txt == "视频") {
            superUpImg("video");
          } else if (txt == "从微信中选择") {
            chooseWxMedia();
          }
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    }
    function chooseWxMedia() {
      common_vendor.wx$1.chooseMessageFile({
        count: 9,
        type: props.wxType,
        success: async function(e) {
          let arr = [];
          common_vendor.index.showLoading({
            title: "上传中"
          });
          let totalArr = [];
          for (let imgInfo of e.tempFiles) {
            console.log(imgInfo);
            if (imgInfo.type == "file" && !props.canFile) {
              continue;
            }
            let imgUrl = await common_ssSuperModules_superBase_superData.superData.superImgCloudRequest(imgInfo.path, imgInfo.name);
            const { data } = await wxApi.mediaCheckAsync(imgUrl, userInfo.wx_openid.mp);
            let extname = imgInfo.path.split(".").pop();
            let fileType = imgInfo.type;
            if (canOpenFile.includes(extname)) {
              fileType = "file";
            }
            const filedata = {
              user_id: userInfo._id,
              type: props.type,
              name: imgInfo.name,
              rename: imgInfo.name,
              extname,
              cloudPath: imgInfo.name,
              fileType,
              url: imgUrl,
              size: imgInfo.size,
              //单位是字节
              path: imgUrl,
              create_date: (/* @__PURE__ */ new Date()).getTime(),
              trace_id: data
            };
            arr.push(filedata);
            if (props.maxCount > 1) {
              totalArr = [...mediaArr.value, filedata];
            } else {
              totalArr = arr;
            }
            emit("update:mediaArr", totalArr);
          }
          console.log("上传乘公共", arr);
          mediaTable.add(arr);
          common_vendor.index.hideLoading();
          if (!props.cover) {
            const defaultCover = totalArr[0];
            if (defaultCover.fileType == "image") {
              emit("update:cover", defaultCover.url);
            } else if (defaultCover.fileType == "video") {
              emit("update:cover", switchVideoSize(defaultCover.url));
            } else
              ;
          }
        }
      });
    }
    function superUpImg(mediaType) {
      common_vendor.index.chooseMedia({
        count: 9,
        mediaType,
        sizeType: ["compressed"],
        success: async function(e) {
          console.log(e);
          let arr = [];
          common_vendor.index.showLoading({
            title: "上传中"
          });
          let totalArr = [];
          for (let imgInfo of e.tempFiles) {
            let filedata = {};
            if (e.type != "video") {
              let imgName = imgInfo.tempFilePath.split("/").pop();
              let imgUrl = await common_ssSuperModules_superBase_superData.superData.superImgCloudRequest(imgInfo.tempFilePath, imgName);
              const { data } = await wxApi.mediaCheckAsync(imgUrl, userInfo.wx_openid.mp);
              filedata = {
                user_id: userInfo._id,
                type: props.type,
                name: imgName,
                rename: imgName,
                extname: imgInfo.tempFilePath.split(".").pop(),
                cloudPath: imgName,
                fileType: "image",
                url: imgUrl,
                size: imgInfo.size,
                //单位是字节
                path: imgUrl,
                create_date: (/* @__PURE__ */ new Date()).getTime(),
                trace_id: data
              };
              arr.push(filedata);
            } else {
              let videoName = imgInfo.tempFilePath.split("/").pop();
              imgInfo.thumbTempFilePath.split("/").pop();
              let videoUrl = await common_ssSuperModules_superBase_superData.superData.superImgCloudRequest(imgInfo.tempFilePath, videoName);
              const { data } = await wxApi.mediaCheckAsync(videoUrl, userInfo.wx_openid.mp);
              filedata = {
                user_id: userInfo._id,
                type: props.type,
                name: videoName,
                rename: videoName,
                extname: imgInfo.tempFilePath.split(".").pop(),
                cloudPath: videoName,
                fileType: "video",
                url: videoUrl,
                size: imgInfo.size,
                //单位是字节
                path: videoUrl,
                create_date: (/* @__PURE__ */ new Date()).getTime(),
                trace_id: data
                // duration: imgInfo.duration,
                // width: imgInfo.width,
                // height: imgInfo.height
              };
              arr.push(filedata);
            }
            if (props.maxCount > 1) {
              totalArr = [...mediaArr.value, filedata];
            } else {
              totalArr = arr;
            }
            emit("update:mediaArr", totalArr);
            console.log("--成功----", totalArr, props.mediaArr);
          }
          mediaTable.add(arr);
          common_vendor.index.hideLoading();
          if (!props.cover) {
            const defaultCover = totalArr[0];
            if (defaultCover.fileType == "image") {
              emit("update:cover", defaultCover.url);
            } else if (defaultCover.fileType == "video") {
              emit("update:cover", switchVideoSize(defaultCover.url));
            } else {
              emit("update:cover", "/static/media/word.png");
            }
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: mediaArr.value.length < common_vendor.unref(maxCount)
      }, mediaArr.value.length < common_vendor.unref(maxCount) ? {
        b: common_vendor.o(($event) => chooseType()),
        c: common_assets._imports_0,
        d: itemW + "px"
      } : {}, {
        e: common_vendor.f(getMediaArr(), (item, index, i0) => {
          return common_vendor.e({
            a: item.fileType == "image"
          }, item.fileType == "image" ? {
            b: common_vendor.o(($event) => setCover(item.url), index),
            c: common_vendor.o(($event) => prewImg(item, mediaArr.value), index),
            d: switchImageSize(item.url),
            e: itemW + "px"
          } : item.fileType == "video" ? {
            g: switchVideoSize(item.url),
            h: itemW + "px",
            i: common_vendor.o(($event) => openVoid(item), index)
          } : {}, {
            f: item.fileType == "video",
            j: item.fileType == "file"
          }, item.fileType == "file" ? {
            k: common_vendor.t(item.name),
            l: common_vendor.o(($event) => openFileVoid(item.url), index),
            m: itemW + "px"
          } : {}, {
            n: item.suggest
          }, item.suggest ? {} : {}, !__props.stopDelete ? {
            o: common_vendor.o(($event) => deleteImg(item), index)
          } : {}, {
            p: item.url == common_vendor.unref(cover) && common_vendor.unref(cover) && item.fileType == "image"
          }, item.url == common_vendor.unref(cover) && common_vendor.unref(cover) && item.fileType == "image" ? {} : {}, {
            q: item.create_date
          }, item.create_date ? {
            r: "3096fc34-0-" + i0,
            s: common_vendor.p({
              date: item.create_date,
              format: "MM/d-h:mm"
            })
          } : {}, {
            t: index
          });
        }),
        f: !__props.stopDelete,
        g: common_vendor.f(mediaArr.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.fileType == "file"
          }, item.fileType == "file" ? common_vendor.e({
            b: common_vendor.t(item.extname),
            c: common_vendor.t(item.name),
            d: common_vendor.o(($event) => _ctx.showRenameVoid(item), index),
            e: !__props.stopDelete
          }, !__props.stopDelete ? {
            f: common_vendor.o(($event) => deleteImg(item), index)
          } : {}, {
            g: common_vendor.o(($event) => openFileVoid(item.url), index)
          }) : {}, {
            h: index
          });
        }),
        h: playVideo.value
      }, playVideo.value ? {
        i: playItem.value.url,
        j: common_vendor.o(closeVideo),
        k: common_vendor.p({
          type: "close",
          size: "26",
          color: "#aaa"
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/BOEINGcode/b787/ninini/components/ss-upimage/ss-upimage.vue"]]);
wx.createComponent(Component);
