const web_path = "http://test.guodunnote.com/teleweb"
const server_down_path = "http://test.guodunnote.com/teleweb/"
import supertools from "./supertools.js"

export default {
	isdev: false, //false 为线上 true 本地
	debug: true, //是否开启debug 模式
	base_url_dev: "https://2302y9e454.zicp.fun/telecom/", //"http://xfl.guodunnote.com/hetianxia/",//
	base_url_pro: "http://test.guodunnote.com/telecom/",
	webpath: web_path,
	appDown: server_down_path,
	ssprint: (e) => {
		// console.log(e)
	},
	appName: 'HTX',
	globalShare: {
		TITLE: '灵猫好车', // 分享标题onMenuShareTimeline
		link: web_path, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		COVER: web_path + '/static/logo.png', // 分享图标
		desc: '' // 分享描述
	}
}

