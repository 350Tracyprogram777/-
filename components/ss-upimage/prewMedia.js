// 预览图片
const canOpenFile = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
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
const openFile = function(url) {
	const type = url.split('.').pop()
	if (canOpenFile.includes(type)) {
		uni.showActionSheet({
			itemList: ['预览', '保存'],
			success: function(res) {
				if (res.tapIndex == 0) {
					uni.downloadFile({
						url: url,
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.openDocument({
								filePath: filePath,
								showMenu: true,
								success: function(res) {
									console.log('打开文档成功');
								}
							});
						}
					});
				} else {
					uni.downloadFile({
						url: url,
						success: function(res) {
							var filePath = res.tempFilePath;
							uni.saveFile({
								tempFilePath: filePath,
								success: function(res) {
									uni.showToast({
										title: '以保存',
										icon: 'none'
									});
								}
							});
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
						url:url,
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
							// 			title: '以保存',
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
