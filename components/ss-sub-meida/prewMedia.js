// 预览图片
const canOpenFile = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
const sysInfo = wx.getSystemInfoSync()

const prewImage = function(index, mediaArr) {
	let arr = [];
	for (let item of mediaArr) {
		if (item.fileType != 'video' && item.fileType != 'file') {
			arr.push(item['url']);
		}
	}
	uni.previewImage({
		current: index,
		urls: arr
	});
}
const openFile = function(item) {
	const type = item.url.split('.').pop()
	if (canOpenFile.includes(type)) {
		uni.showActionSheet({
			itemList: ['预览', '保存'],
			success: function(res) {
				if (res.tapIndex == 0) {
					uni.showLoading({
						title: "打开中..."
					})
					uni.downloadFile({
						url: item.url,
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								showMenu: true,
								success: function(res) {
									console.log('打开文档成功');
								}
							});
						},
						complete: function() {
							uni.hideLoading()
						}
					});
				} else {
					const filename = `${wx.env.USER_DATA_PATH}/${item.name}`
					const fs = wx.getFileSystemManager()

					uni.showLoading({
						title: "下载中..."
					})
					uni.downloadFile({
						url: item.url,
						success: function(res) {
							var filePath = res.tempFilePath;
							// if (sysInfo.platform == 'ios' || sysInfo.platform ==
							// 	'android') {
							wx.shareFileMessage({
								filePath: filePath,
								fileName: item.name,
								complete: function(e) {
									console.log(e)
								}
							})
						},
						complete: function() {
							uni.hideLoading()
						}
					});

				}
			},
			fail: function(res) {
				console.log(res.errMsg);
			}
		});
	} else {
		uni.showActionSheet({
			title: '当前文件不支持预览',
			itemList: ['保存'],
			success: function(res) {
				if (res.tapIndex == 0) {
					uni.downloadFile({
						url: item.url,
						success: function(res) {
							var filePath = res.tempFilePath;
							wx.shareFileMessage({
								filePath: filePath,
								fileName: item.name,
								complete: function(e) {
									console.log(e)
								}
							})
							// uni.saveFile({
							// 	tempFilePath: filePath,
							// 	success: function(res) {
							// 		uni.showToast({
							// 			title: '已保存',
							// 			icon: 'none'
							// 		});
							// 	}
							// });
						}
					});
				}
			},
			fail: function(res) {
				console.log(res.errMsg);
			}
		});
	}
}

export {
	openFile,
	prewImage,
	canOpenFile
}
