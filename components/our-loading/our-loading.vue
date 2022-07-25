<template>
  <view v-if="active" :class="'loading ' + ( type == 'flex' ? 'flex' : '' )" :style="{backgroundColor, }">
    <image class="loading-img" src="/static/images/loading.gif"></image>
  </view>
</template>

<script setup>
  const props = defineProps({
      type: {
        type: String,
        default: 'fixed'
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      },
      active: {
        type: Boolean,
        default: false
      }
  });
</script>
<style lang="scss" scoped>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading.flex {
    position: static;
    flex: 1;
    width: 100%;
}
.loading {
	.loading-img {
		width: 100rpx;
		height: 100rpx;
	}
}
</style>