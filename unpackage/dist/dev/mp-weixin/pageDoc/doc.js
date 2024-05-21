"use strict";
const common_vendor = require("../common/vendor.js");
const docApi = common_vendor.Ws.importObject("user-doc");
function docZan(e) {
  docApi.zan(e.value._id).then((res) => {
    if (res.data.length == 0) {
      e.value.zan = [];
      e.value.like_count--;
    } else {
      e.value.zan = res.data;
      e.value.like_count++;
    }
    common_vendor.index.$emit("docUpdate", e.value);
  });
}
function docCollect(e) {
  const dic = {
    uni_id: e.value._id,
    uni_data: e.value
  };
  docApi.favorite(dic).then((res) => {
    if (res.errCode == 0) {
      e.value.collect = res.data;
      common_vendor.index.$emit("docUpdate", e.value);
    }
  });
}
exports.docCollect = docCollect;
exports.docZan = docZan;
