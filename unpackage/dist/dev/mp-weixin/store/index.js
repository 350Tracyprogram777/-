"use strict";
require("./modules/user.js");
require("./modules/system.js");
require("./modules/contant.js");
const common_vendor = require("../common/vendor.js");
const pinia = common_vendor.createPinia();
pinia.use(common_vendor.index$1);
exports.pinia = pinia;
