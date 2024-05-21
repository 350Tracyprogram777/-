<script>
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
    onPullDownRefresh
  } from '@dcloudio/uni-app';
  import {
    useUserStore
  } from '@/store';

  export default {
    onLaunch: async function(e) {
      // #ifdef MP-WEIXIN
      const userStore = useUserStore();
      userStore.loginIn();
      // #endif
    },
    onShow: function(e) {
      console.log('App Show', e);
    },
    onHide: function() {
      console.log('App Hide');
    }
  };
</script>

<style>
  @import '@/common/ss-superModules/superStyle/selfCss.css';
  @import '@/common/ss-superModules/superStyle/superCss.css';
  @import '@/common/ss-superModules/superStyle/superIcon.css';
  @import '@/common/icon/iconfont.css';

  page {
    background-color: #f6f6f6;
  }

  .DINPro-Bold {
    font-family: DINPro-Bold;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .inpu_p {
    font-size: 26rpx;
    color: #aaa;
  }

  /*每个页面公共css */
</style>