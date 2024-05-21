<template>
	<view class="grid-one grid-gap-2">
		<view @click='navToUrl("/pageAdmin/user/user")' class="row-between-center bg-white p-all-15">
			<text>用户管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view @click='navToUrl("/pageAdmin/category/category")' class="row-between-center bg-white p-all-15">
			<text>分类管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view @click='navToUrl("/pageAdmin/newsArticle/list")' class="row-between-center bg-white p-all-15">
			<text>社区圈管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view @click='navToUrl("/pageAdmin/houseRent/list")'  class="row-between-center  bg-white p-all-15">
			<text>租房管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view @click='navToUrl("/pageAdmin/secondShop/list")'  class="row-between-center  bg-white p-all-15">
			<text>闲置管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view @click='navToUrl("/pageAdmin/userDoc/list")'  class="row-between-center  bg-white p-all-15">
			<text>资料库管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view  @click='navToUrl("/pageAdmin/addressBook/list")' class="row-between-center bg-white p-all-15">
			<text>通讯录管理</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
		<view  @click='navToUrl("/pageAdmin/wxGroup/list")' class="row-between-center bg-white p-all-15">
			<text>微信群认证</text>
			<uni-icons type="right" color="#999" size="20"></uni-icons>
		</view>
	</view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom, onShareTimeline, onShareAppMessage } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';

function navToUrl(e){
	uni.navigateTo({
		url:e
	})
}
</script>

<style></style>
