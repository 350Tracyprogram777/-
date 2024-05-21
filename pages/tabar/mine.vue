<template>
  <view>
    <view class="">
      <view class="row-start-center bg-white p-all-15" v-if="userInfo.nickname"
        @click="navToPage('/pages/set/userInfo')">
        <image :src="userInfo.avatar || '/static/logo.png'" style="width: 120rpx;height:120rpx;border-radius: 20rpx;">
        </image>
        <view class="column-between-start flex-grow align-self-stretch  p-lr-10 p-tb-5">
          <text class="font-36 font-bold">{{ userInfo.nickname }}</text>
          <text class="font-26 color-999">{{ userInfo.mobile }}</text>
        </view>
        <uni-icons type="right" color="#999" size="16"></uni-icons>
      </view>
      <view v-else class="row-center-center p-all-15 bg-white">
        <view class="commit_bt" style="width: 280rpx;" @click="navToAuth()"><text>完善用户信息</text></view>
      </view>
    </view>
    <view class="grid-three m-tb-10 grid-gap-5 m-all-10 border-radius-6">
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pages/newsArticle/mySelf/list')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_tiezi.png" style="width: 58rpx;height: 58rpx;"></image>
        <text class="flex-grow color-555">我的帖子</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pages/houseRent/mySelf/list')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_zufang.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">房屋租售</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pages/addressBook/mySelf/list')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_tongxun.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">通讯录</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pageDoc/mySelf/list')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_ziliao.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">资料库</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pages/secondShop/mySelf/list')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_xianzhi.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">闲置物品</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pages/collect/list')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_love.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">我的收藏</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>
      <view class="column-center-center bg-white p-all-15" @click="navToPage('/pages/set/about')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_guanyu.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">关于我们</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>

      <view v-if="isCommunityAdmin" class="column-center-center bg-white p-all-15"
        @click="navToPage('/pageAdmin/index')">
        <image class="m-r-5 m-b-5" src="/static/mine/ic_love.png" style="width: 58rpx;height: 58rpx;"></image>

        <text class="flex-grow color-555">社区管理员</text>
        <!-- <uni-icons type="right" color="#999"></uni-icons> -->
      </view>

      <!-- <view class="row-start-center bg-white p-all-15" @click="navToPage('/pages/manager/community/list')">
				<text class="flex-grow color-555">认领社区</text>
				<uni-icons type="right" color="#999"></uni-icons>
			</view>
			<view class="row-start-center bg-white p-all-15" @click="text">
				<text class="flex-grow color-555">测试</text>
				<uni-icons type="right" color="#999"></uni-icons>
			</view> -->
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="p-all-10"><official-account @error="gzhErr" @load="gzhErr"></official-account></view>

    <!-- #endif -->
  </view>
</template>

<script setup>
  import {
    onMounted,
    onUpdated,
    onUnmounted,
    computed,
    ref,
    reactive
  } from 'vue';
  import {
    onLoad,
    onShow,
    onPullDownRefresh,
    onReachBottom
  } from '@dcloudio/uni-app';
  import {
    superData,
    superTools,
    msg
  } from '@/common/ss-superModules/superConfig.js';
  import {
    useUserStore
  } from '@/store';
  const wxApi = uniCloud.importObject('wxapi');
  onLoad(e => {});
  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);
  const isCommunityAdmin = computed(() => (userInfo.value.role ? userInfo.value.role.includes('communityAdmin') :
    false));

  function navToAuth() {
    uni.navigateTo({
      url: '/pages/set/userInfo?back=1'
    });
  }

  function navToPage(url) {
    uni.navigateTo({
      url: url
    });
  }

  function text() {
    // wxApi.msgSecCheck('',userInfo.value.wx_openid.mp).then(res=>{
    // 	console.log('返2回',res)
    // })
    wxApi.mediaCheckAsync('https://mei.netfhtu.com/upload/art/07/14/06/l24p5njcsby.jpg', userInfo.value.wx_openid.mp)
      .then(res => {
        console.log('返2 回', res);
      });
  }

  function gzhErr(e) {}
</script>

<style>
  page {
    background-color: #fafafa;
  }
</style>