<template>
  <view>
    <view class="grid-one grid-gap-1">
      <view class="row-start-center itemView">
        <text class="label ">头像</text>
        <view class="p_r">
          <button class="avatar-wrapper p_a p_a_all" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"></button>
          <image class="avatar" :src="userInfo.avatar"></image>
        </view>
      </view>
      <view class="row-start-center itemView">
        <text class="label ">昵称</text>
        <input type="nickname" @blur="inputChange" v-model="userInfo.nickname" class="content_input flex-grow p-lr-10"
          style="text-align: left;" placeholder="社区昵称" />
      </view>
      <!-- <view class="row-start-center itemView">
				<text class="label ">性别</text>
				<view class="content_input row-start-center">
					<uni-data-checkbox v-model="userInfo.gender" :localdata="[{ text: '保密', value: 0 }, { text: '男', value: 1 }, { text: '女', value: 2 }]"></uni-data-checkbox>
				</view>
			</view> -->
      <view class="row-start-center itemView">
        <text class="label ">电话</text>
        <view class="row-between-center content_input flex-grow p-lr-10 ">
          <text v-if="userInfo.mobile" class="  ">{{ userInfo.mobile }}</text>
          <view class="p_r">
            <text v-if="!userInfo.mobile" class=" themecolor ">获取手机号</text>
            <text v-else class=" themecolor ">更换手机号</text>
            <button @getphonenumber="getPhone" open-type="getPhoneNumber" class="nbt  p_a p_a_all"></button>
          </view>
        </view>
      </view>
    </view>
    <!-- 		<text  class=" themecolor ">{{ userInfo.mobile }}</text>
 -->
    <view class="commit_bt m-all-15" @click="commitVoid"><text>确定</text></view>
    <view v-if="!userInfo.nickname || !userInfo.mobile" class="row-center-center p-all-15"><text
        class="themecolor">发布信息,需要先完善个人信息</text></view>
    <ss-twoAlert ref="ssAlert"></ss-twoAlert>
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
  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);
  const loginBackPage = computed(() => userStore.loginBackPage);

  const db = uniCloud.database();
  const usersTable = db.collection('uni-id-users');
  const wxApi = uniCloud.importObject('wxapi', {
    customUI: true // 取消自动展示的交互提示界面
  });
  const userApi = uniCloud.importObject('user-info');
  const mediaApi = uniCloud.importObject('media');

  onLoad(() => {

  });

  function inputChange(e) {
    userInfo.value.nickname = e.detail.value
  }
  const ssAlert = ref();
  async function commitVoid() {
    console.log(userInfo.value)
    if (!userInfo.value.nickname) {
      msg('昵称不能为空');
      return;
    }
    if (!userInfo.value.mobile) {
      msg('手机号不能为空');
      return;
    }
    wxApi
      .msgSecCheck(userInfo.value.nickname, userInfo.value.wx_openid.mp)
      .then(res => {
        if (res.errCode == 0) {
          usersTable
            .where('_id==$env.uid')
            .update({
              nickname: userInfo.value.nickname,
              gender: userInfo.value.gender
            })
            .then(e => {
              userApi.bindPhone(userInfo.value.mobile).then(iphoneRes => {
                if (iphoneRes.errCode == 0) {
                  uni.setStorageSync('uni_id_token', iphoneRes.data.token);
                  uni.setStorageSync('uni_id_token_expired', iphoneRes.data.tokenExpired);
                }
              });
              Object.assign(userInfo.value, {
                nickname: userInfo.value.nickname,
                gender: userInfo.value.gender,
                mobile: userInfo.value.mobile
              })
              ssAlert.value.showModalDic({
                show: true,
                title: '保存成功',
                confirmText: '确定',
                showCancel: false,
                cancelText: '',
                content: '',
                success: e => {
                  if (e.confirm) {
                    if (loginBackPage.value) {
                      uni.redirectTo({
                        url: loginBackPage.value
                      });
                      userStore.loginBackPage = ''
                    } else {
                      uni.navigateBack();
                    }
                  }
                }
              });
            });
        } else {}
      })
      .catch(err => {
        msg('昵称不合规');
      });
  }

  function getPhone(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wxApi.getWxPhone(e.detail.code).then(res => {
        console.log(res);
        if (res.errCode == 0) {
          userInfo.value.mobile = res.data;
        } else {
          msg('请重试');
        }
      });
    }
    // console.log(e)
  }
  // 头像
  async function onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail;
    const filename = 'user_img_' + String(new Date().getTime()) + '.' + avatarUrl.split('.').pop();
    let imgUrl = await superData.superImgCloudRequest(avatarUrl, filename);
    const {
      data
    } = await wxApi.mediaCheckAsync(imgUrl, userInfo.value.wx_openid.mp);
    let filedata = {
      user_id: userInfo.value._id,
      type: '用户头像',
      name: filename,
      extname: avatarUrl.split('.').pop(),
      cloudPath: filename,
      fileType: 'image',
      url: imgUrl,
      size: 100 * 1024, //单位是字节
      path: imgUrl,
      create_date: new Date().getTime(),
      trace_id: data
    };
    mediaApi.add([filedata]);
    if (userInfo.value.avatar) {
      mediaApi.remove([{
        url: userInfo.value.avatar
      }]).then(res => {
        console.log(res);
      });
    }
    usersTable
      .where('_id==$env.uid')
      .update({
        avatar: imgUrl
      })
      .then(res => {
        Object.assign(userInfo.value, {
          avatar: imgUrl
        })
        msg('头像保存成功');
      });
  }
</script>

<style>
  page {
    background-color: #f5f5f5;
    /* padding: 20rpx; */
  }

  .itemView {
    background-color: #fff;
    padding: 15rpx 0rpx;
  }

  .label {
    width: 160rpx;
    flex-shrink: 0;
    text-align: center;
  }

  .label::before {
    content: '*';
    color: #fff;
    margin-right: 10rpx;
  }

  .must {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .must::before {
    content: '*';
    color: red;
    margin-right: 10rpx;
  }

  .content {
    flex-grow: 1;
  }

  .content_input:hover {
    /* border: 1px solid #007aff; */
  }

  .content_input {
    text-align: center;
    /* border: 1px solid #eee; */
    height: 76rpx;
    border-radius: 10rpx;
    font-weight: 400;
  }

  .avatar-wrapper {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    opacity: 0;
  }

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: #eee;
  }
</style>