<template>
  <view>
    <uni-load-more v-if="dataList.length > 0" :status="loadMore"></uni-load-more>

    <view class="" style="height: 10rpx;"></view>
  </view>
</template>

<script>
  export default {
    name: 'bottomMore',
    props: {
      dataList: {
        type: Array,
        default: () => []
      },
      loadMore: {
        type: String,
        default: 'more'
      }
    }
  };
</script>

<style></style>