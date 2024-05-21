const newsApi = uniCloud.importObject('news-article');

function newsZan(e) {
	newsApi.zan(e.value._id).then(res => {
		if (res.data.length == 0) {
			e.value.zan = []
			e.value.like_count--
		} else {
			e.value.zan = res.data
			e.value.like_count++
		}
		uni.$emit('newsUpdate',e.value)
		
	})
}

function newsCollect(e) {
	console.log(e.value._id)
	const dic = {
		uni_id: e.value._id,
		uni_data: e.value
	};
	newsApi.favorite(dic).then(res => {
		if (res.errCode == 0) {
			e.value.collect = res.data
			uni.$emit('newsUpdate',e.value)
			
		}
	})
}
export {
	newsCollect,
	newsZan
}
