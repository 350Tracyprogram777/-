import uniStarterConfig from './appConfig.js';
import {
  useUserStore
} from '@/store'
//应用初始化页
export default async function() {
  let loginConfig = uniStarterConfig.router.login
  //自定义路由拦截
  const {
    "router": {
      needLogin,
      visitor,
      login
    }
  } = uniStarterConfig //需要登录的页面
  let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  list.forEach(item => { //用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
    uni.addInterceptor(item, {
      invoke(e) { // 调用前拦截
        const to_page_url = e.url.split('?')[0];
        const login_url = '/pages/set/userInfo' // "/pages/login/login"
        //获取要前往的页面路径（即url去掉"?"和"?"后的参数）
        const userStore = useUserStore()
        console.log('usestore', userStore)

        const isHasLogin = userStore.hasLogin
        const userInfo = userStore.userInfo
        const pages = getCurrentPages();
        console.log('要去的界面', e, )
        console.log('userInfo', userInfo)
        if (!pages.length) {
          console.log("首页启动调用了");
          return e
        }
        const from_page_url = pages[pages.length - 1].route;
        if (login_url == to_page_url) {
          return e
        }
        // 是否必须登录
        const isMustNeed = needLogin.findIndex(function(item, index) {
          if (typeof(item) == 'string') {
            if (item == to_page_url) {
              return true
            }
          } else {
            return item.pattern.test(to_page_url)
          }
        })
        // 是必须登录 
        if (isMustNeed >= 0) {
          // 业务员/安装员
          if (!userInfo.nickname || !userInfo.mobile) {
            userInfo.loginBackPage = to_page_url
            uni.navigateTo({
              url: login_url
            })
            return false
          }
        }
        return e
      },
      fail(err) { // 失败回调拦截 
        console.log('hhhha3333')
        console.log(err);
      }
    })
  })
  // #ifdef APP-PLUS
  // 监听并提示设备网络状态变化
  // uni.onNetworkStatusChange(res => {
  // 	console.log(res.isConnected);
  // 	console.log(res.networkType);
  // 	if (res.networkType != 'none') {
  // 		uni.showToast({
  // 			title: '当前网络类型：' + res.networkType,
  // 			icon: 'none',
  // 			duration: 3000
  // 		})
  // 	} else {
  // 		uni.showToast({
  // 			title: '网络类型：' + res.networkType,
  // 			icon: 'none',
  // 			duration: 3000
  // 		})
  // 	}
  // });
  // #endif
}
/**
 * // 初始化appVersion
 */
function initAppVersion() {
  // #ifdef APP-PLUS
  let appid = plus.runtime.appid;
  plus.runtime.getProperty(appid, (wgtInfo) => {
    let appVersion = plus.runtime;
    let currentVersion = appVersion.versionCode > wgtInfo.versionCode ? appVersion : wgtInfo;
    getApp({
      allowDefault: true
    }).appVersion = {
      ...currentVersion,
      appid,
      hasNew: false
    }
    // 检查更新小红点
    callCheckVersion().then(res => {
      // console.log('检查是否有可以更新的版本', res);
      if (res.result.code > 0) {
        // 有新版本
        getApp({
          allowDefault: true
        }).appVersion.hasNew = true;
      }
    })
  });
  // 检查更新
  // #endif
}
async function getDeviceInfo() {
  let deviceInfo = {
    "uuid": '',
    "vendor": '',
    "push_clientid": '',
    "imei": '',
    "oaid": '',
    "idfa": '',
    "model": '',
    "platform": '',
  }
  const {
    model,
    platform,
  } = uni.getSystemInfoSync();
  Object.assign(deviceInfo, {
    model,
    platform
  });
  // #ifdef APP-PLUS
  const oaid = await new Promise((callBack, fail) => {
      if (deviceInfo.platform == "android") {
        plus.device.getOAID({
          success: function(e) {
            callBack(e.oaid)
            // console.log('getOAID success: '+JSON.stringify(e));
          },
          fail: function(e) {
            callBack()
            console.log('getOAID failed: ' + JSON.stringify(e));
          }
        });
      } else {
        callBack()
      }
    }),
    {
      imei,
      uuid
    } = await new Promise((callBack, fail) => {
      plus.device.getInfo({
        success: function(e) {
          callBack(e)
          // console.log('getOAID success: '+JSON.stringify(e));
        },
        fail: function(e) {
          callBack()
          console.log('getOAID failed: ' + JSON.stringify(e));
        }
      });
    }),
    idfa = plus.storage.getItem('idfa') || '', //idfa有需要的用户在应用首次启动时自己获取存储到storage中
    vendor = plus.device.vendor;
  try {
    deviceInfo.push_clientid = plus.push.getClientInfo().clientid
  } catch (e) {
    uni.showModal({
      content: '获取推送标识失败。如果你的应用不需要推送功能，请注释掉本代码块',
      showCancel: false,
      confirmText: "好的"
    });
    console.log(e)
  }
  Object.assign(deviceInfo, {
    imei,
    uuid,
    idfa,
    vendor
  });
  // #endif
  return deviceInfo
}