import superData from './superBase/superData.js'
import superTools from './superBase/supertools.js'
import superTime from './superBase/superTime.js'
// #ifdef H5
// import superShare from './superBase/superShare.js'
// import wx from 'weixin-js-sdk'
// #endif
import uniCopy from './superOther/uni-copy.js'
import appInit from "./appInit.js"
import appConfig from "./superBase/ss.config.js"
import md5 from "js-md5"
appInit()
import { useI18n } from "vue-i18n";
// const  {t}  = useI18n();
// #ifndef VUE3
import Vue from 'vue'
export default {
	install(Vue) {
		const debug = superTools.getUrlDataWithName('clear')
		if (debug) {
			uni.clearStorageSync()
			window.location.href = appConfig.webpath
			return
		}
		Vue.prototype.superData = superData;
		Vue.prototype.superTools = superTools;
		Vue.prototype.superTime = superTime;
		Vue.prototype.uniCopy = uniCopy;
		// #ifdef H5
		// Vue.prototype.superShare = superShare;
		// Vue.prototype.wx = wx;
		// #endif
		const msg = (title, duration = 1500, mask = false, icon = 'none') => {
			if (Boolean(title) === false) {
				return;
			}
			uni.showToast({
				title,
				duration,
				mask,
				icon
			});
		}
		Vue.prototype.$api = {
			msg,
			md5: md5
		};
		// Vue.observable(Vue.prototype.$api)
	}
}
// #endif
// #ifdef VUE3
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

export {
	superData,
	superTools,
	superTime,
	useI18n,
	// #ifdef H5
	// superShare,
	// wx,
	// #endif
	md5,
	msg,
	uniCopy,
	appConfig
}
// #endif
