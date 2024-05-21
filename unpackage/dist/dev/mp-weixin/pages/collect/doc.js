"use strict";
const common_vendor = require("../../common/vendor.js");
const docApi = common_vendor.Ws.importObject("user-doc");
function docZan(e) {
  docApi.zan(e.value._id).then((res) => {
    if (res.errCode == 0) {
      e.value.zan = res.data;
    }
  });
}
function docCollect(e) {
  console.log(e.value._id);
  const dic = {
    uni_id: e.value._id,
    uni_data: e.value
  };
  docApi.favorite(dic).then((res) => {
    if (res.errCode == 0) {
      e.value.collect = res.data;
    }
  });
}
exports.docCollect = docCollect;
exports.docZan = docZan;
