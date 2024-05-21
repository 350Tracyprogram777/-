import superTools from './supertools.js'
import superData from './superData'
import appConfig from "./ss.config.js"
import wx from 'weixin-js-sdk'
const APPID = "wx73b337c1a8b30510"
const REDIRET_URI = `${appConfig.webpath}/index.html`
// 有感知授权回调域名地址
const ALERT_URL = `${appConfig.webpath}`
const api_getwxcode = (topath) => "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID +
	"&redirect_uri=" + encodeURIComponent(ALERT_URL + topath) +
	"&response_type=code&scope=snsapi_base&state==123#wechat_redirect"
const api_getwxcode_alert = (topath) => "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID +
	"&redirect_uri=" + encodeURIComponent(ALERT_URL + topath) +
	"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
class superShare {
	constructor() {
		this.instance = ''
	}
	// 单例方法
	static getInstace() {
		if (!this.instance) {
			this.instance = new superShare()
			let self = this
			// this.instance.wxgetConfig()
			// wx.ready(function() {
			// 	self.instance.wxShareInfoConfig(appConfig.globalShare)
			// })
		}
		return this.instance
	}
	// jssdk  配置
	wxgetConfig() {
		return new Promise(function(resolve, reject) {
			let dic = {
				url: window.location.href.split('#')[0],
				name: "getWxConfig"
			}
			superData.superRequest('appWx/wx/config', {
				url: dic.url
			}, {
				hubtitle: ' '
			}).then(res => {
				let resDic = JSON.parse(res)
				wx.config(resDic);
				wx.hideAllNonBaseMenuItem()
				// wx.hideMenuItems({
				// 	menuList: ['menuItem:openWithQQBrowser', 'menuItem:copyUrl',
				// 		'menuItem:share:qq', 'menuItem:share:weiboApp',
				// 		'menuItem:share:QZone', 'menuItem:favorite',
				// 		'menuItem:openWithSafari', "menuItem:share:facebook","menuItem:share:timeline","menuItem:share:appMessage"
				// 	] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				// });
				resolve()
			})
		})
	}
	// 分享配置
	wxShareInfoConfig(shareDic) {
		wx.updateAppMessageShareData({
			title: shareDic.TITLE, // 分享标题onMenuShareTimeline
			link: shareDic.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: shareDic.COVER, // 分享图标
			desc: shareDic.desc, // 分享描述
			success: function(e) {
				// alert(shareDic.link)
				console.log('分享配置成功---', shareDic)
			}
		});
		wx.updateTimelineShareData({
			title: shareDic.TITLE, // 分享标题
			link: shareDic.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: shareDic.COVER, // 分享图标
			success: function(e) {
				// alert(shareDic.link)
				console.log('分享配置成功---', shareDic)
				// 用户点击了分享后执行的回调函数
			}
		});
	}
	getWxCode(authType = 'quiet') {
		let topath = window.location.hash
		if (topath.indexOf("?") >= 0) {
			topath = topath + '&isAuth=1'
		} else {
			topath = topath + '?isAuth=1'
		}
		let wxcode = superTools.getUrlDataWithName('code')
		if (wxcode) {
			return wxcode
		} else {
			let wxCodeRuquest = ''
			if (authType == 'quiet') { //无感知授权
				wxCodeRuquest = api_getwxcode(topath)
			} else { //用户操作授权
				wxCodeRuquest = api_getwxcode_alert(topath)
			}
			//console.log('wxCodeRuquest', wxCodeRuquest)
			window.location.href = wxCodeRuquest
		}
	}
}
export default superShare.getInstace()
