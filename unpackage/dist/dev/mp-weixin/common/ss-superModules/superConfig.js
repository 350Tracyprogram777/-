"use strict";
const common_vendor = require("../vendor.js");
require("./superBase/superData.js");
const common_ssSuperModules_appInit = require("./appInit.js");
common_ssSuperModules_appInit.appInit();
const msg = (title, duration = 1500, mask = false, icon = "none") => {
  if (Boolean(title) === false) {
    return;
  }
  common_vendor.index.showToast({
    title,
    duration,
    mask,
    icon
  });
};
exports.msg = msg;
