"use strict";
const common_vendor = require("../../common/vendor.js");
const canOpenFile = ["doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx"];
const prewImage = function(index, mediaArr) {
  let arr = [];
  for (let item2 of mediaArr) {
    if (item2.fileType != "video" && item2.fileType != "file") {
      arr.push(item2["url"]);
    }
  }
  common_vendor.index.previewImage({
    current: index,
    urls: arr
  });
};
const openFile = function(url) {
  const type = url.split(".").pop();
  if (canOpenFile.includes(type)) {
    common_vendor.index.showActionSheet({
      itemList: ["预览", "保存"],
      success: function(res) {
        if (res.tapIndex == 0) {
          common_vendor.index.downloadFile({
            url,
            success: function(res2) {
              var filePath = res2.tempFilePath;
              common_vendor.index.openDocument({
                filePath,
                showMenu: true,
                success: function(res3) {
                  console.log("打开文档成功");
                }
              });
            }
          });
        } else {
          common_vendor.index.downloadFile({
            url,
            success: function(res2) {
              var filePath = res2.tempFilePath;
              common_vendor.index.saveFile({
                tempFilePath: filePath,
                success: function(res3) {
                  common_vendor.index.showToast({
                    title: "以保存",
                    icon: "none"
                  });
                }
              });
            }
          });
        }
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    });
  } else {
    common_vendor.index.showActionSheet({
      title: "当前文件不支持预览",
      itemList: ["保存"],
      success: function(res) {
        if (res.tapIndex == 0) {
          common_vendor.index.downloadFile({
            url,
            success: function(res2) {
              var filePath = res2.tempFilePath;
              common_vendor.wx$1.shareFileMessage({
                filePath,
                fileName: item.name,
                complete: function(e) {
                  console.log(e);
                }
              });
            }
          });
        }
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    });
  }
};
exports.openFile = openFile;
exports.prewImage = prewImage;
