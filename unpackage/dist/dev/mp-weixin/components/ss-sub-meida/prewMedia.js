"use strict";
const common_vendor = require("../../common/vendor.js");
const canOpenFile = ["doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx"];
common_vendor.wx$1.getSystemInfoSync();
const prewImage = function(index, mediaArr) {
  let arr = [];
  for (let item of mediaArr) {
    if (item.fileType != "video" && item.fileType != "file") {
      arr.push(item["url"]);
    }
  }
  common_vendor.index.previewImage({
    current: index,
    urls: arr
  });
};
const openFile = function(item) {
  const type = item.url.split(".").pop();
  if (canOpenFile.includes(type)) {
    common_vendor.index.showActionSheet({
      itemList: ["预览", "保存"],
      success: function(res) {
        if (res.tapIndex == 0) {
          common_vendor.index.showLoading({
            title: "打开中..."
          });
          common_vendor.index.downloadFile({
            url: item.url,
            success: function(res2) {
              var filePath = res2.tempFilePath;
              common_vendor.index.openDocument({
                filePath,
                showMenu: true,
                success: function(res3) {
                  console.log("打开文档成功");
                }
              });
            },
            complete: function() {
              common_vendor.index.hideLoading();
            }
          });
        } else {
          `${common_vendor.wx$1.env.USER_DATA_PATH}/${item.name}`;
          common_vendor.wx$1.getFileSystemManager();
          common_vendor.index.showLoading({
            title: "下载中..."
          });
          common_vendor.index.downloadFile({
            url: item.url,
            success: function(res2) {
              var filePath = res2.tempFilePath;
              common_vendor.wx$1.shareFileMessage({
                filePath,
                fileName: item.name,
                complete: function(e) {
                  console.log(e);
                }
              });
            },
            complete: function() {
              common_vendor.index.hideLoading();
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
            url: item.url,
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
exports.canOpenFile = canOpenFile;
exports.openFile = openFile;
exports.prewImage = prewImage;
