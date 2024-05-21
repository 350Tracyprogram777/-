"use strict";
const common_vendor = require("../../vendor.js");
function uniCopy({ content, success, error }) {
  if (!content)
    return error("复制的内容不能为空 !");
  content = typeof content === "string" ? content : content.toString();
  common_vendor.index.setClipboardData({
    data: content,
    success: function() {
      success("复制成功~");
    },
    fail: function() {
      success("复制失败~");
    }
  });
}
exports.uniCopy = uniCopy;
