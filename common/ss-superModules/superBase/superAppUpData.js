import superTools from "./supertools.js"
import superData from "./superData.js"
import appConfig from "./ss.config.js"
class superAppUpData {
	constructor() {
		this.isUpIng = false
	}
	// 单例方法
	static getInstace() {
		if (!this.instance) {
			this.instance = new superAppUpData()
		}
		return this.instance
	}
	checkUpdate() {
		if (this.isUpIng) {
			return;
		}
		if(appConfig.debug)
		{
			console.error('debug  不更新')
			return
		}
		
		
		// #ifdef APP-PLUS
		let self = this;
		self.isUpIng = true;

		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			superTools.save_version(widgetInfo.version);
			let platform = uni.getSystemInfoSync().platform;
			let dic = {
				platform: platform == 'ios' ? 2 : 1,
				version: widgetInfo.version,
				
			};
			console.log('更新------2---------')
			superData.superRequest('appBasic/app/version', dic, {hubTitle:' ',allBack:true,domain:appConfig.base_url_pro}).then(
				res => {
					console.log('是否需要更新',res)
					if (res.code == 3) {
						//安卓热更新
						self.hotUpDate(res.data.hotPath, true);
					} else if (res.code == 4) {
						if (platform == 'ios') {
							plus.runtime.openURL(res.data.path, function(res) {});
						} else {
							//安卓重装
							self.hotUpDate(res.data.path, false);
						}
					} else if (res.code == 211) {
						//苹果重装 调转到ituns
					} else if (res.code == 2) {
						console.log('更新---------------', res);
						self.isUpIng = false;
					}
				});
		});
		// #endif
	}
	hotUpDate(wgtUrl, hotUp) {
		// 下载wgt文件
		downWgt();

		function downWgt() {
			plus.nativeUI.showWaiting('正在更新...');
			plus.downloader.createDownload(wgtUrl, {
				filename: '_doc/update/'
			}, function(d, status) {
				if (status == 200) {
					if (hotUp) {
						uni.clearStorageSync()
						installWgt(d.filename); // 安装wgt包
					} else {
						uni.openDocument({
							filePath: d.filename,
							success: function(res) {}
						});
					}
				} else {
					// plus.nativeUI.alert("下载失败");
				}
				plus.nativeUI.closeWaiting();
			}).start();
		}

		function installWgt(path) {
			plus.nativeUI.showWaiting('下载完成,更新中.');
			plus.runtime.install(path, {}, function() {
				// plus.nativeUI.closeWaiting();
				uni.clearStorageSync()
				plus.runtime.restart();
				// plus.nativeUI.alert("更新！",function(){
				//     plus.runtime.restart();
				// });
			}, function(e) {
				plus.nativeUI.closeWaiting();
				//console.log('安装wgt文件失败[' + e.code + ']：' + e.message);
				// plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);
			});
		}
	}
	// copyMoney() {
	// 	if (uni.getSystemInfoSync().platform != 'ios') {
	// 		var Context = plus.android.importClass('android.content.Context');
	// 		var main = plus.android.runtimeMainActivity();
	// 		var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
	// 		plus.android.invoke(clip, 'setText', '0复zんι口~令 e:/＄Xs3hzAE＄~.👉饿了么App👈【快來領外賣紅包，最高20元，人人都有哦~】');
	// 	} else {
	// 		var UIPasteboard = plus.ios.importClass('UIPasteboard');
	// 		var generalPasteboard = UIPasteboard.generalPasteboard();
	// 		// 设置/获取文本内容:
	// 		generalPasteboard.setValueforPasteboardType('testValue',
	// 			'0复zんι口~令 e:/＄Xs3hzAE＄~.👉饿了么App👈【快來領外賣紅包，最高20元，人人都有哦~】');
	// 		// var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
	// 	}
	// }
}
export default superAppUpData.getInstace()
