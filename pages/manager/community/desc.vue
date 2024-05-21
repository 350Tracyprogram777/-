<template>
	<view>
		<view class="row-center-center"><text class="font-bold font-36">社区认领</text></view>
		<view class="grid-one m-t-15">
			<text>
				&emsp;&emsp;&emsp;家在社区平台由河南国顿网络科技有限公司负责开发与维护,该平台旨在打造社区信息的互通,让社区的信息流转更加及时与高效,为生活在社区的住户带来生活的便利!
			</text>
			<text>每个社区的运营由管理员+多名协管员共同管理!</text>
			<text>社区管理员:负责社区信息的审核,对发现的违规信息与图片需要及时的删除!可指定社区协管员共同管理社区!一个人只能认领一个社区!</text>
			<text>协管员:由社区管理员指定与管理</text>
			<text>平台暂无盈利模式,旨在打造信息互通平台,寻找共同的创业合作者!</text>
		</view>
		<view class="fixed-bottom p-all-15">
			<view class="commit_bt"><text>我要认领</text></view>
		</view>
	</view>
</template>

<script setup>
function navToAdd() {
	uni.navigateTo({
		url: '/pages/manager/community/desc'
	});
	// community_cloud.query_is_have().then(res => {
	// 	uni.navigateTo({
	// 		url: '/pages/manager/community/desc'
	// 	});
	// });
}
</script>

<style>
page {
	background-color: #fff;
	padding: 30rpx;
}
</style>
