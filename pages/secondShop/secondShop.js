const secondApi = uniCloud.importObject('second-shop');

function secondZan(e) {
	secondApi.zan(e.value._id).then(res => {
		if (res.data.length == 0) {
			e.value.zan = []
			e.value.like_count--
		} else {
			e.value.zan = res.data
			e.value.like_count++
		}
		uni.$emit('secondUpdate',e.value)
		
	})
}

function secondCollect(e) {
	console.log(e.value._id)
	const dic = {
		uni_id: e.value._id,
		uni_data: e.value
	};
	secondApi.favorite(dic).then(res => {
		if (res.errCode == 0) {
			e.value.collect = res.data
			uni.$emit('secondUpdate',e.value)
			
		}
	})
}
export {
	secondZan,
	secondCollect
}
