import superData from '@/common/ss-superModules/superBase/superData.js'
import superTools from '@/common/ss-superModules/superBase/supertools.js'
import superTime from '@/common/ss-superModules/superBase/superTime.js'
// #ifdef H5
import superShare from "@/common/ss-superModules/superBase/superShare.js"
import wx from 'weixin-js-sdk'
// #endif
import uniCopy from '@/common/ss-superModules/superOther/uni-copy.js'
import appInit from "@/common/ss-superModules/appInit.js"
import appConfig from "@/common/ss-superModules/superBase/ss.config.js"

import md5 from "js-md5"
appInit()

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
export  {
	superData,
	superTools,
	superTime,
	// #ifdef H5
	superShare,
	wx,
	// #endif
	md5,
	msg
}

