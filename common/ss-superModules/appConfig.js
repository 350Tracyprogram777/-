//这是应用的配置页面，App.vue挂载到getApp().globalData.config
export default {
	"h5": {
		"url": "https://uni-starter.dcloud.net.cn", //	前端网页托管的域名	
	},
	"router": {
		"needLogin": [{
			"pattern": /^\/pages\/.*\/mySelf\/list.*/
		},{
			"pattern": /^\/pages\/.*\/add.*/
		}],
		"visitor": [
		],
	},
	//关于应用
	"about": {
		//应用名称
		"appName": "uni-starter",
		//应用logo
		"logo": "/static/logo.png",
		//公司名称
		"company": "北京xx网络技术有限公司",
		//口号
		"slogan": "云端一体应用快速开发模版",
		//政策协议
		"agreements": [{
			"title": "用户服务协议", //如果开启了多语言国际化，本配置将失效。请在 lang/en.js 和 lang/zh-Hans.js中配置
			"url": "请填写用户服务协议链接" //对应的网络链接
		}, {
			"title": "隐私政策", //如果开启了多语言国际化，本配置将失效。请在 lang/en.js 和 lang/zh-Hans.js中配置
			"url": "请填写隐私政策链接" //对应的网络链接
		}],
		//应用的链接，用于分享到第三方平台和生成关于我们页的二维码
		"download": "",
		//version
		"version": "1.0.0" //用于非app端显示，app端自动获取
	}
}
