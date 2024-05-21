<template>
  <view>
    <swiper class=" " circular="true" duration="400" autoplay style="height: 350rpx;background-color: #f5f5f5;">
      <swiper-item class="w-100 " v-for="(item, index) in bannerArr" :key="index">
        <image :src="item.url" class="w-100" style="width: 750rpx;height: 350rpx;" @click="prewImg(item.url)"></image>
      </swiper-item>
    </swiper>
    <view class="grid-two grid-gap-5  m-tb-1">
      <view class="row-center-center bg-white p-all-15" @click="navToUrl('/pageDoc/class')">
        <image src="/static/public/zlk.png" style="width: 48rpx;height: 48rpx;"></image>
        <text class="m-l-10">资料库</text>
      </view>
      <view class="row-center-center bg-white p-all-15" @click="navToUrl('/pages/addressBook/list')">
        <image src="/static/public/txl.png" style="width: 48rpx;height: 48rpx;"></image>
        <text class="m-l-10">通讯录</text>
      </view>
    </view>
    <view class="" style="position: sticky;top: -2px;left: 0rpx;right: 0rpx;z-index: 10">
      <ss-topTabar style="z-index: 0;" styleSet="3" widthNum="w-25" :tabarArr="classArr" :topSelectIndex="topIndex"
        @tabSelect="changeTabIndex"></ss-topTabar>
    </view>

    <view class="grid-one p-all-10">
      <newsOne class="bg-white border-radius-6" @share="newsShare" @zan="newsZan" @collect="newsCollect" :dataDic="item"
        v-for="(item, index) in dataArr" :key="index"></newsOne>
    </view>
    <bottomMore :dataList="dataArr" :loadMore="loadStatus"></bottomMore>

    <uni-fab :popMenu="false" horizontal="right" @fabClick="navToAdd">
    </uni-fab>
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
    onReachBottom,
    onShareTimeline,
    onShareAppMessage
  } from '@dcloudio/uni-app';
  import {
    superData,
    superTools
  } from '@/common/ss-superModules/superConfig.js';
  import {
    newsCollect,
    newsZan
  } from '@/pages/newsArticle/news.js';
  import {
    useUserStore
  } from '@/store';
  const newsApi = uniCloud.importObject('news-article', {
    customUI: true
  });
  const bigDic = ref({});
  const bannerArr = ref([]);
  const classArr = ref([]);
  const topIndex = ref(0);
  const classId = computed(e => (classArr.value.length > 0 ? classArr.value[topIndex.value]['value'] : ''));
  const dataArr = computed(e => bigDic.value[classId.value] || []);
  const loadStatus = ref('more');
  const shareDic = ref('');
  onLoad(e => {
    // 加载页面基本数据
    // loadBaseData();
    uni.$on('newsUpdate', function(e) {
      const item = dataArr.value.find(function(a, b) {
        return a._id == e._id;
      });
      Object.assign(item, e);
    });
  });
  onShow(e => {
    loadBaseData();
  });

  function loadBaseData() {
    newsApi.getBanner().then(res => {
      bannerArr.value = res.data;
    });
    newsApi.getClass().then(res => {
      let arr = [{
        text: '最新',
        value: 'all'
      }];
      classArr.value = arr.concat(res.data);
      console.log('res', classArr.value)

      if (dataArr.value.length == 0) {
        uni.startPullDownRefresh({});
      }
    });
  }

  function changeTabIndex(e) {
    topIndex.value = e.index;
    if (dataArr.value.length == 0) {
      loadData();
    }
  }

  onPullDownRefresh(() => {
    loadData();
  });

  function loadData() {
    const dic = {
      pageIndex: 0,
      where: {
        category_id: classId.value
      }
    };
    newsApi.query(dic).then(res => {
      bigDic.value[classId.value] = res.data;
      uni.stopPullDownRefresh({});
      if (res.data.length % 10 == 0 && res.data.length > 0) {
        loadStatus.value = 'more';
      } else {
        loadStatus.value = 'noMore';
      }
    });
  }
  onReachBottom(() => {
    const dic = {
      pageIndex: dataArr.value.length,
      where: {
        category_id: classId.value
      }
    };
    loadStatus.value = 'loading';
    newsApi.query(dic).then(res => {
      bigDic.value[classId.value] = bigDic.value[classId.value].concat(res.data);
      if (res.data.length % 10 == 0 && res.data.length > 0) {
        loadStatus.value = 'more';
      } else {
        loadStatus.value = 'noMore';
      }
    });
  });

  const prewImg = e => {
    let arr = [];
    for (let item of bannerArr.value) {
      arr.push(item.url);
    }

    uni.previewImage({
      current: e.url,
      urls: arr
    });
  };
  const navToAdd = () => {
    uni.navigateTo({
      url: '/pages/newsArticle/add'
    });
  };
  // 去哪里
  function navToUrl(e) {
    uni.navigateTo({
      url: e
    });
  }
  // 分享
  function newsShare(e) {
    console.log(e);
    shareDic.value = e.value;
  }
  onShareAppMessage(res => {
    console.log(res);
    if (res.from === 'button') {
      return {
        title: shareDic.value.content,
        path: '/pages/newsArticle/detail?newsId=' + shareDic.value._id,
        imageUrl: shareDic.value.cover
      };
    } else {
      return {
        title: '家在龙兴嘉苑2号院',
        path: '/pages/tabar/main',
        imageUrl: '/static/share/share-main2.jpg'
      };
    }
  });
  onShareTimeline(res => {
    if (res.from === 'button') {
      return {
        title: shareDic.value.content,
        path: '/pages/newsArticle/detail?newsId=' + shareDic.value._id,
        imageUrl: shareDic.value.cover
      };
    } else {
      return {
        title: '家在龙兴嘉苑2号院',
        path: '/pages/tabar/main',
        imageUrl: '/static/share/share-main2.jpg'
      };
    }
  });
</script>

<style></style>