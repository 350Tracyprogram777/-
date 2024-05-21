import permision from '@/js_sdk/wa-permission/permission.js';


const superAuto = {
	getH5Auto: () => {
		if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia) {
			getUserMedia({
				video: true,
				audio: true
			}); // 调用用户媒体设备，访问摄像头、录音
		} else {
			alert('你的浏览器不支持访问用户媒体设备');
		}



	},

	getLocationAuto: function({success}) {
		// #ifdef APP-PLUS
		let self = this;
		if ('android' == uni.getSystemInfoSync().platform) {
			// let permissionArr = ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO']
			let permissionArr = ['android.permission.ACCESS_FINE_LOCATION','android.permission.ACCESS_BACKGROUND_LOCATION']
			permision.requestAndroidPermission(permissionArr).then(res => {
				if (res >0) {
					// uni.showToast({
					// 	title: "权限已开启,可正常使用"
					// })
					success()

				} else {
					uni.showModal({
						title: "",
						content: "物流助手需要使用您的位置信息",
						showCancel: false,
						confirmText: "去开启",
						success(e) {
							if (e.confirm) {
								permision.gotoAppPermissionSetting();


							}




						}
					})

				}
			})
		} else {

			let locationPower = permision.judgeIosPermission('location');
			if (cameraPower && audioPower) {

			}
			if (!locationPower) {
				uni.showModal({
					title: "",
					content: "物流助手需要使用您的位置信息",
					showCancel: false,
					confirmText: "去开启",
					success(e) {
						if (e.confirm) {
							permision.gotoAppPermissionSetting();

						}




					}
				})

			}
			return;
		}






		// #endif

	},




	getMainAllAuto: () => {
		// #ifdef APP-PLUS
		let self = this;
		let cameraPower = true;
		let audioPower = true;
		let locationPower = true;

		if ('android' == uni.getSystemInfoSync().platform) {
			let permissionArr = ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO']
			permision.requestAndroidPermission(permissionArr).then(res => {
				if (res == permissionArr.length) {
					// uni.showToast({
					// 	title: "权限已开启,可正常使用"
					// })

				} else {
					uni.showModal({
						title: '',
						content: '请打开相机与麦克风权限',
						showCancel: false,
						success: function(ee) {
							permision.gotoAppPermissionSetting();

						}
					});

				}
			})
		} else {
			cameraPower = permision.judgeIosPermission('camera');
			audioPower = permision.judgeIosPermission('record');
			// locationPower = permision.judgeIosPermission('location');
			if (cameraPower && audioPower) {

			}
			if (!cameraPower || !audioPower) {
				uni.showModal({
					title: "相机与麦克风权限未开启",
					content: "去自测开启,确保正常使用",
					showCancel: false,
					success(e) {
						uni.chooseVideo({
							sourceType: ["camera"],
							camera: "front",
							success() {
								uni.showToast({
									title: "权限已开启,可正常使用"
								})
							},
							fail: function() {
								permision.gotoAppPermissionSetting();

							}
						})



					}
				})

			}
			return;
		}






		// #endif

	},
	getAllAuto: () => {
		// #ifdef APP-PLUS
		let self = this;
		let cameraPower = true;
		let audioPower = true;
		let locationPower = true;

		if ('android' == uni.getSystemInfoSync().platform) {
			let permissionArr = ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO']
			permision.requestAndroidPermission(permissionArr).then(res => {
				if (res == permissionArr.length) {
					uni.showToast({
						title: "权限已开启,可正常使用"
					})

				} else {
					uni.showModal({
						title: '请打开相机与麦克风权限',
						content: ' ',
						showCancel: false,
						success: function(ee) {
							permision.gotoAppPermissionSetting();

						}
					});

				}
			})
		} else {
			cameraPower = permision.judgeIosPermission('camera');
			audioPower = permision.judgeIosPermission('record');
			// locationPower = permision.judgeIosPermission('location');
			if (cameraPower && audioPower) {
				uni.showToast({
					title: "权限已开启,可正常使用"
				})
			}
			if (!cameraPower || !audioPower) {
				uni.showModal({
					title: "开始测试",
					content: "请允许使用相机与麦克风",
					showCancel: false,
					success(e) {
						uni.chooseVideo({
							sourceType: ["camera"],
							camera: "front",
							success() {
								uni.showToast({
									title: "权限已开启,可正常使用"
								})
							},
							fail: function() {
								permision.gotoAppPermissionSetting();

							}
						})

					}
				})

			}
			return;
		}






		// #endif

	}
}


function getUserMedia(constrains) {
	if (navigator.mediaDevices.getUserMedia) {
		// 最新标准API
		navigator.mediaDevices
			.getUserMedia(constrains)
			.then(stream => {
				success(stream);
			})
			.catch(err => {
				error(err);
			});
	} else if (navigator.webkitGetUserMedia) {
		// webkit内核浏览器
		navigator
			.webkitGetUserMedia(constrains)
			.then(stream => {
				success(stream);
			})
			.catch(err => {
				error(err);
			});
	} else if (navigator.mozGetUserMedia) {
		// Firefox浏览器
		navigator
			.mozGetUserMedia(constrains)
			.then(stream => {
				success(stream);
			})
			.catch(err => {
				error(err);
			});
	} else if (navigator.getUserMedia) {
		// 旧版API
		navigator
			.getUserMedia(constrains)
			.then(stream => {
				success(stream);
			})
			.catch(err => {
				error(err);
			});
	}
}
// 成功的回调函数
function success(stream) {
	// uni.showModal({
	// 	title: '权限已开启',
	// 	showCancel: false,
	// 	success() {
	// 		uni.navigateBack({});
	// 	}
	// });
}
// 异常的回调函数
function error(error) {
	alert('访问用户媒体设备失败：', error.name, error.message);
}
export default superAuto
