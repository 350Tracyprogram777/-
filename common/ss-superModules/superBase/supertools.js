const tel = /^1[34578]\d{9}$/;
const ischinese = /^[\u4E00-\u9FA5]+$/; //中文
const carnum =
	/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})+$/
const email =
	/^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const idcard =
	/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/ ///^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
const pswed = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
const AppName = "HTX"
const key_login = AppName + 'LOGIN'
const key_autologin = AppName + 'AUTOLOGIN'
const key_userinfo = AppName + 'USERINFO'
const key_mpopenid = AppName + 'MPOPENID'
const key_webopenid = AppName + 'WEBOPENID'
const key_uniopenid = AppName + 'UNIOPENID'
const key_sharenum = AppName + 'SHARENUM'
const key_navdata = AppName + 'NAVDATA'
const key_subuserinfo = AppName + 'SUBUSERINFO'
const key_navdata2 = AppName + 'NAVDATA2'
const key_pushId = AppName + 'PUSHID'
const key_version = AppName + 'VERSION'
const key_defaultaddress = AppName + 'DEFAULTADDRESS'
const key_myLocation = AppName + 'LOCATION'
const key_token = AppName + 'TOKEN'
const key_searchArchives = AppName + 'SEARCHARCHIVES' //来源
const key_pageData = AppName + 'PAGEDATA' //页面数据
import superCrypto from "./superCrypto.js"
import superTime from "./superTime.js"
//****h5用 */
// 存入本地 carwzdic--查询违章保存到本地 key   ismail大小车判断
// const superSaveLocation = (key, vaule) => localStorage.setItem(key, JSON.stringify(vaule))
// 获取本地数据
const superTools = {
	// 验证手机号
	cheakphone: (e) => tel.test(e),
	// 验证密码
	cheakpswed: (e) => pswed.test(e),
	// 验证中文
	cheakchinese: (e) => ischinese.test(e),
	// 验证车牌号
	cheakcarnum: (e) => carnum.test(e),
	// 验证邮箱
	cheakemail: (e) => email.test(e),
	//验证身份证号
	cheakidcard: (e) => idcard.test(e),
	// 隐藏手机号
	hidPhone: (e) => {
		return e.substr(0, 3) + '****' + e.substr(7)
	},
	//获取各种格式的日期
	getCurrentTime: (format = 'yyyy/MM/dd hh:mm:ss') => {
		let date = new Date()
		return superTime.formatDate(date, format)
	},
	//获取各种格式的日期
	getCurrentTimeNYD: (format = 'yyyy-MM-dd') => {
		let date = new Date()
		return superTime.formatDate(date, format)
	},
	keepTwoDecimal: (num) => {
		var result = parseFloat(num);
		result = Math.round(num * 100) / 100;
		return result;
	},
	superRandomNum: (Min, Max) => {
		var Range = Max - Min;
		var Rand = Math.random();
		if (Math.round(Rand * Range) == 0) {
			return Min + 1;
		} else if (Math.round(Rand * Max) == Max) {
			index++;
			return Max - 1;
		} else {
			var num = Min + Math.round(Rand * Range) - 1;
			return num;
		}
	},
	openDYApp: (packName = 'com.tencent.mm', action = 'weixin://') => {
		let _this = this;
		////console.log('打开都应')
		// 判断平台  
		if (plus.os.name == 'Android') {
			plus.runtime.launchApplication({
				pname: packName
			}, function(e) {
				////console.log('Open system default browser failed: ' + e.message);
			});
		} else if (plus.os.name == 'iOS') {
			plus.runtime.launchApplication({
				action: action
			}, function(e) {
				////console.log('Open system default browser failed: ' + e.message);
			});
		}
	},
	rand32order(randomFlag = 32, min = 32, max = 32) {
		let str = "",
			range = min,
			arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
				'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C',
				'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
				'X', 'Y', 'Z'
			];
		// 随机产生
		if (randomFlag) {
			range = Math.round(Math.random() * (max - min)) + min;
		}
		for (let i = 0; i < range; i++) {
			let pos = Math.round(Math.random() * (arr.length - 1));
			str += arr[pos];
		}
		return str.toLowerCase();
	},
	// 公众号用
	// 获取url 指定参数
	getUrlDataWithName: (name) => {
		var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i"),
			url = window.location;
		if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, " "));
		return "";
	},
	//保存code
	save_code: (vaule) => uni.setStorage({
		key: 'usercode',
		data: vaule
	}),
	get_code: () => superCrypto.superGetStorageSync('usercode'),
	getLoction: () => {
		// #ifdef APP-PLUS		
		return new Promise(function(relsove, reject) {
			let self = this
			uni.getLocation({
				type: 'wgs84',
				geocode: true,
				success: function(res) {
					superCrypto.superSetStorageSync(key_myLocation, res)
					relsove(res)
					// self.myCity = res.address.city.replace('市', '')
					// ////console.log('当前位置的经度：' + res.address.city);
					// ////console.log('当前位置的纬度：' + res.latitude);
				},
				fail: function(err) {
					////console.log('定位失败', err)
					reject(err)
				}
			});
		})
		// #endif
	},
	/*
	---------------- 小程序用---------------------------------
	
	*/
	// 自动登录
	save_autoLogin: (vaule) => superCrypto.superSetStorageSync(key_autologin, vaule),
	get_autoLogin: () => superCrypto.superGetStorageSync(key_autologin),
	clear_autoLogin: () => uni.removeStorageSync(key_autologin),
	// 登录的信息
	save_login: (vaule) => superCrypto.superSetStorageSync(key_login, vaule),
	get_login: () => superCrypto.superGetStorageSync(key_login),
	clear_login: () => uni.removeStorageSync(key_login),
	// 获取子账号
	save_subuserinfo: (vaule) => superCrypto.superSetStorageSync(key_subuserinfo, vaule),
	get_subuserinfo: () => superCrypto.superGetStorageSync(key_subuserinfo),
	clear_subuserinfo: () => uni.removeStorageSync(key_subuserinfo),
	// 获取用户信息
	save_userinfo: (vaule) => superCrypto.superSetStorageSync(key_userinfo, vaule),
	get_userinfo: () => superCrypto.superGetStorageSync(key_userinfo),
	clear_userinfo: () => uni.removeStorageSync(key_userinfo),
	// 保存openid
	save_openid: (vaule) => superCrypto.superSetStorageSync(key_mpopenid, vaule),
	get_openid: () => superCrypto.superGetStorageSync(key_mpopenid),
	clear_mpopenid: () => uni.removeStorageSync(key_mpopenid),
	// 保存邀请码
	save_sharenum: (vaule) => superCrypto.superSetStorageSync(key_sharenum, vaule),
	get_sharenum: () => superCrypto.superGetStorageSync(key_sharenum),
	clear_sharenum: () => uni.removeStorageSync(key_sharenum),
	// 获取用户授权
	getAuthorize: (scope) => getauthorize(scope),
	// 临时数据
	save_navdata: (vaule) => superCrypto.superSetStorageSync(key_navdata, vaule),
	get_navdata: () => superCrypto.superGetStorageSync(key_navdata),
	clear_navdata: () => uni.removeStorageSync(key_navdata),
	// 临时数据
	save_navdata2: (vaule) => superCrypto.superSetStorageSync(key_navdata2, vaule),
	get_navdata2: () => superCrypto.superGetStorageSync(key_navdata2),
	clear_navdata2: () => uni.removeStorageSync(key_navdata2),
	// 推送id
	save_pushId: (vaule) => superCrypto.superSetStorageSync(key_pushId, vaule),
	get_pushId: () => superCrypto.superGetStorageSync(key_pushId),
	clear_pushId: () => uni.removeStorageSync(key_pushId),
	// 获取版本信息
	save_version: (vaule) => superCrypto.superSetStorageSync(key_version, vaule),
	get_version: () => superCrypto.superGetStorageSync(key_version),
	clear_version: () => uni.removeStorageSync(key_version),
	// 获取版本信息
	save_defaultaddress: (vaule) => superCrypto.superSetStorageSync(key_defaultaddress, vaule),
	get_defaultaddress: () => superCrypto.superGetStorageSync(key_defaultaddress),
	clear_defaultaddress: () => uni.removeStorageSync(key_defaultaddress),
	// 获取版本信息
	save_myLocation: (vaule) => superCrypto.superSetStorageSync(key_myLocation, vaule),
	get_myLocation: () => superCrypto.superGetStorageSync(key_myLocation),
	clear_myLocation: () => uni.removeStorageSync(key_myLocation),
	// 获取版本信息
	save_token: (vaule) => superCrypto.superSetStorageSync(key_token, vaule),
	get_token: () => superCrypto.superGetStorageSync(key_token),
	clear_token: () => uni.removeStorageSync(key_token),
	// 搜索
	save_searchArchives: (vaule) => superCrypto.superSetStorageSync(key_searchArchives, vaule),
	get_searchArchives: () => superCrypto.superGetStorageSync(key_searchArchives),
	clear_searchArchives: () => uni.removeStorageSync(key_searchArchives),
	// 搜索
	save_pageData: (vaule) => {
		let dic = superCrypto.superGetStorageSync(key_pageData) || {}
		let pageKey = new Date().getTime()
		dic[pageKey] = vaule
		superCrypto.superSetStorageSync(key_pageData, dic)
		return pageKey
	},
	get_pageData: (pageKey) => {
		let dic = superCrypto.superGetStorageSync(key_pageData) || {}
		if (dic[pageKey]) {
			return dic[pageKey]
		} else {
			return ''
		}
	},
	clear_pageData: () => uni.removeStorageSync(key_pageData),
	superTS: (msg) => {
		uni.showToast({
			title: msg,
			icon: 'none',
			duration: 2000,
			mask: true
		})
	},
	// app 分享
	appWxShare: (dic) => {
		////console.log(dic)
		uni.share({
			provider: dic.provider,
			scene: dic.scene,
			type: 0,
			href: dic.href,
			title: dic.title,
			summary: dic.summary,
			imageUrl: dic.imageUrl,
			success: function(res) {
				////console.log("success:" + JSON.stringify(res));
			},
			fail: function(err) {
				////console.log("fail:" + JSON.stringify(err));
			}
		});
	},
	superSet: (key, value) => superCrypto.superSetStorageSync(key, value),
	superGet: (key) => superCrypto.superGetStorageSync(key),
	jiaM: (data) => wxcrytpo.encrypt(JSON.stringify(data)),
	jieM: (data) => JSON.parse(wxcrytpo.decrypt(data).message),
	server_encrypt: (data) => superCrypto.serverEncrypt(data),
	server_deccrypt: (data) => superCrypto.serverDecrypt(data)
}
const getauthorize = (scope) => {
	return new Promise(function(relsove, reject) {
		uni.getSetting({
			success(res) {
				////console.log(res.authSetting[scope])
				if (!res.authSetting[scope]) {
					uni.authorize({
						scope: scope,
						success(e) {
							////console.log('已经授权')
							relsove(true)
							// 用户已经同意小程序使用录音功能，后续调用 uni.startRecord 接口不会弹窗询问
						},
						fail() {
							////console.log('拒绝了')
							reject(false)
						}
					})
				} else {
					////console.log('已经授权')
					relsove(true)
				}
			}
		})
	})
}
export default superTools;
// 禁止输入空格
// <input type="text" onkeyup="this.value=this.value.replace(/\s+/g,'')" placeholder="请输您的真实姓名">
